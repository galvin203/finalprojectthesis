"""Unit tests for tools/prices_tool.py. The S-Group part runs only against a fake API (never the live service)."""
import csv
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import prices_tool as pt  # noqa: E402


class Loading(unittest.TestCase):
    def test_ingredient_ids_match_the_javascript_table(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("node not installed")
        out = subprocess.run(
            [node, "-e", "require('./data/ingredients.js');console.log(JSON.stringify(globalThis.Ateria.INGREDIENTS.map(i=>[i.id,i.packG,i.fi])))"],
            cwd=ROOT, capture_output=True, text=True, check=True).stdout
        js = {i: (p, fi) for i, p, fi in json.loads(out)}
        py = pt.load_ingredients()
        self.assertEqual(set(js), set(py))
        for i in js:
            self.assertEqual(js[i][0], py[i]["packG"], i)
            self.assertEqual(js[i][1], py[i]["fi"], i)


class CsvConversion(unittest.TestCase):
    def setUp(self):
        self.ing = pt.load_ingredients()

    def test_valid_rows_decimal_comma_and_default_pack(self):
        rows = [
            {"store": "S-market", "ingredient_id": "oats", "price": "1,89", "pack_g": "1000"},
            {"store": "k", "ingredient_id": "oats", "price": "2.05", "pack_g": ""},
            {"store": "Lidl", "ingredient_id": "oats", "price": "€1.49", "pack_g": "500"},
        ]
        prices, rep = pt.rows_to_prices(rows, self.ing)
        self.assertEqual(rep["applied"], 3)
        self.assertEqual(prices["s"]["oats"], {"price": 1.89, "packG": 1000.0})
        self.assertEqual(prices["k"]["oats"]["packG"], self.ing["oats"]["packG"])
        self.assertEqual(prices["lidl"]["oats"], {"price": 1.49, "packG": 500.0})

    def test_bad_rows_are_reported_not_applied(self):
        rows = [
            {"store": "Prisma", "ingredient_id": "oats", "price": "1"},
            {"store": "s", "ingredient_id": "unicorn", "price": "1"},
            {"store": "s", "ingredient_id": "oats", "price": "abc"},
            {"store": "s", "ingredient_id": "oats", "price": "-3"},
            {"store": "s", "ingredient_id": "oats", "price": "9999"},
            {"store": "s", "ingredient_id": "oats", "price": ""},
        ]
        prices, rep = pt.rows_to_prices(rows, self.ing)
        self.assertEqual(prices, {})
        self.assertEqual(rep["applied"], 0)
        self.assertEqual(rep["empty"], 1)
        self.assertEqual(len(rep["skipped"]), 5)

    def test_template_then_cli_roundtrip(self):
        with tempfile.TemporaryDirectory() as d:
            tpl = Path(d) / "t.csv"
            pt.write_template(tpl, self.ing)
            with open(tpl, newline="", encoding="utf8") as fh:
                rows = list(csv.DictReader(fh))
            self.assertEqual(len(rows), len(self.ing) * 3)
            # fill two cells with semicolons as the delimiter, like a Finnish spreadsheet export
            lines = ["store;ingredient_id;price;pack_g", "s;oats;1,99;1000", "lidl;rice;2,19;1000", "k;rice;;"]
            src = Path(d) / "filled.csv"
            src.write_text("\n".join(lines), encoding="utf8")
            out = Path(d) / "out.json"
            self.assertEqual(pt.main(["csv", str(src), "--out", str(out)]), 0)
            data = json.loads(out.read_text(encoding="utf8"))["prices"]
            self.assertEqual(data["s"]["oats"]["price"], 1.99)
            self.assertEqual(data["lidl"]["rice"]["price"], 2.19)
            self.assertNotIn("k", data)

    def test_app_accepts_the_generated_json(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("node not installed")
        with tempfile.TemporaryDirectory() as d:
            src = Path(d) / "f.csv"
            src.write_text("store,ingredient_id,price,pack_g\ns,oats,1.99,1000\nk,rice,2.40,1000\nlidl,pasta,1.35,500\n", encoding="utf8")
            out = Path(d) / "o.json"
            self.assertEqual(pt.main(["csv", str(src), "--out", str(out)]), 0)
            js = ("require('./data/ingredients.js');require('./data/recipes.js');require('./data/prices.js');require('./js/engine.js');"
                  "const r=globalThis.Ateria.engine.parsePrices(require('fs').readFileSync(process.argv[1],'utf8'));"
                  "console.log(JSON.stringify([r.applied,r.skipped,r.error||null]))")
            res = subprocess.run([node, "-e", js, str(out)], cwd=ROOT, capture_output=True, text=True, check=True).stdout
            self.assertEqual(json.loads(res), [3, 0, None])


class FakeAPI:
    def __init__(self, products, fail=()):
        self.products, self.fail, self.calls = products, set(fail), []

    def get_product_by_id(self, pid):
        self.calls.append(pid)
        if pid in self.fail:
            raise RuntimeError("service unavailable")
        return self.products[pid]


class SGroup(unittest.TestCase):
    def setUp(self):
        self.ing = pt.load_ingredients()

    def test_extract_price_prefers_current_then_regular_then_price(self):
        mk = lambda **kw: SimpleNamespace(pricing=SimpleNamespace(**kw), price=kw.get("price"))
        self.assertEqual(pt.extract_price(SimpleNamespace(pricing=SimpleNamespace(currentPrice=1.5, regularPrice=2.0), price=3.0)), 1.5)
        self.assertEqual(pt.extract_price(SimpleNamespace(pricing=SimpleNamespace(currentPrice=None, regularPrice="2,00"), price=3.0)), 2.0)
        self.assertEqual(pt.extract_price(SimpleNamespace(pricing=None, price=3.0)), 3.0)
        self.assertIsNone(pt.extract_price(SimpleNamespace(pricing=None, price=None)))
        self.assertIsNone(pt.extract_price(SimpleNamespace(pricing=SimpleNamespace(currentPrice=0), price=0)))

    def test_fetch_with_fake_api_cache_failure_and_rate_limit(self):
        api = FakeAPI({
            "p1": SimpleNamespace(pricing=SimpleNamespace(currentPrice=1.79), price=1.79),
            "p2": SimpleNamespace(pricing=None, price=None),
        }, fail={"p3"})
        pmap = [
            {"ingredient_id": "oats", "product_id": "p1", "pack_g": "1000"},
            {"ingredient_id": "rice", "product_id": "p1", "pack_g": ""},   # same product: served from cache
            {"ingredient_id": "pasta", "product_id": "p2", "pack_g": ""},  # no usable price
            {"ingredient_id": "quinoa", "product_id": "p3", "pack_g": ""}, # raises
            {"ingredient_id": "nope", "product_id": "p4", "pack_g": ""},   # unknown ingredient
        ]
        sleeps = []
        cache = {}
        prices, rep = pt.fetch_sgroup(api, pmap, self.ing, delay=3.0, cache=cache, sleep=sleeps.append)
        self.assertEqual(set(prices["s"]), {"oats", "rice"})
        self.assertEqual(api.calls, ["p1", "p2", "p3"])      # p1 fetched once
        self.assertEqual(sleeps, [3.0, 3.0, 3.0])             # one pause per real request, none for cache hits
        self.assertEqual(cache, {"p1": 1.79})                 # failures are not cached
        self.assertEqual(len(rep["failed"]), 3)
        self.assertEqual(prices["s"]["rice"]["packG"], self.ing["rice"]["packG"])

    def test_cli_refuses_without_terms_flag(self):
        self.assertEqual(pt.main(["sgroup", "--map", "x.csv"]), 2)


if __name__ == "__main__":
    unittest.main()
