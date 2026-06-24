const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'src', 'app', 'lib', 'constants.ts');
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Add descriptionEn to Location interface
if (!content.includes('descriptionEn?: string;')) {
  content = content.replace(
    /description: string;/,
    'description: string;\n  descriptionEn?: string;'
  );
}

// 2. Bilingual Descriptions Map
const cityData = {
  "zagreb": {
    hr: "Zagreb je glavni i najveći grad Hrvatske, te kulturno, znanstveno i gospodarsko središte države. Njegova povijesna jezgra nudi predivne primjere srednjovjekovne i austrougarske arhitekture. Posebno su poznati Trg bana Jelačića, impresivna Katedrala i slikovita crkva sv. Marka s jedinstvenim krovom. Grad se ponosi brojnim muzejima, kazalištima te prekrasnim parkovima poput Maksimira i Zrinjevca. Kroz cijelu godinu, a posebno u vrijeme nadaleko poznatog Adventa, Zagreb nudi živahnu atmosferu, bogatu gastronomsku ponudu i brojna kulturna događanja.",
    en: "Zagreb is the capital and largest city of Croatia, serving as its cultural, scientific, and economic center. Its historic core features beautiful examples of medieval and Austro-Hungarian architecture. The city is renowned for Ban Jelačić Square, the impressive Cathedral, and the picturesque St. Mark's Church with its unique tiled roof. Zagreb boasts numerous museums, theaters, and stunning parks like Maksimir and Zrinjevac. Throughout the year, and especially during its world-famous Advent, the city offers a vibrant atmosphere, rich gastronomy, and countless cultural events."
  },
  "split": {
    hr: "Split je drugi po veličini grad u Hrvatskoj i neslužbeni glavni grad prekrasne Dalmacije. Njegov najpoznatiji simbol je veličanstvena Dioklecijanova palača, antički spomenik pod zaštitom UNESCO-a koji čini samo srce grada. Živahna Riva, smještena uz samu obalu mora, glavno je okupljalište i savršeno mjesto za ispijanje kave na suncu. Grad je poznat po opuštenom mediteranskom duhu, park-šumi Marjan te bogatoj sportskoj povijesti. S predivnim plažama poput Bačvica i odličnom gastronomijom, Split je nezaobilazna destinacija.",
    en: "Split is the second-largest city in Croatia and the unofficial capital of beautiful Dalmatia. Its most famous symbol is the magnificent Diocletian's Palace, an ancient UNESCO-protected monument forming the very heart of the city. The lively Riva promenade, situated right along the waterfront, is the main gathering spot and perfect for enjoying a coffee in the sun. The city is known for its relaxed Mediterranean spirit, the Marjan forest park, and a rich sporting history. With beautiful beaches like Bačvice and excellent gastronomy, Split is an unmissable destination."
  },
  "dubrovnik": {
    hr: "Dubrovnik, poznat i kao Biser Jadrana, jedan je od najljepših povijesnih gradova na Mediteranu i pod zaštitom je UNESCO-a. Njegove impresivne gradske zidine čuvaju stoljetnu povijest nekadašnje moćne Dubrovačke Republike. Šetnja Stradunom, glavnom gradskom ulicom, otkriva palače, crkve i samostane neprocjenjive vrijednosti. Grad je postao globalno popularan i kao lokacija snimanja serije Igra prijestolja. Sa svojim luksuznim hotelima, vrhunskim restoranima i čistim morem, Dubrovnik predstavlja vrhunac hrvatskog turizma.",
    en: "Dubrovnik, known as the Pearl of the Adriatic, is one of the most beautiful historic cities in the Mediterranean and a UNESCO World Heritage site. Its impressive city walls guard the centuries-old history of the former powerful Republic of Ragusa. A walk down Stradun, the main city street, reveals palaces, churches, and monasteries of inestimable value. The city gained global fame as a filming location for Game of Thrones. With its luxury hotels, top-tier restaurants, and crystal-clear sea, Dubrovnik represents the pinnacle of Croatian tourism."
  },
  "zadar": {
    hr: "Zadar je grad iznimne povijesti i bogatog kulturnog naslijeđa smješten u srcu Jadrana. Njegov antički forum, crkva sv. Donata i brojne romaničke građevine svjedoče o tisućljetnoj urbani tradiciji. Posljednjih godina grad je svjetski poznat po jedinstvenim modernim instalacijama – Morskim orguljama i Pozdravu Suncu. Mnogi se slažu sa slavnim redateljem Alfredom Hitchcockom koji je rekao da Zadar ima najljepši zalazak sunca na svijetu. Opuštena atmosfera i blizina nacionalnih parkova čine ga savršenom bazom za istraživanje.",
    en: "Zadar is a city of exceptional history and rich cultural heritage situated in the heart of the Adriatic. Its ancient Roman forum, the Church of St. Donatus, and numerous Romanesque buildings testify to a millennia-old urban tradition. In recent years, the city has become world-famous for its unique modern installations – the Sea Organ and the Greeting to the Sun. Many agree with famous director Alfred Hitchcock, who claimed Zadar has the most beautiful sunset in the world. Its relaxed atmosphere and proximity to national parks make it a perfect base for exploration."
  },
  "rijeka": {
    hr: "Rijeka je najveća hrvatska luka i treći grad po veličini, prepoznatljiv po svom industrijskom naslijeđu i otvorenom duhu. Njezina povijesna arhitektura odiše snažnim srednjoeuropskim utjecajem, a Korzo je nezaobilazna žila kucavica grada. Ponosna je nositeljica titule Europske prijestolnice kulture s bogatom kazališnom i alternativnom scenom. Riječki karneval, jedan od najvećih u Europi, svake godine privuče tisuće posjetitelja. Trsatska gradina i svetište nude predivan pogled na cijeli Kvarnerski zaljev.",
    en: "Rijeka is Croatia's largest port and third-largest city, recognizable by its industrial heritage and open-minded spirit. Its historical architecture exudes a strong Central European influence, and the Korzo promenade is the city's main artery. It is a proud former European Capital of Culture with a rich theatrical and alternative scene. The Rijeka Carnival, one of the largest in Europe, attracts thousands of visitors each year. The Trsat Castle and sanctuary offer breathtaking views of the entire Kvarner Bay."
  },
  "osijek": {
    hr: "Osijek je najveći grad u Slavoniji, predivno smješten uz desnu obalu rijeke Drave. Simbol grada je Tvrđa, jedna od najznačajnijih baroknih cjelina u Hrvatskoj sa šarmantnim trgovima i zgradama. Grad krase prostrani parkovi, dugačke šetnice uz rijeku i impresivna konkatedrala sv. Petra i Pavla. Poznat po svojoj vrhunskoj gastronomiji i gostoljubivosti, Osijek nudi autentično iskustvo ravnice. Blizina parka prirode Kopački rit čini ga idealnim odredištem za ljubitelje prirode.",
    en: "Osijek is the largest city in Slavonia, beautifully situated on the right bank of the Drava River. The symbol of the city is Tvrđa, one of the most significant baroque ensembles in Croatia with charming squares and buildings. The city is adorned with spacious parks, long riverside promenades, and the impressive Co-cathedral of St. Peter and Paul. Known for its superb gastronomy and hospitality, Osijek offers an authentic experience of the Pannonian plains. The proximity to the Kopački Rit Nature Park makes it an ideal destination for nature lovers."
  },
  "pula": {
    hr: "Pula je najveći istarski grad, najpoznatiji po svojim nevjerojatno očuvanim starorimskim spomenicima. Glavna zvijezda svakako je Pulska Arena, jedan od najočuvanijih rimskih amfiteatara u svijetu koji danas služi kao impresivna ljetna pozornica. U staroj jezgri možete prošetati ispod Slavoluka Sergijevaca i diviti se Augustovom hramu na drevnom Forumu. Osim bogate povijesti, Pula je okružena predivnim plažama i netaknutom prirodom poluotoka Kamenjak. Grad predstavlja savršen spoj antike, brodogradnje i modernog turizma.",
    en: "Pula is the largest city in Istria, best known for its incredibly preserved ancient Roman monuments. The main star is undoubtedly the Pula Arena, one of the best-preserved Roman amphitheaters globally, which today serves as an impressive summer stage. In the old core, you can walk under the Arch of the Sergii and admire the Temple of Augustus at the ancient Forum. Besides its rich history, Pula is surrounded by beautiful beaches and the pristine nature of the Kamenjak peninsula. The city perfectly blends antiquity, shipbuilding, and modern tourism."
  },
  "sibenik": {
    hr: "Šibenik je jedinstven grad smješten na ušću rijeke Krke, s poviješću koju su stvarali isključivo Hrvati, za razliku od drugih obalnih gradova. Ponosi se s čak dva spomenika pod zaštitom UNESCO-a: Katedralom sv. Jakova i Tvrđavom sv. Nikole. Katedrala je pravo arhitektonsko čudo u potpunosti izgrađeno od kamena, bez vezivnog materijala. Mreža gradskih tvrđava pruža spektakularne poglede i udomljuje vrhunske koncerte. Šarmantne kamene uličice starog grada čuvaju pravi duh Dalmacije.",
    en: "Šibenik is a unique city located at the mouth of the Krka River, with a history forged entirely by Croats, unlike other coastal cities. It boasts two UNESCO-protected monuments: the Cathedral of St. James and St. Nicholas Fortress. The cathedral is an architectural marvel built entirely of stone, without any binding material. The network of city fortresses provides spectacular views and hosts premier concerts. The charming narrow stone streets of the old town preserve the true spirit of Dalmatia."
  },
  "varazdin": {
    hr: "Varaždin je bivši glavni grad Hrvatske i jedno od najočuvanijih baroknih središta u ovom dijelu Europe. Grad je prepun raskošnih palača, crkava i znamenitog dvorca Stari grad koji je okružen perivojima. Svakog ljeta grad oživi zahvaljujući Špancirfestu, festivalu uličnih šetača koji privlači umjetnike iz cijelog svijeta. Varaždinsko groblje, remek-djelo parkovne arhitekture, također je jedna od najposjećenijih atrakcija. Opuštena atmosfera i bogata kultura čine Varaždin pravim kontinentalnim draguljem.",
    en: "Varaždin is the former capital of Croatia and one of the best-preserved baroque centers in this part of Europe. The city is full of magnificent palaces, churches, and the famous Old Town castle surrounded by beautiful parklands. Every summer, the city comes alive with Špancirfest, a street walking festival attracting artists worldwide. The Varaždin Cemetery, a masterpiece of park architecture, is also a highly visited attraction. Its relaxed atmosphere and rich culture make Varaždin a true continental gem."
  },
  "karlovac": {
    hr: "Karlovac je poznat kao grad na četiri rijeke: Kupi, Korani, Mrežnici i Dobri. Njegov povijesni centar izgrađen je u jedinstvenom obliku renesansne šesterokrake zvijezde radi obrane od Turaka. Danas je to grad parkova, perivoja i ugodnih šetnica uz vodu. Tijekom ljeta, obale rijeka postaju omiljena kupališta, a najpoznatije je ono na Korani u samom centru. Karlovac je nezaobilazna točka na putu prema moru, s bogatom tradicijom proizvodnje piva.",
    en: "Karlovac is famously known as the city on four rivers: the Kupa, Korana, Mrežnica, and Dobra. Its historical center was built in a unique Renaissance six-pointed star shape for defense against the Ottomans. Today, it is a city of parks, gardens, and pleasant riverside promenades. During summer, the riverbanks become popular bathing spots, with the one on the Korana right in the center being the most famous. Karlovac is an unmissable stop on the way to the sea, holding a rich tradition of beer brewing."
  },
  "sisak": {
    hr: "Sisak je jedan od najstarijih gradova u Hrvatskoj, čija bogata povijest seže još iz vremena Kelta i Rimljana kada se zvao Siscia. Smješten na ušću rijeke Kupe u Savu, grad se ponosi impozantnom Starom tvrđavom koja je odigrala ključnu ulogu u obrani Europe. Danas je to grad industrijske baštine koji se uspješno okreće uličnoj umjetnosti s brojnim impresivnim muralima. Prekrasna šetnica uz Kupu omiljeno je okupljalište Siščana. Svojim mirnim ritmom Sisak nudi ugodan predah u kontinentalnoj Hrvatskoj.",
    en: "Sisak is one of the oldest cities in Croatia, with a rich history dating back to the Celts and Romans when it was called Siscia. Located at the confluence of the Kupa and Sava rivers, the city boasts an imposing Old Fortress that played a key role in defending Europe. Today, it is a city of industrial heritage successfully pivoting towards street art with numerous impressive murals. The beautiful Kupa promenade is a favorite gathering spot for locals. With its peaceful pace, Sisak offers a pleasant break in continental Croatia."
  },
  "slavonski-brod": {
    hr: "Slavonski Brod je značajno industrijsko, kulturno i povijesno središte smješteno uz samu granicu na rijeci Savi. Njegov najpoznatiji simbol je veličanstvena Brodska tvrđava, jedna od najvećih utvrda u Hrvatskoj iz 18. stoljeća. Grad je blisko vezan uz našu najpoznatiju autoricu bajki, Ivanu Brlić-Mažuranić, čija se kuća nalazi na glavnom trgu. Korzo uz rijeku Savu jedno je od najljepših šetališta u Slavoniji. Slavonski Brod oduševljava bogatom gastro ponudom i istinskom slavonskom gostoljubivošću.",
    en: "Slavonski Brod is a significant industrial, cultural, and historical center situated right on the border along the Sava River. Its most famous symbol is the magnificent Brod Fortress, one of the largest 18th-century forts in Croatia. The city is closely tied to Croatia's most famous fairy tale author, Ivana Brlić-Mažuranić, whose house is on the main square. The promenade along the Sava River is one of the most beautiful in Slavonia. Slavonski Brod delights with its rich gastronomy and true Slavonian hospitality."
  },
  "vukovar": {
    hr: "Vukovar je grad heroj smješten na ušću rijeke Vuke u Dunav, s dubokom i emotivnom modernom poviješću. Unatoč stradanjima, grad je danas predivno obnovljen s naglaskom na baroknu arhitekturu. Vučedolska kultura, jedna od najstarijih europskih civilizacija, potječe upravo s ovog područja i slavi se u modernom muzeju. Šetnica uz Dunav pruža fantastične poglede i mirno utočište za stanovnike i goste. Vukovar je simbol otpora, ali i grad kulture, vina i zajedništva.",
    en: "Vukovar is a hero city located at the confluence of the Vuka River into the Danube, carrying a deep and emotional modern history. Despite its wartime suffering, the city has been beautifully restored, highlighting its baroque architecture. The Vučedol culture, one of the oldest European civilizations, originates from this area and is celebrated in a modern museum. The Danube promenade offers fantastic views and a peaceful refuge for locals and guests. Vukovar is a symbol of resistance, but also a city of culture, wine, and unity."
  },
  "rovinj": {
    hr: "Rovinj se često naziva najromantičnijim gradom na hrvatskoj obali zbog svojih uskih kamenih uličica i slikovitih trgova. Stari grad smješten je na poluotoku iznad kojeg dominira impresivna crkva sv. Eufemije sa svojim visokim zvonikom. Šarene fasade zgrada koje izranjaju iz samog mora podsjećaju na Veneciju i mame uzdahe posjetitelja. Grad nudi vrhunsku gastronomiju, luksuzne hotele i galerije na svakom koraku. Zlatni rt (Punta Corrente) savršena je oaza prirode i prekrasnih plaža u neposrednoj blizini.",
    en: "Rovinj is often called the most romantic city on the Croatian coast due to its narrow stone streets and picturesque squares. The old town is situated on a peninsula, dominated by the impressive Church of St. Euphemia with its tall bell tower. The colorful building facades emerging directly from the sea are reminiscent of Venice and captivate visitors. The city offers superb gastronomy, luxury hotels, and galleries at every turn. The Golden Cape (Punta Corrente) is a perfect natural oasis with beautiful beaches nearby."
  },
  "porec": {
    hr: "Poreč je jedan od najjačih turističkih centara u Istri, grad koji živi od turizma i za turizam. Njegov najvrjedniji dragulj je Eufrazijeva bazilika iz 6. stoljeća, remek-djelo bizantske umjetnosti pod zaštitom UNESCO-a. Ulice starog grada i dalje prate antički rimski raspored ulica s Cardom i Decumanusom. Poreč nudi vrhunske resorte, kampove i čiste plaže okrunjene Plavom zastavom. Osim povijesti, poznat je po bogatom noćnom životu i izvrsnim sportskim sadržajima.",
    en: "Poreč is one of the strongest tourist centers in Istria, a city that lives by and for tourism. Its most valuable gem is the 6th-century Euphrasian Basilica, a masterpiece of Byzantine art protected by UNESCO. The old town streets still follow the ancient Roman street layout with the Cardo and Decumanus. Poreč offers top-tier resorts, campsites, and clean Blue Flag beaches. Besides its history, it is well known for its rich nightlife and excellent sports facilities."
  },
  "koprivnica": {
    hr: "Koprivnica je srce Podravine i grad iznimno bogate industrijske i kulturne tradicije. Poznata po prehrambenoj industriji Podravka, domovina je čuvene Vegete. Renesansni festival, koji se održava krajem ljeta, pretvara grad u srednjovjekovnu prijestolnicu i najveća je takva manifestacija u Hrvatskoj. Grad krase predivni trgovi, biciklističke staze i zelenilo na svakom koraku. Koprivnica nudi jedinstven spoj mirnog kontinentalnog života i snažnog gospodarskog rasta.",
    en: "Koprivnica is the heart of the Podravina region and a city with exceptionally rich industrial and cultural traditions. Known for the Podravka food industry, it is the home of the famous Vegeta seasoning. The Renaissance Festival, held in late summer, turns the city into a medieval capital and is the largest event of its kind in Croatia. The city is adorned with beautiful squares, bike paths, and greenery at every turn. Koprivnica offers a unique blend of peaceful continental life and strong economic growth."
  },
  "bjelovar": {
    hr: "Bjelovar je jedan od najmlađih hrvatskih gradova, izgrađen u 18. stoljeću kao vojni centar s jedinstvenim mrežastim tlocrtom. Grad odiše šarmom srednje Europe s prekrasnim paviljonima u središnjem parku. Poznat je po bogatoj poljoprivredi, prvenstveno proizvodnji sira, te se često naziva gradom sira. Bjelovar njeguje dugu konjičku tradiciju i privlači posjetitelje autentičnim sajmovima poput Gudovačkog sajma. Ugodan je za obiteljski život i nudi autentično iskustvo kontinentalne Hrvatske.",
    en: "Bjelovar is one of Croatia's youngest cities, built in the 18th century as a military center with a unique grid-like street layout. The city exudes Central European charm with beautiful pavilions in its central park. It is famous for its rich agriculture, primarily cheese production, and is often called the city of cheese. Bjelovar nurtures a long equestrian tradition and attracts visitors with authentic fairs like the Gudovac Fair. It is pleasant for family life and offers an authentic experience of continental Croatia."
  },
  "vinkovci": {
    hr: "Vinkovci se ponose titulom najstarijeg europskog grada s u kontinuitetu od preko osam tisuća godina naseljenosti. Ovdje je pronađen slavni Orion, najstariji europski kalendar. Grad je dom poznate manifestacije Vinkovačke jeseni koja slavi tradiciju, nošnje i tamburašku glazbu Slavonije. Smješten na rijeci Bosut, grad krasi prekrasna barokna arhitektura i duga šetnica. Vinkovci su savršen spoj bogate arheološke prošlosti i živog, veselog slavonskog duha.",
    en: "Vinkovci boasts the title of the oldest continuously inhabited city in Europe, with over eight thousand years of settlement. The famous Orion, the oldest European calendar, was discovered here. The city is home to the famous Vinkovci Autumns event, celebrating the tradition, costumes, and tamburica music of Slavonia. Located on the Bosut River, the city is adorned with beautiful baroque architecture and a long promenade. Vinkovci is a perfect blend of a rich archaeological past and a lively, cheerful Slavonian spirit."
  },
  "samobor": {
    hr: "Samobor je najomiljenije izletište u blizini Zagreba, prepoznatljivo po svojoj očuvanoj arhitekturi i vrhunskoj gastronomiji. Najpoznatiji zaštitni znak grada svakako je Samoborska kremšnita koja se obavezno kuša na središnjem gradskom trgu. Grad je okružen Parkom prirode Žumberak – Samoborsko gorje, što ga čini rajem za planinare i ljubitelje prirode. Samoborski fašnik jedna je od najstarijih i najvećih pokladnih svečanosti u Hrvatskoj. Romantične uličice i mostovi preko potoka Gradne daju mu poseban šarm.",
    en: "Samobor is the most popular excursion destination near Zagreb, recognizable by its preserved architecture and superb gastronomy. The city's most famous trademark is undoubtedly the Samobor kremšnita (custard slice), a must-try on the main city square. The city is surrounded by the Žumberak – Samoborsko Gorje Nature Park, making it a paradise for hikers and nature lovers. The Samobor Fašnik is one of the oldest and largest carnival festivities in Croatia. Romantic streets and bridges over the Gradna stream give it a special charm."
  },
  "velika-gorica": {
    hr: "Velika Gorica je šesti po veličini grad u Hrvatskoj i samo središte tradicionalne regije Turopolje. Najpoznatija je kao dom zagrebačke Međunarodne zračne luke Franjo Tuđman. Unatoč modernom razvoju, grad brižno čuva svoju povijest vidljivu kroz prekrasne drvene turopoljske kurije i kapelice. Gorica nudi mnoštvo zelenih površina, biciklističkih staza i odlične uvjete za sport i rekreaciju. Ovdje se isprepliću ruralna tradicija i snažan urbani i gospodarski rast.",
    en: "Velika Gorica is the sixth-largest city in Croatia and the center of the traditional Turopolje region. It is best known as the home of Zagreb's Franjo Tuđman International Airport. Despite modern development, the city carefully preserves its history, visible through beautiful wooden Turopolje manors and chapels. Gorica offers plenty of green spaces, bike paths, and excellent conditions for sports and recreation. Here, rural tradition intertwines with strong urban and economic growth."
  },
  "knin": {
    hr: "Knin je grad od iznimne povijesne i strateške važnosti za Hrvatsku, često nazivan Zvonimirovim gradom. Iznad grada dominira velebna Kninska tvrđava, jedna od najvećih fortifikacijskih građevina u Dalmaciji s koje puca spektakularan pogled. Knin se nalazi na izvoru rijeke Krke i okružen je veličanstvenim planinama, uključujući Dinaru, najvišu planinu u Hrvatskoj. Grad ima ogroman potencijal za razvoj aktivnog turizma i planinarenja. Ovdje se snažno osjeća ponosna povijest i netaknuta divljina dalmatinskog zaleđa.",
    en: "Knin is a city of exceptional historical and strategic importance for Croatia, often called Zvonimir's City. Towering above it is the magnificent Knin Fortress, one of the largest fortifications in Dalmatia offering spectacular views. Knin is located at the source of the Krka River and is surrounded by majestic mountains, including Dinara, the highest mountain in Croatia. The city has immense potential for developing active tourism and hiking. A proud history and the pristine wilderness of the Dalmatian hinterland are strongly felt here."
  },
  "makarska": {
    hr: "Makarska je srce jedne od najljepših rivijera na Mediteranu, gdje se surove litice planine Biokovo dramatično spuštaju do kristalno čistog mora. Grad je okružen dugim šljunčanim plažama i gustom borovom šumom koja nudi prirodan hlad. Šetnica uz more, prepuna kafića i restorana, središte je dnevnog i noćnog života. Makarska nudi bogat noćni život, ali i prilike za avanturističke izlete poput Skywalka na Biokovu. Ovo je savršena destinacija za ljubitelje sunca, mora i aktivnog odmora.",
    en: "Makarska is the heart of one of the most beautiful rivieras in the Mediterranean, where the rugged cliffs of Mount Biokovo drop dramatically to the crystal-clear sea. The city is surrounded by long pebble beaches and dense pine forests offering natural shade. The seaside promenade, packed with cafes and restaurants, is the center of day and night life. Makarska offers a rich nightlife, as well as opportunities for adventure trips like the Skywalk on Biokovo. It is a perfect destination for lovers of sun, sea, and active vacations."
  },
  "opatija": {
    hr: "Opatija nosi s punim pravom titulu dame hrvatskog turizma s tradicijom dugom više od 170 godina. Grad krasi predivna arhitektura iz vremena Austro-Ugarske monarhije s luksuznim vilama i grandioznim hotelima. Čuvena šetnica Lungomare, duga 12 kilometara, povezuje Opatiju sa susjednim pitoresknim mjestima i nudi opuštajuće poglede na Kvarner. Opatija je cjelogodišnja destinacija, poznata po svojim vrhunskim wellness centrima i parkovima. Zbog svog ljekovitog zraka i otmjenosti, oduvijek je bila omiljeno odmorište europske aristokracije.",
    en: "Opatija rightfully holds the title of the Lady of Croatian tourism, with a tradition spanning over 170 years. The city is adorned with beautiful architecture from the Austro-Hungarian monarchy, featuring luxury villas and grandiose hotels. The famous 12-kilometer Lungomare promenade connects Opatija to neighboring picturesque towns and offers relaxing views of the Kvarner Bay. Opatija is a year-round destination, known for its premium wellness centers and parks. Thanks to its healing air and elegance, it has always been a favorite retreat for European aristocracy."
  },
  "umag": {
    hr: "Umag je najzapadniji hrvatski grad, često nazivan i vratima Istre u Europu zbog svoje blizine slovenskoj i talijanskoj granici. U svijetu je najpoznatiji po prestižnom ATP teniskom turniru koji svakog ljeta pretvara grad u središte sporta i zabave. Umag se ponosi vrhunskom ponudom modernih hotela i kvalitetnih kampova uz samu obalu. Njegova duga rivijera skriva brojne šljunčane i stjenovite plaže savršene za odmor. Okolica Umaga poznata je po vrhunskim vinarima i maslinarima koji nude autentične istarske okuse.",
    en: "Umag is Croatia's westernmost city, often called Istria's gateway to Europe due to its proximity to the Slovenian and Italian borders. Globally, it is best known for the prestigious ATP tennis tournament, which turns the city into a hub of sports and entertainment every summer. Umag boasts a top-tier offer of modern hotels and quality seaside campsites. Its long riviera hides numerous pebble and rocky beaches perfect for vacationing. The surrounding area is famous for premium winemakers and olive oil producers offering authentic Istrian flavors."
  },
  "sinj": {
    hr: "Sinj je srce ponosne Dalmatinske Zagore, grad slavne povijesti i duboke tradicije. Najpoznatiji je po Sinjskoj alci, viteškoj igri pod zaštitom UNESCO-a koja se održava svake godine u čast pobjede nad Turcima. Grad je ujedno i jedno od najvažnijih marijanskih svetišta u Hrvatskoj s čudotvornom slikom Gospe Sinjske. Okružen planinama i smješten u dolini rijeke Cetine, Sinj pruža fantastične mogućnosti za jahanje, biciklizam i rafting. Njegova jedinstvena kombinacija viteštva, religije i prirode pruža autentično hrvatsko iskustvo.",
    en: "Sinj is the heart of the proud Dalmatian hinterland, a city of glorious history and deep tradition. It is best known for the Sinjska Alka, a UNESCO-protected knightly tournament held annually to commemorate the victory over the Ottomans. The city is also one of the most important Marian sanctuaries in Croatia, housing the miraculous painting of the Lady of Sinj. Surrounded by mountains and located in the Cetina River valley, Sinj offers fantastic opportunities for horseback riding, cycling, and rafting. Its unique combination of chivalry, religion, and nature provides an authentic Croatian experience."
  }
};

