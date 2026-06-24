import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const CITIES = [
  { 
    slug: 'zagreb', name: 'Zagreb', region: 'Središnja Hrvatska', population: '767,131',
    image: 'https://picsum.photos/seed/zagreb1/1200/800', lat: 45.8150, lng: 15.9819,
    mayor: 'Tomislav Tomašević', areaCode: '01', zipCode: '10000', officialWeb: 'https://www.zagreb.hr',
    description: 'Zagreb je glavni i najveći grad Hrvatske, te kulturno, znanstveno i gospodarsko središte države. Njegova povijesna jezgra nudi predivne primjere srednjovjekovne i austrougarske arhitekture. Posebno su poznati Trg bana Jelačića, impresivna Katedrala i slikovita crkva sv. Marka s jedinstvenim krovom. Grad se ponosi brojnim muzejima, kazalištima te prekrasnim parkovima poput Maksimira i Zrinjevca. Kroz cijelu godinu, a posebno u vrijeme nadaleko poznatog Adventa, Zagreb nudi živahnu atmosferu, bogatu gastronomsku ponudu i brojna kulturna događanja.',
    descriptionEn: 'Zagreb is the capital and largest city of Croatia, serving as its cultural, scientific, and economic center. Its historic core features beautiful examples of medieval and Austro-Hungarian architecture. The city is renowned for Ban Jelačić Square, the impressive Cathedral, and the picturesque St. Mark\'s Church with its unique tiled roof. Zagreb boasts numerous museums, theaters, and stunning parks like Maksimir and Zrinjevac. Throughout the year, and especially during its world-famous Advent, the city offers a vibrant atmosphere, rich gastronomy, and countless cultural events.'
  },
  { 
    slug: 'split', name: 'Split', region: 'Dalmacija', population: '161,312',
    image: 'https://picsum.photos/seed/split1/1200/800', lat: 43.5081, lng: 16.4402,
    mayor: 'Ivica Puljak', areaCode: '021', zipCode: '21000', officialWeb: 'https://www.split.hr',
    description: 'Split je drugi po veličini grad u Hrvatskoj i neslužbeni glavni grad prekrasne Dalmacije. Njegov najpoznatiji simbol je veličanstvena Dioklecijanova palača, antički spomenik pod zaštitom UNESCO-a koji čini samo srce grada. Živahna Riva, smještena uz samu obalu mora, glavno je okupljalište i savršeno mjesto za ispijanje kave na suncu. Grad je poznat po opuštenom mediteranskom duhu, park-šumi Marjan te bogatoj sportskoj povijesti. S predivnim plažama poput Bačvica i odličnom gastronomijom, Split je nezaobilazna destinacija.',
    descriptionEn: 'Split is the second-largest city in Croatia and the unofficial capital of beautiful Dalmatia. Its most famous symbol is the magnificent Diocletian\'s Palace, an ancient UNESCO-protected monument forming the very heart of the city. The lively Riva promenade, situated right along the waterfront, is the main gathering spot and perfect for enjoying a coffee in the sun. The city is known for its relaxed Mediterranean spirit, the Marjan forest park, and a rich sporting history. With beautiful beaches like Bačvice and excellent gastronomy, Split is an unmissable destination.'
  },
  { 
    slug: 'dubrovnik', name: 'Dubrovnik', region: 'Južna Dalmacija', population: '41,562',
    image: 'https://picsum.photos/seed/dubrovnik1/1200/800', lat: 42.6507, lng: 18.0944,
    mayor: 'Mato Franković', areaCode: '020', zipCode: '20000', officialWeb: 'https://www.dubrovnik.hr',
    description: 'Dubrovnik, poznat i kao Biser Jadrana, jedan je od najljepših povijesnih gradova na Mediteranu i pod zaštitom je UNESCO-a. Njegove impresivne gradske zidine čuvaju stoljetnu povijest nekadašnje moćne Dubrovačke Republike. Šetnja Stradunom, glavnom gradskom ulicom, otkriva palače, crkve i samostane neprocjenjive vrijednosti. Grad je postao globalno popularan i kao lokacija snimanja serije Igra prijestolja. Sa svojim luksuznim hotelima, vrhunskim restoranima i čistim morem, Dubrovnik predstavlja vrhunac hrvatskog turizma.',
    descriptionEn: 'Dubrovnik, known as the Pearl of the Adriatic, is one of the most beautiful historic cities in the Mediterranean and a UNESCO World Heritage site. Its impressive city walls guard the centuries-old history of the former powerful Republic of Ragusa. A walk down Stradun, the main city street, reveals palaces, churches, and monasteries of inestimable value. The city gained global fame as a filming location for Game of Thrones. With its luxury hotels, top-tier restaurants, and crystal-clear sea, Dubrovnik represents the pinnacle of Croatian tourism.'
  },
  { 
    slug: 'zadar', name: 'Zadar', region: 'Sjeverna Dalmacija', population: '70,829',
    image: 'https://picsum.photos/seed/zadar1/1200/800', lat: 44.1194, lng: 15.2314,
    mayor: 'Branko Dukić', areaCode: '023', zipCode: '23000', officialWeb: 'https://www.grad-zadar.hr',
    description: 'Zadar je grad iznimne povijesti i bogatog kulturnog naslijeđa smješten u srcu Jadrana. Njegov antički forum, crkva sv. Donata i brojne romaničke građevine svjedoče o tisućljetnoj urbani tradiciji. Posljednjih godina grad je svjetski poznat po jedinstvenim modernim instalacijama – Morskim orguljama i Pozdravu Suncu. Mnogi se slažu sa slavnim redateljem Alfredom Hitchcockom koji je rekao da Zadar ima najljepši zalazak sunca na svijetu. Opuštena atmosfera i blizina nacionalnih parkova čine ga savršenom bazom za istraživanje.',
    descriptionEn: 'Zadar is a city of exceptional history and rich cultural heritage situated in the heart of the Adriatic. Its ancient Roman forum, the Church of St. Donatus, and numerous Romanesque buildings testify to a millennia-old urban tradition. In recent years, the city has become world-famous for its unique modern installations – the Sea Organ and the Greeting to the Sun. Many agree with famous director Alfred Hitchcock, who claimed Zadar has the most beautiful sunset in the world. Its relaxed atmosphere and proximity to national parks make it a perfect base for exploration.'
  },
  { 
    slug: 'rijeka', name: 'Rijeka', region: 'Kvarner', population: '108,622',
    image: 'https://picsum.photos/seed/rijeka1/1200/800', lat: 45.3271, lng: 14.4422,
    mayor: 'Marko Filipović', areaCode: '051', zipCode: '51000', officialWeb: 'https://www.rijeka.hr',
    description: 'Rijeka je najveća hrvatska luka i treći grad po veličini, prepoznatljiv po svom industrijskom naslijeđu i otvorenom duhu. Njezina povijesna arhitektura odiše snažnim srednjoeuropskim utjecajem, a Korzo je nezaobilazna žila kucavica grada. Ponosna je nositeljica titule Europske prijestolnice kulture s bogatom kazališnom i alternativnom scenom. Riječki karneval, jedan od najvećih u Europi, svake godine privuče tisuće posjetitelja. Trsatska gradina i svetište nude predivan pogled na cijeli Kvarnerski zaljev.',
    descriptionEn: 'Rijeka is Croatia\'s largest port and third-largest city, recognizable by its industrial heritage and open-minded spirit. Its historical architecture exudes a strong Central European influence, and the Korzo promenade is the city\'s main artery. It is a proud former European Capital of Culture with a rich theatrical and alternative scene. The Rijeka Carnival, one of the largest in Europe, attracts thousands of visitors each year. The Trsat Castle and sanctuary offer breathtaking views of the entire Kvarner Bay.'
  },
  { 
    slug: 'osijek', name: 'Osijek', region: 'Slavonija', population: '96,848',
    image: 'https://picsum.photos/seed/osijek1/1200/800', lat: 45.5550, lng: 18.6955,
    mayor: 'Ivan Radić', areaCode: '031', zipCode: '31000', officialWeb: 'https://www.osijek.hr',
    description: 'Osijek je najveći grad u Slavoniji, predivno smješten uz desnu obalu rijeke Drave. Simbol grada je Tvrđa, jedna od najznačajnijih baroknih cjelina u Hrvatskoj sa šarmantnim trgovima i zgradama. Grad krase prostrani parkovi, dugačke šetnice uz rijeku i impresivna konkatedrala sv. Petra i Pavla. Poznat po svojoj vrhunskoj gastronomiji i gostoljubivosti, Osijek nudi autentično iskustvo ravnice. Blizina parka prirode Kopački rit čini ga idealnim odredištem za ljubitelje prirode.',
    descriptionEn: 'Osijek is the largest city in Slavonia, beautifully situated on the right bank of the Drava River. The symbol of the city is Tvrđa, one of the most significant baroque ensembles in Croatia with charming squares and buildings. The city is adorned with spacious parks, long riverside promenades, and the impressive Co-cathedral of St. Peter and Paul. Known for its superb gastronomy and hospitality, Osijek offers an authentic experience of the Pannonian plains. The proximity to the Kopački Rit Nature Park makes it an ideal destination for nature lovers.'
  },
  { 
    slug: 'pula', name: 'Pula', region: 'Istra', population: '52,220',
    image: 'https://picsum.photos/seed/pula1/1200/800', lat: 44.8666, lng: 13.8496,
    mayor: 'Filip Zoričić', areaCode: '052', zipCode: '52100', officialWeb: 'https://www.pula.hr',
    description: 'Pula je najveći istarski grad, najpoznatiji po svojim nevjerojatno očuvanim starorimskim spomenicima. Glavna zvijezda svakako je Pulska Arena, jedan od najočuvanijih rimskih amfiteatara u svijetu koji danas služi kao impresivna ljetna pozornica. U staroj jezgri možete prošetati ispod Slavoluka Sergijevaca i diviti se Augustovom hramu na drevnom Forumu. Osim bogate povijesti, Pula je okružena predivnim plažama i netaknutom prirodom poluotoka Kamenjak. Grad predstavlja savršen spoj antike, brodogradnje i modernog turizma.',
    descriptionEn: 'Pula is the largest city in Istria, best known for its incredibly preserved ancient Roman monuments. The main star is undoubtedly the Pula Arena, one of the best-preserved Roman amphitheaters globally, which today serves as an impressive summer stage. In the old core, you can walk under the Arch of the Sergii and admire the Temple of Augustus at the ancient Forum. Besides its rich history, Pula is surrounded by beautiful beaches and the pristine nature of the Kamenjak peninsula. The city perfectly blends antiquity, shipbuilding, and modern tourism.'
  },
  { 
    slug: 'sibenik', name: 'Šibenik', region: 'Dalmacija', population: '42,599',
    image: 'https://picsum.photos/seed/sibenik1/1200/800', lat: 43.7350, lng: 15.8950,
    mayor: 'Željko Burić', areaCode: '022', zipCode: '22000', officialWeb: 'https://www.sibenik.hr',
    description: 'Šibenik je jedinstven grad smješten na ušću rijeke Krke, s poviješću koju su stvarali isključivo Hrvati, za razliku od drugih obalnih gradova. Ponosi se s čak dva spomenika pod zaštitom UNESCO-a: Katedralom sv. Jakova i Tvrđavom sv. Nikole. Katedrala je pravo arhitektonsko čudo u potpunosti izgrađeno od kamena, bez vezivnog materijala. Mreža gradskih tvrđava pruža spektakularne poglede i udomljuje vrhunske koncerte. Šarmantne kamene uličice starog grada čuvaju pravi duh Dalmacije.',
    descriptionEn: 'Šibenik is a unique city located at the mouth of the Krka River, with a history forged entirely by Croats, unlike other coastal cities. It boasts two UNESCO-protected monuments: the Cathedral of St. James and St. Nicholas Fortress. The cathedral is an architectural marvel built entirely of stone, without any binding material. The network of city fortresses provides spectacular views and hosts premier concerts. The charming narrow stone streets of the old town preserve the true spirit of Dalmatia.'
  },
  { 
    slug: 'varazdin', name: 'Varaždin', region: 'Sjeverna Hrvatska', population: '43,999',
    image: 'https://picsum.photos/seed/varazdin1/1200/800', lat: 46.3057, lng: 16.3366,
    mayor: 'Neven Bosilj', areaCode: '042', zipCode: '42000', officialWeb: 'https://www.varazdin.hr',
    description: 'Varaždin je bivši glavni grad Hrvatske i jedno od najočuvanijih baroknih središta u ovom dijelu Europe. Grad je prepun raskošnih palača, crkava i znamenitog dvorca Stari grad koji je okružen perivojima. Svakog ljeta grad oživi zahvaljujući Špancirfestu, festivalu uličnih šetača koji privlači umjetnike iz cijelog svijeta. Varaždinsko groblje, remek-djelo parkovne arhitekture, također je jedna od najposjećenijih atrakcija. Opuštena atmosfera i bogata kultura čine Varaždin pravim kontinentalnim draguljem.',
    descriptionEn: 'Varaždin is the former capital of Croatia and one of the best-preserved baroque centers in this part of Europe. The city is full of magnificent palaces, churches, and the famous Old Town castle surrounded by beautiful parklands. Every summer, the city comes alive with Špancirfest, a street walking festival attracting artists worldwide. The Varaždin Cemetery, a masterpiece of park architecture, is also a highly visited attraction. Its relaxed atmosphere and rich culture make Varaždin a true continental gem.'
  },
  { 
    slug: 'karlovac', name: 'Karlovac', region: 'Središnja Hrvatska', population: '49,377',
    image: 'https://picsum.photos/seed/karlovac1/1200/800', lat: 45.4929, lng: 15.5553,
    mayor: 'Damir Mandić', areaCode: '047', zipCode: '47000', officialWeb: 'https://www.karlovac.hr',
    description: 'Karlovac je poznat kao grad na četiri rijeke: Kupi, Korani, Mrežnici i Dobri. Njegov povijesni centar izgrađen je u jedinstvenom obliku renesansne šesterokrake zvijezde radi obrane od Turaka. Danas je to grad parkova, perivoja i ugodnih šetnica uz vodu. Tijekom ljeta, obale rijeka postaju omiljena kupališta, a najpoznatije je ono na Korani u samom centru. Karlovac je nezaobilazna točka na putu prema moru, s bogatom tradicijom proizvodnje piva.',
    descriptionEn: 'Karlovac is famously known as the city on four rivers: the Kupa, Korana, Mrežnica, and Dobra. Its historical center was built in a unique Renaissance six-pointed star shape for defense against the Ottomans. Today, it is a city of parks, gardens, and pleasant riverside promenades. During summer, the riverbanks become popular bathing spots, with the one on the Korana right in the center being the most famous. Karlovac is an unmissable stop on the way to the sea, holding a rich tradition of beer brewing.'
  },
  { 
    slug: 'sisak', name: 'Sisak', region: 'Središnja Hrvatska', population: '40,185',
    image: 'https://picsum.photos/seed/sisak1/1200/800', lat: 45.4851, lng: 16.3735,
    mayor: 'Kristina Ikić Baniček', areaCode: '044', zipCode: '44000', officialWeb: 'https://www.sisak.hr',
    description: 'Sisak je jedan od najstarijih gradova u Hrvatskoj, čija bogata povijest seže još iz vremena Kelta i Rimljana kada se zvao Siscia. Smješten na ušću rijeke Kupe u Savu, grad se ponosi impozantnom Starom tvrđavom koja je odigrala ključnu ulogu u obrani Europe. Danas je to grad industrijske baštine koji se uspješno okreće uličnoj umjetnosti s brojnim impresivnim muralima. Prekrasna šetnica uz Kupu omiljeno je okupljalište Siščana. Svojim mirnim ritmom Sisak nudi ugodan predah u kontinentalnoj Hrvatskoj.',
    descriptionEn: 'Sisak is one of the oldest cities in Croatia, with a rich history dating back to the Celts and Romans when it was called Siscia. Located at the confluence of the Kupa and Sava rivers, the city boasts an imposing Old Fortress that played a key role in defending Europe. Today, it is a city of industrial heritage successfully pivoting towards street art with numerous impressive murals. The beautiful Kupa promenade is a favorite gathering spot for locals. With its peaceful pace, Sisak offers a pleasant break in continental Croatia.'
  },
  { 
    slug: 'slavonski-brod', name: 'Slavonski Brod', region: 'Slavonija', population: '53,273',
    image: 'https://picsum.photos/seed/brod1/1200/800', lat: 45.1631, lng: 18.0116,
    mayor: 'Mirko Duspara', areaCode: '035', zipCode: '35000', officialWeb: 'https://www.slavonski-brod.hr',
    description: 'Slavonski Brod je značajno industrijsko, kulturno i povijesno središte smješteno uz samu granicu na rijeci Savi. Njegov najpoznatiji simbol je veličanstvena Brodska tvrđava, jedna od najvećih utvrda u Hrvatskoj iz 18. stoljeća. Grad je blisko vezan uz našu najpoznatiju autoricu bajki, Ivanu Brlić-Mažuranić, čija se kuća nalazi na glavnom trgu. Korzo uz rijeku Savu jedno je od najljepših šetališta u Slavoniji. Slavonski Brod oduševljava bogatom gastro ponudom i istinskom slavonskom gostoljubivošću.',
    descriptionEn: 'Slavonski Brod is a significant industrial, cultural, and historical center situated right on the border along the Sava River. Its most famous symbol is the magnificent Brod Fortress, one of the largest 18th-century forts in Croatia. The city is closely tied to Croatia\'s most famous fairy tale author, Ivana Brlić-Mažuranić, whose house is on the main square. The promenade along the Sava River is one of the most beautiful in Slavonia. Slavonski Brod delights with its rich gastronomy and true Slavonian hospitality.'
  },
  { 
    slug: 'vukovar', name: 'Vukovar', region: 'Slavonija', population: '23,175',
    image: 'https://picsum.photos/seed/vukovar1/1200/800', lat: 45.3431, lng: 18.9997,
    mayor: 'Ivan Penava', areaCode: '032', zipCode: '32000', officialWeb: 'https://www.vukovar.hr',
    description: 'Vukovar je grad heroj smješten na ušću rijeke Vuke u Dunav, s dubokom i emotivnom modernom poviješću. Unatoč stradanjima, grad je danas predivno obnovljen s naglaskom na baroknu arhitekturu. Vučedolska kultura, jedna od najstarijih europskih civilizacija, potječe upravo s ovog područja i slavi se u modernom muzeju. Šetnica uz Dunav pruža fantastične poglede i mirno utočište za stanovnike i goste. Vukovar je simbol otpora, ali i grad kulture, vina i zajedništva.',
    descriptionEn: 'Vukovar is a hero city located at the confluence of the Vuka River into the Danube, carrying a deep and emotional modern history. Despite its wartime suffering, the city has been beautifully restored, highlighting its baroque architecture. The Vučedol culture, one of the oldest European civilizations, originates from this area and is celebrated in a modern museum. The Danube promenade offers fantastic views and a peaceful refuge for locals and guests. Vukovar is a symbol of resistance, but also a city of culture, wine, and unity.'
  },
  { 
    slug: 'rovinj', name: 'Rovinj', region: 'Istra', population: '12,968',
    image: 'https://picsum.photos/seed/rovinj1/1200/800', lat: 45.0811, lng: 13.6387,
    mayor: 'Marko Paliaga', areaCode: '052', zipCode: '52210', officialWeb: 'https://www.rovinj-rovigno.hr',
    description: 'Rovinj se često naziva najromantičnijim gradom na hrvatskoj obali zbog svojih uskih kamenih uličica i slikovitih trgova. Stari grad smješten je na poluotoku iznad kojeg dominira impresivna crkva sv. Eufemije sa svojim visokim zvonikom. Šarene fasade zgrada koje izranjaju iz samog mora podsjećaju na Veneciju i mame uzdahe posjetitelja. Grad nudi vrhunsku gastronomiju, luksuzne hotele i galerije na svakom koraku. Zlatni rt (Punta Corrente) savršena je oaza prirode i prekrasnih plaža u neposrednoj blizini.',
    descriptionEn: 'Rovinj is often called the most romantic city on the Croatian coast due to its narrow stone streets and picturesque squares. The old town is situated on a peninsula, dominated by the impressive Church of St. Euphemia with its tall bell tower. The colorful building facades emerging directly from the sea are reminiscent of Venice and captivate visitors. The city offers superb gastronomy, luxury hotels, and galleries at every turn. The Golden Cape (Punta Corrente) is a perfect natural oasis with beautiful beaches nearby.'
  },
  { 
    slug: 'porec', name: 'Poreč', region: 'Istra', population: '16,607',
    image: 'https://picsum.photos/seed/porec1/1200/800', lat: 45.2272, lng: 13.5947,
    mayor: 'Loris Peršurić', areaCode: '052', zipCode: '52440', officialWeb: 'https://www.porec.hr',
    description: 'Poreč je jedan od najjačih turističkih centara u Istri, grad koji živi od turizma i za turizam. Njegov najvrjedniji dragulj je Eufrazijeva bazilika iz 6. stoljeća, remek-djelo bizantske umjetnosti pod zaštitom UNESCO-a. Ulice starog grada i dalje prate antički rimski raspored ulica s Cardom i Decumanusom. Poreč nudi vrhunske resorte, kampove i čiste plaže okrunjene Plavom zastavom. Osim povijesti, poznat je po bogatom noćnom životu i izvrsnim sportskim sadržajima.',
    descriptionEn: 'Poreč is one of the strongest tourist centers in Istria, a city that lives by and for tourism. Its most valuable gem is the 6th-century Euphrasian Basilica, a masterpiece of Byzantine art protected by UNESCO. The old town streets still follow the ancient Roman street layout with the Cardo and Decumanus. Poreč offers top-tier resorts, campsites, and clean Blue Flag beaches. Besides its history, it is well known for its rich nightlife and excellent sports facilities.'
  },
  { 
    slug: 'koprivnica', name: 'Koprivnica', region: 'Podravina', population: '30,826',
    image: 'https://picsum.photos/seed/kc1/1200/800', lat: 46.1627, lng: 16.8339,
    mayor: 'Mišel Jakšić', areaCode: '048', zipCode: '48000', officialWeb: 'https://www.koprivnica.hr',
    description: 'Koprivnica je srce Podravine i grad iznimno bogate industrijske i kulturne tradicije. Poznata po prehrambenoj industriji Podravka, domovina je čuvene Vegete. Renesansni festival, koji se održava krajem ljeta, pretvara grad u srednjovjekovnu prijestolnicu i najveća je takva manifestacija u Hrvatskoj. Grad krase predivni trgovi, biciklističke staze i zelenilo na svakom koraku. Koprivnica nudi jedinstven spoj mirnog kontinentalnog života i snažnog gospodarskog rasta.',
    descriptionEn: 'Koprivnica is the heart of the Podravina region and a city with exceptionally rich industrial and cultural traditions. Known for the Podravka food industry, it is the home of the famous Vegeta seasoning. The Renaissance Festival, held in late summer, turns the city into a medieval capital and is the largest event of its kind in Croatia. The city is adorned with beautiful squares, bike paths, and greenery at every turn. Koprivnica offers a unique blend of peaceful continental life and strong economic growth.'
  },
  { 
    slug: 'bjelovar', name: 'Bjelovar', region: 'Središnja Hrvatska', population: '40,276',
    image: 'https://picsum.photos/seed/bj1/1200/800', lat: 45.8988, lng: 16.8423,
    mayor: 'Dario Hrebak', areaCode: '043', zipCode: '43000', officialWeb: 'https://www.bjelovar.hr',
    description: 'Bjelovar je jedan od najmlađih hrvatskih gradova, izgrađen u 18. stoljeću kao vojni centar s jedinstvenim mrežastim tlocrtom. Grad odiše šarmom srednje Europe s prekrasnim paviljonima u središnjem parku. Poznat je po bogatoj poljoprivredi, prvenstveno proizvodnji sira, te se često naziva gradom sira. Bjelovar njeguje dugu konjičku tradiciju i privlači posjetitelje autentičnim sajmovima poput Gudovačkog sajma. Ugodan je za obiteljski život i nudi autentično iskustvo kontinentalne Hrvatske.',
    descriptionEn: 'Bjelovar is one of Croatia\'s youngest cities, built in the 18th century as a military center with a unique grid-like street layout. The city exudes Central European charm with beautiful pavilions in its central park. It is famous for its rich agriculture, primarily cheese production, and is often called the city of cheese. Bjelovar nurtures a long equestrian tradition and attracts visitors with authentic fairs like the Gudovac Fair. It is pleasant for family life and offers an authentic experience of continental Croatia.'
  },
  { 
    slug: 'vinkovci', name: 'Vinkovci', region: 'Slavonija', population: '31,057',
    image: 'https://picsum.photos/seed/vk1/1200/800', lat: 45.2869, lng: 18.8058,
    mayor: 'Ivan Bosančić', areaCode: '032', zipCode: '32100', officialWeb: 'https://www.vinkovci.hr',
    description: 'Vinkovci se ponose titulom najstarijeg europskog grada s u kontinuitetu od preko osam tisuća godina naseljenosti. Ovdje je pronađen slavni Orion, najstariji europski kalendar. Grad je dom poznate manifestacije Vinkovačke jeseni koja slavi tradiciju, nošnje i tamburašku glazbu Slavonije. Smješten na rijeci Bosut, grad krasi prekrasna barokna arhitektura i duga šetnica. Vinkovci su savršen spoj bogate arheološke prošlosti i živog, veselog slavonskog duha.',
    descriptionEn: 'Vinkovci boasts the title of the oldest continuously inhabited city in Europe, with over eight thousand years of settlement. The famous Orion, the oldest European calendar, was discovered here. The city is home to the famous Vinkovci Autumns event, celebrating the tradition, costumes, and tamburica music of Slavonia. Located on the Bosut River, the city is adorned with beautiful baroque architecture and a long promenade. Vinkovci is a perfect blend of a rich archaeological past and a lively, cheerful Slavonian spirit.'
  },
  { 
    slug: 'samobor', name: 'Samobor', region: 'Središnja Hrvatska', population: '37,435',
    image: 'https://picsum.photos/seed/samobor1/1200/800', lat: 45.8016, lng: 15.7111,
    mayor: 'Petra Škrobot', areaCode: '01', zipCode: '10430', officialWeb: 'https://www.samobor.hr',
    description: 'Samobor je najomiljenije izletište u blizini Zagreba, prepoznatljivo po svojoj očuvanoj arhitekturi i vrhunskoj gastronomiji. Najpoznatiji zaštitni znak grada svakako je Samoborska kremšnita koja se obavezno kuša na središnjem gradskom trgu. Grad je okružen Parkom prirode Žumberak – Samoborsko gorje, što ga čini rajem za planinare i ljubitelje prirode. Samoborski fašnik jedna je od najstarijih i najvećih pokladnih svečanosti u Hrvatskoj. Romantične uličice i mostovi preko potoka Gradne daju mu poseban šarm.',
    descriptionEn: 'Samobor is the most popular excursion destination near Zagreb, recognizable by its preserved architecture and superb gastronomy. The city\'s most famous trademark is undoubtedly the Samobor kremšnita (custard slice), a must-try on the main city square. The city is surrounded by the Žumberak – Samoborsko Gorje Nature Park, making it a paradise for hikers and nature lovers. The Samobor Fašnik is one of the oldest and largest carnival festivities in Croatia. Romantic streets and bridges over the Gradna stream give it a special charm.'
  },
  { 
    slug: 'velika-gorica', name: 'Velika Gorica', region: 'Središnja Hrvatska', population: '61,198',
    image: 'https://picsum.photos/seed/vg1/1200/800', lat: 45.7131, lng: 16.0728,
    mayor: 'Krešimir Ačkar', areaCode: '01', zipCode: '10410', officialWeb: 'https://www.gorica.hr',
    description: 'Velika Gorica je šesti po veličini grad u Hrvatskoj i samo središte tradicionalne regije Turopolje. Najpoznatija je kao dom zagrebačke Međunarodne zračne luke Franjo Tuđman. Unatoč modernom razvoju, grad brižno čuva svoju povijest vidljivu kroz prekrasne drvene turopoljske kurije i kapelice. Gorica nudi mnoštvo zelenih površina, biciklističkih staza i odlične uvjete za sport i rekreaciju. Ovdje se isprepliću ruralna tradicija i snažan urbani i gospodarski rast.',
    descriptionEn: 'Velika Gorica is the sixth-largest city in Croatia and the center of the traditional Turopolje region. It is best known as the home of Zagreb\'s Franjo Tuđman International Airport. Despite modern development, the city carefully preserves its history, visible through beautiful wooden Turopolje manors and chapels. Gorica offers plenty of green spaces, bike paths, and excellent conditions for sports and recreation. Here, rural tradition intertwines with strong urban and economic growth.'
  },
  { 
    slug: 'knin', name: 'Knin', region: 'Dalmatinska Zagora', population: '11,633',
    image: 'https://picsum.photos/seed/knin1/1200/800', lat: 44.0344, lng: 16.1961,
    mayor: 'Marijo Ćaćić', areaCode: '022', zipCode: '22300', officialWeb: 'https://www.knin.hr',
    description: 'Knin je grad od iznimne povijesne i strateške važnosti za Hrvatsku, često nazivan Zvonimirovim gradom. Iznad grada dominira velebna Kninska tvrđava, jedna od najvećih fortifikacijskih građevina u Dalmaciji s koje puca spektakularan pogled. Knin se nalazi na izvoru rijeke Krke i okružen je veličanstvenim planinama, uključujući Dinaru, najvišu planinu u Hrvatskoj. Grad ima ogroman potencijal za razvoj aktivnog turizma i planinarenja. Ovdje se snažno osjeća ponosna povijest i netaknuta divljina dalmatinskog zaleđa.',
    descriptionEn: 'Knin is a city of exceptional historical and strategic importance for Croatia, often called Zvonimir\'s City. Towering above it is the magnificent Knin Fortress, one of the largest fortifications in Dalmatia offering spectacular views. Knin is located at the source of the Krka River and is surrounded by majestic mountains, including Dinara, the highest mountain in Croatia. The city has immense potential for developing active tourism and hiking. A proud history and the pristine wilderness of the Dalmatian hinterland are strongly felt here.'
  },
  { 
    slug: 'makarska', name: 'Makarska', region: 'Dalmacija', population: '13,834',
    image: 'https://picsum.photos/seed/makarska1/1200/800', lat: 43.2936, lng: 17.0197,
    mayor: 'Zoran Paunović', areaCode: '021', zipCode: '21300', officialWeb: 'https://www.makarska.hr',
    description: 'Makarska je srce jedne od najljepših rivijera na Mediteranu, gdje se surove litice planine Biokovo dramatično spuštaju do kristalno čistog mora. Grad je okružen dugim šljunčanim plažama i gustom borovom šumom koja nudi prirodan hlad. Šetnica uz more, prepuna kafića i restorana, središte je dnevnog i noćnog života. Makarska nudi bogat noćni život, ali i prilike za avanturističke izlete poput Skywalka na Biokovu. Ovo je savršena destinacija za ljubitelje sunca, mora i aktivnog odmora.',
    descriptionEn: 'Makarska is the heart of one of the most beautiful rivieras in the Mediterranean, where the rugged cliffs of Mount Biokovo drop dramatically to the crystal-clear sea. The city is surrounded by long pebble beaches and dense pine forests offering natural shade. The seaside promenade, packed with cafes and restaurants, is the center of day and night life. Makarska offers a rich nightlife, as well as opportunities for adventure trips like the Skywalk on Biokovo. It is a perfect destination for lovers of sun, sea, and active vacations.'
  },
  { 
    slug: 'opatija', name: 'Opatija', region: 'Kvarner', population: '10,619',
    image: 'https://picsum.photos/seed/opatija1/1200/800', lat: 45.3331, lng: 14.3039,
    mayor: 'Fernando Kirigin', areaCode: '051', zipCode: '51410', officialWeb: 'https://www.opatija.hr',
    description: 'Opatija nosi s punim pravom titulu dame hrvatskog turizma s tradicijom dugom više od 170 godina. Grad krasi predivna arhitektura iz vremena Austro-Ugarske monarhije s luksuznim vilama i grandioznim hotelima. Čuvena šetnica Lungomare, duga 12 kilometara, povezuje Opatiju sa susjednim pitoresknim mjestima i nudi opuštajuće poglede na Kvarner. Opatija je cjelogodišnja destinacija, poznata po svojim vrhunskim wellness centrima i parkovima. Zbog svog ljekovitog zraka i otmjenosti, oduvijek je bila omiljeno odmorište europske aristokracije.',
    descriptionEn: 'Opatija rightfully holds the title of the Lady of Croatian tourism, with a tradition spanning over 170 years. The city is adorned with beautiful architecture from the Austro-Hungarian monarchy, featuring luxury villas and grandiose hotels. The famous 12-kilometer Lungomare promenade connects Opatija to neighboring picturesque towns and offers relaxing views of the Kvarner Bay. Opatija is a year-round destination, known for its premium wellness centers and parks. Thanks to its healing air and elegance, it has always been a favorite retreat for European aristocracy.'
  },
  { 
    slug: 'umag', name: 'Umag', region: 'Istra', population: '12,699',
    image: 'https://picsum.photos/seed/umag1/1200/800', lat: 45.4371, lng: 13.5244,
    mayor: 'Vili Bassanese', areaCode: '052', zipCode: '52470', officialWeb: 'https://www.umag.hr',
    description: 'Umag je najzapadniji hrvatski grad, često nazivan i vratima Istre u Europu zbog svoje blizine slovenskoj i talijanskoj granici. U svijetu je najpoznatiji po prestižnom ATP teniskom turniru koji svakog ljeta pretvara grad u središte sporta i zabave. Umag se ponosi vrhunskom ponudom modernih hotela i kvalitetnih kampova uz samu obalu. Njegova duga rivijera skriva brojne šljunčane i stjenovite plaže savršene za odmor. Okolica Umaga poznata je po vrhunskim vinarima i maslinarima koji nude autentične istarske okuse.',
    descriptionEn: 'Umag is Croatia\'s westernmost city, often called Istria\'s gateway to Europe due to its proximity to the Slovenian and Italian borders. Globally, it is best known for the prestigious ATP tennis tournament, which turns the city into a hub of sports and entertainment every summer. Umag boasts a top-tier offer of modern hotels and quality seaside campsites. Its long riviera hides numerous pebble and rocky beaches perfect for vacationing. The surrounding area is famous for premium winemakers and olive oil producers offering authentic Istrian flavors.'
  },
  { 
    slug: 'sinj', name: 'Sinj', region: 'Dalmatinska Zagora', population: '23,452',
    image: 'https://picsum.photos/seed/sinj1/1200/800', lat: 43.7031, lng: 16.6339,
    mayor: 'Miro Bulj', areaCode: '021', zipCode: '21230', officialWeb: 'https://www.sinj.hr',
    description: 'Sinj je srce ponosne Dalmatinske Zagore, grad slavne povijesti i duboke tradicije. Najpoznatiji je po Sinjskoj alci, viteškoj igri pod zaštitom UNESCO-a koja se održava svake godine u čast pobjede nad Turcima. Grad je ujedno i jedno od najvažnijih marijanskih svetišta u Hrvatskoj s čudotvornom slikom Gospe Sinjske. Okružen planinama i smješten u dolini rijeke Cetine, Sinj pruža fantastične mogućnosti za jahanje, biciklizam i rafting. Njegova jedinstvena kombinacija viteštva, religije i prirode pruža autentično hrvatsko iskustvo.',
    descriptionEn: 'Sinj is the heart of the proud Dalmatian hinterland, a city of glorious history and deep tradition. It is best known for the Sinjska Alka, a UNESCO-protected knightly tournament held annually to commemorate the victory over the Ottomans. The city is also one of the most important Marian sanctuaries in Croatia, housing the miraculous painting of the Lady of Sinj. Surrounded by mountains and located in the Cetina River valley, Sinj offers fantastic opportunities for horseback riding, cycling, and rafting. Its unique combination of chivalry, religion, and nature provides an authentic Croatian experience.'
  }
];

