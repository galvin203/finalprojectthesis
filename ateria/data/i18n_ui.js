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
  U('brand.tag', 'Weekly meal plans with a priced shopping list', 'Viikon ruokalista ja hinnoiteltu ostoslista', 'Veckans matplan med prissatt inköpslista', 'Thực đơn cả tuần kèm danh sách đi chợ có giá');
  U('nav.aria', 'Main', 'Päävalikko', 'Huvudmeny', 'Menu chính');
  U('nav.plan', 'Plan', 'Ruokalista', 'Matplan', 'Thực đơn');
  U('nav.shop', 'Shop', 'Ostokset', 'Inköp', 'Đi chợ');
  U('nav.prices', 'Prices', 'Hinnat', 'Priser', 'Giá');
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
  U('shop.people_one', '{n} person', '{n} henkilö', '{n} person', '{n} người');
  U('shop.people_other', '{n} people', '{n} henkilöä', '{n} personer', '{n} người');
  U('shop.days', '7 days', '7 päivää', '7 dagar', '7 ngày');
  U('shop.placeholder', '<strong>Placeholder prices.</strong> Prices marked “est.” are illustrative numbers, not real store prices. {link} to compare the stores properly.',
    '<strong>Esimerkkihinnat.</strong> ”arv.”-merkityt hinnat ovat havainnollistavia lukuja, eivät kauppojen todellisia hintoja. {link}, jotta voit verrata kauppoja oikein.',
    '<strong>Platshållarpriser.</strong> Priser markerade ”uppsk.” är illustrativa siffror, inte butikernas verkliga priser. {link} för att jämföra butikerna på riktigt.',
    '<strong>Giá minh họa.</strong> Các giá có dấu “ước tính” chỉ là con số minh họa, không phải giá thật của cửa hàng. {link} để so sánh các cửa hàng cho đúng.');
  U('shop.placeholderLink', 'Enter real prices', 'Syötä todelliset hinnat', 'Ange verkliga priser', 'Nhập giá thật');
  U('est', 'est.', 'arv.', 'uppsk.', 'ước tính');
  U('store.use', 'meals use {eur}', 'ateriat käyttävät {eur}', 'måltiderna använder {eur}', 'các bữa dùng hết {eur}');
  U('store.missing_one', '{n} price missing', '{n} hinta puuttuu', '{n} pris saknas', 'thiếu {n} giá');
  U('store.missing_other', '{n} prices missing', '{n} hintaa puuttuu', '{n} priser saknas', 'thiếu {n} giá');
  U('store.lowest', 'Lowest', 'Edullisin', 'Lägst', 'Rẻ nhất');
  U('store.more', '{eur} more than {store}', '{eur} enemmän kuin {store}', '{eur} mer än {store}', 'đắt hơn {store} {eur}');
  U('store.under', '{eur} under budget', '{eur} budjetin alla', '{eur} under budgeten', 'dưới ngân sách {eur}');
  U('store.over', '{eur} over budget', '{eur} yli budjetin', '{eur} över budgeten', 'vượt ngân sách {eur}');
  U('shop.note', 'The large number is what you pay for whole packs. “Meals use” is the share of those packs this week’s meals consume; leftovers carry over to later weeks.',
    'Iso luku on kokonaisten pakkausten hinta. ”Ateriat käyttävät” on se osuus pakkauksista, jonka tämän viikon ateriat kuluttavat; ylijäämä riittää seuraaville viikoille.',
    'Det stora talet är vad du betalar för hela förpackningar. ”Måltiderna använder” är den andel av förpackningarna som veckans måltider går åt; resten räcker till kommande veckor.',
    'Con số lớn là số tiền bạn trả cho nguyên bao gói. “Các bữa dùng hết” là phần của các bao gói mà bữa ăn tuần này tiêu thụ; phần còn lại dùng cho những tuần sau.');
  U('shop.noteBudget', ' Your budget of {budget} is compared with the “meals use” figure.',
    ' Budjettiasi {budget} verrataan ”ateriat käyttävät” -lukuun.',
    ' Din budget på {budget} jämförs med siffran ”måltiderna använder”.',
    ' Ngân sách {budget} của bạn được so với con số “các bữa dùng hết”.');
  U('shop.mixed', '<strong>Item by item</strong> the cheapest basket is {total}, which is {saving} less than {store} alone, but means visiting {n} stores.',
    '<strong>Tuote tuotteelta</strong> edullisin ostoskori maksaa {total}, eli {saving} vähemmän kuin pelkkä {store}, mutta vaatii käyntiä {n} kaupassa.',
    '<strong>Vara för vara</strong> kostar den billigaste varukorgen {total}, vilket är {saving} mindre än enbart {store}, men innebär besök i {n} butiker.',
    '<strong>Mua từng món</strong> thì giỏ hàng rẻ nhất là {total}, rẻ hơn mua toàn bộ ở {store} {saving}, nhưng bạn phải ghé {n} cửa hàng.');
  U('item.got', 'Got {name}', 'Ostettu: {name}', 'Köpt: {name}', 'Đã mua {name}');
  U('item.noPrice', 'no price', 'ei hintaa', 'inget pris', 'chưa có giá');

  // ---------- prices ----------
  U('prices.title', 'Prices', 'Hinnat', 'Priser', 'Giá');
  U('prices.banner', '<strong>Placeholder prices.</strong> The numbers shown in grey are illustrative placeholders. Type the price you see in the store for one pack and it replaces the placeholder. Nothing is fetched from the stores.',
    '<strong>Esimerkkihinnat.</strong> Harmaalla näytetyt luvut ovat havainnollistavia esimerkkejä. Kirjoita kaupassa näkemäsi yhden pakkauksen hinta, niin se korvaa esimerkkiluvun. Kaupoista ei haeta mitään.',
    '<strong>Platshållarpriser.</strong> Siffrorna i grått är illustrativa platshållare. Skriv det pris du ser i butiken för en förpackning så ersätter det platshållaren. Ingenting hämtas från butikerna.',
    '<strong>Giá minh họa.</strong> Các con số màu xám chỉ là giá giữ chỗ để minh họa. Hãy gõ giá một bao gói mà bạn thấy ở cửa hàng, nó sẽ thay thế giá minh họa. Ứng dụng không tự lấy dữ liệu từ cửa hàng.');
  U('prices.find', 'Find an ingredient', 'Etsi ainesosa', 'Sök ingrediens', 'Tìm nguyên liệu');
  U('prices.findPh', 'Oats, milk, rice…', 'Kaurahiutale, maito, riisi…', 'Havregryn, mjölk, ris…', 'Yến mạch, sữa, gạo…');
  U('prices.perPack', 'price per {g} pack', 'hinta {g} pakkaukselle', 'pris per förpackning om {g}', 'giá cho gói {g}');
  U('io.title', 'Import or export prices', 'Tuo tai vie hintoja', 'Importera eller exportera priser', 'Nhập hoặc xuất giá');
  U('io.help', 'Paste JSON or CSV (columns: store, ingredient_id, price, pack_g; stores are S, K and Lidl) and press Load. Use Copy to keep your own prices. <code>tools/prices_tool.py</code> produces this format.',
    'Liitä JSON tai CSV (sarakkeet: store, ingredient_id, price, pack_g; kaupat ovat S, K ja Lidl) ja paina Lataa. Kopioi-painikkeella voit tallentaa omat hintasi. <code>tools/prices_tool.py</code> tuottaa tämän muodon.',
    'Klistra in JSON eller CSV (kolumner: store, ingredient_id, price, pack_g; butikerna är S, K och Lidl) och tryck på Läs in. Använd Kopiera för att spara dina egna priser. <code>tools/prices_tool.py</code> skapar det här formatet.',
    'Dán JSON hoặc CSV (các cột: store, ingredient_id, price, pack_g; cửa hàng là S, K và Lidl) rồi bấm Nạp. Dùng Sao chép để lưu giá của riêng bạn. <code>tools/prices_tool.py</code> tạo ra định dạng này.');
  U('io.aria', 'Prices as JSON or CSV', 'Hinnat JSON- tai CSV-muodossa', 'Priser som JSON eller CSV', 'Giá ở dạng JSON hoặc CSV');
  U('io.load', 'Load', 'Lataa', 'Läs in', 'Nạp');
  U('io.copy', 'Copy my prices', 'Kopioi hintani', 'Kopiera mina priser', 'Sao chép giá của tôi');
  U('io.reset', 'Remove my prices', 'Poista hintani', 'Ta bort mina priser', 'Xóa giá của tôi');
  U('io.resetArmed', 'Press again to remove all my prices', 'Paina uudelleen poistaaksesi kaikki hintani', 'Tryck igen för att ta bort alla mina priser', 'Bấm lần nữa để xóa toàn bộ giá của tôi');
  U('io.loaded_one', 'Loaded {n} price', 'Ladattu {n} hinta', 'Läste in {n} pris', 'Đã nạp {n} giá');
  U('io.loaded_other', 'Loaded {n} prices', 'Ladattu {n} hintaa', 'Läste in {n} priser', 'Đã nạp {n} giá');
  U('io.skipped_one', 'skipped {n} row (unknown store or ingredient, or a bad number)', 'ohitettu {n} rivi (tuntematon kauppa tai ainesosa tai virheellinen luku)', 'hoppade över {n} rad (okänd butik eller ingrediens, eller ett felaktigt tal)', 'bỏ qua {n} dòng (cửa hàng hoặc nguyên liệu không rõ, hoặc số không hợp lệ)');
  U('io.skipped_other', 'skipped {n} rows (unknown store or ingredient, or a bad number)', 'ohitettu {n} riviä (tuntematon kauppa tai ainesosa tai virheellinen luku)', 'hoppade över {n} rader (okänd butik eller ingrediens, eller ett felaktigt tal)', 'bỏ qua {n} dòng (cửa hàng hoặc nguyên liệu không rõ, hoặc số không hợp lệ)');
  U('io.copied', 'Copied. Paste it into a file to keep it.', 'Kopioitu. Liitä se tiedostoon tallentaaksesi.', 'Kopierat. Klistra in det i en fil för att spara det.', 'Đã sao chép. Hãy dán vào một tệp để lưu lại.');
  U('io.copyFail', 'Select the text above and copy it.', 'Valitse yllä oleva teksti ja kopioi se.', 'Markera texten ovan och kopiera den.', 'Hãy chọn đoạn văn bản ở trên và sao chép.');
  U('io.removed', 'Your prices were removed.', 'Hintasi poistettiin.', 'Dina priser togs bort.', 'Giá của bạn đã được xóa.');
  U('io.errEmpty', 'Nothing to import.', 'Ei tuotavaa.', 'Inget att importera.', 'Không có gì để nhập.');
  U('io.errJson', 'That is not valid JSON.', 'Tämä ei ole kelvollista JSONia.', 'Det är inte giltig JSON.', 'Đó không phải JSON hợp lệ.');

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
  U('profile.budget', 'Weekly food budget (€, 0 for none)', 'Viikoittainen ruokabudjetti (€, 0 = ei budjettia)', 'Veckobudget för mat (€, 0 för ingen)', 'Ngân sách ăn uống mỗi tuần (€, 0 nếu không đặt)');
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
