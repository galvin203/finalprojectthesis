#!/usr/bin/env python3
"""Ateria price tool: build the price file that the app imports (Prices tab > Import).

Commands
  template   Write a CSV with every ingredient x store (Finnish name included) to fill in by hand.
  csv        Convert a filled-in CSV to the JSON the app imports. This is the supported route for
             all three stores (S-market, K-market, Lidl).
  sgroup     EXPERIMENTAL. Look up S-Group (S-market) prices with the unofficial `sokpy` package.
             It has never been run against the live service by the author, because the sandbox it
             was written in cannot reach the shop. Treat the first run as a test and check the output.

K-market (K-Ruoka) and Lidl are deliberately not scraped:
  * K-Ruoka sits behind Cloudflare Bot Management. Getting past that is a bypass of an access
    control, so this tool does not attempt it.
  * No documented price source for Lidl was found.
Enter those prices by hand (template + csv) or from the shop's own app/leaflet.

Responsibility: read and follow each shop's terms of use before fetching anything automatically,
fetch only for personal use, keep the request rate low, and do not publish what you fetch.

Only the Python standard library is needed (sokpy is imported only by the sgroup command).
"""
import argparse
import csv
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORES = {"s": "S-market", "k": "K-market", "lidl": "Lidl"}
STORE_ALIASES = {
    "s": "s", "smarket": "s", "sgroup": "s",
    "k": "k", "kmarket": "k", "kruoka": "k",
    "lidl": "lidl",
}
MAX_PRICE = 500.0  # same sanity limit as the app


def load_ingredients(path=None):
    """Read id, English name, Finnish name and default pack size from data/ingredients.js."""
    path = Path(path) if path else ROOT / "data" / "ingredients.js"
    text = path.read_text(encoding="utf8")
    rows = {}
    pat = re.compile(
        r"I\('(?P<id>[a-z0-9_]+)',\s*'(?P<name>[^']*)',\s*'(?P<fi>[^']*)',\s*'(?P<aisle>[a-z]+)',"
        r"\s*\[[^\]]*\],\s*(?P<pack>[0-9.]+),\s*(?P<price>[0-9.]+)"
    )
    for m in pat.finditer(text):
        rows[m["id"]] = {
            "id": m["id"], "name": m["name"], "fi": m["fi"],
            "packG": float(m["pack"]), "price": float(m["price"]),
        }
    if not rows:
        raise SystemExit("Could not read any ingredients from " + str(path))
    return rows


def norm_store(value):
    key = re.sub(r"[^a-z]", "", str(value or "").strip().lower())
    return STORE_ALIASES.get(key)


def to_number(value):
    """Accepts 1.99 and 1,99. Returns None when the cell is empty or not a number."""
    s = str(value if value is not None else "").strip().replace("€", "").replace(" ", "")
    if not s:
        return None
    try:
        return float(s.replace(",", "."))
    except ValueError:
        return None


def rows_to_prices(rows, ingredients):
    """rows: iterable of dicts with store, ingredient_id, price, pack_g.
    Returns (prices, report). prices is {store: {id: {price, packG}}}."""
    prices = {}
    report = {"applied": 0, "empty": 0, "skipped": []}
    for n, row in enumerate(rows, start=2):  # line 1 is the header
        store = norm_store(row.get("store"))
        ing_id = str(row.get("ingredient_id") or "").strip()
        price = to_number(row.get("price"))
        if price is None and not str(row.get("price") or "").strip():
            report["empty"] += 1
            continue
        if store is None:
            report["skipped"].append((n, "unknown store %r" % row.get("store")))
        elif ing_id not in ingredients:
            report["skipped"].append((n, "unknown ingredient_id %r" % ing_id))
        elif price is None or not (0 < price <= MAX_PRICE):
            report["skipped"].append((n, "price %r is not a number between 0 and %d" % (row.get("price"), MAX_PRICE)))
        else:
            pack = to_number(row.get("pack_g"))
            if pack is None or pack <= 0:
                pack = ingredients[ing_id]["packG"]
            prices.setdefault(store, {})[ing_id] = {"price": round(price, 2), "packG": pack}
            report["applied"] += 1
    return prices, report


def write_template(out_path, ingredients):
    with open(out_path, "w", newline="", encoding="utf8") as fh:
        w = csv.writer(fh)
        w.writerow(["store", "ingredient_id", "price", "pack_g", "name", "finnish_name"])
        for store in STORES:
            for ing in ingredients.values():
                w.writerow([store, ing["id"], "", int(ing["packG"]), ing["name"], ing["fi"]])


def cmd_template(args):
    ingredients = load_ingredients()
    write_template(args.out, ingredients)
    print("Wrote %s (%d rows). Fill in price (EUR) and pack_g for the packs you actually buy; "
          "leave price empty to skip a row." % (args.out, len(ingredients) * len(STORES)))