// 3. Update the CITIES array in constants.ts
const citiesRegex = /(export const CITIES: Location\[\] = \[)([\s\S]*?)(\n\];)/;
const match = content.match(citiesRegex);

if (match) {
  let citiesBlock = match[2];
  
  // We'll parse each city object to update description and descriptionEn
  // Since parsing JS objects with regex is tricky, we'll replace the descriptions individually
  
  for (const [slug, descs] of Object.entries(cityData)) {
    // Find the object for this slug
    const slugRegex = new RegExp(`({[^}]*slug:\\s*'${slug}'[^}]*})`, 'g');
    
    citiesBlock = citiesBlock.replace(slugRegex, (cityObj) => {
      // Remove old description completely
      let newObj = cityObj.replace(/description:\s*'[^']*'/g, '');
      
      // Remove double commas if any
      newObj = newObj.replace(/,\s*,/g, ',');
      
      // Clean up empty lines before inserting new descriptions
      
      // Format new descriptions safely
      const hrSafe = descs.hr.replace(/'/g, "\\'");
      const enSafe = descs.en.replace(/'/g, "\\'");
      
      // Inject right before the closing brace
      newObj = newObj.replace(/\s*}$/, `,\n    description: '${hrSafe}',\n    descriptionEn: '${enSafe}'\n  }`);
      
      return newObj;
    });
  }

  content = content.replace(citiesRegex, `$1${citiesBlock}$3`);
  fs.writeFileSync(FILE_PATH, content, 'utf8');
  console.log('Descriptions successfully updated in constants.ts!');
} else {
  console.log('Could not find CITIES array in constants.ts.');
}