const ISLANDS = [
  { 
    slug: 'hvar', name: 'Hvar', region: 'Dalmacija', population: '11,077',
    image: 'https://picsum.photos/seed/hvar1/1200/800', lat: 43.1729, lng: 16.4425,
    mayor: 'Ricardo Novak', areaCode: '021', zipCode: '21450', officialWeb: 'https://www.hvar.hr',
    description: 'Najsunčaniji hrvatski otok s najstarijim kazalištem u Europi.',
    descriptionEn: 'The sunniest Croatian island with the oldest theater in Europe.' 
  },
  { 
    slug: 'brac', name: 'Brač', region: 'Dalmacija', population: '14,434',
    image: 'https://picsum.photos/seed/brac1/1200/800', lat: 43.3289, lng: 16.6346,
    mayor: 'Ivana Marković (Supetar)', areaCode: '021', zipCode: '21400',
    description: 'Najviši jadranski otok s legendarnom plažom Zlatni rat.',
    descriptionEn: 'The highest Adriatic island with the legendary Golden Horn beach.' 
  },
  { 
    slug: 'korcula', name: 'Korčula', region: 'Dalmacija', population: '15,522',
    image: 'https://picsum.photos/seed/korcula1/1200/800', lat: 42.9611, lng: 16.8988,
    mayor: 'Nika Silić Maroević', areaCode: '020', zipCode: '20260',
    description: 'Otok Marka Pola i viteške igre Moreška.',
    descriptionEn: 'The island of Marco Polo and the Moreška knightly game.' 
  },
  { 
    slug: 'vis', name: 'Vis', region: 'Dalmacija', population: '3,445',
    image: 'https://picsum.photos/seed/vis1/1200/800', lat: 43.0611, lng: 16.1833,
    mayor: 'Tonka Ivčević', areaCode: '021', zipCode: '21480',
    description: 'Otok bogate vojne povijesti i netaknute prirode.',
    descriptionEn: 'An island of rich military history and pristine nature.' 
  },
  { 
    slug: 'krk', name: 'Krk', region: 'Kvarner', population: '19,383',
    image: 'https://picsum.photos/seed/krk1/1200/800', lat: 45.0250, lng: 14.5750,
    mayor: 'Darijo Vasilić', areaCode: '051', zipCode: '51500',
    description: 'Zlatni otok povezan mostom s kopnom.',
    descriptionEn: 'The golden island connected to the mainland by a bridge.' 
  },
  { 
    slug: 'pag', name: 'Pag', region: 'Kvarner/Dalmacija', population: '8,398',
    image: 'https://picsum.photos/seed/pag1/1200/800', lat: 44.4450, lng: 15.0560,
    mayor: 'Ante Fabijanić', areaCode: '023', zipCode: '23250',
    description: 'Otok sira, čipke i mjesečevog pejsaža.',
    descriptionEn: 'The island of cheese, lace, and a moon-like landscape.' 
  },
  { 
    slug: 'losinj', name: 'Lošinj', region: 'Kvarner', population: '7,537',
    image: 'https://picsum.photos/seed/losinj1/1200/800', lat: 44.5333, lng: 14.4667,
    mayor: 'Ana Kučić', areaCode: '051', zipCode: '51550',
    description: 'Otok vitalnosti i miomirisa.',
    descriptionEn: 'The island of vitality and fragrances.' 
  },
  { 
    slug: 'rab', name: 'Rab', region: 'Kvarner', population: '9,328',
    image: 'https://picsum.photos/seed/rab1/1200/800', lat: 44.7567, lng: 14.7600,
    mayor: 'Nikola Grgurić', areaCode: '051', zipCode: '51280',
    description: 'Sretni otok s četiri zvonika.',
    descriptionEn: 'The happy island with four bell towers.' 
  },
  { 
    slug: 'mljet', name: 'Mljet', region: 'Južna Dalmacija', population: '1,088',
    image: 'https://picsum.photos/seed/mljet1/1200/800', lat: 42.7444, lng: 17.5367,
    description: 'Zeleni otok s nacionalnim parkom i slanim jezerima.',
    descriptionEn: 'The green island with a national park and salt lakes.' 
  },
  { 
    slug: 'cres', name: 'Cres', region: 'Kvarner', population: '2,879',
    image: 'https://picsum.photos/seed/cres1/1200/800', lat: 44.9600, lng: 14.4100,
    mayor: 'Marin Gregorović', areaCode: '051', zipCode: '51557',
    description: 'Otok bjeloglavih supova i Vranskog jezera.',
    descriptionEn: 'The island of griffon vultures and Lake Vrana.' 
  },
  { 
    slug: 'murter', name: 'Murter', region: 'Dalmacija', population: '5,060',
    image: 'https://picsum.photos/seed/murter1/1200/800', lat: 43.8167, lng: 15.6000,
    description: 'Vrata Kornata povezana pokretnim bridge.',
    descriptionEn: 'The gateway to the Kornati connected by a drawbridge.' 
  },
  { 
    slug: 'dugi-otok', name: 'Dugi otok', region: 'Dalmacija', population: '2,873',
    image: 'https://picsum.photos/seed/dugi1/1200/800', lat: 43.9833, lng: 15.0000,
    description: 'Otok s prekrasnim svjetionikom Veli Rat i parkom Telašćica.',
    descriptionEn: 'An island with the beautiful Veli Rat lighthouse and Telašćica park.' 
  },
  { 
    slug: 'solta', name: 'Šolta', region: 'Dalmacija', population: '1,700',
    image: 'https://picsum.photos/seed/solta1/1200/800', lat: 43.3833, lng: 16.3000,
    description: 'Otok meda, maslina i mirnog odmora.',
    descriptionEn: 'The island of honey, olives, and a peaceful vacation.' 
  },
  { 
    slug: 'pasman', name: 'Pašman', region: 'Dalmacija', population: '2,850',
    image: 'https://picsum.photos/seed/pasman1/1200/800', lat: 43.9500, lng: 15.3667,
    description: 'Otok s najčišćim morem zbog čestih izmjena struja.',
    descriptionEn: 'The island with the cleanest sea due to frequent current changes.' 
  },
  { 
    slug: 'ugljan', name: 'Ugljan', region: 'Dalmacija', population: '6,100',
    image: 'https://picsum.photos/seed/ugljan1/1200/800', lat: 44.0833, lng: 15.1667,
    description: 'Vrt Zadra, prekriven maslinicima.',
    descriptionEn: 'The garden of Zadar, covered in olive groves.' 
  },
  { 
    slug: 'lastovo', name: 'Lastovo', region: 'Južna Dalmacija', population: '792',
    image: 'https://picsum.photos/seed/lastovo1/1200/800', lat: 42.7667, lng: 16.9000,
    description: 'Otok kristalnih zvijezda i netaknute prirode.',
    descriptionEn: 'The island of crystal stars and untouched nature.' 
  },
  { 
    slug: 'silba', name: 'Silba', region: 'Zadarski arhipelag', population: '292',
    image: 'https://picsum.photos/seed/silba1/1200/800', lat: 44.3833, lng: 14.7000,
    description: 'Otok bez automobila, idealan za potpuni mir.',
    descriptionEn: 'A car-free island, ideal for complete peace.' 
  },
  { 
    slug: 'olib', name: 'Olib', region: 'Zadarski arhipelag', population: '140',
    image: 'https://picsum.photos/seed/olib1/1200/800', lat: 44.3833, lng: 14.7833,
    description: 'Skroviti otok pješčanih uvala i mira.',
    descriptionEn: 'A hidden island of sandy coves and peace.' 
  },
  { 
    slug: 'molat', name: 'Molat', region: 'Zadarski arhipelag', population: '197',
    image: 'https://picsum.photos/seed/molat1/1200/800', lat: 44.2333, lng: 14.8333,
    description: 'Otok tišine i prekrasnih uvala za nautičare.',
    descriptionEn: 'An island of silence and beautiful coves for sailors.' 
  },
  { 
    slug: 'iz', name: 'Iž', region: 'Zadarski arhipelag', population: '615',
    image: 'https://picsum.photos/seed/iz1/1200/800', lat: 44.0500, lng: 15.1167,
    description: 'Otok lončarstva i tradicionalne dalmatinske pjesme.',
    descriptionEn: 'The island of pottery and traditional Dalmatian songs.' 
  },
  { 
    slug: 'prvic', name: 'Prvić', region: 'Šibenski arhipelag', population: '403',
    image: 'https://picsum.photos/seed/prvic1/1200/800', lat: 43.7333, lng: 15.8000,
    description: 'Otok Fausta Vrančića, izumitelja padobrana.',
    descriptionEn: 'The island of Faust Vrančić, the inventor of the parachute.' 
  },
  { 
    slug: 'zlarin', name: 'Zlarin', region: 'Šibenski arhipelag', population: '284',
    image: 'https://picsum.photos/seed/zlarin1/1200/800', lat: 43.6833, lng: 15.8500,
    description: 'Otok koralja i čuvar tradicije ronjenja.',
    descriptionEn: 'The island of corals and the guardian of diving traditions.' 
  },
  { 
    slug: 'lopud', name: 'Lopud', region: 'Elafitski otoci', population: '249',
    image: 'https://picsum.photos/seed/lopud1/1200/800', lat: 42.6833, lng: 17.9500,
    description: 'Otok prekrasne pješčane plaže Šunj.',
    descriptionEn: 'An island with the beautiful sandy beach Šunj.' 
  },
  { 
    slug: 'kolocep', name: 'Koločep', region: 'Elafitski otoci', population: '163',
    image: 'https://picsum.photos/seed/kolocep1/1200/800', lat: 42.6667, lng: 18.0000,
    description: 'Najjužniji naseljeni otok u Hrvatskoj.',
    descriptionEn: 'The southernmost inhabited island in Croatia.' 
  },
  { 
    slug: 'susak', name: 'Susak', region: 'Kvarner', population: '151',
    image: 'https://picsum.photos/seed/susak1/1200/800', lat: 44.5167, lng: 14.3000,
    description: 'Jedinstveni pješčani otok s posebnim dijalektom.',
    descriptionEn: 'A unique sandy island with a special dialect.' 
  }
];

