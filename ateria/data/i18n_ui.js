/*
 * Interface texts in English, Finnish, Swedish and Vietnamese.
 * Placeholders look like {name}; keys ending in _one / _other are plural forms (see js/i18n.js).
 * Texts containing <strong>, <code> or {link} are trusted markup written here, never user input.
 * Swedish and Vietnamese (and parts of the Finnish) were written for this project: have a native speaker check them.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const I18N = (A.I18N = A.I18N || {});

  A.LANGS = [
    { id: 'en', name: 'English', locale: 'en-GB' },
    { id: 'fi', name: 'Suomi', locale: 'fi-FI' },
    { id: 'sv', name: 'Svenska', locale: 'sv-FI' },
    { id: 'vi', name: 'Tiếng Việt', locale: 'vi-VN' },
  ];

  const ui = (I18N.ui = { en: {}, fi: {}, sv: {}, vi: {} });
  function U(key, en, fi, sv, vi) { ui.en[key] = en; ui.fi[key] = fi; ui.sv[key] = sv; ui.vi[key] = vi; }

  // ---------- shell ----------
  U('brand.tag', 'Meal plans, food log and shopping list',
    'Ruokalista, kirjaus ja ostoslista',
    'Matplan, logg och inköpslista',
    'Thực đơn, nhật ký ăn uống và danh sách đi chợ');
  U('nav.aria', 'Main', 'Päävalikko', 'Huvudmeny', 'Menu chính');
  U('nav.plan', 'Plan', 'Ruokalista', 'Matplan', 'Thực đơn');
  U('nav.shop', 'Shop', 'Ostokset', 'Inköp', 'Đi chợ');
  U('nav.you', 'You', 'Profiili', 'Profil', 'Hồ sơ');
  U('lang.label', 'Language', 'Kieli', 'Språk', 'Ngôn ngữ');

  U('example.body', '<strong>Example profile.</strong> This plan is for a made-up person. {link} to get your own targets.',
    '<strong>Esimerkkiprofiili.</strong> Tämä suunnitelma on kuvitellulle henkilölle. {link}, niin saat omat tavoitteesi.',
    '<strong>Exempelprofil.</strong> Den här planen är för en påhittad person. {link} för att få dina egna mål.',
    '<strong>Hồ sơ mẫu.</strong> Kế hoạch này dành cho một người giả định. {link} để nhận mục tiêu của riêng bạn.');
  U('example.link', 'Enter your own details', 'Syötä omat tietosi', 'Ange dina egna uppgifter', 'Nhập thông tin của bạn');

  // ---------- plan ----------
  U('plan.none', 'No plan yet', 'Ei vielä suunnitelmaa', 'Ingen plan ännu', 'Chưa có kế hoạch');
  U('plan.change', 'Change profile', 'Muuta profiilia', 'Ändra profil', 'Sửa hồ sơ');
  U('targets.aria', 'Daily targets', 'Päivän tavoitteet', 'Dagens mål', 'Mục tiêu hằng ngày');
  U('targets.daily', 'Your daily target', 'Päivittäinen tavoitteesi', 'Ditt dagliga mål', 'Mục tiêu mỗi ngày của bạn');
  U('kcal', 'kcal', 'kcal', 'kcal', 'kcal');
  U('macro.protein', 'Protein', 'Proteiini', 'Protein', 'Chất đạm');
  U('macro.fat', 'Fat', 'Rasva', 'Fett', 'Chất béo');
  U('macro.carbs', 'Carbs', 'Hiilihydraatit', 'Kolhydrater', 'Tinh bột');
  U('macro.fibre', 'Fibre', 'Kuitu', 'Fibrer', 'Chất xơ');
  U('formula.main', 'Resting energy {bmr} kcal (Mifflin-St Jeor) × activity {pal} = {tdee} kcal. Goal {adj} gives {kcal} kcal.',
    'Perusaineenvaihdunta {bmr} kcal (Mifflin–St Jeor) × aktiivisuus {pal} = {tdee} kcal. Tavoite {adj} antaa {kcal} kcal.',
    'Vilometabolism {bmr} kcal (Mifflin–St Jeor) × aktivitet {pal} = {tdee} kcal. Målet {adj} ger {kcal} kcal.',
    'Năng lượng nghỉ ngơi {bmr} kcal (Mifflin–St Jeor) × mức vận động {pal} = {tdee} kcal. Mục tiêu {adj} cho {kcal} kcal.');
  U('formula.floored', 'Resting energy {bmr} kcal (Mifflin-St Jeor) × activity {pal} = {tdee} kcal. Goal {adj}, held at resting energy, gives {kcal} kcal.',
    'Perusaineenvaihdunta {bmr} kcal (Mifflin–St Jeor) × aktiivisuus {pal} = {tdee} kcal. Tavoite {adj}, pidetty perusaineenvaihdunnan tasolla, antaa {kcal} kcal.',
    'Vilometabolism {bmr} kcal (Mifflin–St Jeor) × aktivitet {pal} = {tdee} kcal. Målet {adj}, hållet vid vilometabolismen, ger {kcal} kcal.',
    'Năng lượng nghỉ ngơi {bmr} kcal (Mifflin–St Jeor) × mức vận động {pal} = {tdee} kcal. Mục tiêu {adj}, giữ ở mức năng lượng nghỉ ngơi, cho {kcal} kcal.');
  U('formula.share', ' The meals you plan cover {pct} of the day ({kcal} kcal); you cover the rest.',
    ' Suunnittelemasi ateriat kattavat {pct} päivästä ({kcal} kcal); loput hoidat itse.',
    ' Måltiderna du planerar täcker {pct} av dagen ({kcal} kcal); resten står du för själv.',
    ' Các bữa bạn chọn chiếm {pct} trong ngày ({kcal} kcal); phần còn lại bạn tự lo.');
  U('plan.title', 'Week plan', 'Viikon ruokalista', 'Veckans matplan', 'Thực đơn cả tuần');
  U('plan.new', 'New plan', 'Uusi suunnitelma', 'Ny plan', 'Tạo thực đơn mới');
  U('plan.chooseDay', 'Choose a day', 'Valitse päivä', 'Välj dag', 'Chọn ngày');
  U('plan.day', 'Day {n}', 'Päivä {n}', 'Dag {n}', 'Ngày {n}');
  U('gauge.energy', 'Energy', 'Energia', 'Energi', 'Năng lượng');
  U('gauge.aria', '{label} {val} of {target} {unit}', '{label} {val} / {target} {unit}', '{label} {val} av {target} {unit}', '{label}: {val} trên {target} {unit}');
  U('warn.label', 'Check:', 'Tarkista:', 'Kontrollera:', 'Lưu ý:');
  U('warn.noSnack', 'No snack recipe fits your restrictions, so snacks were left out.',
    'Mikään välipalaresepti ei sovi rajoituksiisi, joten välipalat jätettiin pois.',
    'Inget mellanmålsrecept passar dina begränsningar, så mellanmål utelämnades.',
    'Không có công thức bữa phụ nào phù hợp với hạn chế của bạn, nên đã bỏ bữa phụ.');
  U('warn.energy', 'Day {day}: energy is {pct} from the target (portion limits reached).',
    'Päivä {day}: energia poikkeaa tavoitteesta {pct} (annoskoon rajat täyttyivät).',
    'Dag {day}: energin avviker {pct} från målet (portionsgränserna nåddes).',
    'Ngày {day}: năng lượng lệch {pct} so với mục tiêu (đã chạm giới hạn khẩu phần).');
  U('warn.protein', 'Day {day}: protein is below 85% of the target.',
    'Päivä {day}: proteiinia on alle 85 % tavoitteesta.',
    'Dag {day}: proteinet är under 85 % av målet.',
    'Ngày {day}: chất đạm thấp hơn 85% mục tiêu.');

  U('meal.breakfast', 'Breakfast', 'Aamiainen', 'Frukost', 'Bữa sáng');
  U('meal.lunch', 'Lunch', 'Lounas', 'Lunch', 'Bữa trưa');
  U('meal.snack', 'Snack', 'Välipala', 'Mellanmål', 'Bữa phụ');
  U('meal.dinner', 'Dinner', 'Päivällinen', 'Middag', 'Bữa tối');
  U('meal.swapped', 'swapped', 'vaihdettu', 'utbytt', 'đã đổi');
  U('meal.min', '{n} min', '{n} min', '{n} min', '{n} phút');
  U('meal.protein', 'Protein {n} g', 'Proteiini {n} g', 'Protein {n} g', 'Đạm {n} g');
  U('tbl.ingredient', 'Ingredient', 'Ainesosa', 'Ingrediens', 'Nguyên liệu');
  U('tbl.amount', 'Amount', 'Määrä', 'Mängd', 'Lượng');
  U('tbl.protein', 'Protein', 'Proteiini', 'Protein', 'Đạm');
  U('tbl.total', 'Total', 'Yhteensä', 'Totalt', 'Tổng');
  U('tbl.instead', 'instead of {name}', 'korvaa: {name}', 'istället för {name}', 'thay cho {name}');
  U('meal.note', 'Each line is grams × the ingredient’s values per 100 g. Portion scaled ×{f} to fit your target. Salt, pepper and spices are not counted.',
    'Jokainen rivi on grammat × ainesosan arvot 100 g:aa kohden. Annos skaalattu ×{f}, jotta se sopii tavoitteeseesi. Suolaa, pippuria ja mausteita ei lasketa.',
    'Varje rad är gram × ingrediensens värden per 100 g. Portionen är skalad ×{f} för att passa ditt mål. Salt, peppar och kryddor räknas inte.',
    'Mỗi dòng là số gam × giá trị dinh dưỡng của nguyên liệu trên 100 g. Khẩu phần được nhân ×{f} để khớp với mục tiêu của bạn. Muối, tiêu và gia vị không được tính.');
  U('swap.open', 'Swap this meal', 'Vaihda tämä ateria', 'Byt den här måltiden', 'Đổi món này');
  U('swap.hide', 'Hide alternatives', 'Piilota vaihtoehdot', 'Dölj alternativ', 'Ẩn các món thay thế');
  U('swap.none', 'No other recipe fits your restrictions for this meal.', 'Mikään muu tämän aterian resepti ei sovi rajoituksiisi.', 'Inget annat recept för den här måltiden passar dina begränsningar.', 'Không còn công thức nào khác cho bữa này phù hợp với hạn chế của bạn.');
  U('swap.meta', '{min} min · protein {p} g', '{min} min · proteiinia {p} g', '{min} min · protein {p} g', '{min} phút · đạm {p} g');
  U('toast.swapped', 'Meal swapped', 'Ateria vaihdettu', 'Måltiden byttes', 'Đã đổi món');
  U('toast.newplan', 'New plan ready', 'Uusi suunnitelma valmis', 'Ny plan klar', 'Thực đơn mới đã sẵn sàng');
  U('toast.ready', 'Plan ready', 'Suunnitelma valmis', 'Planen är klar', 'Thực đơn đã sẵn sàng');
  U('toast.check', 'Check your restrictions', 'Tarkista rajoituksesi', 'Kontrollera dina begränsningar', 'Hãy kiểm tra lại các hạn chế của bạn');
  U('amt.pcs', '≈ {pcs} pcs · {g}', '≈ {pcs} kpl · {g}', '≈ {pcs} st · {g}', '≈ {pcs} cái · {g}');

  // ---------- shop ----------
  U('shop.none', 'No shopping list yet', 'Ei vielä ostoslistaa', 'Ingen inköpslista ännu', 'Chưa có danh sách đi chợ');
  U('shop.createFirst', 'Create a plan first.', 'Luo ensin suunnitelma.', 'Skapa en plan först.', 'Hãy tạo thực đơn trước.');
  U('shop.title', 'Shopping list', 'Ostoslista', 'Inköpslista', 'Danh sách đi chợ');
  U('shop.forDays', 'Buy for these days',
    'Osta näille päiville',
    'Handla för dessa dagar',
    'Mua cho những ngày này');
  U('shop.allDays', 'All days',
    'Kaikki päivät',
    'Alla dagar',
    'Cả tuần');
  U('shop.noDays', 'Choose at least one day to see what to buy.',
    'Valitse vähintään yksi päivä nähdäksesi, mitä ostaa.',
    'Välj minst en dag för att se vad du ska köpa.',
    'Hãy chọn ít nhất một ngày để xem cần mua gì.');
  U('shop.where', 'Where it is used',
    'Missä käytetään',
    'Var det används',
    'Dùng ở đâu');
  U('shop.items_one', '{n} item',
    '{n} tuote',
    '{n} vara',
    '{n} món');
  U('shop.items_other', '{n} items',
    '{n} tuotetta',
    '{n} varor',
    '{n} món');
  U('shop.meals_one', '{n} meal',
    '{n} ateria',
    '{n} måltid',
    '{n} bữa');
  U('shop.meals_other', '{n} meals',
    '{n} ateriaa',
    '{n} måltider',
    '{n} bữa');
  U('shop.people_one', '{n} person', '{n} henkilö', '{n} person', '{n} người');
  U('shop.people_other', '{n} people', '{n} henkilöä', '{n} personer', '{n} người');
  U('shop.note', 'Amounts are the totals the recipes need for everyone in the plan, for the days you choose. Open “Where it is used” to see which meals need an ingredient. Check what you already have at home before you buy.',
    'Määrät ovat kokonaismäärät, jotka reseptit vaativat kaikille suunnitelman henkilöille valitsemiesi päivien ajalta. Avaa ”Missä käytetään” nähdäksesi, mitkä ateriat tarvitsevat ainesosan. Tarkista, mitä sinulla on jo kotona, ennen kuin ostat.',
    'Mängderna är de totala mängder som recepten behöver för alla i planen under de dagar du väljer. Öppna ”Var det används” för att se vilka måltider som behöver en ingrediens. Kolla vad du redan har hemma innan du handlar.',
    'Số lượng là tổng lượng các công thức cần cho tất cả mọi người trong kế hoạch, trong những ngày bạn chọn. Mở “Dùng ở đâu” để xem những bữa nào cần nguyên liệu đó. Hãy kiểm tra những gì đã có ở nhà trước khi mua.');
  U('item.got', 'Got {name}', 'Ostettu: {name}', 'Köpt: {name}', 'Đã mua {name}');

  // ---------- profile ----------
  U('profile.title', 'Your details', 'Tietosi', 'Dina uppgifter', 'Thông tin của bạn');
  U('profile.sex', 'Sex used in the energy formula', 'Energiakaavassa käytettävä sukupuoli', 'Kön som används i energiformeln', 'Giới tính dùng trong công thức tính năng lượng');
  U('sex.female', 'Female', 'Nainen', 'Kvinna', 'Nữ');
  U('sex.male', 'Male', 'Mies', 'Man', 'Nam');
  U('profile.age', 'Age (18 or older)', 'Ikä (18 tai yli)', 'Ålder (18 eller äldre)', 'Tuổi (từ 18 trở lên)');
  U('profile.height', 'Height (cm)', 'Pituus (cm)', 'Längd (cm)', 'Chiều cao (cm)');
  U('profile.weight', 'Weight (kg)', 'Paino (kg)', 'Vikt (kg)', 'Cân nặng (kg)');
  U('profile.activity', 'Activity', 'Aktiivisuus', 'Aktivitet', 'Mức vận động');
  U('activity.sedentary', 'Mostly sitting, light daily activity', 'Pääosin istumatyötä, kevyttä päivittäistä liikkumista', 'Mest stillasittande, lätt aktivitet i vardagen', 'Chủ yếu ngồi, vận động nhẹ hằng ngày');
  U('activity.active', 'On your feet most of the day, or regular exercise', 'Jalkeilla suurimman osan päivästä tai säännöllistä liikuntaa', 'På fötter större delen av dagen, eller regelbunden motion', 'Đứng đi nhiều trong ngày, hoặc tập luyện đều đặn');
  U('activity.vigorous', 'Hard physical work or daily heavy training', 'Raskas ruumiillinen työ tai päivittäinen kova harjoittelu', 'Tungt fysiskt arbete eller tuff träning varje dag', 'Lao động chân tay nặng hoặc tập luyện cường độ cao mỗi ngày');
  U('profile.goal', 'Goal', 'Tavoite', 'Mål', 'Mục tiêu');
  U('goal.lose', 'Lose weight', 'Laihduttaa', 'Gå ner i vikt', 'Giảm cân');
  U('goal.maintain', 'Maintain weight', 'Pitää paino', 'Behålla vikten', 'Giữ cân');
  U('goal.gain', 'Gain weight', 'Lisätä painoa', 'Gå upp i vikt', 'Tăng cân');
  U('goal.muscle', 'Build muscle (gym)', 'Lisätä lihasta (kuntosali)', 'Bygga muskler (gym)', 'Tăng cơ (tập gym)');
  U('profile.goalMuscle', 'Food supports muscle gain, but training is what builds muscle: strength training two to three times a week is a common starting point. If you train, pick the second or third activity level above. This goal adds 10 % energy and 1.8 g protein per kg of body weight.',
    'Ruoka tukee lihaskasvua, mutta lihasta rakentaa harjoittelu: voimaharjoittelu kaksi tai kolme kertaa viikossa on yleinen aloitus. Jos harjoittelet, valitse yltä toinen tai kolmas aktiivisuustaso. Tämä tavoite lisää energiaa 10 % ja proteiinia 1,8 g painokiloa kohti.',
    'Maten stödjer muskeluppbyggnad, men det är träningen som bygger muskler: styrketräning två till tre gånger i veckan är en vanlig start. Om du tränar, välj den andra eller tredje aktivitetsnivån ovan. Det här målet lägger till 10 % energi och 1,8 g protein per kilo kroppsvikt.',
    'Ăn uống hỗ trợ tăng cơ, nhưng chính việc tập luyện mới xây cơ: tập tạ 2–3 buổi mỗi tuần là điểm bắt đầu phổ biến. Nếu bạn tập, hãy chọn mức vận động thứ hai hoặc thứ ba ở trên. Mục tiêu này cộng thêm 10 % năng lượng và 1,8 g protein cho mỗi kg cân nặng.');
  U('welcome.title', 'Your week of meals, planned and ready to shop for', 'Viikon ateriat suunniteltuna ja valmiina ostoslistaksi', 'Veckans måltider, planerade och klara för inköp', 'Một tuần bữa ăn, đã lên kế hoạch và sẵn sàng đi chợ');
  U('welcome.lead', 'Choose your goal. Ateria plans seven days of meals that fit your calories and protein, then lists what to buy for them.',
    'Valitse tavoitteesi. Ateria suunnittelee seitsemän päivää aterioita, jotka sopivat kaloreihisi ja proteiiniisi, ja listaa, mitä niihin tarvitsee ostaa.',
    'Välj ditt mål. Ateria planerar sju dagars måltider som passar dina kalorier och ditt protein och listar vad du behöver köpa till dem.',
    'Chọn mục tiêu của bạn. Ateria lên thực đơn bảy ngày phù hợp lượng calo và protein của bạn, rồi liệt kê những gì cần mua cho các bữa đó.');
  U('welcome.pick', 'What is your goal?', 'Mikä on tavoitteesi?', 'Vad är ditt mål?', 'Mục tiêu của bạn là gì?');
  U('welcome.example', 'See an example week', 'Katso esimerkkiviikko', 'Se en exempelvecka', 'Xem tuần mẫu');
  U('welcome.dishes', 'A taste of the week', 'Maistiainen viikosta', 'Smakprov på veckan', 'Xem trước vài món trong tuần');
  U('welcome.how', 'How it works', 'Näin se toimii', 'Så fungerar det', 'Cách hoạt động');
  U('welcome.s1.t', 'Tell us about you', 'Kerro itsestäsi', 'Berätta om dig', 'Cho chúng tôi biết về bạn');
  U('welcome.s1.b', 'Age, height, weight, activity and goal. Allergies and food you dislike are respected.',
    'Ikä, pituus, paino, aktiivisuus ja tavoite. Allergiat ja inhokit otetaan huomioon.',
    'Ålder, längd, vikt, aktivitet och mål. Allergier och mat du ogillar respekteras.',
    'Tuổi, chiều cao, cân nặng, mức vận động và mục tiêu. Dị ứng và món bạn không thích đều được tôn trọng.');
  U('welcome.s2.t', 'Get a week of meals', 'Saat viikon ateriat', 'Få en vecka med måltider', 'Nhận thực đơn một tuần');
  U('welcome.s2.b', 'Calories and protein are worked out for you, and every recipe shows exact amounts.',
    'Kalorit ja proteiini lasketaan puolestasi, ja jokaisessa reseptissä on tarkat määrät.',
    'Kalorier och protein räknas ut åt dig och varje recept visar exakta mängder.',
    'Calo và protein được tính sẵn, mỗi công thức đều có định lượng cụ thể.');
  U('welcome.s3.t', 'Buy what the meals need',
    'Osta se, mitä ateriat tarvitsevat',
    'Köp det måltiderna behöver',
    'Mua đúng thứ các bữa ăn cần');
  U('welcome.s3.b', 'The list adds up the amounts for every meal and person, grouped by aisle. Choose the days you shop for and see which meals use each item.',
    'Lista laskee yhteen jokaisen aterian ja henkilön määrät ja ryhmittelee ne osastoittain. Valitse päivät, joille ostat, ja katso, mitkä ateriat käyttävät kutakin tuotetta.',
    'Listan summerar mängderna för varje måltid och person, sorterade efter avdelning. Välj vilka dagar du handlar för och se vilka måltider som använder varje vara.',
    'Danh sách cộng dồn lượng nguyên liệu cho từng bữa và từng người, chia theo khu vực. Chọn những ngày bạn đi chợ và xem bữa nào dùng từng món.');
  U('photo.credit', 'Photo: {credit}', 'Kuva: {credit}', 'Foto: {credit}', 'Ảnh: {credit}');
  U('profile.diet', 'Diet', 'Ruokavalio', 'Kost', 'Chế độ ăn');
  U('diet.omnivore', 'Eats everything', 'Syö kaikkea', 'Äter allt', 'Ăn tất cả');
  U('diet.pescatarian', 'Fish, no meat', 'Kalaa, ei lihaa', 'Fisk, inget kött', 'Có cá, không ăn thịt');
  U('diet.vegetarian', 'Vegetarian', 'Kasvissyöjä', 'Vegetarian', 'Ăn chay (có trứng, sữa)');
  U('diet.vegan', 'Vegan', 'Vegaani', 'Vegan', 'Ăn thuần chay');
  U('profile.allergy', 'Allergies and intolerances', 'Allergiat ja intoleranssit', 'Allergier och intoleranser', 'Dị ứng và không dung nạp');
  U('profile.lactose', 'Lactose intolerance', 'Laktoosi-intoleranssi', 'Laktosintolerans', 'Không dung nạp lactose');
  U('profile.meals', 'Meals to plan', 'Suunniteltavat ateriat', 'Måltider att planera', 'Các bữa cần lên thực đơn');
  U('profile.mealsNote', 'Meals you leave out are assumed to be eaten elsewhere, so the plan covers only their share of your day.',
    'Pois jätettyjen aterioiden oletetaan syötävän muualla, joten suunnitelma kattaa vain valittujen aterioiden osuuden päivästäsi.',
    'Måltider du utelämnar antas ätas någon annanstans, så planen täcker bara de valda måltidernas andel av din dag.',
    'Những bữa bạn bỏ chọn được coi là ăn ở nơi khác, nên kế hoạch chỉ bao gồm phần năng lượng của các bữa đã chọn.');
  U('profile.people', 'People you shop for', 'Henkilöt, joille ostat ruokaa', 'Personer du handlar åt', 'Số người bạn đi chợ cho');
  U('profile.dislike', 'Ingredients you dislike', 'Ainesosat, joista et pidä', 'Ingredienser du inte gillar', 'Nguyên liệu bạn không thích');
  U('profile.like', 'Ingredients you like', 'Ainesosat, joista pidät', 'Ingredienser du gillar', 'Nguyên liệu bạn thích');
  U('profile.create', 'Create my plan', 'Luo suunnitelmani', 'Skapa min plan', 'Tạo thực đơn của tôi');
  U('profile.disclaimer', 'Targets are general estimates for healthy adults from standard equations. Ateria is not medical advice. If you have a medical condition, are pregnant or have a history of disordered eating, ask a doctor or dietitian first. Nutrition values are approximate reference values.',
    'Tavoitteet ovat yleisiä arvioita terveille aikuisille tavallisilla kaavoilla. Ateria ei ole lääketieteellistä neuvontaa. Jos sinulla on sairaus, olet raskaana tai sinulla on ollut syömishäiriö, keskustele ensin lääkärin tai ravitsemusterapeutin kanssa. Ravintoarvot ovat likimääräisiä viitearvoja.',
    'Målen är allmänna uppskattningar för friska vuxna enligt standardformler. Ateria är inte medicinsk rådgivning. Om du har en sjukdom, är gravid eller har haft ätstörningar, fråga först en läkare eller dietist. Näringsvärdena är ungefärliga referensvärden.',
    'Các mục tiêu chỉ là ước tính chung cho người trưởng thành khỏe mạnh theo công thức tiêu chuẩn. Ateria không phải lời khuyên y tế. Nếu bạn có bệnh lý, đang mang thai hoặc từng bị rối loạn ăn uống, hãy hỏi bác sĩ hoặc chuyên gia dinh dưỡng trước. Giá trị dinh dưỡng chỉ là giá trị tham khảo gần đúng.');

  // ---------- validation and engine messages ----------
  U('err.missing', 'Missing profile', 'Profiili puuttuu', 'Profil saknas', 'Thiếu hồ sơ');
  U('err.sex', 'Choose a sex used for the energy formula.', 'Valitse energiakaavassa käytettävä sukupuoli.', 'Välj det kön som används i energiformeln.', 'Hãy chọn giới tính dùng trong công thức tính năng lượng.');
  U('err.age', 'Age must be between 18 and 99 (the formulas are for adults).', 'Iän on oltava 18–99 vuotta (kaavat on tarkoitettu aikuisille).', 'Åldern måste vara mellan 18 och 99 (formlerna är för vuxna).', 'Tuổi phải từ 18 đến 99 (các công thức dành cho người trưởng thành).');
  U('err.height', 'Height must be between 120 and 230 cm.', 'Pituuden on oltava 120–230 cm.', 'Längden måste vara mellan 120 och 230 cm.', 'Chiều cao phải từ 120 đến 230 cm.');
  U('err.weight', 'Weight must be between 35 and 250 kg.', 'Painon on oltava 35–250 kg.', 'Vikten måste vara mellan 35 och 250 kg.', 'Cân nặng phải từ 35 đến 250 kg.');
  U('err.activity', 'Choose an activity level.', 'Valitse aktiivisuustaso.', 'Välj aktivitetsnivå.', 'Hãy chọn mức vận động.');
  U('err.goal', 'Choose a goal.', 'Valitse tavoite.', 'Välj ett mål.', 'Hãy chọn mục tiêu.');
  U('err.meals', 'Select at least one meal to plan.', 'Valitse vähintään yksi suunniteltava ateria.', 'Välj minst en måltid att planera.', 'Hãy chọn ít nhất một bữa để lên thực đơn.');
  U('err.people', 'People must be between 1 and 8.', 'Henkilöiden määrän on oltava 1–8.', 'Antalet personer måste vara mellan 1 och 8.', 'Số người phải từ 1 đến 8.');
  U('err.noRecipes', '{meal}: no recipes fit your diet, allergies and dislikes. Try removing a restriction.',
    '{meal}: mikään resepti ei sovi ruokavalioosi, allergioihisi ja inhokkeihisi. Kokeile poistaa jokin rajoitus.',
    '{meal}: inga recept passar din kost, dina allergier och det du ogillar. Prova att ta bort en begränsning.',
    '{meal}: không có công thức nào phù hợp với chế độ ăn, dị ứng và món bạn không thích. Hãy thử bỏ bớt một hạn chế.');
})(typeof window !== 'undefined' ? window : globalThis);
