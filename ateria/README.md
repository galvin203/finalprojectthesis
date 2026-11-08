# Ateria

Weekly meal plans with calorie and protein targets, a recipe for every meal, and a shopping list priced for **S-market, K-market and Lidl** (Finland).

Ateria is inspired by apps like Mealbird, but every recipe, text, ingredient drawing and line of code here is original. The only third-party images are the three store logos (see *Store logos* below). It is a **separate project from the NutriWise thesis** (Viet Nam).

* No dependencies: plain HTML, CSS and JavaScript.
* Four languages: English, Finnish, Swedish and Vietnamese.
* Adults only (18–99). **Not medical advice.**

## Quick start

```
# 1. Use it
open index.html                       # any browser; double-click works

# 2. Run the tests (Node 18 or newer, Python 3 for the price tool)
node --test tests/*.test.js           # 76 tests
python3 -I tests/test_prices_tool.py  # 8 tests

# 3. Optional: build one self-contained page (for publishing as a single file)
node tools/build_artifact.js          # writes dist/ateria-artifact.html
```

### Put it online (Vercel)

Ateria is a static site, so it needs no build tools. In Vercel, import this repository and set **Root Directory** to `ateria`. `vercel.json` already tells Vercel to publish only `index.html`, `styles.css`, `js/`, `data/` and `img/`, so tests and tools are not served. Every push to `main` then redeploys the site.

## How to use the app

| Screen | What you do there |
| --- | --- |
| **You** | Enter sex, age, height, weight, activity, goal (lose / maintain / gain), diet, allergies, dislikes, meals per day, number of people and a weekly budget. Add more people, log your weight, see your favourite recipes, back up or delete your data. |
| **Plan** | See 7 days of meals scaled to your targets. Open a meal to see the amounts for 1–8 portions, the seasoning list and the method. Swap a meal, press **New plan** for another week, tap the heart on recipes you like. |
| **Shop** | One list for the whole week with the price in each store, the cheapest store and the cheapest mixed basket. A separate "check your cupboard" list shows the seasonings you need (not priced). |
| **Prices** | Type a real price for any ingredient and store, or import a CSV or JSON file. |
| **Help** (button, bottom right) | Ask "how do I...?" in any of the four languages. It answers offline, can read the answer aloud and has buttons that open the right screen. |

### Recipes

* **66 recipes**: 22 Nordic, 16 European, 14 Asian and 14 everyday or world dishes, for breakfast, lunch, dinner and snacks.
* **Amounts in kitchen units**: spoons, dl and pieces, with the grams in brackets, filled in for the portion size and number of people you choose.
* **Seasoning by moment**: what goes in at the start, while cooking, at the end and when serving, with a picture, the amount and the water. Seasoning is mild on purpose and salt is kept low (WHO: under 5 g a day). Seasoning is not counted in calories or in the shopping prices.
* Allergies, diet, lactose-free and dislikes are respected, and an ingredient is swapped where a safe swap exists (for example milk → lactose-free milk).

### Your details and privacy

* **Nothing is saved until you say yes.** On first use the app asks "Keep my details on this device?". If you say no, nothing else is stored.
* After "yes", details are kept in this browser only: up to 6 people, weight log, favourites, week choices and your prices.
* In **You → My data** you can make a backup (text or file), load a backup, and delete everything (two steps). A backup contains personal details, so keep it safe.
* If the page runs on Claude, an extra **Copy in my account** button saves the same backup to a private document, only when you press it.
* Storage can be blocked (private window): the app tells you and keeps working from memory.

### The helper and AI

* The offline helper has 22 topics in four languages (`data/i18n_help.js`) and works without internet.
* Where the page runs on Claude, an optional **Ask Claude instead** button appears for questions the list cannot answer. It is never automatic, it sends only the question, the language and the screen name (never your details, plan or weight), and it is told to give no medical advice and no calorie or nutrient numbers. Its answers are labelled as AI and can be wrong.

## How the numbers work

* Resting energy: Mifflin–St Jeor. Activity multiplier: 1.53 / 1.76 / 2.25 (FAO/WHO/UNU 2004).
* Goal: −15 % energy to lose, 0 to maintain, +10 % to gain. Energy never goes below resting energy.
* Protein 1.6 g/kg (lose, gain) or 1.2 g/kg (maintain). Fat 30 % of energy. Fibre 14 g per 1000 kcal.
* The planner picks meals, scales portions to the daily target and shows a warning when a target cannot be met.
* A meal you do not select (for example no snacks) is assumed to be eaten elsewhere, so the plan covers only the selected meals' share of the day.

