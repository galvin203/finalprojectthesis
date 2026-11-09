/*
 * Interface texts added in version 2 (kitchen measures, seasoning, favourites, saved data, weight log, food log, helper), in
 * English, Finnish, Swedish and Vietnamese. Same conventions as data/i18n_ui.js: {placeholders}, _one/_other plural forms.
 * Swedish and Vietnamese (and parts of the Finnish) were written for this project: have a native speaker check them.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const ui = A.I18N.ui;
  function U(key, en, fi, sv, vi) { ui.en[key] = en; ui.fi[key] = fi; ui.sv[key] = sv; ui.vi[key] = vi; }

  // ---------- kitchen measures ----------
  U('unit.tsp', 'tsp', 'tl', 'tsk', 'thìa cà phê');
  U('unit.tbsp', 'tbsp', 'rkl', 'msk', 'thìa canh');
  U('unit.dl', 'dl', 'dl', 'dl', 'dl');
  U('unit.pinch', 'a pinch of', 'ripaus', 'en nypa', 'một nhúm');
  U('unit.pinch1', 'a pinch', 'ripaus', 'en nypa', 'một nhúm');
  U('unit.leaf_one', '{n} leaf', '{n} lehti', '{n} blad', '{n} lá');
  U('unit.leaf_other', '{n} leaves', '{n} lehteä', '{n} blad', '{n} lá');
  U('unit.pcs_one', '{n} piece', '{n} kappale', '{n} st', '{n} cái');
  U('unit.pcs_other', '{n} pieces', '{n} kappaletta', '{n} st', '{n} cái');
  U('unit.clove_one', '{n} clove', '{n} kynsi', '{n} klyfta', '{n} tép');
  U('unit.clove_other', '{n} cloves', '{n} kynttä', '{n} klyftor', '{n} tép');
  U('unit.lemon_one', '{n} lemon', '{n} sitruuna', '{n} citron', '{n} quả chanh');
  U('unit.lemon_other', '{n} lemons', '{n} sitruunaa', '{n} citroner', '{n} quả chanh');

  // ---------- cuisines ----------
  U('cuisine.nordic', 'Nordic', 'Pohjoismainen', 'Nordisk', 'Bắc Âu');
  U('cuisine.european', 'European', 'Eurooppalainen', 'Europeisk', 'Châu Âu');
  U('cuisine.asian', 'Asian', 'Aasialainen', 'Asiatisk', 'Châu Á');
  U('cuisine.world', 'Everyday and world', 'Arki ja maailma', 'Vardag och värld', 'Hằng ngày và thế giới');
  U('profile.cuisine', 'Food you would like more of', 'Ruoka, jota haluat enemmän', 'Mat du vill ha mer av', 'Món bạn muốn ăn nhiều hơn');
  U('profile.cuisineNote', 'Pick any. These recipes appear more often; other recipes still mix in. Pick none for a bit of everything.',
    'Valitse mitä tahansa. Nämä reseptit tulevat esiin useammin, mutta muita sekoittuu mukaan. Älä valitse mitään, jos haluat vähän kaikkea.',
    'Välj vilka du vill. Dessa recept dyker upp oftare, men andra blandas fortfarande in. Välj inga för lite av allt.',
    'Chọn tùy ý. Các món này sẽ xuất hiện nhiều hơn, các món khác vẫn xen vào. Không chọn gì để có một ít mọi loại.');

  U('budget.none', 'No budget', 'Ei budjettia', 'Ingen budget', 'Không đặt ngân sách');
  U('profile.budgetSlide', 'Weekly food budget, slider', 'Viikoittainen ruokabudjetti, liukusäädin', 'Veckobudget för mat, reglage', 'Ngân sách ăn uống mỗi tuần, thanh trượt');
  // ---------- swipe: choose the kinds of food you like ----------
  U('steps.of', 'Step {n} of {total}', 'Vaihe {n}/{total}', 'Steg {n} av {total}', 'Bước {n}/{total}');
  U('swipe.title', 'Which food do you like?', 'Mistä ruoasta pidät?', 'Vilken mat gillar du?', 'Bạn thích loại món nào?');
  U('swipe.hint', 'Swipe right (green tick) if you like it, left (red cross) if not.',
    'Pyyhkäise oikealle (vihreä valintamerkki), jos pidät, vasemmalle (punainen risti), jos et.',
    'Svep åt höger (grön bock) om du gillar, åt vänster (rött kryss) om inte.',
    'Quẹt phải (dấu tick xanh) nếu thích, quẹt trái (dấu X đỏ) nếu không.');
  U('swipe.yes', 'I like it', 'Pidän siitä', 'Jag gillar det', 'Tôi thích');
  U('swipe.no', 'Not for me', 'Ei minulle', 'Inte för mig', 'Không thích');
  U('swipe.undo', 'Undo', 'Kumoa', 'Ångra', 'Hoàn tác');
  U('swipe.skip', 'Skip this step', 'Ohita tämä vaihe', 'Hoppa över steget', 'Bỏ qua bước này');
  U('swipe.continue', 'Continue', 'Jatka', 'Fortsätt', 'Tiếp tục');
  U('swipe.again', 'Start over', 'Aloita alusta', 'Börja om', 'Làm lại');
  U('swipe.examples', 'Some dishes', 'Esimerkkejä', 'Några rätter', 'Vài món');
  U('swipe.recipes', 'Recipes: {n}', 'Reseptejä: {n}', 'Recept: {n}', 'Số công thức: {n}');
  U('swipe.deck', 'Food types, card {n} of {total}. Right arrow means like, left arrow means not for me.',
    'Ruokatyypit, kortti {n}/{total}. Oikea nuoli tarkoittaa pidän, vasen nuoli ei minulle.',
    'Typer av mat, kort {n} av {total}. Högerpil betyder gillar, vänsterpil betyder inte för mig.',
    'Loại món, thẻ {n}/{total}. Mũi tên phải là thích, mũi tên trái là không thích.');
  U('swipe.live.yes', '{name}: liked', '{name}: pidät', '{name}: gillar', '{name}: thích');
  U('swipe.live.no', '{name}: not for you', '{name}: et pidä', '{name}: gillar inte', '{name}: không thích');
  U('swipe.done.title', 'Your picks', 'Valintasi', 'Dina val', 'Lựa chọn của bạn');
  U('swipe.done.some', 'Ateria will plan more of this food:', 'Ateria suunnittelee tätä ruokaa enemmän:', 'Ateria planerar mer av den här maten:', 'Ateria sẽ xếp nhiều món này hơn:');
  U('swipe.done.none', 'You ticked nothing, so you get a bit of everything.', 'Et valinnut mitään, joten saat vähän kaikkea.', 'Du markerade inget, så du får lite av allt.', 'Bạn chưa chọn loại nào, nên sẽ có một ít của mọi loại.');
  U('swipe.done.passed', 'Not for you:', 'Ei sinulle:', 'Inte för dig:', 'Bạn không thích:');
  U('swipe.d.nordic', 'Fish, rye bread, potatoes, berries and skyr. Simple, filling meals.',
    'Kalaa, ruisleipää, perunaa, marjoja ja skyriä. Yksinkertaisia, täyttäviä aterioita.',
    'Fisk, rågbröd, potatis, bär och skyr. Enkla, mättande måltider.',
    'Cá, bánh mì lúa mạch đen, khoai tây, quả mọng và skyr. Bữa ăn đơn giản, no lâu.');
  U('swipe.d.european', 'Pasta, tomato sauces, soups and bakes, with a Mediterranean touch.',
    'Pastaa, tomaattikastikkeita, keittoja ja uuniruokia välimerellisellä otteella.',
    'Pasta, tomatsåser, soppor och ugnsrätter med en touch av Medelhavet.',
    'Mì ống, sốt cà chua, súp và món nướng, mang hơi hướng Địa Trung Hải.');
  U('swipe.d.asian', 'Rice, noodles, curries and stir-fries with chicken, fish, shrimp and tofu.',
    'Riisiä, nuudeleita, currya ja wokkia kanalla, kalalla, katkaravuilla ja tofulla.',
    'Ris, nudlar, curry och wok med kyckling, fisk, räkor och tofu.',
    'Cơm, mì, cà ri và món xào với gà, cá, tôm và đậu phụ.');
  U('swipe.d.world', 'Wraps, hummus, lentils, chili and shakshuka for quick everyday meals.',
    'Wrapit, hummus, linssit, chili ja shakshuka nopeisiin arkiaterioihin.',
    'Wraps, hummus, linser, chili och shakshuka till snabba vardagsmåltider.',
    'Wrap, hummus, đậu lăng, chili và shakshuka cho bữa ăn nhanh hằng ngày.');

  // ---------- recipe view ----------
  U('rec.portions', 'Portions', 'Annokset', 'Portioner', 'Số phần ăn');
  U('rec.less', 'Fewer portions', 'Vähemmän annoksia', 'Färre portioner', 'Giảm số phần ăn');
  U('rec.more', 'More portions', 'Enemmän annoksia', 'Fler portioner', 'Tăng số phần ăn');
  U('rec.amountsFor_one', 'Amounts are for {n} portion. kcal and protein are for one portion.', 'Määrät ovat {n} annokselle. kcal ja proteiini ovat yhdelle annokselle.', 'Mängderna är för {n} portion. kcal och protein gäller en portion.', 'Lượng nguyên liệu cho {n} phần. kcal và đạm tính cho một phần.');
  U('rec.amountsFor_other', 'Amounts are for {n} portions. kcal and protein are for one portion.', 'Määrät ovat {n} annokselle. kcal ja proteiini ovat yhdelle annokselle.', 'Mängderna är för {n} portioner. kcal och protein gäller en portion.', 'Lượng nguyên liệu cho {n} phần. kcal và đạm tính cho một phần.');
  U('rec.spices', 'Spices and seasoning', 'Mausteet ja maustaminen', 'Kryddor och smaksättning', 'Gia vị và cách nêm');
  U('rec.spiceNote', 'Amounts are for the portions above. They are mild: taste, then add more if you like. Seasoning is not counted in calories.',
    'Määrät ovat yllä oleville annoksille. Ne ovat miedot: maista ja lisää tarvittaessa. Mausteita ei lasketa kaloreihin.',
    'Mängderna är för portionerna ovan. De är milda: smaka av och tillsätt mer om du vill. Kryddor räknas inte i kalorierna.',
    'Lượng gia vị cho số phần ở trên. Mức này khá nhẹ: hãy nếm rồi thêm nếu thích. Gia vị không được tính vào calo.');
  U('rec.saltNote', 'Salt is kept low on purpose. The WHO advises less than 5 g of salt (about 1 teaspoon) a day in total, so taste before you add more.',
    'Suolaa on tarkoituksella vähän. WHO suosittelee alle 5 g suolaa (noin 1 teelusikallinen) päivässä yhteensä, joten maista ennen kuin lisäät.',
    'Saltet är sparsamt med avsikt. WHO rekommenderar mindre än 5 g salt (ungefär 1 tesked) per dag totalt, så smaka av innan du tillsätter mer.',
    'Muối được để ít có chủ ý. WHO khuyến nghị dưới 5 g muối (khoảng 1 thìa cà phê) mỗi ngày tính tổng cộng, vì vậy hãy nếm trước khi cho thêm.');
  U('rec.water', 'Water', 'Vesi', 'Vatten', 'Nước');
  U('rec.method', 'Method', 'Valmistus', 'Gör så här', 'Cách làm');
  U('rec.tip', 'Seasoning tip', 'Maustevinkki', 'Kryddtips', 'Mẹo nêm gia vị');
  U('rec.swapNote', 'Changed for your profile: {list}. Use the new ingredient wherever the steps mention the old one.',
    'Muutettu profiilisi mukaan: {list}. Käytä uutta ainesosaa kaikkialla, missä ohjeessa mainitaan vanha.',
    'Ändrat efter din profil: {list}. Använd den nya ingrediensen överallt där stegen nämner den gamla.',
    'Đã đổi theo hồ sơ của bạn: {list}. Hãy dùng nguyên liệu mới ở mọi chỗ các bước nhắc đến nguyên liệu cũ.');
  U('rec.swapItem', '{to} instead of {from}', '{to} (ei {from})', '{to} istället för {from}', '{to} thay cho {from}');
  U('rec.like', 'Add to favourites', 'Lisää suosikkeihin', 'Lägg till som favorit', 'Thêm vào món yêu thích');
  U('rec.unlike', 'Remove from favourites', 'Poista suosikeista', 'Ta bort från favoriter', 'Bỏ khỏi món yêu thích');
  U('toast.liked', 'Saved as a favourite. It will show up more often in new plans.', 'Tallennettu suosikiksi. Se tulee esiin useammin uusissa suunnitelmissa.', 'Sparad som favorit. Den dyker upp oftare i nya planer.', 'Đã lưu vào món yêu thích. Món này sẽ xuất hiện nhiều hơn trong thực đơn mới.');
  U('toast.unliked', 'Removed from favourites', 'Poistettu suosikeista', 'Borttagen från favoriter', 'Đã bỏ khỏi món yêu thích');
  U('when.start', 'At the start: fry in the oil', 'Alussa: paista öljyssä', 'I början: stek i oljan', 'Lúc đầu: phi trong dầu');
  U('when.cook', 'While cooking', 'Kypsennyksen aikana', 'Under tillagningen', 'Trong lúc nấu');
  U('when.end', 'At the end: taste first', 'Lopuksi: maista ensin', 'Sist: smaka av först', 'Cuối cùng: nếm trước');
  U('when.serve', 'To serve: fresh on top', 'Tarjoiltaessa: tuoreena päälle', 'Vid servering: färskt överst', 'Khi dọn ra: rắc tươi lên trên');

  // ---------- shopping: seasonings ----------
  U('shop.spices', 'Check your cupboard', 'Tarkista kaappisi', 'Kolla skafferiet', 'Kiểm tra tủ bếp của bạn');
  U('shop.spicesHelp', 'Seasonings are not priced. Check what you already have at home; buy only what is missing.',
    'Mausteilla ei ole hintaa. Tarkista, mitä sinulla on jo kotona, ja osta vain puuttuvat.',
    'Kryddor är inte prissatta. Kolla vad du redan har hemma och köp bara det som saknas.',
    'Gia vị không được tính giá. Hãy kiểm tra những gì đã có ở nhà và chỉ mua món còn thiếu.');
  U('shop.spicesDried', 'Dried spices and salt', 'Kuivatut mausteet ja suola', 'Torkade kryddor och salt', 'Gia vị khô và muối');
  U('shop.spicesFresh', 'Fresh herbs and lemon', 'Tuoreet yrtit ja sitruuna', 'Färska örter och citron', 'Rau thơm tươi và chanh');
  U('shop.uses_one', 'in {n} meal', '{n} ateriassa', 'i {n} måltid', 'trong {n} bữa');
  U('shop.uses_other', 'in {n} meals', '{n} aterialla', 'i {n} måltider', 'trong {n} bữa');

  // ---------- saved data ----------
  U('data.title', 'My data', 'Tietoni', 'Mina uppgifter', 'Dữ liệu của tôi');
  U('consent.q', 'Keep my details on this device?', 'Tallennetaanko tietoni tälle laitteelle?', 'Spara mina uppgifter på den här enheten?', 'Lưu thông tin của tôi trên thiết bị này?');
  U('consent.body', 'Ateria can remember your details, favourites, ticked items and food log on this device, so you do not have to enter them again. Nothing is sent anywhere. You can delete it at any time.',
    'Ateria voi muistaa tietosi, suosikkisi, merkityt ostokset ja ruokapäiväkirjasi tällä laitteella, jotta sinun ei tarvitse syöttää niitä uudelleen. Mitään ei lähetetä minnekään. Voit poistaa ne milloin tahansa.',
    'Ateria kan komma ihåg dina uppgifter, favoriter, markerade varor och din matlogg på den här enheten, så att du slipper skriva in dem igen. Ingenting skickas någonstans. Du kan radera dem när som helst.',
    'Ateria có thể ghi nhớ thông tin, món yêu thích, các mục đã đánh dấu và nhật ký ăn uống trên thiết bị này, để bạn không phải nhập lại. Không có gì được gửi đi đâu cả. Bạn có thể xóa bất cứ lúc nào.');
  U('consent.migrated', 'Details saved by an earlier version of Ateria were found on this device. Keep them?',
    'Tältä laitteelta löytyi Aterian aiemman version tallentamia tietoja. Säilytetäänkö ne?',
    'Uppgifter som sparats av en tidigare version av Ateria hittades på den här enheten. Ska de sparas?',
    'Tìm thấy thông tin do phiên bản Ateria trước đó lưu trên thiết bị này. Giữ lại chứ?');
  U('consent.yes', 'Yes, remember', 'Kyllä, muista', 'Ja, kom ihåg', 'Có, hãy nhớ');
  U('consent.no', 'No, thanks', 'Ei kiitos', 'Nej tack', 'Không, cảm ơn');
  U('toast.consentYes', 'Saved on this device', 'Tallennettu tälle laitteelle', 'Sparat på den här enheten', 'Đã lưu trên thiết bị này');
  U('toast.consentNo', 'Nothing will be saved', 'Mitään ei tallenneta', 'Ingenting sparas', 'Sẽ không lưu gì cả');
  U('toast.saveFail', 'Could not save on this device', 'Tallennus tälle laitteelle epäonnistui', 'Det gick inte att spara på enheten', 'Không thể lưu trên thiết bị này');
  U('data.status.yes', 'Your details are saved on this device ({kb} KB).', 'Tietosi on tallennettu tälle laitteelle ({kb} kt).', 'Dina uppgifter är sparade på den här enheten ({kb} kB).', 'Thông tin của bạn được lưu trên thiết bị này ({kb} KB).');
  U('data.status.no', 'Nothing is saved. Your details disappear when you close the page.', 'Mitään ei tallenneta. Tietosi katoavat, kun suljet sivun.', 'Ingenting sparas. Dina uppgifter försvinner när du stänger sidan.', 'Không có gì được lưu. Thông tin của bạn sẽ mất khi bạn đóng trang.');
  U('data.status.ask', 'You have not decided yet. Until then nothing is saved.', 'Et ole vielä päättänyt. Siihen asti mitään ei tallenneta.', 'Du har inte bestämt dig ännu. Tills dess sparas ingenting.', 'Bạn chưa quyết định. Cho đến lúc đó sẽ không lưu gì cả.');
  U('data.status.unavailable', 'This browser does not allow saving, so your details cannot be kept. The app still works.', 'Tämä selain ei salli tallentamista, joten tietojasi ei voi säilyttää. Sovellus toimii silti.', 'Den här webbläsaren tillåter inte sparande, så dina uppgifter kan inte behållas. Appen fungerar ändå.', 'Trình duyệt này không cho phép lưu nên thông tin của bạn không được giữ lại. Ứng dụng vẫn hoạt động.');
  U('data.status.error', 'Saving failed (storage is full or blocked). Your latest changes are not kept.', 'Tallennus epäonnistui (tila on täynnä tai estetty). Viimeisimpiä muutoksia ei säilytetä.', 'Det gick inte att spara (lagringen är full eller blockerad). Dina senaste ändringar sparas inte.', 'Lưu không thành công (bộ nhớ đầy hoặc bị chặn). Các thay đổi mới nhất không được giữ lại.');
  U('data.status.corrupt', 'Saved details were damaged and could not be read, so a fresh start was made.', 'Tallennetut tiedot olivat vioittuneet eikä niitä voitu lukea, joten aloitettiin alusta.', 'Sparade uppgifter var skadade och kunde inte läsas, så vi började om.', 'Thông tin đã lưu bị hỏng và không đọc được, nên đã bắt đầu lại từ đầu.');
  U('data.turnOn', 'Save my details on this device', 'Tallenna tietoni tälle laitteelle', 'Spara mina uppgifter på den här enheten', 'Lưu thông tin của tôi trên thiết bị này');
  U('data.backup', 'Backup file', 'Varmuuskopio', 'Säkerhetskopia', 'Tệp sao lưu');
  U('data.backupHelp', 'Move your details to another phone or computer: make a backup here, then paste it there and press Load backup. The backup contains your personal details, so keep it safe.',
    'Siirrä tietosi toiselle puhelimelle tai tietokoneelle: tee varmuuskopio tässä, liitä se toisessa laitteessa ja paina Lataa varmuuskopio. Varmuuskopio sisältää henkilötietojasi, joten säilytä se turvallisessa paikassa.',
    'Flytta dina uppgifter till en annan telefon eller dator: gör en säkerhetskopia här, klistra in den där och tryck på Läs in säkerhetskopia. Säkerhetskopian innehåller dina personuppgifter, så förvara den säkert.',
    'Chuyển thông tin sang điện thoại hoặc máy tính khác: tạo bản sao lưu ở đây, dán vào thiết bị kia rồi bấm Nạp bản sao lưu. Bản sao lưu chứa thông tin cá nhân của bạn nên hãy giữ an toàn.');
  U('data.backupAria', 'Backup text', 'Varmuuskopion teksti', 'Säkerhetskopians text', 'Nội dung bản sao lưu');
  U('data.makeBackup', 'Make backup', 'Tee varmuuskopio', 'Skapa säkerhetskopia', 'Tạo bản sao lưu');
  U('data.download', 'Download file', 'Lataa tiedosto', 'Ladda ner fil', 'Tải tệp xuống');
  U('data.copy', 'Copy', 'Kopioi', 'Kopiera', 'Sao chép');
  U('data.chooseFile', 'Choose a backup file', 'Valitse varmuuskopiotiedosto', 'Välj en säkerhetskopia', 'Chọn tệp sao lưu');
  U('data.load', 'Load backup', 'Lataa varmuuskopio', 'Läs in säkerhetskopia', 'Nạp bản sao lưu');
  U('data.loadWarn', 'Loading a backup replaces the details now in the app.', 'Varmuuskopion lataaminen korvaa sovelluksessa nyt olevat tiedot.', 'Att läsa in en säkerhetskopia ersätter uppgifterna som finns i appen nu.', 'Nạp bản sao lưu sẽ thay thế thông tin hiện có trong ứng dụng.');
  U('data.copied', 'Copied.', 'Kopioitu.', 'Kopierat.', 'Đã sao chép.');
  U('data.copyFail', 'Select the text and copy it.', 'Valitse teksti ja kopioi se.', 'Markera texten och kopiera den.', 'Hãy chọn đoạn văn bản và sao chép.');
  U('data.imported_one', 'Backup loaded: {n} person.', 'Varmuuskopio ladattu: {n} henkilö.', 'Säkerhetskopian lästes in: {n} person.', 'Đã nạp bản sao lưu: {n} người.');
  U('data.imported_other', 'Backup loaded: {n} people.', 'Varmuuskopio ladattu: {n} henkilöä.', 'Säkerhetskopian lästes in: {n} personer.', 'Đã nạp bản sao lưu: {n} người.');
  U('data.err.empty', 'Nothing to load. Paste the backup text first.', 'Ei ladattavaa. Liitä ensin varmuuskopion teksti.', 'Inget att läsa in. Klistra först in säkerhetskopians text.', 'Không có gì để nạp. Hãy dán nội dung bản sao lưu trước.');
  U('data.err.json', 'That is not a valid backup (the text is damaged).', 'Tämä ei ole kelvollinen varmuuskopio (teksti on vioittunut).', 'Det är ingen giltig säkerhetskopia (texten är skadad).', 'Đây không phải bản sao lưu hợp lệ (nội dung bị hỏng).');
  U('data.err.format', 'That is not an Ateria backup.', 'Tämä ei ole Aterian varmuuskopio.', 'Det är inte en Ateria-säkerhetskopia.', 'Đây không phải bản sao lưu của Ateria.');
  U('data.err.big', 'That file is too big to be a backup.', 'Tiedosto on liian suuri varmuuskopioksi.', 'Filen är för stor för att vara en säkerhetskopia.', 'Tệp quá lớn để là bản sao lưu.');
  U('data.wipe', 'Delete all my saved data', 'Poista kaikki tallennetut tietoni', 'Radera alla mina sparade uppgifter', 'Xóa toàn bộ dữ liệu đã lưu của tôi');
  U('data.wipeArmed', 'Press again to delete everything', 'Paina uudelleen poistaaksesi kaiken', 'Tryck igen för att radera allt', 'Bấm lần nữa để xóa tất cả');
  U('data.wiped', 'Everything saved on this device was deleted.', 'Kaikki tälle laitteelle tallennettu poistettiin.', 'Allt som sparats på den här enheten raderades.', 'Mọi thứ đã lưu trên thiết bị này đã bị xóa.');

  // ---------- several people ----------
  U('prof.who', 'Whose plan', 'Kenen suunnitelma', 'Vems plan', 'Kế hoạch của ai');
  U('prof.add', 'Add a person', 'Lisää henkilö', 'Lägg till person', 'Thêm người');
  U('prof.name', 'Name', 'Nimi', 'Namn', 'Tên');
  U('prof.rename', 'Save name', 'Tallenna nimi', 'Spara namn', 'Lưu tên');
  U('prof.remove', 'Remove this person', 'Poista tämä henkilö', 'Ta bort den här personen', 'Xóa người này');
  U('prof.removeArmed', 'Press again to remove', 'Paina uudelleen poistaaksesi', 'Tryck igen för att ta bort', 'Bấm lần nữa để xóa');
  U('prof.max', 'You can keep up to {n} people.', 'Voit säilyttää enintään {n} henkilöä.', 'Du kan ha upp till {n} personer.', 'Bạn có thể lưu tối đa {n} người.');
  U('prof.newName', 'Person {n}', 'Henkilö {n}', 'Person {n}', 'Người {n}');
  U('prof.me', 'Me', 'Minä', 'Jag', 'Tôi');
  U('toast.personAdded', 'Person added. Fill in the details below.', 'Henkilö lisätty. Täytä tiedot alle.', 'Person tillagd. Fyll i uppgifterna nedan.', 'Đã thêm người. Hãy điền thông tin bên dưới.');
  U('toast.personRemoved', 'Person removed', 'Henkilö poistettu', 'Person borttagen', 'Đã xóa người');

  // ---------- weight log and favourites ----------
  U('wt.title', 'Weight log', 'Painopäiväkirja', 'Viktlogg', 'Nhật ký cân nặng');
  U('wt.date', 'Date', 'Päivämäärä', 'Datum', 'Ngày');
  U('wt.kg', 'Weight (kg)', 'Paino (kg)', 'Vikt (kg)', 'Cân nặng (kg)');
  U('wt.add', 'Add', 'Lisää', 'Lägg till', 'Thêm');
  U('wt.none', 'No entries yet. Add your weight whenever you weigh yourself.', 'Ei vielä merkintöjä. Lisää painosi aina, kun punnitset itsesi.', 'Inga poster ännu. Lägg till din vikt varje gång du väger dig.', 'Chưa có mục nào. Hãy thêm cân nặng mỗi khi bạn cân.');
  U('wt.err', 'Enter a real date and a weight between 20 and 400 kg.', 'Anna oikea päivämäärä ja paino väliltä 20–400 kg.', 'Ange ett riktigt datum och en vikt mellan 20 och 400 kg.', 'Hãy nhập ngày hợp lệ và cân nặng từ 20 đến 400 kg.');
  U('wt.change', 'Change since the first entry: {d} kg', 'Muutos ensimmäisestä merkinnästä: {d} kg', 'Förändring sedan första posten: {d} kg', 'Thay đổi từ mục đầu tiên: {d} kg');
  U('wt.chart', 'Weight over time', 'Paino ajan myötä', 'Vikt över tid', 'Cân nặng theo thời gian');
  U('wt.remove', 'Remove entry {date}', 'Poista merkintä {date}', 'Ta bort post {date}', 'Xóa mục {date}');
  U('wt.needSave', 'Entries are kept only if you allow saving on this device (see My data).', 'Merkinnät säilyvät vain, jos sallit tallennuksen tälle laitteelle (katso Tietoni).', 'Posterna sparas bara om du tillåter sparande på den här enheten (se Mina uppgifter).', 'Các mục chỉ được giữ lại nếu bạn cho phép lưu trên thiết bị này (xem Dữ liệu của tôi).');
  U('wt.note', 'A weight log is only for you. It does not change your plan; update your weight in your details when you want new targets.', 'Painopäiväkirja on vain sinua varten. Se ei muuta suunnitelmaasi; päivitä painosi tietoihisi, kun haluat uudet tavoitteet.', 'Viktloggen är bara för dig. Den ändrar inte din plan; uppdatera din vikt i dina uppgifter när du vill ha nya mål.', 'Nhật ký cân nặng chỉ dành cho bạn. Nó không thay đổi thực đơn; hãy cập nhật cân nặng trong thông tin của bạn khi muốn có mục tiêu mới.');
  U('fav.title', 'Favourite recipes', 'Suosikkireseptit', 'Favoritrecept', 'Món yêu thích');
  U('fav.none', 'Tap the heart on a recipe to keep it here.', 'Napauta reseptin sydäntä, niin se tallentuu tänne.', 'Tryck på hjärtat på ett recept för att spara det här.', 'Chạm vào trái tim ở một công thức để giữ nó ở đây.');
  U('fav.remove', 'Remove {name} from favourites', 'Poista {name} suosikeista', 'Ta bort {name} från favoriter', 'Bỏ {name} khỏi món yêu thích');

  // ---------- account copy (only when the page runs where the viewer has an account) ----------
  U('cloud.title', 'Copy in my account', 'Kopio tilissäni', 'Kopia i mitt konto', 'Bản sao trong tài khoản của tôi');
  U('cloud.help', 'Keep a copy of your details in your account and load it on another device. It only happens when you press a button.',
    'Säilytä kopio tiedoistasi tililläsi ja lataa se toiselle laitteelle. Se tapahtuu vain, kun painat painiketta.',
    'Spara en kopia av dina uppgifter i ditt konto och läs in den på en annan enhet. Det sker bara när du trycker på en knapp.',
    'Giữ một bản sao thông tin của bạn trong tài khoản và nạp nó trên thiết bị khác. Việc này chỉ xảy ra khi bạn bấm nút.');
  U('cloud.save', 'Save to my account', 'Tallenna tililleni', 'Spara i mitt konto', 'Lưu vào tài khoản của tôi');
  U('cloud.load', 'Load from my account', 'Lataa tililtäni', 'Läs in från mitt konto', 'Nạp từ tài khoản của tôi');
  U('cloud.saved', 'Saved to your account.', 'Tallennettu tilillesi.', 'Sparat i ditt konto.', 'Đã lưu vào tài khoản của bạn.');
  U('cloud.loaded', 'Loaded from your account.', 'Ladattu tililtäsi.', 'Inläst från ditt konto.', 'Đã nạp từ tài khoản của bạn.');
  U('cloud.empty', 'No copy was found in your account.', 'Tililtäsi ei löytynyt kopiota.', 'Ingen kopia hittades i ditt konto.', 'Không tìm thấy bản sao nào trong tài khoản của bạn.');
  U('cloud.err', 'Could not reach your account. Try again later.', 'Tiliisi ei saatu yhteyttä. Yritä myöhemmin uudelleen.', 'Det gick inte att nå ditt konto. Försök igen senare.', 'Không thể kết nối tới tài khoản của bạn. Hãy thử lại sau.');
  U('cloud.denied', 'This page may not save to your account.', 'Tämä sivu ei saa tallentaa tilillesi.', 'Den här sidan får inte spara i ditt konto.', 'Trang này không được phép lưu vào tài khoản của bạn.');
  U('cloud.at', 'Last copy: {time}', 'Viimeisin kopio: {time}', 'Senaste kopia: {time}', 'Bản sao gần nhất: {time}');
  U('cloud.busy', 'Working…', 'Käsitellään…', 'Arbetar…', 'Đang xử lý…');

  // ---------- helper ----------
  U('help.btn', 'Help', 'Apua', 'Hjälp', 'Trợ giúp');
  U('help.title', 'Ateria helper', 'Aterian apuri', 'Aterias hjälpare', 'Trợ lý Ateria');
  U('help.panel', 'Help assistant', 'Aputoiminto', 'Hjälpassistent', 'Trợ lý hướng dẫn');
  U('help.hello', 'Hi! I help you use the app. Tap a question or type your own.', 'Hei! Autan sinua käyttämään sovellusta. Napauta kysymystä tai kirjoita oma.', 'Hej! Jag hjälper dig att använda appen. Tryck på en fråga eller skriv en egen.', 'Xin chào! Tôi giúp bạn dùng ứng dụng. Hãy chạm vào một câu hỏi hoặc tự gõ câu hỏi của bạn.');
  U('help.ph', 'Type your question…', 'Kirjoita kysymyksesi…', 'Skriv din fråga…', 'Gõ câu hỏi của bạn…');
  U('help.send', 'Ask', 'Kysy', 'Fråga', 'Hỏi');
  U('help.close', 'Close help', 'Sulje apu', 'Stäng hjälpen', 'Đóng trợ giúp');
  U('help.listen', 'Read aloud', 'Lue ääneen', 'Läs upp', 'Đọc to');
  U('help.stop', 'Stop reading', 'Lopeta lukeminen', 'Sluta läsa', 'Dừng đọc');
  U('help.more', 'More questions', 'Lisää kysymyksiä', 'Fler frågor', 'Thêm câu hỏi');
  U('help.less', 'Fewer questions', 'Vähemmän kysymyksiä', 'Färre frågor', 'Bớt câu hỏi');
  U('help.open', 'Open: {where}', 'Avaa: {where}', 'Öppna: {where}', 'Mở: {where}');
  U('help.you', 'You', 'Sinä', 'Du', 'Bạn');
  U('help.bot', 'Helper', 'Apuri', 'Hjälpare', 'Trợ lý');
  U('help.nomatch', 'I did not find an answer to that. Try one of these questions.', 'En löytänyt vastausta tähän. Kokeile jotakin näistä kysymyksistä.', 'Jag hittade inget svar på det. Prova någon av de här frågorna.', 'Tôi chưa tìm thấy câu trả lời. Hãy thử một trong các câu hỏi này.');
  U('help.related', 'You may also want to know', 'Saatat haluta tietää myös', 'Du kanske också vill veta', 'Có thể bạn cũng muốn biết');
  U('help.ai', 'Ask Claude instead', 'Kysy Claudelta', 'Fråga Claude i stället', 'Hỏi Claude');
  U('help.aiNote', 'Claude’s answer is written by AI and can be wrong. It is only about using this app, never medical advice. Your health details are not sent.',
    'Clauden vastaus on tekoälyn kirjoittama ja voi olla väärä. Se koskee vain tämän sovelluksen käyttöä, ei koskaan lääketieteellistä neuvontaa. Terveystietojasi ei lähetetä.',
    'Claudes svar skrivs av AI och kan vara fel. Det handlar bara om hur appen används, aldrig om medicinska råd. Dina hälsouppgifter skickas inte.',
    'Câu trả lời của Claude do AI viết và có thể sai. Nó chỉ nói về cách dùng ứng dụng, không bao giờ là lời khuyên y tế. Thông tin sức khỏe của bạn không được gửi đi.');
  U('help.aiBusy', 'Thinking…', 'Mietitään…', 'Funderar…', 'Đang suy nghĩ…');
  U('help.aiErr', 'Claude could not answer right now. Please try one of the questions above.', 'Claude ei voinut vastata juuri nyt. Kokeile jotakin yllä olevista kysymyksistä.', 'Claude kunde inte svara just nu. Prova någon av frågorna ovan.', 'Lúc này Claude chưa thể trả lời. Hãy thử một trong các câu hỏi ở trên.');
  U('help.aiLimit', 'Too many questions. Please wait a minute.', 'Liian monta kysymystä. Odota hetki.', 'För många frågor. Vänta en stund.', 'Quá nhiều câu hỏi. Vui lòng chờ một chút.');
  U('help.aiLabel', 'Answer from Claude (AI)', 'Clauden vastaus (tekoäly)', 'Svar från Claude (AI)', 'Câu trả lời từ Claude (AI)');
  U('help.hint', 'Need help? Tap here.', 'Tarvitsetko apua? Napauta tästä.', 'Behöver du hjälp? Tryck här.', 'Cần giúp đỡ? Chạm vào đây.');

  // ---------- food log ----------
  U('nav.log', 'Log', 'Kirjaus', 'Logg', 'Nhật ký');
  U('log.title', 'Food log', 'Ruokapäiväkirja', 'Matlogg', 'Nhật ký ăn uống');
  U('log.intro', 'Write down what you eat and see how the day compares with your daily target.',
    'Kirjaa, mitä syöt, ja katso, miten päivä vertautuu päivittäiseen tavoitteeseesi.',
    'Skriv ner vad du äter och se hur dagen står sig mot ditt dagliga mål.',
    'Ghi lại những gì bạn ăn và xem cả ngày so với mục tiêu mỗi ngày của bạn.');
  U('log.days', 'Last seven days', 'Viimeiset seitsemän päivää', 'Senaste sju dagarna', 'Bảy ngày gần nhất');
  U('log.today', 'Today', 'Tänään', 'Idag', 'Hôm nay');
  U('log.date', 'Date', 'Päivämäärä', 'Datum', 'Ngày');
  U('log.dayAria', '{date}, {n} kcal logged', '{date}, kirjattu {n} kcal', '{date}, {n} kcal loggat', '{date}, đã ghi {n} kcal');
  U('log.left', '{n} kcal left for this day', '{n} kcal jäljellä tälle päivälle', '{n} kcal kvar för den här dagen', 'Còn {n} kcal cho ngày này');
  U('log.over', '{n} kcal over the daily target', '{n} kcal yli päivän tavoitteen', '{n} kcal över dagsmålet', 'Vượt mục tiêu ngày {n} kcal');
  U('log.none', 'Nothing logged for this day yet.', 'Tälle päivälle ei ole vielä kirjauksia.', 'Inget loggat för den här dagen ännu.', 'Chưa ghi gì cho ngày này.');
  U('log.remove', 'Remove {name}', 'Poista {name}', 'Ta bort {name}', 'Xóa {name}');
  U('log.fromPlan', 'From my plan', 'Omasta ruokalistasta', 'Från min matplan', 'Từ thực đơn của tôi');
  U('log.planDay', 'Plan day', 'Ruokalistan päivä', 'Dag i planen', 'Ngày trong thực đơn');
  U('log.portion', 'Portion', 'Annos', 'Portion', 'Khẩu phần');
  U('log.noPlan', 'Make your plan first, then you can log its meals here.',
    'Tee ensin ruokalista, niin voit kirjata sen ateriat tähän.',
    'Gör först din plan, så kan du logga dess måltider här.',
    'Hãy tạo thực đơn trước, rồi bạn có thể ghi các bữa trong đó vào đây.');
  U('log.ideas', 'Ideas for the rest of today', 'Ideoita päivän loppuun', 'Idéer för resten av dagen', 'Gợi ý cho phần còn lại của hôm nay');
  U('log.ideasHelp', 'Recipes from Ateria that suit your diet and allergies, sized to the energy you have left.',
    'Ateria-reseptejä, jotka sopivat ruokavalioosi ja allergioihisi. Annos mitoitetaan jäljellä olevan energian mukaan.',
    'Recept från Ateria som passar din kost och dina allergier, anpassade till energin du har kvar.',
    'Các công thức của Ateria phù hợp với chế độ ăn và dị ứng của bạn, được điều chỉnh theo năng lượng còn lại.');
  U('log.ideasLeft', 'You have {n} kcal left for today.', 'Tälle päivälle on jäljellä {n} kcal.', 'Du har {n} kcal kvar för idag.', 'Hôm nay bạn còn {n} kcal.');
  U('log.ideasLeftP', 'You have {n} kcal and {p} g of protein left for today.',
    'Tälle päivälle on jäljellä {n} kcal ja {p} g proteiinia.',
    'Du har {n} kcal och {p} g protein kvar för idag.',
    'Hôm nay bạn còn {n} kcal và {p} g chất đạm.');
  U('log.ideasDone', 'The energy target for today is reached or nearly reached, so there are no ideas.',
    'Päivän energiatavoite on saavutettu tai lähes saavutettu, joten ideoita ei ole.',
    'Dagens energimål är nått eller nästan nått, så det finns inga idéer.',
    'Mục tiêu năng lượng hôm nay đã đạt hoặc gần đạt, nên không có gợi ý nào.');
  U('log.ideasNone', 'No recipe fits the energy you have left and your restrictions.',
    'Mikään resepti ei sovi jäljellä olevaan energiaan ja rajoituksiisi.',
    'Inget recept passar energin du har kvar och dina begränsningar.',
    'Không có công thức nào phù hợp với năng lượng còn lại và các hạn chế của bạn.');
  U('log.ideasMore', 'Other ideas', 'Muita ideoita', 'Andra idéer', 'Gợi ý khác');
  U('log.ideaMeta', '≈ {k} kcal · protein {p} g · {min} min', '≈ {k} kcal · proteiinia {p} g · {min} min', '≈ {k} kcal · protein {p} g · {min} min', '≈ {k} kcal · đạm {p} g · {min} phút');
  U('log.add', 'Add', 'Lisää', 'Lägg till', 'Thêm');
  U('log.addFood', 'Add a food', 'Lisää ruoka-aine', 'Lägg till en matvara', 'Thêm một thực phẩm');
  U('log.food', 'Food', 'Ruoka-aine', 'Matvara', 'Thực phẩm');
  U('log.grams', 'Amount (g)', 'Määrä (g)', 'Mängd (g)', 'Số lượng (g)');
  U('log.slot', 'Meal', 'Ateria', 'Måltid', 'Bữa ăn');
  U('log.quick', 'Quick add', 'Pikakirjaus', 'Snabbtillägg', 'Thêm nhanh');
  U('log.quickHelp', 'For food that is not on the list, such as a restaurant meal. Enter what you know. Only energy and protein are added to the totals.',
    'Ruoalle, jota ei ole listalla, esimerkiksi ravintola-ateria. Anna tiedot, jotka tiedät. Summiin lasketaan vain energia ja proteiini.',
    'För mat som inte finns i listan, till exempel en restaurangmåltid. Ange det du vet. Bara energi och protein räknas med i summorna.',
    'Dành cho món không có trong danh sách, ví dụ bữa ăn ở nhà hàng. Hãy nhập những gì bạn biết. Chỉ năng lượng và chất đạm được cộng vào tổng.');
  U('log.name', 'What did you eat?', 'Mitä söit?', 'Vad åt du?', 'Bạn đã ăn gì?');
  U('log.kcal', 'Energy (kcal)', 'Energia (kcal)', 'Energi (kcal)', 'Năng lượng (kcal)');
  U('log.protein', 'Protein (g, optional)', 'Proteiini (g, valinnainen)', 'Protein (g, valfritt)', 'Chất đạm (g, không bắt buộc)');
  U('log.err', 'Could not add this. Check the food, the name and the numbers.',
    'Lisäys ei onnistunut. Tarkista ruoka, nimi ja luvut.',
    'Det gick inte att lägga till. Kontrollera maten, namnet och siffrorna.',
    'Không thể thêm. Hãy kiểm tra thực phẩm, tên và các con số.');
  U('log.full', 'This day already has 40 entries. Remove one first.',
    'Tässä päivässä on jo 40 kirjausta. Poista ensin yksi.',
    'Den här dagen har redan 40 poster. Ta bort en först.',
    'Ngày này đã có 40 mục. Hãy xóa bớt một mục trước.');
  U('log.added', 'Added to your log', 'Lisätty kirjauksiin', 'Tillagd i loggen', 'Đã thêm vào nhật ký');
  U('log.note', 'Amounts and nutrition values are approximate, so treat the totals as a guide. This is not medical or dietetic advice. The log does not change your plan.',
    'Määrät ja ravintoarvot ovat likimääräisiä, joten pidä summia suuntaa-antavina. Tämä ei ole lääketieteellistä eikä ravitsemusneuvontaa. Kirjaus ei muuta ruokalistaasi.',
    'Mängder och näringsvärden är ungefärliga, så se summorna som en vägledning. Det här är inte medicinska råd eller kostråd. Loggen ändrar inte din plan.',
    'Khối lượng và giá trị dinh dưỡng chỉ là ước lượng, nên hãy xem tổng số như một tham khảo. Đây không phải lời khuyên y tế hay dinh dưỡng. Nhật ký không làm thay đổi thực đơn của bạn.');
})(typeof window !== 'undefined' ? window : globalThis);
