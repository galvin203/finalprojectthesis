# Ateria

Weekly meal plans with calorie and protein targets, a recipe for every meal, a food log, and a shopping list that says how much of each ingredient to buy for the meals and days you choose (Finland).

Ateria is inspired by apps like Mealbird, but the code, texts and ingredient drawings here are original. The recipes are adapted from recipes published by dietitians, universities and health agencies (see *Licence* below). It is a **separate project from the NutriWise thesis** (Viet Nam).

* No dependencies: plain HTML, CSS and JavaScript.
* Four languages: English, Finnish, Swedish and Vietnamese.
* Adults only (18–99). **Not medical advice.**

## Quick start

```
# 1. Use it
open index.html                       # any browser; double-click works

# 2. Run the tests (Node 18 or newer)
node --test tests/*.test.js           # 127 tests

# 3. Optional: build one self-contained page (for publishing as a single file)
node tools/build_artifact.js          # writes dist/ateria-artifact.html
```

### Put it online (Vercel)

Ateria is a static site, so it needs no build tools. In Vercel, import this repository and set **Root Directory** to `ateria`. `vercel.json` already tells Vercel to publish only `index.html`, `styles.css`, `js/`, `data/`, `fonts/` and `img/`, so tests and tools are not served. Every push to `main` then redeploys the site.

## How to use the app

| Screen | What you do there |
| --- | --- |
| **Welcome** (first screen, until you make a profile; the Ateria name takes you back) | Pick a goal, create your plan or open an example week. Shows a few dishes from the example plan and how the app works. |
| **Food types** (step 2 of 3 after the welcome screen) | Swipe cards, one per kind of food (Nordic, European, Asian, everyday and world): right or the green tick button for food you like, left or the red cross button for food you do not. The arrow keys and an undo button work too, and the cards stay still for people who ask their device for less motion. What you tick fills the "food you would like more of" choice on the next step (a soft preference for the planner, not a filter). "Skip this step" leaves it as it is. |
| **You** | Enter sex, age, height, weight, activity, goal (lose / maintain / gain weight / build muscle at the gym), diet, allergies, dislikes, meals per day, number of people. Add more people, log your weight, see your favourite recipes, back up or delete your data. |
| **Plan** | See 7 days of meals scaled to your targets. Open a meal to see the amounts for 1–8 portions, the seasoning list and the method. Swap a meal, press **New plan** for another week, tap the heart on recipes you like. |
| **Log** | Write down what you ate on any of the last 120 days. Add a meal from your own plan (whole, half, one and a half or two portions), a food from the ingredient list by weight, or a quick entry (a name, calories and optional protein) for something that is not on the list. The day shows the energy left or passed against your daily target and your protein, carbohydrate and fat against theirs, and the last seven days at a glance. Each entry keeps the values it had when it was added. It is a diary only: it does not change the plan. Quick entries count energy and protein only. For today, **Ideas for the rest of today** suggests two recipes for each meal that has no entry yet. The recipes are the ones in Ateria that fit your diet, allergies and dislikes, each sized to your share of the energy that is left (between half and two portions) and ranked by how little protein they lack for the protein still needed. "Other ideas" shows different recipes, and "Add" writes the idea into the log. |
| **Shop** | The amount of every ingredient the planned meals need, for everyone in the plan, grouped by shop aisle and written in grams and kitchen measures. Pick the days you shop for (all seven by default). Open **Where it is used** under an item to see which meal on which day needs how much of it. Tick items off as you buy them. A separate "check your cupboard" list shows the seasonings you need (not counted in grams). Amounts are exactly what the recipes need; they are not rounded up to pack sizes and the list does not know what you already have at home. |
| **Help** (button, bottom right) | Ask "how do I...?" in any of the four languages. It answers offline, can read the answer aloud and has buttons that open the right screen. |

### Recipes

* **66 recipes**: 22 Nordic, 16 European, 14 Asian and 14 everyday or world dishes, for breakfast, lunch, dinner and snacks.
* **Amounts in kitchen units**: spoons, dl and pieces, with the grams in brackets, filled in for the portion size and number of people you choose.
* **Seasoning by moment**: what goes in at the start, while cooking, at the end and when serving, with a picture, the amount and the water. Seasoning is mild on purpose and salt is kept low (WHO: under 5 g a day). Seasoning is not counted in calories or in the shopping amounts.
* Allergies, diet, lactose-free and dislikes are respected, and an ingredient is swapped where a safe swap exists (for example milk → lactose-free milk).