const collectionSchemaCities = {
  name: 'cities',
  type: 'base',
  system: false,
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'region', type: 'text', required: true },
    { name: 'population', type: 'text' },
    { name: 'image', type: 'url' },
    { name: 'lat', type: 'number' },
    { name: 'lng', type: 'number' },
    { name: 'mayor', type: 'text' },
    { name: 'areaCode', type: 'text' },
    { name: 'zipCode', type: 'text' },
    { name: 'officialWeb', type: 'url' },
    { name: 'description', type: 'text' },
    { name: 'descriptionEn', type: 'text' }
  ],
  listRule: '',
  viewRule: '',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
};

const collectionSchemaIslands = {
  name: 'islands',
  type: 'base',
  system: false,
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'region', type: 'text', required: true },
    { name: 'population', type: 'text' },
    { name: 'image', type: 'url' },
    { name: 'lat', type: 'number' },
    { name: 'lng', type: 'number' },
    { name: 'mayor', type: 'text' },
    { name: 'areaCode', type: 'text' },
    { name: 'zipCode', type: 'text' },
    { name: 'officialWeb', type: 'url' },
    { name: 'description', type: 'text' },
    { name: 'descriptionEn', type: 'text' }
  ],
  listRule: '',
  viewRule: '',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
};

const collectionSchemaPages = {
  name: 'pages',
  type: 'base',
  system: false,
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'editor' },
  ],
  listRule: '',
  viewRule: '',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
};

async function run() {
  console.log("Authenticating as admin...");
  await pb.admins.authWithPassword('admin@croatiabest.hr', 'admin123456');

  console.log("Creating collections...");
  try { await pb.collections.create(collectionSchemaCities); console.log("Created cities collection."); } catch (e) { console.log("cities collection might already exist"); }
  try { await pb.collections.create(collectionSchemaIslands); console.log("Created islands collection."); } catch (e) { console.log("islands collection might already exist"); }
  try { await pb.collections.create(collectionSchemaPages); console.log("Created pages collection."); } catch (e) { console.log("pages collection might already exist"); }

  console.log("Migrating cities...");
  for (const city of CITIES) {
    try {
      await pb.collection('cities').create(city);
      console.log(`Migrated city: ${city.name}`);
    } catch (e) {
      console.log(`Failed or already exists: ${city.name}`);
    }
  }

  console.log("Migrating islands...");
  for (const island of ISLANDS) {
    try {
      await pb.collection('islands').create(island);
      console.log(`Migrated island: ${island.name}`);
    } catch (e) {
      console.log(`Failed or already exists: ${island.name}`);
    }
  }

  console.log("Done!");
}

run().catch(console.error);
