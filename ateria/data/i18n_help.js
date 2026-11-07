/*
 * Knowledge base of the in-app helper: questions people ask when they struggle to use the app, with short answers in
 * English, Finnish, Swedish and Vietnamese. The helper answers from this list without any network access.
 * (The optional "Ask Claude" button in js/help.js uses the same list as its notes.)
 *
 *   H(id, icon, actions, keywords, [q en, fi, sv, vi], [a en, fi, sv, vi])
 *     actions   views the answer can open: plan | shop | prices | profile
 *     keywords  words in any language, lower case, written with or without accents (matching ignores accents)
 *     "\n" in an answer starts a new paragraph.
 *
 * Button names quoted in the answers must match data/i18n_ui.js and data/i18n_ui2.js.
 * Swedish and Vietnamese (and parts of the Finnish) were written for this project: have a native speaker check them.
 */
(function (g) {
  const A = (g.Ateria = g.Ateria || {});
  const I18N = (A.I18N = A.I18N || {});
  const list = (I18N.help = []);
  function H(id, icon, actions, kw, q, a) { list.push({ id: id, icon: icon, actions: actions, kw: kw.split(','), q: q, a: a }); }

  H('start', 'helper', ['profile', 'plan'],
    'start,begin,getting started,first,how to use,aloita,alku,ensimmainen,miten kaytan,borja,komma igang,forsta,hur anvander,bat dau,dau tien,cach dung,huong dan',
    ['How do I get started?', 'Miten pääsen alkuun?', 'Hur kommer jag igång?', 'Tôi bắt đầu như thế nào?'],
    ['Open You and fill in your details. Press “Create my plan”.\nThen open Plan to see your week, and Shop for your shopping list.',
      'Avaa Profiili ja täytä tietosi. Paina ”Luo suunnitelmani”.\nAvaa sitten Ruokalista nähdäksesi viikkosi ja Ostokset nähdäksesi ostoslistan.',
      'Öppna Profil och fyll i dina uppgifter. Tryck på ”Skapa min plan”.\nÖppna sedan Matplan för att se din vecka och Inköp för inköpslistan.',
      'Mở mục Hồ sơ và điền thông tin của bạn. Bấm “Tạo thực đơn của tôi”.\nSau đó mở Thực đơn để xem cả tuần và Đi chợ để xem danh sách đi chợ.']);

  H('profile', 'people', ['profile'],
    'change,edit,details,goal,weight,height,age,profile,muuta,tiedot,tavoite,paino,pituus,ika,profiili,andra,uppgifter,mal,vikt,langd,alder,sua,thong tin,muc tieu,can nang,chieu cao,tuoi,ho so',
    ['How do I change my details or goal?', 'Miten muutan tietojani tai tavoitettani?', 'Hur ändrar jag mina uppgifter eller mitt mål?', 'Làm sao để sửa thông tin hoặc mục tiêu?'],
    ['Open You, change what you want and press “Create my plan” again. A new week is made from your new details.',
      'Avaa Profiili, muuta haluamaasi ja paina uudelleen ”Luo suunnitelmani”. Uusi viikko tehdään uusien tietojesi pohjalta.',
      'Öppna Profil, ändra det du vill och tryck på ”Skapa min plan” igen. En ny vecka görs utifrån dina nya uppgifter.',
      'Mở Hồ sơ, sửa phần bạn muốn rồi bấm lại “Tạo thực đơn của tôi”. Một tuần mới sẽ được tạo từ thông tin mới.']);

  H('numbers', 'scale', ['plan'],
    'calorie,calories,kcal,formula,energy,target,numbers,protein,kalori,energia,kaava,tavoite,proteiini,energi,formel,mal,calo,nang luong,cong thuc,dam',
    ['Where do my calorie numbers come from?', 'Mistä kaloriluvut tulevat?', 'Varifrån kommer mina kalorital?', 'Các con số calo của tôi từ đâu ra?'],
    ['They are worked out with a standard formula (Mifflin–St Jeor) from your age, height, weight, activity and goal. It is a rough guide for healthy adults, not medical advice.',
      'Ne lasketaan vakiokaavalla (Mifflin–St Jeor) iästäsi, pituudestasi, painostasi, aktiivisuudestasi ja tavoitteestasi. Se on suuntaa antava arvio terveille aikuisille, ei lääketieteellistä neuvontaa.',
      'De räknas ut med en standardformel (Mifflin–St Jeor) utifrån din ålder, längd, vikt, aktivitet och ditt mål. Det är en grov vägledning för friska vuxna, inte medicinsk rådgivning.',
      'Chúng được tính bằng công thức chuẩn (Mifflin–St Jeor) từ tuổi, chiều cao, cân nặng, mức vận động và mục tiêu của bạn. Đây chỉ là ước tính tham khảo cho người trưởng thành khỏe mạnh, không phải lời khuyên y tế.']);

  H('swap', 'snack', ['plan'],
    'swap,replace,dislike,do not like,different meal,another meal,change meal,vaihda,korvaa,en pida,toinen ateria,byt,ersatt,gillar inte,annan maltid,doi mon,thay mon,khong thich,mon khac',
    ['How do I swap a meal I do not like?', 'Miten vaihdan aterian, josta en pidä?', 'Hur byter jag en måltid jag inte gillar?', 'Làm sao để đổi món tôi không thích?'],
    ['Open Plan and tap a meal. Press “Swap this meal” and pick another one. The calories stay about the same.',
      'Avaa Ruokalista ja napauta ateriaa. Paina ”Vaihda tämä ateria” ja valitse toinen. Kalorit pysyvät suunnilleen samoina.',
      'Öppna Matplan och tryck på en måltid. Tryck på ”Byt den här måltiden” och välj en annan. Kalorierna förblir ungefär desamma.',
      'Mở Thực đơn và chạm vào một bữa ăn. Bấm “Đổi món này” rồi chọn món khác. Lượng calo vẫn gần như giữ nguyên.']);

  H('newplan', 'heart', ['plan'],
    'new plan,another week,different week,variety,regenerate,shuffle,favourite,favorite,heart,like,uusi suunnitelma,toinen viikko,vaihtelu,suosikki,sydan,ny plan,annan vecka,variation,favorit,hjarta,thuc don moi,tuan moi,yeu thich,trai tim,da dang',
    ['How do I get a different week?', 'Miten saan toisenlaisen viikon?', 'Hur får jag en annan vecka?', 'Làm sao để có một tuần khác?'],
    ['In Plan press “New plan”. Tap the heart on recipes you like, and they show up more often in new plans.',
      'Paina Ruokalistassa ”Uusi suunnitelma”. Napauta sydäntä reseptien kohdalla, joista pidät, niin ne tulevat esiin useammin uusissa suunnitelmissa.',
      'Tryck på ”Ny plan” i Matplan. Tryck på hjärtat vid recept du gillar, så dyker de upp oftare i nya planer.',
      'Trong Thực đơn, bấm “Tạo thực đơn mới”. Chạm vào trái tim ở các công thức bạn thích, chúng sẽ xuất hiện nhiều hơn trong thực đơn mới.']);

  H('portions', 'people', ['plan', 'profile'],
    'portion,portions,people,family,more people,servings,serve,annos,annokset,henkilo,perhe,useampi,portioner,personer,familj,fler,khau phan,so phan,nguoi,gia dinh,nhieu nguoi',
    ['How do I cook for more people?', 'Miten valmistan ruokaa useammalle?', 'Hur lagar jag mat till fler personer?', 'Làm sao để nấu cho nhiều người hơn?'],
    ['Open a meal and use the + and − buttons next to Portions. All the amounts change. To shop for more people, change “People you shop for” in You.',
      'Avaa ateria ja käytä Annokset-kohdan + ja − -painikkeita. Kaikki määrät muuttuvat. Jos haluat ostaa useammalle, muuta Profiilissa kohtaa ”Henkilöt, joille ostat ruokaa”.',
      'Öppna en måltid och använd + och − vid Portioner. Alla mängder ändras. Vill du handla åt fler personer ändrar du ”Personer du handlar åt” i Profil.',
      'Mở một bữa ăn và dùng nút + và − cạnh Số phần ăn. Mọi lượng nguyên liệu sẽ thay đổi. Để đi chợ cho nhiều người hơn, hãy đổi “Số người bạn đi chợ cho” trong Hồ sơ.']);

  H('shopping', 'tomato', ['shop'],
    'shopping,list,shop,store,cheapest,tick,check off,buy,ostos,ostoslista,kauppa,edullisin,merkitse,osta,inkop,inkopslista,butik,billigast,bocka,kopa,di cho,danh sach,cua hang,re nhat,mua',
    ['How does the shopping list work?', 'Miten ostoslista toimii?', 'Hur fungerar inköpslistan?', 'Danh sách đi chợ hoạt động thế nào?'],
    ['Shop lists everything for the week, grouped by store aisle. Tick an item when you have it. The top shows what each store costs and which is cheapest.',
      'Ostokset-näkymä listaa viikon tarvikkeet kauppaosastoittain. Merkitse tuote, kun olet saanut sen. Ylhäällä näkyy, mitä kukin kauppa maksaa ja mikä on edullisin.',
      'Inköp listar allt för veckan, grupperat efter butiksavdelning. Bocka av en vara när du har den. Överst ser du vad varje butik kostar och vilken som är billigast.',
      'Mục Đi chợ liệt kê mọi thứ cho cả tuần, xếp theo khu vực trong cửa hàng. Đánh dấu khi bạn đã mua được. Phía trên cho biết mỗi cửa hàng tốn bao nhiêu và cửa hàng nào rẻ nhất.']);

  H('prices', 'wallet', ['prices'],
    'price,prices,est,estimate,placeholder,cost,euro,real price,hinta,hinnat,arv,arvio,esimerkki,pris,priser,uppsk,uppskattning,exempel,gia,gia tien,uoc tinh,gia that',
    ['Why do prices say “est.”?', 'Miksi hinnoissa lukee ”arv.”?', 'Varför står det ”uppsk.” vid priserna?', 'Vì sao giá có chữ “ước tính”?'],
    ['Prices marked “est.” are example numbers, not real store prices. Open Prices and type the price you see in the store, and it replaces the example.',
      'Hinnat, joissa lukee ”arv.”, ovat esimerkkilukuja, eivät kauppojen todellisia hintoja. Avaa Hinnat ja kirjoita kaupassa näkemäsi hinta, niin se korvaa esimerkin.',
      'Priser markerade ”uppsk.” är exempelsiffror, inte butikernas riktiga priser. Öppna Priser och skriv det pris du ser i butiken, så ersätter det exemplet.',
      'Giá có chữ “ước tính” là con số ví dụ, không phải giá thật của cửa hàng. Mở mục Giá và gõ giá bạn thấy ở cửa hàng, nó sẽ thay thế giá ví dụ.']);

  H('budget', 'wallet', ['profile', 'shop'],
    'budget,money,cheap,afford,save money,euro,budjetti,raha,halpa,saasta,pengar,billig,spara,ngan sach,tien,re,tiet kiem',
    ['How do I set a food budget?', 'Miten asetan ruokabudjetin?', 'Hur ställer jag in en matbudget?', 'Làm sao để đặt ngân sách ăn uống?'],
    ['In You, type your weekly food budget in euros. In Shop, each store shows if you are under or over budget. Use 0 for no budget.',
      'Kirjoita Profiilissa viikoittainen ruokabudjettisi euroina. Ostokset-näkymässä jokainen kauppa näyttää, oletko budjetin alla vai yli. Käytä arvoa 0, jos et halua budjettia.',
      'Skriv din veckobudget för mat i euro i Profil. I Inköp visar varje butik om du är under eller över budgeten. Använd 0 för ingen budget.',
      'Trong Hồ sơ, nhập ngân sách ăn uống mỗi tuần bằng euro. Ở mục Đi chợ, mỗi cửa hàng cho biết bạn dưới hay vượt ngân sách. Nhập 0 nếu không đặt ngân sách.']);

  H('spices', 'spice_jar', ['plan'],
    'spice,spices,seasoning,salt,pepper,herb,herbs,taste,how much,flavour,mauste,mausteet,suola,pippuri,yrtti,maku,kuinka paljon,krydda,kryddor,peppar,ort,smak,hur mycket,gia vi,muoi,tieu,rau thom,nem,bao nhieu',
    ['How much seasoning should I use?', 'Kuinka paljon mausteita käytän?', 'Hur mycket krydda ska jag använda?', 'Tôi nên dùng bao nhiêu gia vị?'],
    ['Open a meal and look at “Spices and seasoning”. It lists each spice with an amount for your portions and when to add it. Amounts are mild, so taste and add more if you like. Salt is low on purpose.',
      'Avaa ateria ja katso kohta ”Mausteet ja maustaminen”. Siinä on jokainen mauste annoksiisi sopivalla määrällä ja tieto siitä, milloin se lisätään. Määrät ovat miedot, joten maista ja lisää tarvittaessa. Suolaa on tarkoituksella vähän.',
      'Öppna en måltid och titta på ”Kryddor och smaksättning”. Där står varje krydda med en mängd för dina portioner och när den ska tillsättas. Mängderna är milda, så smaka av och tillsätt mer om du vill. Saltet är sparsamt med avsikt.',
      'Mở một bữa ăn và xem mục “Gia vị và cách nêm”. Ở đó có từng loại gia vị kèm lượng cho số phần của bạn và lúc nào nên cho vào. Lượng khá nhẹ nên hãy nếm rồi thêm nếu thích. Muối được để ít có chủ ý.']);

  H('units', 'tbsp', ['plan'],
    'tsp,tbsp,dl,teaspoon,tablespoon,decilitre,spoon,measure,cup,tl,rkl,teelusikka,ruokalusikka,desilitra,lusikka,mitta,tsk,msk,tesked,matsked,deciliter,sked,matt,thia,thia ca phe,thia canh,dung cu,do luong,ly dong',
    ['What do tsp, tbsp and dl mean?', 'Mitä tl, rkl ja dl tarkoittavat?', 'Vad betyder tsk, msk och dl?', 'Thìa cà phê, thìa canh và dl nghĩa là gì?'],
    ['tsp is a teaspoon (about 5 ml), tbsp is a tablespoon (about 15 ml), and dl is a decilitre (100 ml, about half a normal glass). Use ordinary spoons and a measuring cup. Grams are shown in brackets.',
      'tl on teelusikka (noin 5 ml), rkl on ruokalusikka (noin 15 ml) ja dl on desilitra (100 ml, noin puoli tavallista lasillista). Käytä tavallisia lusikoita ja mittakuppia. Grammat näkyvät sulkeissa.',
      'tsk är en tesked (cirka 5 ml), msk är en matsked (cirka 15 ml) och dl är en deciliter (100 ml, ungefär ett halvt vanligt glas). Använd vanliga skedar och ett mått. Gram visas inom parentes.',
      'Thìa cà phê (tsp) khoảng 5 ml, thìa canh (tbsp) khoảng 15 ml, dl là decilit (100 ml, khoảng nửa ly thông thường). Hãy dùng thìa và ly đong bình thường. Số gam được ghi trong ngoặc.']);

  H('allergies', 'milk_lf', ['profile'],
    'allergy,allergies,allergic,gluten,lactose,milk,nuts,peanut,vegan,vegetarian,diet,intolerance,allergia,allergiat,gluteeni,laktoosi,maito,pahkina,vegaani,kasvis,ruokavalio,intolerans,allergi,allergier,mjolk,notter,jordnot,kost,di ung,sua,hat,thuan chay,an chay,che do an',
    ['How do allergies and diets work?', 'Miten allergiat ja ruokavaliot toimivat?', 'Hur fungerar allergier och kost?', 'Dị ứng và chế độ ăn hoạt động thế nào?'],
    ['In You, choose your diet and tick your allergies. Recipes that contain them are left out, and some are changed (for example oat drink instead of milk). Always read the label on the package: Ateria is not a guarantee.',
      'Valitse Profiilissa ruokavaliosi ja merkitse allergiasi. Niitä sisältävät reseptit jätetään pois, ja joitakin muutetaan (esimerkiksi kaurajuoma maidon tilalle). Lue aina pakkausmerkinnät: Ateria ei ole takuu.',
      'Välj kost och kryssa i dina allergier i Profil. Recept som innehåller dem utelämnas, och vissa ändras (till exempel havredryck i stället för mjölk). Läs alltid etiketten på förpackningen: Ateria är ingen garanti.',
      'Trong Hồ sơ, hãy chọn chế độ ăn và đánh dấu các dị ứng của bạn. Công thức chứa chúng sẽ bị loại, và một số được đổi (ví dụ dùng sữa yến mạch thay sữa bò). Luôn đọc nhãn trên bao bì: Ateria không phải là sự đảm bảo.']);

  H('cuisine', 'world', ['profile'],
    'cuisine,nordic,european,asian,asia,finnish,italian,thai,vietnamese,world,recipes,pohjoismainen,eurooppalainen,aasialainen,suomalainen,ruokatyyli,nordisk,europeisk,asiatisk,finsk,bac au,chau au,chau a,mon an,cong thuc',
    ['How do I choose Nordic, European or Asian food?', 'Miten valitsen pohjoismaista, eurooppalaista tai aasialaista ruokaa?', 'Hur väljer jag nordisk, europeisk eller asiatisk mat?', 'Làm sao để chọn món Bắc Âu, Châu Âu hoặc Châu Á?'],
    ['In You, find “Food you would like more of” and tick Nordic, European or Asian. Those recipes appear more often. You can pick more than one.',
      'Etsi Profiilista ”Ruoka, jota haluat enemmän” ja valitse pohjoismainen, eurooppalainen tai aasialainen. Nämä reseptit tulevat esiin useammin. Voit valita useamman.',
      'Hitta ”Mat du vill ha mer av” i Profil och kryssa i nordisk, europeisk eller asiatisk. Dessa recept dyker upp oftare. Du kan välja flera.',
      'Trong Hồ sơ, tìm mục “Món bạn muốn ăn nhiều hơn” rồi chọn Bắc Âu, Châu Âu hoặc Châu Á. Các món đó sẽ xuất hiện nhiều hơn. Bạn có thể chọn nhiều loại.']);

  H('save', 'save', ['profile'],
    'save,saved,remember,memory,store,storage,privacy,delete,erase,data,tallenna,tallennettu,muista,muisti,yksityisyys,poista,tiedot,spara,sparat,komma ihag,integritet,radera,uppgifter,luu,ghi nho,rieng tu,xoa,du lieu,duoc luu,co luu,luu khong,luu lai,luu thong tin',
    ['Is my information saved?', 'Tallentuvatko tietoni?', 'Sparas mina uppgifter?', 'Thông tin của tôi có được lưu không?'],
    ['Only if you say yes to “Keep my details on this device?”. It stays on this device and is not sent anywhere. You can delete it any time in You, under My data.',
      'Vain jos vastaat kyllä kysymykseen ”Tallennetaanko tietoni tälle laitteelle?”. Ne pysyvät tällä laitteella eikä niitä lähetetä minnekään. Voit poistaa ne milloin tahansa Profiilissa kohdassa Tietoni.',
      'Bara om du svarar ja på ”Spara mina uppgifter på den här enheten?”. De stannar på den här enheten och skickas inte någonstans. Du kan radera dem när som helst i Profil under Mina uppgifter.',
      'Chỉ khi bạn chọn có ở câu hỏi “Lưu thông tin của tôi trên thiết bị này?”. Thông tin ở lại trên thiết bị này và không gửi đi đâu. Bạn có thể xóa bất cứ lúc nào trong Hồ sơ, mục Dữ liệu của tôi.']);

  H('backup', 'cloud', ['profile'],
    'backup,export,import,restore,move,transfer,another phone,new phone,download,varmuuskopio,vie,tuo,siirra,toinen puhelin,uusi puhelin,lataa,sakerhetskopia,flytta,annan telefon,ny telefon,ladda ner,sao luu,chuyen,dien thoai khac,dien thoai moi,tai xuong',
    ['How do I move my details to another phone?', 'Miten siirrän tietoni toiselle puhelimelle?', 'Hur flyttar jag mina uppgifter till en annan telefon?', 'Làm sao để chuyển thông tin sang điện thoại khác?'],
    ['In You, open My data and press “Make backup”. Copy the text. On the other device open My data, paste it and press “Load backup”.',
      'Avaa Profiilissa Tietoni ja paina ”Tee varmuuskopio”. Kopioi teksti. Avaa toisella laitteella Tietoni, liitä teksti ja paina ”Lataa varmuuskopio”.',
      'Öppna Mina uppgifter i Profil och tryck på ”Skapa säkerhetskopia”. Kopiera texten. Öppna Mina uppgifter på den andra enheten, klistra in den och tryck på ”Läs in säkerhetskopia”.',
      'Trong Hồ sơ, mở Dữ liệu của tôi và bấm “Tạo bản sao lưu”. Sao chép đoạn văn bản. Trên thiết bị kia, mở Dữ liệu của tôi, dán vào và bấm “Nạp bản sao lưu”.']);

  H('people', 'people', ['profile'],
    'person,persons,partner,wife,husband,child,kids,profile switch,add person,whose,henkilo,puoliso,lapsi,lapset,lisaa henkilo,kenen,barn,lagg till person,vems,them nguoi,vo,chong,con,nhieu ho so,cua ai,luu thuc don,luu cho nhieu nguoi,nhieu nguoi khong,hon mot nguoi,moi nguoi mot',
    ['Can I keep plans for more than one person?', 'Voinko säilyttää suunnitelmia useammalle kuin yhdelle henkilölle?', 'Kan jag ha planer för mer än en person?', 'Tôi có thể lưu thực đơn cho nhiều người không?'],
    ['Yes. In You, use “Whose plan” at the top and press “Add a person”. Each person has their own details, favourites and weight log.',
      'Kyllä. Käytä Profiilissa ylhäällä kohtaa ”Kenen suunnitelma” ja paina ”Lisää henkilö”. Jokaisella henkilöllä on omat tietonsa, suosikkinsa ja painopäiväkirjansa.',
      'Ja. Använd ”Vems plan” högst upp i Profil och tryck på ”Lägg till person”. Varje person har egna uppgifter, favoriter och viktlogg.',
      'Được. Trong Hồ sơ, dùng mục “Kế hoạch của ai” ở trên cùng và bấm “Thêm người”. Mỗi người có thông tin, món yêu thích và nhật ký cân nặng riêng.']);

  H('weight', 'scale', ['profile'],
    'weight log,record weight,weigh,scale,progress,track,painopaivakirja,punnitus,edistyminen,seuranta,viktlogg,vaga,framsteg,folja,nhat ky can nang,can,tien trinh,theo doi,record,my weight,painoni,kirjaan,kirjaa,registrerar,min vikt,ghi lai,ghi can nang',
    ['How do I record my weight?', 'Miten kirjaan painoni?', 'Hur registrerar jag min vikt?', 'Làm sao để ghi lại cân nặng?'],
    ['In You, scroll to Weight log. Enter the date and your weight and press Add. A small line shows the change over time.',
      'Vieritä Profiilissa kohtaan Painopäiväkirja. Anna päivämäärä ja painosi ja paina Lisää. Pieni viiva näyttää muutoksen ajan myötä.',
      'Rulla till Viktlogg i Profil. Ange datum och din vikt och tryck på Lägg till. En liten linje visar förändringen över tid.',
      'Trong Hồ sơ, cuộn xuống Nhật ký cân nặng. Nhập ngày và cân nặng rồi bấm Thêm. Một đường nhỏ cho thấy sự thay đổi theo thời gian.']);

  H('language', 'world', [],
    'language,english,finnish,swedish,vietnamese,translate,kieli,englanti,suomi,ruotsi,vietnam,kaanna,sprak,engelska,finska,svenska,vietnamesiska,oversatt,ngon ngu,tieng anh,tieng viet,dich,kielen,kielta,vaihdan kielen,byta sprak,doi ngon ngu',
    ['How do I change the language?', 'Miten vaihdan kielen?', 'Hur byter jag språk?', 'Làm sao để đổi ngôn ngữ?'],
    ['Use the language box at the top right of the screen. You can choose English, Suomi, Svenska or Tiếng Việt.',
      'Käytä näytön oikean yläkulman kielivalintaa. Voit valita englannin, suomen, ruotsin tai vietnamin.',
      'Använd språkrutan uppe till höger på skärmen. Du kan välja engelska, finska, svenska eller vietnamesiska.',
      'Dùng ô chọn ngôn ngữ ở góc trên bên phải màn hình. Bạn có thể chọn tiếng Anh, Phần Lan, Thụy Điển hoặc tiếng Việt.']);

  H('pictures', 'speaker', [],
    'read,reading,cannot read,pictures,images,aloud,listen,speak,illiterate,dyslexia,lue,lukeminen,en osaa lukea,kuvat,aaneen,kuuntele,lasa,kan inte lasa,bilder,upp,lyssna,doc,khong biet doc,hinh,hinh anh,doc to,nghe',
    ['I find reading hard. Can the app help?', 'Lukeminen on minulle vaikeaa. Voiko sovellus auttaa?', 'Jag har svårt att läsa. Kan appen hjälpa?', 'Tôi đọc chữ khó. Ứng dụng có giúp được không?'],
    ['Yes. Every food has a picture next to its name, so you can shop by the pictures. Press the speaker button under my answers and I will read them aloud.',
      'Kyllä. Jokaisella ruoka-aineella on kuva nimen vieressä, joten voit ostaa kuvien avulla. Paina vastausteni alla olevaa kaiutinpainiketta, niin luen ne ääneen.',
      'Ja. Varje matvara har en bild bredvid namnet, så du kan handla efter bilderna. Tryck på högtalarknappen under mina svar så läser jag upp dem.',
      'Được. Mỗi thực phẩm đều có hình bên cạnh tên, nên bạn có thể đi chợ theo hình. Bấm nút loa dưới câu trả lời của tôi, tôi sẽ đọc to cho bạn nghe.']);

  H('noplan', 'check', ['profile'],
    'no plan,error,empty,nothing,not working,problem,why,ei suunnitelmaa,virhe,tyhja,ei toimi,ongelma,miksi,ingen plan,fel,tom,fungerar inte,varfor,khong co thuc don,loi,trong,khong hoat dong,van de,tai sao,chua co,chua co thuc don,bao la chua co,vi sao bao',
    ['Why does it say there is no plan?', 'Miksi sanotaan, ettei suunnitelmaa ole?', 'Varför står det att det inte finns någon plan?', 'Vì sao báo là chưa có thực đơn?'],
    ['Too many limits can leave no recipe for a meal. Open You and remove a dislike, or tick another meal, then press “Create my plan”. Never remove an allergy just to get a plan.',
      'Liian monet rajoitukset voivat jättää aterialle ilman reseptiä. Avaa Profiili ja poista jokin inhokki tai valitse toinen ateria ja paina ”Luo suunnitelmani”. Älä koskaan poista allergiaa vain saadaksesi suunnitelman.',
      'För många begränsningar kan göra att en måltid saknar recept. Öppna Profil och ta bort något du ogillar, eller kryssa i en annan måltid, och tryck på ”Skapa min plan”. Ta aldrig bort en allergi bara för att få en plan.',
      'Quá nhiều hạn chế có thể khiến một bữa không còn công thức nào. Mở Hồ sơ, bỏ bớt một món bạn không thích hoặc chọn thêm một bữa khác rồi bấm “Tạo thực đơn của tôi”. Đừng bao giờ bỏ dị ứng chỉ để có thực đơn.']);

  H('medical', 'leaf', [],
    'medical,doctor,diabetes,diabetic,kidney,pregnant,pregnancy,illness,disease,medicine,eating disorder,advice,health,laakari,munuais,raskaus,sairaus,laake,syomishairio,neuvonta,terveys,medicinsk,lakare,njur,gravid,sjukdom,atstorning,rad,halsa,y te,bac si,tieu duong,benh than,mang thai,benh,thuoc,roi loan an uong,loi khuyen,suc khoe',
    ['Is this medical advice? I have diabetes.', 'Onko tämä lääketieteellistä neuvontaa? Minulla on diabetes.', 'Är det här medicinsk rådgivning? Jag har diabetes.', 'Đây có phải lời khuyên y tế không? Tôi bị tiểu đường.'],
    ['No. Ateria gives general food ideas and rough numbers, not medical advice. If you have diabetes or kidney disease, are pregnant, take medicines or have had an eating disorder, talk to your doctor or a dietitian before you follow a plan. Ateria is for adults aged 18 to 99.',
      'Ei. Ateria antaa yleisiä ruokaideoita ja suuntaa antavia lukuja, ei lääketieteellistä neuvontaa. Jos sinulla on diabetes tai munuaissairaus, olet raskaana, käytät lääkkeitä tai sinulla on ollut syömishäiriö, keskustele lääkärin tai ravitsemusterapeutin kanssa ennen kuin noudatat suunnitelmaa. Ateria on tarkoitettu 18–99-vuotiaille aikuisille.',
      'Nej. Ateria ger allmänna matidéer och ungefärliga siffror, inte medicinsk rådgivning. Om du har diabetes eller njursjukdom, är gravid, tar läkemedel eller har haft en ätstörning, prata med din läkare eller en dietist innan du följer en plan. Ateria är för vuxna mellan 18 och 99 år.',
      'Không. Ateria chỉ đưa ra ý tưởng món ăn chung và các con số ước tính, không phải lời khuyên y tế. Nếu bạn bị tiểu đường hoặc bệnh thận, đang mang thai, đang dùng thuốc hoặc từng bị rối loạn ăn uống, hãy hỏi bác sĩ hoặc chuyên gia dinh dưỡng trước khi làm theo thực đơn. Ateria dành cho người trưởng thành từ 18 đến 99 tuổi.']);

  H('who', 'helper', [],
    'who are you,robot,ai,human,real person,claude,bot,kuka olet,ihminen,tekoaly,vem ar du,manniska,ar du en robot,ban la ai,nguoi that,tro ly',
    ['Who are you? Are you a real person?', 'Kuka olet? Oletko oikea ihminen?', 'Vem är du? Är du en riktig person?', 'Bạn là ai? Bạn có phải người thật không?'],
    ['I am Ateria’s help assistant, a program, not a person. I answer questions about how to use the app. I cannot give medical advice.',
      'Olen Aterian apuohjelma, en ihminen. Vastaan kysymyksiin sovelluksen käytöstä. En voi antaa lääketieteellistä neuvontaa.',
      'Jag är Aterias hjälpprogram, ett program och inte en person. Jag svarar på frågor om hur appen används. Jag kan inte ge medicinska råd.',
      'Tôi là trợ lý hướng dẫn của Ateria, một chương trình chứ không phải con người. Tôi trả lời các câu hỏi về cách dùng ứng dụng. Tôi không thể đưa ra lời khuyên y tế.']);
})(typeof window !== 'undefined' ? window : globalThis);
