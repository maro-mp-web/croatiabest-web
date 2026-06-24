import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const MONUMENTS = [
  // DUBROVNIK (20)
  {
    name: 'Dubrovačke gradske zidine', city: 'Dubrovnik', lat: 42.6417, lng: 18.1070,
    description: 'Monumentalne obrambene zidine koje okružuju stari dio grada Dubrovnika. Građene su od 13. do 17. stoljeća za potrebe obrane Dubrovačke Republike. Duge su nevjerojatnih 1940 metara, a uključuju pet tvrđava, šesnaest kula i bastiona. Zbog svoje očuvanosti i povijesne važnosti nalaze se pod zaštitom UNESCO-a te predstavljaju najpoznatiju znamenitost cijele regije, a globalno su popularizirane kao lokacija snimanja Igre prijestolja.'
  },
  {
    name: 'Tvrđava Lovrijenac', city: 'Dubrovnik', lat: 42.6410, lng: 18.1042,
    description: 'Impozantna utvrda smještena na strmoj hridi visokoj 37 metara, izvan vanjskih gradskih zidina. Često se naziva "Dubrovačkim Gibraltarom". Izgrađena je kako bi štitila zapadni morski prilaz gradu. Danas je poznata po natpisu "Non Bene Pro Toto Libertas Venditur Auro" (Sloboda se ne prodaje za sve zlato svijeta) i kao jedinstvena pozornica za izvedbe Shakespeareovog Hamleta.'
  },
  {
    name: 'Stradun (Placa)', city: 'Dubrovnik', lat: 42.6409, lng: 18.1084,
    description: 'Glavna ulica u staroj jezgri Dubrovnika, popločana bijelim vapnencom koji je stoljećima poliran do sjaja. Duga je oko 300 metara i povezuje istočna i zapadna gradska vrata. Nekada je bila morski tjesnac koji je razdvajao dva naselja, a danas je kucavica grada, omiljeno šetalište te mjesto okupljanja povodom blagdana sv. Vlaha i Dubrovačkih ljetnih igara.'
  },
  {
    name: 'Knežev dvor', city: 'Dubrovnik', lat: 42.6403, lng: 18.1105,
    description: 'Prekrasna gotičko-renesansna palača koja je stoljećima bila središte moći Dubrovačke Republike. U njoj je stolovao knez tijekom svog jednomjesečnog mandata. Palača se ističe predivnim atrijem s kamenim stupovima i kapitelima. Danas služi kao Kulturno-povijesni muzej grada Dubrovnika s bogatom zbirkom namještaja, slika i numizmatike.'
  },
  {
    name: 'Palača Sponza', city: 'Dubrovnik', lat: 42.6411, lng: 18.1106,
    description: 'Jedna od rijetkih zgrada koja je preživjela veliki potres 1667. godine bez oštećenja. Njezina arhitektura predstavlja savršen spoj gotike i renesanse. U doba Dubrovačke Republike služila je kao carinarnica, kovnica novca i oružarnica. Danas se u njoj čuva Državni arhiv s dokumentima neprocjenjive vrijednosti za hrvatsku i europsku povijest.'
  },
  {
    name: 'Crkva sv. Vlaha', city: 'Dubrovnik', lat: 42.6408, lng: 18.1104,
    description: 'Raskošna barokna crkva posvećena zaštitniku Dubrovnika, svetom Vlahu. Sagrađena je početkom 18. stoljeća na mjestu starije romaničke crkve. Na glavnom oltaru čuva se dragocjeni zlatni kip sv. Vlaha iz 15. stoljeća, koji u ruci drži maketu Dubrovnika prije velikog potresa, što ima ogromnu povijesnu važnost.'
  },
  {
    name: 'Katedrala Uznesenja Blažene Djevice Marije', city: 'Dubrovnik', lat: 42.6398, lng: 18.1105,
    description: 'Dubrovačka prvostolnica izgrađena u baroknom stilu nakon razornog potresa. Prema legendi, izvornu crkvu financirao je engleski kralj Rikard Lavljeg Srca u znak zahvalnosti za spas od brodoloma. Katedrala čuva iznimno bogatu riznicu relikvija i neprocjenjivih zlatarskih umjetnina, uključujući i relikvije sv. Vlaha.'
  },
  {
    name: 'Tvrđava Minčeta', city: 'Dubrovnik', lat: 42.6427, lng: 18.1082,
    description: 'Najviša i najmasivnija točka dubrovačkih gradskih zidina sa sjeverne strane. Svojom prepoznatljivom krunom dominira gradskim pejzažem. Izgrađena je kao ključna obrambena točka prema kopnu. S njenog vrha pruža se najljepši panoramski pogled na cijeli stari grad, crvene krovove i otvoreno more.'
  },
  {
    name: 'Velika Onofrijeva česma', city: 'Dubrovnik', lat: 42.6415, lng: 18.1068,
    description: 'Velika poligonalna fontana smještena na samom ulazu u Stari grad preko Pila. Sagradio ju je napuljski graditelj Onofrio della Cava u 15. stoljeću kao dio dubrovačkog vodovoda. Voda istječe iz 16 kamenih maskerona, a česma i danas pruža osvježenje posjetiteljima u vrućim ljetnim danima.'
  },
  {
    name: 'Franjevački samostan i stara ljekarna', city: 'Dubrovnik', lat: 42.6417, lng: 18.1075,
    description: 'Kompleks iz 14. stoljeća poznat po svom prekrasnom romaničko-gotičkom klaustru koji je pravo remek-djelo arhitekture. Unutar samostana nalazi se treća najstarija ljekarna u Europi (osnovana 1317. godine) koja kontinuirano radi do današnjih dana, te bogata knjižnica s vrijednim inkunabulama.'
  },
  {
    name: 'Orlandov stup', city: 'Dubrovnik', lat: 42.6410, lng: 18.1102,
    description: 'Kameni stup s uklesanim likom srednjovjekovnog viteza Orlanda. Najstarija je sačuvana javna skulptura u Dubrovniku, izgrađena u 15. stoljeću. Stup je predstavljao simbol slobode i državne neovisnosti Dubrovačke Republike. Dužina vitezove podlaktice služila je kao službena dubrovačka mjera za dužinu - dubrovački lakat.'
  },
  {
    name: 'Dominikanski samostan', city: 'Dubrovnik', lat: 42.6418, lng: 18.1121,
    description: 'Impresivan samostanski kompleks smješten blizu vrata od Ploča. Njegova arhitektura je savršen primjer dubrovačke gotike i renesanse. U njemu se nalazi muzej s iznimno vrijednom zbirkom umjetnina Dubrovačke slikarske škole iz 15. i 16. stoljeća te nakita, a dvorište pruža osjećaj mira unutar gužvi grada.'
  },
  {
    name: 'Tvrđava Revelin', city: 'Dubrovnik', lat: 42.6422, lng: 18.1126,
    description: 'Snažna utvrda oblika nepravilnog četverokuta smještena na istoku grada za obranu vrata od Ploča. Zbog svoje masivnosti i debelih zidova nikad nije bila osvojena. Danas je ova tvrđava dom jednog od najpoznatijih noćnih klubova u regiji te mjesto održavanja ekskluzivnih festivala.'
  },
  {
    name: 'Crkva sv. Spasa', city: 'Dubrovnik', lat: 42.6415, lng: 18.1070,
    description: 'Prekrasna renesansna crkvica smještena između Velike Onofrijeve česme i Franjevačkog samostana. Sagrađena je u 16. stoljeću u znak zahvalnosti nakon razornog potresa i zanimljivo je to da je u velikom potresu 1667. ostala potpuno neoštećena u svom izvornom obliku.'
  },
  {
    name: 'Tvrđava Bokar', city: 'Dubrovnik', lat: 42.6403, lng: 18.1065,
    description: 'Ključna polukružna tvrđava iz 15. stoljeća smještena na jugozapadnom dijelu zidina. Služila je obrani Vrata od Pila. Danas je jedan od najstarijih primjera kazamatne utvrde u Europi. Njena arhitektonska ljepota privlači posjetitelje jer pruža izvanredne vidike prema tvrđavi Lovrijenac i otvorenom moru.'
  },
  {
    name: 'Lazarati (Dubrovačka karantena)', city: 'Dubrovnik', lat: 42.6413, lng: 18.1147,
    description: 'Kompleks zgrada smješten izvan gradskih zidina na Pločama, izgrađen u 17. stoljeću. Dubrovnik je među prvima u svijetu uzeo mjere karantene. Lazareti su služili kao izolacija za trgovce i putnike u cilju sprječavanja širenja zaraznih bolesti. Danas su kulturni centar grada i dom mnogim udrugama.'
  },
  {
    name: 'Crkva sv. Ignacija', city: 'Dubrovnik', lat: 42.6391, lng: 18.1093,
    description: 'Monumentalna barokna isusovačka crkva dovršena početkom 18. stoljeća. Do nje vodi slavni, široki kameni skalin (Isusovačke stube) koje su projektirane po uzoru na Španjolske stube u Rimu. Unutrašnjost crkve krase iluzionističke freske Gaetana Garcije, što je čini jednim od najdragocjenijih sakralnih objekata.'
  },
  {
    name: 'Vrata od Pila', city: 'Dubrovnik', lat: 42.6417, lng: 18.1066,
    description: 'Glavni ulaz u dubrovački Stari grad na zapadnoj strani. Vrata s renesansnim lukom čuva kameni kip zaštitnika sv. Vlaha. Kroz stoljeća, pokretni drveni most bi se svake noći podizao, a ključevi grada predavali bi se dubrovačkom knezu. Danas mostom svakodnevno prolaze tisuće posjetitelja.'
  },
  {
    name: 'Vrata od Ploča', city: 'Dubrovnik', lat: 42.6418, lng: 18.1128,
    description: 'Istočni ulaz u povijesnu jezgru Dubrovnika s prekrasnim kamenim mostom iznad obrambenog jarka. Kroz povijest, ovaj je ulaz bio snažno čuvan tvrđavom Revelin, a sustav vrata je identičan onom na zapadu. S ovog mjesta pruža se i prekrasan pogled na staru gradsku luku.'
  },
  {
    name: 'Stara gradska luka', city: 'Dubrovnik', lat: 42.6406, lng: 18.1121,
    description: 'Povijesna dubrovačka luka koja je stoljećima bila temelj trgovačke moći Republike. Zaštićena je lukobranom Kaše i okružena arsenalom gdje su se gradili nadaleko poznati dubrovački brodovi - galijuni i karake. Danas služi vezivanju manjih brodica i stvara jednu od najslikovitijih dubrovačkih razglednica.'
  },

  // ZADAR (20)
  {
    name: 'Crkva sv. Donata', city: 'Zadar', lat: 44.1158, lng: 15.2244,
    description: 'Najpoznatiji spomenik Zadra i jedan od najvažnijih primjera predromaničke arhitekture kružnog tlocrta u Europi. Sagrađena je u 9. stoljeću. Zbog iznimne akustike njen se prostor danas uglavnom koristi za održavanje glazbenih programa, a postala je i jednim od vizualnih simbola Hrvatske u svijetu.'
  },
  {
    name: 'Rimski Forum u Zadru', city: 'Zadar', lat: 44.1156, lng: 15.2246,
    description: 'Najveći rimski forum izgrađen na istočnoj obali Jadranskog mora, nastao po nalogu cara Augusta u 1. stoljeću. Očuvani su ostaci temelja, antičkih stupova i žrtvenika. Nalazi se u strogom središtu povijesne jezgre i okružuje crkvu sv. Donata, svjedočeći o izvanredno dugoj urbanoj tradiciji grada Zadra.'
  },
  {
    name: 'Katedrala sv. Stošije', city: 'Zadar', lat: 44.1163, lng: 15.2238,
    description: 'Najveća crkva u Dalmaciji, izgrađena u prekrasnom romaničkom stilu tijekom 12. i 13. stoljeća. Njena raskošna fasada oduzima dah. Posvećena je srijemskoj mučenici sv. Anastaziji čije se relikvije čuvaju unutra. S impresivnog zvonika, s kojeg možete vidjeti cijeli zadarski arhipelag, baca se nezaboravan panoramski pogled.'
  },
  {
    name: 'Kopnena vrata (Foša)', city: 'Zadar', lat: 44.1130, lng: 15.2285,
    description: 'Remek-djelo renesansne arhitekture koje je izradio poznati venecijanski arhitekt Michele Sanmicheli 1543. godine. Vrata su ukrašena reljefom mletačkog lava sv. Marka i prikazom sv. Krševana. Smatraju se najljepšim spomenikom renesansne arhitekture u Dalmaciji koji uokviruje slikovitu luku Foša.'
  },
  {
    name: 'Trg pet bunara', city: 'Zadar', lat: 44.1136, lng: 15.2275,
    description: 'Slikoviti trg izgrađen u 16. stoljeću kao velika cisterna za vodu iz koje se Zadar opskrbljivao tijekom turskih opsada. Na trgu se nalazi pet okrunjenih zdenaca po kojima je dobio ime, dok se u pozadini uzdiže predivan park kraljice Jelene Madijevke, prvi javni gradski park u Hrvatskoj.'
  },
  {
    name: 'Kapetanova kula', city: 'Zadar', lat: 44.1138, lng: 15.2272,
    description: 'Pesterokutna obrambena kula iz 13. stoljeća koja dominira Trgom pet bunara. Uz gradske zidine, imala je vitalnu ulogu u mletačkom obrambenom sustavu od osmanskih osvajanja. Danas je ova lokacija često središte umjetničkih instalacija, pop-up izložbi i kulturnih zbivanja u srcu ljeta.'
  },
  {
    name: 'Morske orgulje', city: 'Zadar', lat: 44.1174, lng: 15.2197,
    description: 'Fascinantan spoj moderne arhitekture i prirode s naglaskom na SEO. Ovaj eksperimentalni instrument instaliran ispod kamenih stepenica zadarske rive proizvodi jedinstvene melodije snagom morskih valova. Mjesto predstavlja inovativni pristup oblikovanju obale i privlači stotine tisuća turista godišnje u meditativnu zvučnu idilu.'
  },
  {
    name: 'Pozdrav Suncu', city: 'Zadar', lat: 44.1180, lng: 15.2192,
    description: 'Velika svjetlosna instalacija arhitekta Nikole Bašića smještena na Istarskoj obali, tik do Morskih orgulja. Sastoji se od stotina staklenih solarnih ploča koje preko dana skupljaju sunčevu energiju, a noću stvaraju spektakularnu igru svjetlosti, slaveći zadarske zalaske sunca koje je volio i Alfred Hitchcock.'
  },
  {
    name: 'Crkva sv. Krševana', city: 'Zadar', lat: 44.1158, lng: 15.2272,
    description: 'Impresivna romanička bazilika iz 12. stoljeća s prekrasno ukrašenom polukružnom apsidom. Crkva je nekoć pripadala velikom muškom benediktinskom samostanu. Sv. Krševan je ujedno i glavni zaštitnik grada Zadra, stoga zgrada ima izuzetnu važnost u duhovnom i kulturnom životu grada.'
  },
  {
    name: 'Crkva sv. Šime', city: 'Zadar', lat: 44.1143, lng: 15.2270,
    description: 'Ranoromanička crkva preuređena u baroknom stilu unutar koje se nalazi nevjerojatna raka (škrinja) svetog Šimuna, remek-djelo srednjovjekovnog zlatarstva izrađeno od 250 kilograma srebra s pozlatom, a koje je naručila kraljica Elizabeta Kotromanić. Najvrjednije je umjetničko djelo s područja Zadra.'
  },
  {
    name: 'Arsenalska zgrada', city: 'Zadar', lat: 44.1170, lng: 15.2223,
    description: 'Veliko skladište i vojno pomorsko postrojenje iz 18. stoljeća koje se prostire na 4000 četvornih metara. Danas je stari mletački Arsenal sjajno obnovljen te pretvoren u multifunkcionalni zatvoreni trg. Funkcionira kao elitni prostor za koncerte, luksuzne restorane te poslovne konferencije.'
  },
  {
    name: 'Palača Kneževa dvora (Providurova palača)', city: 'Zadar', lat: 44.1147, lng: 15.2263,
    description: 'Veličanstven povijesni kompleks koji je služio kao sjedište gradske uprave još od doba srednjovjekovne komune, a zatim kao providurova rezidencija. Danas spojeni kompleks s Kneževom palačom čini moderno srce kulture poznato kao "Dvije palače" unutar kojeg su smješteni Nacionalni muzej i izložbene dvorane.'
  },
  {
    name: 'Stup srama', city: 'Zadar', lat: 44.1157, lng: 15.2248,
    description: 'Pravi preostali rimski stup koji je stoljećima na zadarskom Forumu služio kao svojevrsni stup srama. Na njemu bi bili javno izloženi prijestupnici vezani lancima s ciljem sramoćenja pred građanima. Stup je nevjerojatan svjedok surovijih srednjovjekovnih pravnih postupaka i nalazišta iz doba Rima.'
  },
  {
    name: 'Zadarski bedemi (Muraj)', city: 'Zadar', lat: 44.1142, lng: 15.2291,
    description: 'Impozantan sustav obrambenih utvrda koje je Mletačka Republika sagradila radi obrane od Osmanskog Carstva u 16. stoljeću. Od 2017. su pod zaštitom UNESCO-a. Nedavno su revitalizirani u dugu šetnicu prepunu drvoreda s nevjerojatnim pogledima, čineći ju zelenom i sigurnom oazom ponad gradskih ulica.'
  },
  {
    name: 'Narodni trg u Zadru', city: 'Zadar', lat: 44.1152, lng: 15.2265,
    description: 'Srce javnog života Zadra još od srednjeg vijeka. Na trgu dominira zgrada gradske straže s prepoznatljivim tornjem sa satom te impresivna Gradska loža. Danas je trg uvijek prepun života, ispunjen vanjskim terasama vrhunskih kafića te je odlična polazna točka za obilazak Poluotoka.'
  },
  {
    name: 'Zgrada Sveučilišta', city: 'Zadar', lat: 44.1135, lng: 15.2222,
    description: 'Ova raskošna neoklasicistička zgrada smještena uz more pruža dom najstarijem sveučilištu na hrvatskom tlu i jugoistočnoj Europi, čija tradicija osnutka datira još u 1396. godinu. Pogled s kampusa pada točno na zalazak sunca, čime nudi vjerojatno najljepšu kulisu za studiranje u regiji.'
  },
  {
    name: 'Lučka Vrata (Porta Marina)', city: 'Zadar', lat: 44.1173, lng: 15.2259,
    description: 'Monumentalna mletačka vrata smještena sa sjeverne strane gradskih bedema koja vode iz grada izravno prema staroj i novoj luci. Iznad bogato ukrašenog prolaza izdiže se trijumfalni luk s mletačkim lavom u spomen velikoj bitci kod Lepanta u 16. stoljeću.'
  },
  {
    name: 'Samostan sv. Marije i zlato i srebro Zadra', city: 'Zadar', lat: 44.1152, lng: 15.2248,
    description: 'Ženski benediktinski samostan koji postoji od ranog srednjeg vijeka. Unutar njega nalazi se stalna izložba crkvene umjetnosti pod nazivom Zlato i srebro Zadra, koja čuva nevjerojatno bogatu i raskošnu kolekciju relikvijara, svetih posuda i čipke iz hrvatske povijesti.'
  },
  {
    name: 'Palača Grisogono-Vovo', city: 'Zadar', lat: 44.1165, lng: 15.2250,
    description: 'Jedinstvena povijesna plemićka palača iznimne arhitektonske važnosti s raskošnim detaljima mletačke gotike na prozorima i predivnim renesansnim unutrašnjim dvorištem koje obiluje starim bunarima. Otkriva način života bogatih zadarskih plemićkih obitelji u doba najveće pomorske slave.'
  },
  {
    name: 'Kalelarga (Široka ulica)', city: 'Zadar', lat: 44.1155, lng: 15.2255,
    description: 'Glavna, najpoznatija i najstarija zadarska ulica o kojoj se pjevaju pjesme. Njezini temelji potječu od antičkog rimskog Decumanusa. Nakon bombardiranja u 2. svjetskom ratu obnovljena je te i danas služi kao "dnevni boravak" i glavno okupljalište brojnih generacija zadrana.'
  },

  // PULA (20)
  {
    name: 'Amfiteatar u Puli (Arena)', city: 'Pula', lat: 44.8732, lng: 13.8501,
    description: 'Jedan od najljepših i najočuvanijih rimskih amfiteatara na svijetu, te bez sumnje najpoznatiji istarski antički spomenik. Sagrađen je u prvom stoljeću pod vladavinom cara Vespazijana kako bi služio za gladijatorske borbe. Zapanjujuće grandiozna eliptična građevina danas u ljetnim mjesecima dom ugošćuje poznate svjetske glazbenike i Pulski filmski festival.'
  },
  {
    name: 'Slavoluk Sergijevaca (Zlatna vrata)', city: 'Pula', lat: 44.8686, lng: 13.8483,
    description: 'Prekrasan i savršeno očuvan antički rimski slavoluk postavljen u čast trojice braće iz ugledne obitelji Sergijevaca zbog njihovog sudjelovanja u slavnoj bitci kod Akcija. Vrata izgrađena u korintskom stilu predstavljaju izvrstan dokaz estetskih dosega lokalne rimske skulpture te su glavno sjecište starih gradskih trgovača u Puli.'
  },
  {
    name: 'Augustov hram', city: 'Pula', lat: 44.8703, lng: 13.8421,
    description: 'Velebni, elegantni rimski hram izgrađen na antičkom Forumu posvećen božici Romi i caru Augustu. Visokim stupovima dominira glavnim trgom. Unatoč teškim razaranjima od bombardiranja u Drugom svjetskom ratu, predivno je rekonstruiran i danas unutar njega djeluje mala zbirka vrhunske antičke skulpture od bronce.'
  },
  {
    name: 'Rimski Forum', city: 'Pula', lat: 44.8702, lng: 13.8423,
    description: 'Središnji gradski trg i danas i u doba antičkog Rima. Nekada okružen s tri velika hrama, danas je ovo popularno mjesto okupljanja puno terasa, a uz povijesni Augustov hram ovdje se nalazi arhitektonski složena mletačka Gradska vijećnica koja daje savršen kontrast.'
  },
  {
    name: 'Mletačka utvrda (Kaštel)', city: 'Pula', lat: 44.8708, lng: 13.8450,
    description: 'Masivna utvrda zvjezdastog oblika smještena na najvišem brdu pulskog središta, podignuta u 17. stoljeću od strane Mlečana kako bi čuvala jednu od najvažnijih luka na Mediteranu. Danas utvrda pruža nevjerojatan pogled na Arenu i pulski zaljev, a unutar nje djeluje Povijesni i pomorski muzej Istre.'
  },
  {
    name: 'Malo rimsko kazalište', city: 'Pula', lat: 44.8707, lng: 13.8475,
    description: 'Antički rimski teatar smješten na padinama brežuljka ispod utvrde Kaštel. Nedavno je briljantno obnovljeno te sada, na 2000 godina starim tribinama, ponovno funkcionira kao spektakularna pozornica pod otvorenim nebom kapaciteta do nekoliko tisuća posjetitelja.'
  },
  {
    name: 'Dvojna vrata (Porta Gemina)', city: 'Pula', lat: 44.8716, lng: 13.8480,
    description: 'Veličanstvena vrata iz rimskog razdoblja sastavljena od dva monumentalna luka koja su tvorila jedan od glavnih ulaza u antički grad Pulu. Izrađena u tipičnom rimskom arhitektonskom stilu 2. stoljeća, danas posjetitelje vode do stepenica prema Kaštelu i rimskom kazalištu.'
  },
  {
    name: 'Herkulova vrata', city: 'Pula', lat: 44.8702, lng: 13.8486,
    description: 'Najstariji očuvani arhitektonski spomenik rimske arhitekture u Puli, datiran u sredinu 1. stoljeća prije Krista. U tjemenu luka nalazi se pomalo oštećen, ali još uvijek prepoznatljiv kameni reljef antičkog heroja Herkula, mitskog zaštitnika samog osnutka pulske kolonije.'
  },
  {
    name: 'Mozaik Kažnjavanje Dirke', city: 'Pula', lat: 44.8690, lng: 13.8465,
    description: 'Veliki, nevjerojatno dobro očuvan podni mozaik iz rimskog vremena smješten ispod stambene zgrade blizu kapele sv. Marije Formoze. Slučajno je pronađen tijekom Drugog svjetskog rata, a prikazuje detaljne, mitološki inspirirane geometrijske ornamente, pravo bogatstvo istarske antike.'
  },
  {
    name: 'Kapelica sv. Marije Formoze', city: 'Pula', lat: 44.8687, lng: 13.8458,
    description: 'Rano-bizantska kapela izgrađena u 6. stoljeću koja je nekoć pripadala ogromnoj benediktinskoj opatiji, čiji je veći dio nažalost uništen u mletačkim osvajanjima. Njezini bizantski mozaici zbog iznimne ljepote preneseni su čak i u samu Veneciju, dok danas njezina gola ljepota odiše mirom.'
  },
  {
    name: 'Katedrala Uznesenja Blažene Djevice Marije', city: 'Pula', lat: 44.8715, lng: 13.8436,
    description: 'Ranokršćanska katedrala podignuta na ostacima drevnog rimskog Jupiterovog hrama, smještena blizu pulske rive. Više puta je proširivana. U njenoj je blizini izdvojen impresivni zvonik izgrađen uporabom kamenih blokova koji su zapravo ukradeni iz Amfiteatra u 17. stoljeću.'
  },
  {
    name: 'Mornaričko groblje', city: 'Pula', lat: 44.8570, lng: 13.8340,
    description: 'Jedno od najvećih austrougarskih groblja u Europi smješteno u predivnoj borovoj šumi. Na njemu počivaju brojni admirali ratne mornarice te žrtve velike pomorske havarije broda Baron Gautsch. Prošećite među predivnim, očuvanim starim nadgrobnim spomenicima koji odišu nevjerojatnom arhitekturom.'
  },
  {
    name: 'Svetište Majke Božje od Milosti (Šijana)', city: 'Pula', lat: 44.8778, lng: 13.8640,
    description: 'Jedno od najstarijih Marijanskih svetišta u jugoistočnoj Europi. Ovo staro franjevačko odredište na ulazu u grad krije impresivnu zbirku crkvenih predmeta, a hodočasnici mu stoljećima gravitiraju zbog mirnog ambijenta i legende o raznim čudotvornim iscjeljenjima.'
  },
  {
    name: 'Svjetleći divovi', city: 'Pula', lat: 44.8741, lng: 13.8398,
    description: 'Fascinantan spoj teške brodograđevne industrije i moderne suvremene umjetnosti za SEO isticanje noćnog života. Poznati umjetnik rasvjete Dean Skira osvijetlio je ogromne lučke dizalice Uljanika tisućama pametnih LED svjetala te svake noći na nebu stvaraju nevjerojatne vizualne svjetlosne spektakle.'
  },
  {
    name: 'Austrougarske utvrde Pule (Sustav Bourguignon)', city: 'Pula', lat: 44.8510, lng: 13.8260,
    description: 'Snažan prsten obrane koji čini niz kružnih kamenih tvrđava razbacanih širom obale zbog nekadašnje uloge Pule kao glavne ratne pomorske baze Austro-Ugarske monarhije. Tvrđava Bourguignon i Punta Christo najbolji su očuvani primjeri vojne arhitekture s kraja 19. stoljeća.'
  },
  {
    name: 'Mornarička crkva Gospe od Mora', city: 'Pula', lat: 44.8596, lng: 13.8428,
    description: 'Raskošna crkva iz 1898. godine izgrađena u pseudobizantskom i neoromaničkom stilu namijenjena časnicima austro-ugarske vojske. Crkva je impresivne unutrašnjosti od najkvalitetnijeg obojenog mramora koji je brodovima prenesen s brojnih Mediteranskih otoka i iz Alpa.'
  },
  {
    name: 'Zgrada Tržnice (Mercato)', city: 'Pula', lat: 44.8682, lng: 13.8495,
    description: 'Prelijepo, funkcionalno zdanje pulske zelene tržnice iz 1903. godine izgrađeno primjenom željeza, čelika i stakla pod utjecajem bečke secesije. Zgrada se savršeno uklopila u staro gradsko tkivo, a u njezinom prizemlju svakog jutra vrvi svježom, fantastičnom istarskom gastro ponudom.'
  },
  {
    name: 'Zerostrasse (Tuneli pod Pulom)', city: 'Pula', lat: 44.8711, lng: 13.8462,
    description: 'Kompleks mračnih, dugačkih tunela koji se protežu kilometrima točno ispod gradskog središta Kaštela. Sustav je izgradila austrijska vojska za skrivanje streljiva i sigurnost od zračnih napada u slučaju opasnosti. Danas ti fascinantni hladni tuneli služe za kulturna okupljanja te umjetničke podzemne izložbe.'
  },
  {
    name: 'Palača obitelji Smareglia', city: 'Pula', lat: 44.8698, lng: 13.8430,
    description: 'Stara gradska rodna kuća poznatog istarskog skladatelja Antonija Smareglie. Smještena blizu Foruma, krasi je kasnogotički portal te prozor u kojem se danas unutar spomen sobe čuvaju uspomene na velika operna djela ovog skladatelja koji je osvojio europske kulturne krugove u 19. st.'
  },
  {
    name: 'Agripinina kuća', city: 'Pula', lat: 44.8700, lng: 13.8437,
    description: 'Zanimljiv arheološki park nedaleko Foruma gdje se može vidjeti ostatke rimske patricijske kuće posvećene Juliji Agripini, nećakinji, supruzi i majci rimskih careva. Prekrasno je utkana u modernu urbanu gradnju, svjedočeći slojevitosti arhitekture koja pokriva antički život Pule.'
  }
];

async function run() {
  console.log("Authenticating as admin...");
  await pb.admins.authWithPassword('admin@croatiabest.hr', 'admin123456');

  console.log("Fetching a user for ownerId...");
  const users = await pb.collection('users').getFullList({ requestKey: null, limit: 1 });
  const ownerId = users.length > 0 ? users[0].id : '';

  console.log("Seeding monuments...");
  for (const monument of MONUMENTS) {
    try {
      const data = {
        name: monument.name,
        locationCategoryId: 'landmarks',
        categoryId: 'landmarks', // in case both are used
        city: monument.city,
        latitude: monument.lat,
        longitude: monument.lng,
        description: monument.description,
        status: 'active',
        ownerId: ownerId,
        photoUrls: ['https://picsum.photos/seed/' + monument.name.replace(/\s+/g, '') + '/800/600'],
      };
      
      await pb.collection('listings').create(data);
      console.log(`Created monument: ${monument.name} in ${monument.city}`);
    } catch (e) {
      console.log(`Error creating monument ${monument.name}:`, e.response?.data || e.message);
    }
  }

  console.log("Done!");
}

run().catch(console.error);