def cmd_csv(args):
    ingredients = load_ingredients()
    with open(args.input, newline="", encoding="utf-8-sig") as fh:
        sample = fh.read(4096)
        fh.seek(0)
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t") if sample.strip() else csv.excel
        rows = list(csv.DictReader(fh, dialect=dialect))
    prices, report = rows_to_prices(rows, ingredients)
    Path(args.out).write_text(json.dumps({"prices": prices}, indent=2, ensure_ascii=False), encoding="utf8")
    print("Applied %d prices, %d empty rows ignored, %d rows skipped." % (report["applied"], report["empty"], len(report["skipped"])))
    for n, why in report["skipped"][:20]:
        print("  line %d: %s" % (n, why))
    print("Wrote %s. In the app: Prices > Import > choose this file." % args.out)
    return 0 if report["applied"] else 1


# ---------------------------------------------------------------- S-Group (experimental)

def extract_price(product):
    """Pull a pack price out of a sokpy product object using only the documented field names.
    Returns a float or None. Kept separate so it can be tested with fake objects."""
    pricing = getattr(product, "pricing", None)
    candidates = [
        getattr(pricing, "currentPrice", None) if pricing is not None else None,
        getattr(pricing, "regularPrice", None) if pricing is not None else None,
        getattr(product, "price", None),
    ]
    for c in candidates:
        v = to_number(c)
        if v is not None and 0 < v <= MAX_PRICE:
            return round(v, 2)
    return None


def load_product_map(path):
    """CSV: ingredient_id,product_id,pack_g   (one S-kaupat product id per ingredient you want)."""
    with open(path, newline="", encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))


def fetch_sgroup(api, product_map, ingredients, delay=3.0, cache=None, sleep=time.sleep):
    """api needs get_product_by_id(product_id). Returns (prices, report)."""
    cache = cache if cache is not None else {}
    prices = {}
    report = {"applied": 0, "failed": []}
    for n, row in enumerate(product_map, start=2):
        ing_id = str(row.get("ingredient_id") or "").strip()
        pid = str(row.get("product_id") or "").strip()
        if ing_id not in ingredients or not pid:
            report["failed"].append((n, "unknown ingredient_id or empty product_id"))
            continue
        if pid in cache:
            price = cache[pid]
        else:
            try:
                price = extract_price(api.get_product_by_id(pid))
            except Exception as exc:  # network, parsing or service errors: report and carry on
                report["failed"].append((n, "%s: %s" % (type(exc).__name__, exc)))
                price = None
            else:
                if price is not None:
                    cache[pid] = price
            sleep(delay)
        if price is None:
            if not any(f[0] == n for f in report["failed"]):
                report["failed"].append((n, "no usable price for product %s" % pid))
            continue
        pack = to_number(row.get("pack_g")) or ingredients[ing_id]["packG"]
        prices.setdefault("s", {})[ing_id] = {"price": price, "packG": pack}
        report["applied"] += 1
    return prices, report


def cmd_sgroup(args):
    if not args.accept_terms:
        print("Refusing to fetch. Read S-Group's terms of use, then run again with --accept-terms "
              "to confirm that automated lookups for personal use are allowed.", file=sys.stderr)
        return 2
    try:
        from sokpy import SOKAPI  # type: ignore
    except ImportError:
        print("sokpy is not installed. Run: pip install sokpy   (unofficial, not affiliated with S-Group)", file=sys.stderr)
        return 2
    ingredients = load_ingredients()
    product_map = load_product_map(args.map)
    cache_path = Path(args.cache)
    cache = json.loads(cache_path.read_text(encoding="utf8")) if cache_path.exists() else {}
    prices, report = fetch_sgroup(SOKAPI(), product_map, ingredients, delay=args.delay, cache=cache)
    cache_path.write_text(json.dumps(cache, indent=2), encoding="utf8")
    Path(args.out).write_text(json.dumps({"prices": prices}, indent=2, ensure_ascii=False), encoding="utf8")
    print("EXPERIMENTAL. Fetched %d prices, %d failed. Check a few against the shop before trusting them." % (report["applied"], len(report["failed"])))
    for n, why in report["failed"][:20]:
        print("  map line %d: %s" % (n, why))
    return 0 if report["applied"] else 1


def build_parser():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = p.add_subparsers(dest="cmd", required=True)

    t = sub.add_parser("template", help="write a CSV to fill in by hand")
    t.add_argument("--out", default="prices_template.csv")
    t.set_defaults(func=cmd_template)

    c = sub.add_parser("csv", help="convert a filled-in CSV to the app's JSON")
    c.add_argument("input")
    c.add_argument("--out", default="prices.json")
    c.set_defaults(func=cmd_csv)

    s = sub.add_parser("sgroup", help="EXPERIMENTAL: S-market prices via sokpy")
    s.add_argument("--map", required=True, help="CSV with columns ingredient_id,product_id,pack_g")
    s.add_argument("--out", default="prices_s.json")
    s.add_argument("--cache", default="sgroup_cache.json")
    s.add_argument("--delay", type=float, default=3.0, help="seconds between requests (default 3)")
    s.add_argument("--accept-terms", action="store_true", help="confirm you have read the shop's terms of use")
    s.set_defaults(func=cmd_sgroup)
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    return args.func(args) or 0


if __name__ == "__main__":
    sys.exit(main())