### Your details and privacy

* **Nothing is saved until you say yes.** On first use the app asks "Keep my details on this device?". If you say no, nothing else is stored.
* After "yes", details are kept in this browser only: up to 6 people, weight log, food log, favourites, week choices and the shopping items you ticked.
* In **You → My data** you can make a backup (text or file), load a backup, and delete everything (two steps). A backup contains personal details, so keep it safe.
* If the page runs on Claude, an extra **Copy in my account** button saves the same backup to a private document, only when you press it.
* Storage can be blocked (private window): the app tells you and keeps working from memory.

### The helper and AI

* The offline helper has 22 topics in four languages (`data/i18n_help.js`) and works without internet.
* Where the page runs on Claude, an optional **Ask Claude instead** button appears for questions the list cannot answer. It is never automatic, it sends only the question, the language and the screen name (never your details, plan or weight), and it is told to give no medical advice and no calorie or nutrient numbers. Its answers are labelled as AI and can be wrong.

## How the numbers work

* Resting energy: Mifflin–St Jeor. Activity multiplier: 1.53 / 1.76 / 2.25 (FAO/WHO/UNU 2004).
* Goal: −15 % energy to lose, 0 to maintain, +10 % to gain weight or to build muscle. Energy never goes below resting energy. The −15 % lies between the 10 % and 20 % deficits that gave weight loss in a six-month trial of 180 adults with overweight or obesity (Woźniak et al. 2024, Food Science & Nutrition 12(11)). The +10 % is the lower end of the 10–20 % surplus recommended for novice and intermediate bodybuilders (Iraki et al. 2019, Sports 7(7), 154).
* Protein 1.6 g/kg (lose, gain weight), 1.8 g/kg (build muscle) or 0.83 g/kg (maintain). 0.83 g/kg is the EFSA 2012 population reference intake for adults; people who train may need more, so choose Build muscle or another goal if you train hard. 1.6 and 1.8 g/kg lie inside the 1.4–2.0 g/kg range that the ISSN position stand on protein and exercise gives for people who train. Food supports muscle gain, but training is what builds muscle: choose the activity level that matches your training. Fat 30 % of energy. Fibre 14 g per 1000 kcal.
* The planner picks meals, scales portions to the daily target and shows a warning when a target cannot be met.
* A meal you do not select (for example no snacks) is assumed to be eaten elsewhere, so the plan covers only the selected meals' share of the day.

## Important: placeholder data

