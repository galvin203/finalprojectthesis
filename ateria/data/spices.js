/*
 * Ateria seasonings: dried spices, fresh herbs and aromatics that are listed in a recipe's seasoning block.
 *
 * They are NOT counted in calories or in the shopping totals (the amounts are a few grams at most and add
 * well under 10 kcal per meal). The shopping view lists them separately so you can check your cupboard.
 *
 *   unit  'tsp'    teaspoon (3 tsp = 1 tbsp, converted for display)
 *         'leaf'   whole leaves (bay)           'pcs'    whole pieces (star anise)
 *         'lemon'  fraction of a whole lemon (juice and zest)
 *   kind  'salt' | 'dried' | 'fresh'    (fresh = buy fresh, dried = usually already at home)
 *   names = [English, Finnish, Swedish, Vietnamese]  (Swedish and Vietnamese: please have a native speaker check them)
 *
 * Amounts in recipes are per ONE base portion; the app multiplies them by the portion size and the number of people.
 * Salt is deliberately low: taste first. WHO advises less than 5 g of salt (about one teaspoon) per day in total.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const S = (A.SPICES = {});
  function P(id, unit, kind, icon, en, fi, sv, vi) { S[id] = { id: id, unit: unit, kind: kind, icon: icon, names: [en, fi, sv, vi] }; }

  P('salt', 'tsp', 'salt', 'salt', 'Salt', 'Suola', 'Salt', 'Muối');
  P('pepper', 'tsp', 'dried', 'spice_jar', 'Black pepper', 'Musta pippuri', 'Svartpeppar', 'Tiêu đen');
  P('allspice', 'tsp', 'dried', 'spice_jar', 'Allspice', 'Maustepippuri', 'Kryddpeppar', 'Tiêu Jamaica (allspice)');
  P('cardamom', 'tsp', 'dried', 'spice_jar', 'Ground cardamom', 'Jauhettu kardemumma', 'Mald kardemumma', 'Bạch đậu khấu xay');
  P('cinnamon', 'tsp', 'dried', 'spice_jar', 'Cinnamon', 'Kaneli', 'Kanel', 'Quế');
  P('nutmeg', 'tsp', 'dried', 'spice_jar', 'Nutmeg', 'Muskottipähkinä', 'Muskot', 'Nhục đậu khấu');
  P('paprika', 'tsp', 'dried', 'spice_jar', 'Sweet paprika', 'Paprikajauhe', 'Paprikapulver', 'Bột paprika ngọt');
  P('cumin', 'tsp', 'dried', 'spice_jar', 'Ground cumin', 'Jauhettu juustokumina', 'Mald spiskummin', 'Thì là Ai Cập (cumin) xay');
  P('coriander', 'tsp', 'dried', 'spice_jar', 'Ground coriander', 'Jauhettu korianteri', 'Malen koriander', 'Hạt rau mùi xay');
  P('turmeric', 'tsp', 'dried', 'spice_jar', 'Turmeric', 'Kurkuma', 'Gurkmeja', 'Nghệ');
  P('chili', 'tsp', 'dried', 'chili', 'Chilli flakes', 'Chilihiutaleet', 'Chiliflingor', 'Ớt khô vụn');
  P('curry', 'tsp', 'dried', 'spice_jar', 'Mild curry powder', 'Mieto currijauhe', 'Mild currypulver', 'Bột cà ri nhẹ');
  P('oregano', 'tsp', 'dried', 'spice_jar', 'Dried oregano', 'Kuivattu oregano', 'Torkad oregano', 'Oregano khô');
  P('thyme', 'tsp', 'dried', 'spice_jar', 'Dried thyme', 'Kuivattu timjami', 'Torkad timjan', 'Cỏ xạ hương khô');
  P('rosemary', 'tsp', 'dried', 'spice_jar', 'Rosemary', 'Rosmariini', 'Rosmarin', 'Hương thảo');
  P('bay', 'leaf', 'dried', 'spice_jar', 'Bay leaf', 'Laakerinlehti', 'Lagerblad', 'Lá nguyệt quế');
  P('star_anise', 'pcs', 'dried', 'spice_jar', 'Star anise', 'Tähtianis', 'Stjärnanis', 'Hoa hồi');
  P('dill', 'tsp', 'fresh', 'herb', 'Fresh dill', 'Tuore tilli', 'Färsk dill', 'Thì là tươi');
  P('parsley', 'tsp', 'fresh', 'herb', 'Fresh parsley', 'Tuore persilja', 'Färsk persilja', 'Mùi tây tươi');
  P('chives', 'tsp', 'fresh', 'herb', 'Chives', 'Ruohosipuli', 'Gräslök', 'Hẹ tây');
  P('basil', 'tsp', 'fresh', 'herb', 'Fresh basil', 'Tuore basilika', 'Färsk basilika', 'Húng quế tươi');
  P('mint', 'tsp', 'fresh', 'herb', 'Fresh mint', 'Tuore minttu', 'Färsk mynta', 'Bạc hà tươi');
  P('coriander_leaf', 'tsp', 'fresh', 'herb', 'Fresh coriander leaves', 'Tuore korianterin lehti', 'Färsk korianderblad', 'Rau mùi (ngò) tươi');
  P('spring_onion', 'tsp', 'fresh', 'herb', 'Spring onion', 'Kevätsipuli', 'Salladslök', 'Hành lá');
  P('lemon', 'lemon', 'fresh', 'lemon', 'Lemon (juice and zest)', 'Sitruuna (mehu ja kuori)', 'Citron (saft och skal)', 'Chanh vàng (nước và vỏ)');

  // When to add a seasoning. The app shows the groups in this order.
  A.SPICE_WHEN = ['start', 'cook', 'end', 'serve'];
})(typeof window !== 'undefined' ? window : globalThis);
