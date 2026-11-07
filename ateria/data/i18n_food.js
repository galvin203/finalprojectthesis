/*
 * Names of ingredients, store aisles and allergens in English, Finnish, Swedish and Vietnamese.
 * English and Finnish ingredient names come from data/ingredients.js (fields `name` and `fi`).
 * Swedish and Vietnamese were written for this project and should be checked by a native speaker.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const I18N = (A.I18N = A.I18N || {});

  // id: [Swedish, Vietnamese]
  I18N.ing = {
    oats: ['Havregryn', 'Yến mạch cán'],
    rye_bread: ['Rågbröd', 'Bánh mì lúa mạch đen'],
    pasta: ['Fullkornspasta (torr)', 'Mì ống nguyên cám (khô)'],
    rice: ['Ris (torrt)', 'Gạo'],
    quinoa: ['Quinoa (torr)', 'Hạt quinoa (khô)'],
    tortilla: ['Tortillabröd', 'Bánh tortilla'],
    potato: ['Potatis', 'Khoai tây'],
    chicken: ['Kycklingbröst', 'Ức gà'],
    beef_mince: ['Nötfärs 10 %', 'Thịt bò xay 10% mỡ'],
    salmon: ['Laxfilé', 'Phi lê cá hồi'],
    cod: ['Torskfilé (fryst)', 'Phi lê cá tuyết (đông lạnh)'],
    tuna: ['Tonfisk på burk (avrunnen)', 'Cá ngừ đóng hộp (đã ráo)'],
    egg: ['Ägg', 'Trứng'],
    tofu: ['Tofu', 'Đậu phụ'],
    lentils: ['Röda linser (torra)', 'Đậu lăng đỏ (khô)'],
    chickpeas: ['Kikärtor (på burk, avrunna)', 'Đậu gà (đóng hộp, đã ráo)'],
    kidney_beans: ['Kidneybönor (på burk, avrunna)', 'Đậu thận đỏ (đóng hộp, đã ráo)'],
    peanut_butter: ['Jordnötssmör', 'Bơ đậu phộng'],
    almonds: ['Mandel', 'Hạnh nhân'],
    walnuts: ['Valnötter', 'Quả óc chó'],
    sunflower: ['Solroskärnor', 'Hạt hướng dương'],
    chia: ['Chiafrön', 'Hạt chia'],
    milk: ['Lättmjölk 1,5 %', 'Sữa tươi 1,5% béo'],
    milk_lf: ['Laktosfri lättmjölk 1,5 %', 'Sữa không lactose 1,5% béo'],
    oat_drink: ['Havredryck', 'Sữa yến mạch'],
    yoghurt: ['Naturell yoghurt', 'Sữa chua không đường'],
    skyr: ['Skyr', 'Skyr'],
    cottage: ['Keso', 'Phô mai cottage'],
    cheese: ['Ost 17 % (Edamtyp)', 'Phô mai 17% béo (loại Edam)'],
    feta: ['Fetaost', 'Phô mai feta'],
    hummus: ['Hummus', 'Hummus'],
    oil: ['Rapsolja', 'Dầu hạt cải'],
    honey: ['Honung', 'Mật ong'],
    soy_sauce: ['Sojasås', 'Nước tương'],
    canned_tomato: ['Krossade tomater (på burk)', 'Cà chua cắt nhỏ (đóng hộp)'],
    tomato: ['Tomat', 'Cà chua'],
    cucumber: ['Gurka', 'Dưa chuột'],
    carrot: ['Morötter', 'Cà rốt'],
    broccoli: ['Broccoli', 'Súp lơ xanh'],
    spinach: ['Spenat', 'Rau bina (cải bó xôi)'],
    onion: ['Lök', 'Hành tây'],
    bell_pepper: ['Paprika', 'Ớt chuông'],
    garlic: ['Vitlök', 'Tỏi'],
    zucchini: ['Zucchini', 'Bí ngòi'],
    mushrooms: ['Champinjoner', 'Nấm'],
    cabbage: ['Vitkål', 'Bắp cải'],
    salad_mix: ['Salladsmix', 'Rau trộn salad'],
    sweet_potato: ['Sötpotatis', 'Khoai lang'],
    avocado: ['Avokado', 'Bơ'],
    banana: ['Bananer', 'Chuối'],
    apple: ['Äpplen', 'Táo'],
    frozen_veg: ['Frysta blandade grönsaker', 'Rau củ hỗn hợp đông lạnh'],
    blueberries: ['Blåbär (frysta)', 'Việt quất (đông lạnh)'],
    wholemeal_bread: ['Fullkornsbröd', 'Bánh mì nguyên cám'],
    flour: ['Vetemjöl', 'Bột mì'],
    rice_noodles: ['Risnudlar (torra)', 'Bún gạo / mì gạo (khô)'],
    split_peas: ['Gula ärtor (torra)', 'Đậu Hà Lan vàng tách đôi (khô)'],
    coconut_milk: ['Kokosmjölk (på burk)', 'Nước cốt dừa (đóng hộp)'],
    sesame_oil: ['Sesamolja', 'Dầu mè'],
    fish_sauce: ['Fisksås', 'Nước mắm'],
    herring: ['Inlagd sill (avrunnen)', 'Cá trích ngâm (đã ráo)'],
    smoked_salmon: ['Kallrökt lax', 'Cá hồi hun khói'],
    shrimp: ['Räkor (kokta, skalade)', 'Tôm (đã nấu, bóc vỏ)'],
    ginger: ['Färsk ingefära (riven)', 'Gừng tươi (bào)'],
    edamame: ['Edamame (frysta, skalade)', 'Đậu nành edamame (đông lạnh, đã bóc vỏ)'],
  };

  // Counted items: the number is followed by this noun in a recipe step ("2 eggs", "½ onion").
  // id: { lang: [singular form, plural form] }.  Finnish uses the partitive after a number (2 kananmunaa),
  // Vietnamese has one form with a classifier (quả, củ).
  I18N.count = {
    egg: { en: ['egg', 'eggs'], fi: ['kananmuna', 'kananmunaa'], sv: ['ägg', 'ägg'], vi: ['quả trứng', 'quả trứng'] },
    tomato: { en: ['tomato', 'tomatoes'], fi: ['tomaatti', 'tomaattia'], sv: ['tomat', 'tomater'], vi: ['quả cà chua', 'quả cà chua'] },
    cucumber: { en: ['cucumber', 'cucumbers'], fi: ['kurkku', 'kurkkua'], sv: ['gurka', 'gurkor'], vi: ['quả dưa chuột', 'quả dưa chuột'] },
    onion: { en: ['onion', 'onions'], fi: ['sipuli', 'sipulia'], sv: ['lök', 'lökar'], vi: ['củ hành tây', 'củ hành tây'] },
    bell_pepper: { en: ['bell pepper', 'bell peppers'], fi: ['paprika', 'paprikaa'], sv: ['paprika', 'paprikor'], vi: ['quả ớt chuông', 'quả ớt chuông'] },
    avocado: { en: ['avocado', 'avocados'], fi: ['avokado', 'avokadoa'], sv: ['avokado', 'avokador'], vi: ['quả bơ', 'quả bơ'] },
    banana: { en: ['banana', 'bananas'], fi: ['banaani', 'banaania'], sv: ['banan', 'bananer'], vi: ['quả chuối', 'quả chuối'] },
    apple: { en: ['apple', 'apples'], fi: ['omena', 'omenaa'], sv: ['äpple', 'äpplen'], vi: ['quả táo', 'quả táo'] },
    tortilla: { en: ['tortilla', 'tortillas'], fi: ['tortilla', 'tortillaa'], sv: ['tortillabröd', 'tortillabröd'], vi: ['cái bánh tortilla', 'cái bánh tortilla'] },
  };

  // key: [en, fi, sv, vi]
  I18N.aisle = {
    produce: ['Fruit & vegetables', 'Hedelmät ja vihannekset', 'Frukt och grönsaker', 'Rau củ quả'],
    grains: ['Bread & grains', 'Leipä ja viljatuotteet', 'Bröd och spannmål', 'Bánh mì và ngũ cốc'],
    meat: ['Meat & fish', 'Liha ja kala', 'Kött och fisk', 'Thịt và cá'],
    dairy: ['Dairy, eggs & chilled', 'Maito- ja kylmätuotteet, munat', 'Mejeri, ägg och kylvaror', 'Sữa, trứng và đồ lạnh'],
    pantry: ['Pantry & cans', 'Kuivatuotteet ja säilykkeet', 'Skafferi och konserver', 'Đồ khô và đồ hộp'],
    frozen: ['Frozen', 'Pakasteet', 'Fryst', 'Đông lạnh'],
  };

  I18N.allergen = {
    gluten: ['Gluten', 'Gluteeni', 'Gluten', 'Gluten'],
    milk: ['Milk', 'Maito', 'Mjölk', 'Sữa'],
    egg: ['Egg', 'Muna', 'Ägg', 'Trứng'],
    fish: ['Fish', 'Kala', 'Fisk', 'Cá'],
    peanut: ['Peanut', 'Maapähkinä', 'Jordnöt', 'Đậu phộng'],
    nuts: ['Tree nuts', 'Pähkinät', 'Trädnötter', 'Các loại hạt cây'],
    soy: ['Soy', 'Soija', 'Soja', 'Đậu nành'],
    sesame: ['Sesame', 'Seesami', 'Sesam', 'Mè (vừng)'],
    shellfish: ['Shellfish', 'Äyriäiset', 'Skaldjur', 'Hải sản có vỏ (tôm, cua)'],
  };
})(typeof window !== 'undefined' ? window : globalThis);