| Data | Status | What to do |
| --- | --- | --- |
| **Nutrition per 100 g** | Approximate reference values, not from a licensed database. | Replace with [Fineli](https://fineli.fi) (THL, open data) or USDA FoodData Central before relying on them. |
| **Recipes** | Adapted from published dietitian, university and health-agency recipes. The adapted versions are not reviewed by a health professional and not yet cooked and tasted by a person. | Taste-test them; add your own in `data/recipes.js`. |
| **Translations** | Finnish, Swedish and Vietnamese were written for this project. | Ask a native speaker to review them. Tests check that nothing is missing and that numbers match, not the wording. |

## Languages and pictures

* Pick the language at the top right. The app starts from the browser language and remembers your choice. Texts, ingredient names, recipes, seasoning, measures, numbers and plurals all follow it.
* When the language is not Finnish, shopping rows also show the Finnish product name in small italics, because that is what is printed on the shelf.
* Every ingredient has an original flat illustration (111 drawings in `data/icons.js`). They are drawings of the food, **not photos of store products**.
* **Dish photos.** Recipes show the drawn ingredient pictures until a real photo is added. Put one JPEG per recipe in `img/food/`, named after the recipe id (`d_meatballs.jpg`; the rules are in `img/food/README.md`), then run `node tools/photos_index.js`. It updates `data/photos.js` and lists the recipes still without a photo. Photos appear on the meal card, at the top of the opened recipe, in the swap list and on the welcome screen. Use only photos you took yourself or whose licence allows this use; if a licence asks for a credit, add it to `img/food/credits.json` and the app shows it under the photo. **No photos are included yet.**
* To add a language: add it to `A.LANGS` in `data/i18n_ui.js`, add a column to every `U(...)` row and to `data/i18n_food.js`, add entries in `data/i18n_recipes.js` and `data/i18n_help.js`, then run `node --test tests/*.test.js`, which lists what is missing.

## Project layout

```
index.html               app shell
styles.css               light and dark themes, type scale, welcome banner
js/engine.js             targets, planner, shopping list with the meals that use each item (no DOM)
js/measure.js            grams -> spoons / dl / pieces, recipe text, seasoning summary
js/store.js              saved details, consent, backup, cleaning of imported data
js/cloud.js              optional private copy in the person's Claude account
js/help.js               helper: matching, panel, read aloud, optional Ask Claude
js/i18n.js               language: text lookup, plurals, number formats
js/log.js                food log: portions, grams, totals, dates and ideas for the rest of the day (no screen, no storage)
js/app.js                interface
fonts/                   Lora (headlines) and Inter (text), subset with Vietnamese, served from this site; see fonts/README.md
img/                     img/food/ is for dish photos
data/ingredients.js      65 ingredients (nutrition, allergens, swaps, measures)
data/spices.js           25 seasonings
data/recipes.js          66 recipes in English
data/icons.js            111 SVG drawings
data/i18n_*.js           texts, names, recipes and helper topics in the other languages
tools/photos_index.js    checks img/food/ and writes data/photos.js
tools/build_artifact.js  builds dist/ateria-artifact.html (one self-contained page)
tests/                   JavaScript tests
```

## Tests

`node --test tests/*.test.js` runs 127 tests: the targets checked by hand, the planner on 600 random profiles and many diet and allergy combinations, all texts in four languages, amounts in every unit, the shopping list (totals, chosen days, the meals behind each amount, no price left anywhere), storage and consent, the food log (sums, dates, limits, cleaning of imported data), the ideas for the rest of the day and the helper.

## Known limits

* Not a medical device. It does not handle diabetes, pregnancy, eating disorders or children. A thesis audience of teenagers and older adults would need different formulas that are not covered here.
* The app shows amounts, not prices. No open and lawful source of store-level prices was found for this project, so there is no price comparison and no budget.
* Details are kept per browser. To move to another device, use a backup file (or the account copy on Claude).
* The offline helper answers are fixed text written for this app. Answers from Claude are not reviewed and can be wrong.

## Look and type

* **Fonts.** Headlines, dish names and big numbers use Lora; everything else uses Inter. Both are in `fonts/` (WOFF subsets with Latin, Finnish, Swedish and Vietnamese letters), so the site makes no request to a font service. Licences are in `fonts/README.md`.
* **Vietnamese.** Headlines are never letter-spaced tightly and get extra line height when the page language is `vi`, so stacked tone marks do not touch the line above.
* **Colours.** Spruce green for structure, cloudberry gold for the one main button on the welcome screen, lingonberry red for hearts and warnings. Dark mode keeps the welcome banner and the daily-target card deep green.
* **Motion.** The only animation that plays by itself is the food stickers on the welcome banner. It is switched off for people who ask for less motion.

## Licence

The code, tests, tools and the author's own texts and drawings are under the [MIT licence](../LICENSE) (Copyright (c) 2026 Nhut Tan Pham). Some parts are not covered by it:

| Part | Terms |
| --- | --- |
| Fonts in `fonts/` (Lora, Inter) | SIL Open Font License 1.1, see `fonts/README.md`. |
| Recipes in `data/recipes.js` | Adapted from recipes published by dietitians, universities and health agencies. The original publishers keep their rights in their own texts and photos; the MIT licence does not extend to them. |
| Dish photos in `img/food/` (none yet) | Only photos you took yourself or whose licence allows this use, with a credit where the licence asks for one. |
| Nutrition values | Placeholders, not taken from a licensed database. |

The software is provided "as is", without warranty. It gives general information, not medical or dietetic advice.
