/*
 * Ateria ingredient table.
 *
 * Nutrition values are APPROXIMATE reference values per 100 g (as bought / as listed in the name),
 * rounded from general food-composition knowledge. They are NOT taken from a licensed database.
 * Before relying on them, replace them with Fineli (THL, open data) or USDA FoodData Central values.
 *
 * `price` is a placeholder price per pack in EUR, used only to build the illustrative seed prices
 * (see data/prices.js). Real prices come from the user (Prices tab / CSV) or from tools/prices_tool.py.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});

  A.AISLES = {
    produce: 'Fruit & vegetables',
    grains: 'Bread & grains',
    meat: 'Meat & fish',
    dairy: 'Dairy, eggs & chilled',
    pantry: 'Pantry & cans',
    frozen: 'Frozen',
  };

  A.STORES = [
    { id: 's', name: 'S-market', short: 'S', logo: 'img/smarket.jpg' },
    { id: 'k', name: 'K-market', short: 'K', logo: 'img/kmarket.png' },
    { id: 'lidl', name: 'Lidl', short: 'Lidl', logo: 'img/lidl.png' },
  ];

  // I(id, name, fi, aisle, [kcal, protein, fat, carbs, fibre], packG, price, opts)
  // opts: allergens [], lactose bool, animal 'meat'|'fish'|'egg'|'dairy'|'honey', each (g per piece), unit ('clove'), swaps []
  const list = [];
  function I(id, name, fi, aisle, n, packG, price, opts) {
    opts = opts || {};
    list.push({
      id, name, fi, aisle,
      per100: { kcal: n[0], protein: n[1], fat: n[2], carbs: n[3], fibre: n[4] },
      packG, price,
      allergens: opts.allergens || [],
      lactose: !!opts.lactose,
      animal: opts.animal || null,
      each: opts.each || null,
      unit: opts.unit || null,
      swaps: opts.swaps || [],
    });
  }

  // grains & bread
  I('oats', 'Rolled oats', 'Kaurahiutale', 'grains', [375, 13, 7, 62, 10], 1000, 1.9, { allergens: ['gluten'] });
  I('rye_bread', 'Rye bread', 'Ruisleipä', 'grains', [210, 7, 1.5, 40, 11], 500, 2.6, { allergens: ['gluten'] });
  I('pasta', 'Wholegrain pasta (dry)', 'Täysjyväpasta', 'grains', [350, 13, 2.5, 67, 8], 500, 1.7, { allergens: ['gluten'] });
  I('rice', 'Rice (dry)', 'Riisi', 'grains', [360, 7, 0.6, 79, 1], 1000, 2.5);
  I('quinoa', 'Quinoa (dry)', 'Kvinoa', 'grains', [368, 14, 6, 64, 7], 500, 4.5);
  I('tortilla', 'Wheat tortillas', 'Tortillat', 'grains', [310, 8, 7, 52, 3], 320, 2.3, { allergens: ['gluten'], each: 40 });
  I('potato', 'Potatoes', 'Peruna', 'produce', [77, 2, 0.1, 17, 2.2], 1000, 1.6);

  // meat, fish, eggs, plant protein
  I('chicken', 'Chicken breast', 'Broilerin rintafilee', 'meat', [120, 23, 2.5, 0, 0], 500, 6.5, { animal: 'meat' });
  I('beef_mince', 'Beef mince 10%', 'Naudan jauheliha 10 %', 'meat', [176, 20, 10, 0, 0], 400, 4.8, { animal: 'meat' });
  I('salmon', 'Salmon fillet', 'Lohifile', 'meat', [208, 20, 13, 0, 0], 300, 6.8, { animal: 'fish', allergens: ['fish'] });
  I('cod', 'Cod fillet (frozen)', 'Turskafile (pakaste)', 'frozen', [82, 18, 0.7, 0, 0], 400, 5.9, { animal: 'fish', allergens: ['fish'] });
  I('tuna', 'Canned tuna (drained)', 'Tonnikala', 'pantry', [110, 25, 1, 0, 0], 150, 1.9, { animal: 'fish', allergens: ['fish'] });
  I('egg', 'Eggs', 'Kananmuna', 'dairy', [143, 12.5, 9.5, 0.7, 0], 550, 3.3, { animal: 'egg', allergens: ['egg'], each: 55 });
  I('tofu', 'Tofu', 'Tofu', 'dairy', [125, 13, 7, 2, 1], 300, 2.7, { allergens: ['soy'] });
  I('lentils', 'Red lentils (dry)', 'Punaiset linssit', 'pantry', [355, 25, 1.5, 60, 11], 500, 2.3);
  I('chickpeas', 'Chickpeas (canned, drained)', 'Kikherneet', 'pantry', [135, 7.5, 2.6, 21, 6], 240, 1.3);
  I('kidney_beans', 'Kidney beans (canned, drained)', 'Kidneypavut', 'pantry', [95, 7, 0.5, 15, 6], 240, 1.3);
  I('peanut_butter', 'Peanut butter', 'Maapähkinävoi', 'pantry', [600, 25, 50, 12, 6], 350, 3.5, { allergens: ['peanut'] });
  I('almonds', 'Almonds', 'Manteli', 'pantry', [580, 21, 50, 10, 12], 200, 3.3, { allergens: ['nuts'] });
  I('walnuts', 'Walnuts', 'Saksanpähkinä', 'pantry', [654, 15, 65, 14, 7], 200, 3.9, { allergens: ['nuts'] });
  I('sunflower', 'Sunflower seeds', 'Auringonkukansiemen', 'pantry', [584, 21, 51, 20, 9], 200, 2.0);
  I('chia', 'Chia seeds', 'Chiansiemenet', 'pantry', [486, 17, 31, 42, 34], 200, 3.1);

  // dairy & alternatives
  I('milk', 'Milk 1.5%', 'Kevytmaito', 'dairy', [46, 3.4, 1.5, 4.8, 0], 1000, 1.4, { animal: 'dairy', allergens: ['milk'], lactose: true, swaps: ['milk_lf', 'oat_drink'] });
  I('milk_lf', 'Lactose-free milk 1.5%', 'Laktoositon kevytmaito', 'dairy', [46, 3.4, 1.5, 4.8, 0], 1000, 1.6, { animal: 'dairy', allergens: ['milk'] });
  I('oat_drink', 'Oat drink', 'Kaurajuoma', 'dairy', [45, 1, 1.5, 7, 0.8], 1000, 1.9, { allergens: ['gluten'] });
  I('yoghurt', 'Natural yoghurt', 'Maustamaton jogurtti', 'dairy', [55, 4, 2, 4.5, 0], 1000, 2.3, { animal: 'dairy', allergens: ['milk'], lactose: true });
  I('skyr', 'Skyr', 'Skyr', 'dairy', [62, 11, 0.2, 4, 0], 450, 1.95, { animal: 'dairy', allergens: ['milk'], lactose: true });
  I('cottage', 'Cottage cheese', 'Raejuusto', 'dairy', [85, 11, 3, 3, 0], 200, 1.7, { animal: 'dairy', allergens: ['milk'], lactose: true });
  I('cheese', 'Cheese 17% (Edam type)', 'Edam-juusto', 'dairy', [260, 28, 16, 0, 0], 500, 4.5, { animal: 'dairy', allergens: ['milk'] });
  I('feta', 'Feta', 'Fetajuusto', 'dairy', [265, 14, 21, 4, 0], 200, 2.5, { animal: 'dairy', allergens: ['milk'], lactose: true });
  I('hummus', 'Hummus', 'Hummus', 'dairy', [230, 8, 16, 14, 6], 200, 2.3, { allergens: ['sesame'] });

  // pantry
  I('oil', 'Rapeseed oil', 'Rypsiöljy', 'pantry', [884, 0, 100, 0, 0], 460, 3.0);
  I('honey', 'Honey', 'Hunaja', 'pantry', [304, 0.3, 0, 82, 0.2], 350, 3.9, { animal: 'honey' });
  I('soy_sauce', 'Soy sauce', 'Soijakastike', 'pantry', [55, 8, 0, 5, 0], 150, 2.1, { allergens: ['soy', 'gluten'] });
  I('canned_tomato', 'Chopped tomatoes (canned)', 'Tomaattimurska', 'pantry', [21, 1.2, 0.2, 4, 1.2], 400, 0.95);

  // fruit & vegetables
  I('tomato', 'Tomatoes', 'Tomaatti', 'produce', [18, 0.9, 0.2, 3.9, 1.2], 500, 2.5, { each: 100 });
  I('cucumber', 'Cucumber', 'Kurkku', 'produce', [15, 0.7, 0.1, 3.6, 0.5], 300, 1.3, { each: 300 });
  I('carrot', 'Carrots', 'Porkkana', 'produce', [41, 0.9, 0.2, 10, 2.8], 1000, 1.6);
  I('broccoli', 'Broccoli', 'Parsakaali', 'produce', [34, 2.8, 0.4, 7, 2.6], 400, 2.2);
  I('spinach', 'Spinach', 'Pinaatti', 'produce', [23, 2.9, 0.4, 3.6, 2.2], 150, 2.4);
  I('onion', 'Onions', 'Sipuli', 'produce', [40, 1.1, 0.1, 9, 1.7], 1000, 1.9, { each: 110 });
  I('bell_pepper', 'Bell pepper', 'Paprika', 'produce', [31, 1, 0.3, 6, 2.1], 200, 1.3, { each: 180 });
  I('garlic', 'Garlic', 'Valkosipuli', 'produce', [149, 6.4, 0.5, 33, 2.1], 100, 1.2, { each: 5, unit: 'clove' });
  I('zucchini', 'Zucchini', 'Kesäkurpitsa', 'produce', [17, 1.2, 0.3, 3.1, 1], 350, 1.7);
  I('mushrooms', 'Mushrooms', 'Herkkusieni', 'produce', [22, 3.1, 0.3, 3.3, 1], 250, 2.4);
  I('cabbage', 'Cabbage', 'Valkokaali', 'produce', [25, 1.3, 0.1, 6, 2.5], 1000, 1.4);
  I('salad_mix', 'Salad mix', 'Salaattisekoitus', 'produce', [15, 1.4, 0.2, 2.9, 1.3], 150, 2.2);
  I('sweet_potato', 'Sweet potato', 'Bataatti', 'produce', [86, 1.6, 0.1, 20, 3], 500, 2.4);
  I('avocado', 'Avocado', 'Avokado', 'produce', [160, 2, 15, 9, 7], 150, 1.3, { each: 150 });
  I('banana', 'Bananas', 'Banaani', 'produce', [89, 1.1, 0.3, 23, 2.6], 1000, 1.9, { each: 120 });
  I('apple', 'Apples', 'Omena', 'produce', [52, 0.3, 0.2, 14, 2.4], 1000, 3.0, { each: 180 });
  I('frozen_veg', 'Frozen mixed vegetables', 'Pakastekasvissekoitus', 'frozen', [60, 3, 0.5, 11, 4], 600, 2.2);
  I('blueberries', 'Blueberries (frozen)', 'Mustikka (pakaste)', 'frozen', [57, 0.7, 0.3, 14, 2.4], 300, 3.3);

  // ---------- added in version 2 (Nordic, European and Asian recipes) ----------
  I('wholemeal_bread', 'Wholegrain bread', 'Täysjyväleipä', 'grains', [240, 9, 3, 42, 7], 500, 2.4, { allergens: ['gluten'] });
  I('flour', 'Wheat flour', 'Vehnäjauho', 'grains', [340, 10, 1, 72, 3], 1000, 1.3, { allergens: ['gluten'] });
  I('rice_noodles', 'Rice noodles (dry)', 'Riisinuudelit', 'grains', [360, 6, 0.6, 80, 1.6], 250, 2.1);
  I('split_peas', 'Yellow split peas (dry)', 'Keltaiset halkaistut herneet', 'pantry', [340, 24, 1.5, 60, 25], 500, 1.9);
  I('coconut_milk', 'Coconut milk (canned)', 'Kookosmaito', 'pantry', [180, 1.8, 18, 3, 0], 400, 1.6);
  I('sesame_oil', 'Sesame oil', 'Seesamiöljy', 'pantry', [884, 0, 100, 0, 0], 250, 3.4, { allergens: ['sesame'] });
  I('fish_sauce', 'Fish sauce', 'Kalakastike', 'pantry', [35, 5, 0, 4, 0], 200, 2.2, { animal: 'fish', allergens: ['fish'], swaps: ['soy_sauce'] });
  I('herring', 'Pickled herring (drained)', 'Maustesilli', 'meat', [195, 14, 13, 5, 0], 250, 3.2, { animal: 'fish', allergens: ['fish'] });
  I('smoked_salmon', 'Smoked salmon', 'Kylmäsavulohi', 'meat', [180, 22, 10, 0, 0], 200, 4.9, { animal: 'fish', allergens: ['fish'] });
  I('shrimp', 'Shrimp (cooked, peeled)', 'Katkarapu (kypsä)', 'frozen', [99, 24, 0.3, 0.2, 0], 250, 4.6, { animal: 'fish', allergens: ['shellfish'] });
  I('ginger', 'Fresh ginger (grated)', 'Tuore inkivääri (raastettu)', 'produce', [80, 1.8, 0.8, 18, 2], 100, 1.2);
  I('edamame', 'Edamame (frozen, shelled)', 'Edamame (pakaste)', 'frozen', [121, 12, 5, 9, 5], 400, 2.6, { allergens: ['soy'] });

  A.INGREDIENTS = list;
  A.ING = {};
  list.forEach(function (x) { A.ING[x.id] = x; });

  // Household measures used to show amounts in the kitchen's own units.
  //   dl   = grams per decilitre,  tbsp = grams per tablespoon (a teaspoon is one third of that).
  //   liquid = shown by volume only (no grams in brackets).
  // Densities are rounded everyday values; they only change how an amount is DISPLAYED, never any calculation.
  const MEASURES = {
    oats: { dl: 35 }, rice: { dl: 85 }, quinoa: { dl: 80 }, flour: { dl: 60, tbsp: 8 }, lentils: { dl: 80 }, split_peas: { dl: 85 },
    chia: { tbsp: 12 }, sunflower: { tbsp: 9 }, peanut_butter: { tbsp: 16 }, cottage: { tbsp: 15, dl: 100 }, hummus: { tbsp: 15 },
    honey: { tbsp: 21, liquid: true }, oil: { tbsp: 14, liquid: true }, soy_sauce: { tbsp: 17, liquid: true },
    fish_sauce: { tbsp: 18, liquid: true }, sesame_oil: { tbsp: 14, liquid: true }, ginger: { tbsp: 6 },
    milk: { dl: 100, tbsp: 15, liquid: true }, milk_lf: { dl: 100, tbsp: 15, liquid: true }, oat_drink: { dl: 100, tbsp: 15, liquid: true },
    coconut_milk: { dl: 100, tbsp: 15, liquid: true }, yoghurt: { dl: 100, tbsp: 15 }, skyr: { dl: 100, tbsp: 15 }, canned_tomato: { dl: 100, tbsp: 15 },
  };
  Object.keys(MEASURES).forEach(function (id) { Object.assign(A.ING[id], MEASURES[id]); });

  // Options shown in the profile form
  A.ALLERGENS = [
    ['gluten', 'Gluten'], ['milk', 'Milk'], ['egg', 'Egg'], ['fish', 'Fish'],
    ['peanut', 'Peanut'], ['nuts', 'Tree nuts'], ['soy', 'Soy'], ['sesame', 'Sesame'], ['shellfish', 'Shellfish'],
  ];
})(typeof window !== 'undefined' ? window : globalThis);