## Important: placeholder data

| Data | Status | What to do |
| --- | --- | --- |
| **Prices** | Illustrative, **not real**. Shown with "est." | Enter real prices in the Prices screen or import them (below). |
| **Nutrition per 100 g** | Approximate reference values, not from a licensed database. | Replace with [Fineli](https://fineli.fi) (THL, open data) or USDA FoodData Central before relying on them. |
| **Recipes** | Original, but not yet cooked and tasted by a person. | Taste-test them; add your own in `data/recipes.js`. |
| **Translations** | Finnish, Swedish and Vietnamese were written for this project. | Ask a native speaker to review them. Tests check that nothing is missing and that numbers match, not the wording. |

## Getting real prices

The supported way, for all three stores, is a CSV you fill in yourself:

```
python3 tools/prices_tool.py template --out prices_template.csv     # every ingredient x 3 stores
# fill in "price" (EUR) and "pack_g" from the shop's site or app; leave unknown rows empty
python3 tools/prices_tool.py csv prices_template.csv --out prices.json
```

Then open **Prices**, paste the contents of `prices.json` (or the CSV itself) into the import box and press **Load**.

Automatic fetching:

* **S-market**: experimental (`tools/prices_tool.py sgroup`, uses the unofficial `sokpy` package, needs `--accept-terms`). It has **never been run against the live service**; treat the first run as a test and compare a few prices with the shop.
* **K-market**: not scraped. The site is protected by Cloudflare Bot Management and getting around that is not something this project does. Use the CSV.
* **Lidl**: not scraped. No documented price source was found. Use the CSV or the weekly leaflet.

Before fetching anything automatically, read each shop's terms of use, use it for yourself only, keep the request rate low and do not publish the prices you collect.

## Languages and pictures

* Pick the language at the top right. The app starts from the browser language and remembers your choice. Texts, ingredient names, recipes, seasoning, measures, numbers and plurals all follow it.
* When the language is not Finnish, shopping and price rows also show the Finnish product name in small italics, because that is what is printed on the shelf.
* Every ingredient has an original flat illustration (111 drawings in `data/icons.js`). They are drawings of the food, **not photos of store products**.
* **Store logos.** `img/` holds the S-market, K-market and Lidl logos, shown next to each store so the three are easy to tell apart. They belong to their owners and are used only to identify the stores; Ateria is not affiliated with them. Remove the `logo` fields in `data/ingredients.js` to turn them off.
* To add a language: add it to `A.LANGS` in `data/i18n_ui.js`, add a column to every `U(...)` row and to `data/i18n_food.js`, add entries in `data/i18n_recipes.js` and `data/i18n_help.js`, then run `node --test tests/*.test.js`, which lists what is missing.

## Project layout

```
index.html               app shell
styles.css               light and dark themes
js/engine.js             targets, planner, shopping list, price import (no DOM)
js/measure.js            grams -> spoons / dl / pieces, recipe text, seasoning summary
js/store.js              saved details, consent, backup, cleaning of imported data
js/cloud.js              optional private copy in the person's Claude account
js/help.js               helper: matching, panel, read aloud, optional Ask Claude
js/i18n.js               language: text lookup, plurals, number and money formats
js/app.js                interface
img/                     logos of S-market, K-market and Lidl
data/ingredients.js      65 ingredients (nutrition, pack size, allergens, swaps, measures)
data/spices.js           25 seasonings
data/recipes.js          66 recipes in English
data/icons.js            111 SVG drawings
data/i18n_*.js           texts, names, recipes and helper topics in the other languages
data/prices.js           illustrative seed prices
tools/prices_tool.py     price template / CSV conversion / experimental S-Group fetch
tools/build_artifact.js  builds dist/ateria-artifact.html (one self-contained page)
tests/                   JavaScript and Python tests
```

## Tests

`node --test tests/*.test.js` runs 76 tests: the targets checked by hand, the planner on 600 random profiles and many diet and allergy combinations, all texts in four languages, amounts in every unit, storage and consent, and the helper. `python3 -I tests/test_prices_tool.py` runs 8 more for the price tool.

## Known limits

* Not a medical device. It does not handle diabetes, pregnancy, eating disorders or children. A thesis audience of teenagers and older adults would need different formulas that are not covered here.
* Prices change weekly and differ by store location; the app has no store-location logic.
* Details are kept per browser. To move to another device, use a backup file (or the account copy on Claude).
* The offline helper answers are fixed text written for this app. Answers from Claude are not reviewed and can be wrong.
* No licence has been chosen yet.
