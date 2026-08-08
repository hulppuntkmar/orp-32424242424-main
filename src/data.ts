import { License, Aircraft, TrainingCourse, IssuedLicense } from "./types";

export const LICENSES: License[] = [
  {
    id: "helicopter",
    name: "Helikopter Brevet",
    type: "helicopter",
    price: 250000,
    description: "Beheers de kunst van het helikoptervliegen over Oranjestad. Uw ticket naar ultieme mobiliteit en landing op de meest exclusieve helipads.",
    category: "Helikopter",
    difficulty: "Gemiddeld",
    requirements: [],
    specs: {
      duration: "",
      hoursRequired: 0,
      maxAltitude: ""
    }
  },
  {
    id: "small-plane",
    name: "Vliegtuig Klein Brevet",
    type: "small-plane",
    price: 500000,
    description: "Leer vliegen in eenmotorige sportvliegtuigen zoals de Cessna 172 of Cirrus SR22. Uitermate geschikt voor privévluchten en verkenningstochten.",
    category: "Vliegtuig Klein",
    difficulty: "Beginner",
    requirements: [],
    specs: {
      duration: "",
      hoursRequired: 0,
      maxAltitude: ""
    }
  },
  {
    id: "large-plane",
    name: "Vliegtuig Groot Brevet",
    type: "large-plane",
    price: 750000,
    description: "Het ultieme brevet voor de zware luchtvaart. Word gezagvoerder op legendarische meermotorige straalvliegtuigen en commerciële liners.",
    category: "Vliegtuig Groot",
    difficulty: "Gevorderd",
    requirements: [],
    specs: {
      duration: "",
      hoursRequired: 0,
      maxAltitude: ""
    }
  }
];

export const AIRCRAFT_LIST: Aircraft[] = [
  {
    id: "cessna-172",
    name: "Cessna 172S Skyhawk",
    type: "small-plane",
    manufacturer: "Cessna Aircraft",
    basePrice: 380000,
    topSpeedKnots: 124,
    rangeKm: 1185,
    engineType: "Lycoming IO-360-L2A (180 PK)",
    capacity: 4,
    description: "Het meest succesvolle en betrouwbare sportvliegtuig ter wereld. Uitgerust met een moderne Garmin G1000 NXi glazen cockpit, uitstekend voor lessen en cross-country vluchten.",
    imageTheme: "linear-gradient(135deg, #38bdf8, #0369a1)"
  },
  {
    id: "cirrus-sr22",
    name: "Cirrus SR22T GTS",
    type: "small-plane",
    manufacturer: "Cirrus Aircraft",
    basePrice: 850000,
    topSpeedKnots: 213,
    rangeKm: 1943,
    engineType: "Continental TSIO-550-K (315 PK Turbo)",
    capacity: 5,
    description: "De belichaming van luxe en veiligheid. Voorzien van het beroemde CAPS parachutesysteem voor het hele vliegtuig en geavanceerde airconditioning - perfect voor het vliegen boven Oranjestad.",
    imageTheme: "linear-gradient(135deg, #10b981, #047857)"
  },
  {
    id: "robinson-r44",
    name: "Robinson R44 Raven II",
    type: "helicopter",
    manufacturer: "Robinson Helicopter Company",
    basePrice: 510000,
    topSpeedKnots: 110,
    rangeKm: 560,
    engineType: "Lycoming IO-540-AE1A5 (245 PK)",
    capacity: 4,
    description: "Een uiterst efficiënte en breed ingezette lichte helikopter. Biedt uitstekend panorama-zicht door de grote ramen en beschikt over een betrouwbare zuigermotor.",
    imageTheme: "linear-gradient(135deg, #f59e0b, #b45309)"
  },
  {
    id: "airbus-h135",
    name: "Airbus Helicopters H135",
    type: "helicopter",
    manufacturer: "Airbus Helicopters",
    basePrice: 3100000,
    topSpeedKnots: 137,
    rangeKm: 635,
    engineType: "2x Pratt & Whitney PW206B3 (Turbine)",
    capacity: 7,
    description: "De gouden standaard voor VIP transport, traumahelikopters en geavanceerde training. Biedt extreem lage geluidsniveaus dankzij de Fenestron gehulsde staartrotor.",
    imageTheme: "linear-gradient(135deg, #ec4899, #be185d)"
  },
  {
    id: "embraer-phenom",
    name: "Embraer Phenom 100EV",
    type: "large-plane",
    manufacturer: "Embraer",
    basePrice: 4850000,
    topSpeedKnots: 406,
    rangeKm: 2182,
    engineType: "2x Pratt & Whitney PW617F1-E (Turbofan)",
    capacity: 6,
    description: "Een verbluffend elegante en snelle lichte zakenjet. Vlieg in ultiem comfort op straalaandrijving met een ruime cabine ontworpen door BMW Designworks.",
    imageTheme: "linear-gradient(135deg, #6366f1, #4338ca)"
  }
];

export const COURSES: TrainingCourse[] = [
  {
    id: "rt-radio",
    title: "Radiotelefonie (VFR & IFR)",
    instructor: "Kapt. Henk van der Meer",
    description: "Leer foutloos communiceren met luchtverkeersleidingen (ATC) in het Engels en Nederlands volgens officiële ICAO spelling en standaarden. Essentieel voor veilig en gecontroleerd vliegen.",
    durationWeeks: 4,
    price: 450,
    topics: ["ICAO alfabet & standaardzinnen", "Noodprocedures & Mayday", "ATC klaringen interpreteren", "Luchtruim classificaties"],
    rating: 4.9
  },
  {
    id: "meteo-carib",
    title: "Tropische Meteorologie",
    instructor: "Dr. Evelyn Croes",
    description: "Begrijp windpatronen, passaatwinden, tropische stormsystemen en de unieke aerodynamische effecten in Oranjestad. Cruciaal voor veilige vluchten rondom Oranjestad.",
    durationWeeks: 3,
    price: 380,
    topics: ["Wolkenherkenning & Beaufort", "Passaatwinden & thermiek", "Microbursts & windschering", "Decoderen van METAR & TAF"],
    rating: 4.8
  },
  {
    id: "glass-cockpit",
    title: "Garmin G1000 Transitie",
    instructor: "Instructeur Ryan Peterson",
    description: "Stap over van analoge klokken naar de modernste 'glass cockpit'. Beheers de Primary Flight Display (PFD) en Multi-Function Display (MFD) inclusief autopiloot integraties.",
    durationWeeks: 5,
    price: 950,
    topics: ["Synthetisch zicht navigatie", "Vluchtplannen programmeren", "Motor management pagina's", "Systeemstoringen simuleren"],
    rating: 5.0
  }
];

export const DEFAULT_ISSUED_LICENSES: IssuedLicense[] = [
  {
    citizenName: "Martin Vasilyev",
    id: "lic-6625",
    taxPaid: true,
    managementFeePaid: true,
    issuedBy: "Mike",
    issueDate: "6-6-2026",
    licenseType: "large-plane",
    employeeCommissionPaid: true,
    citizenId: "BSN-85145495"
  },
  {
    citizenId: "BSN-86551022",
    employeeCommissionPaid: false,
    licenseType: "helicopter",
    issueDate: "4-6-2026",
    issuedBy: "Military_Touch",
    managementFeePaid: false,
    remarks: "Cursist is geslaagd",
    taxPaid: false,
    id: "lic-3965",
    citizenName: "Dwayne The Rock"
  },
  {
    taxPaid: false,
    remarks: "Mooie landing na de tip die ik heb gegeven. Kan goed vliegen.",
    id: "lic-3999",
    citizenName: "Ian Foster",
    citizenId: "BSN-51213775",
    licenseType: "large-plane",
    employeeCommissionPaid: true,
    issueDate: "3-6-2026",
    issuedBy: "Yahro",
    managementFeePaid: false
  },
  {
    citizenName: "Jason White",
    taxPaid: false,
    remarks: "Cursist is geslaagd",
    id: "lic-2022",
    issueDate: "3-6-2026",
    managementFeePaid: false,
    issuedBy: "Military_Touch",
    citizenId: "BSN-81463127",
    employeeCommissionPaid: true,
    licenseType: "helicopter"
  },
  {
    issueDate: "3-6-2026",
    issuedBy: "Military_Touch",
    managementFeePaid: false,
    citizenId: "BSN-10849091",
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenName: "Joey Winkelwagen",
    remarks: "cursist is geslaagd",
    taxPaid: false,
    id: "lic-7625"
  },
  {
    citizenName: "Milan de kok",
    remarks: "Cursist is geslaagd",
    taxPaid: false,
    id: "lic-4015",
    issueDate: "3-6-2026",
    issuedBy: "Military_Touch",
    managementFeePaid: false,
    citizenId: "BSN-75683537",
    employeeCommissionPaid: true,
    licenseType: "helicopter"
  },
  {
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenId: "BSN-58684993",
    issuedBy: "Military_Touch",
    managementFeePaid: false,
    issueDate: "3-6-2026",
    id: "lic-3788",
    remarks: "Cursist is geslaagd",
    taxPaid: false,
    citizenName: "Bennie Wies"
  },
  {
    citizenName: "Zoe Cuore",
    id: "lic-3930",
    remarks: "Cursist is geslaagd",
    taxPaid: false,
    issuedBy: "Military_Touch",
    managementFeePaid: true,
    issueDate: "2-6-2026",
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenId: "BSN- 92681628"
  },
  {
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenId: "BSN-62608820",
    managementFeePaid: true,
    issuedBy: "Military_Touch",
    issueDate: "1-6-2026",
    id: "lic-3207",
    taxPaid: false,
    remarks: "cursist is geslaagd",
    citizenName: "Bryan Mehewez"
  },
  {
    citizenId: "BSN-91931636",
    employeeCommissionPaid: true,
    licenseType: "large-plane",
    issueDate: "1-6-2026",
    issuedBy: "Mike",
    managementFeePaid: true,
    taxPaid: true,
    id: "lic-9565",
    citizenName: "Adam Mahmoud"
  },
  {
    licenseType: "large-plane",
    employeeCommissionPaid: true,
    citizenId: "BSN-32929852",
    managementFeePaid: true,
    issuedBy: "Mike",
    issueDate: "1-6-2026",
    id: "lic-3410",
    taxPaid: true,
    citizenName: "John Frost"
  },
  {
    issuedByDiscordId: "1087831804775514142",
    issuedBy: "Reggie G.",
    managementFeePaid: true,
    issueDate: "1-6-2026",
    licenseType: "helicopter",
    employeeCommissionPaid: false,
    citizenId: "BSN-NIL",
    citizenName: "Keano batsbak",
    id: "lic-5464",
    taxPaid: true
  },
  {
    licenseType: "helicopter",
    employeeCommissionPaid: false,
    citizenId: "BSN-NIL",
    issuedByDiscordId: "459230738798346253",
    managementFeePaid: true,
    issuedBy: "Jens",
    issueDate: "1-6-2026",
    id: "lic-7924",
    taxPaid: true,
    citizenName: "Luciano Stof"
  },
  {
    citizenName: "Adam Mahmoud",
    id: "lic-4355",
    taxPaid: true,
    managementFeePaid: true,
    issuedBy: "Mike",
    issueDate: "1-6-2026",
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenId: "BSN-NIL"
  },
  {
    taxPaid: true,
    id: "lic-7977",
    citizenName: "Carlos Bombo",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    employeeCommissionPaid: false,
    issueDate: "1-6-2026",
    issuedByDiscordId: "459230738798346253",
    issuedBy: "Jens",
    managementFeePaid: true
  },
  {
    employeeCommissionPaid: false,
    licenseType: "helicopter",
    citizenId: "BSN-90154099",
    issuedBy: "Jens",
    managementFeePaid: true,
    issuedByDiscordId: "459230738798346253",
    issueDate: "1-6-2026",
    id: "lic-4272",
    taxPaid: true,
    citizenName: "Jaya Glauco"
  },
  {
    citizenName: "Autumn Azc",
    id: "lic-4968",
    taxPaid: true,
    issuedByDiscordId: "1250892233776042128",
    issuedBy: "military_touch",
    managementFeePaid: true,
    issueDate: "1-6-2026",
    licenseType: "helicopter",
    employeeCommissionPaid: true,
    citizenId: "BSN-16849219"
  },
  {
    licenseType: "helicopter",
    employeeCommissionPaid: true,
    citizenId: "BSN-85473758",
    managementFeePaid: true,
    issuedBy: "military_touch",
    issuedByDiscordId: "1250892233776042128",
    issueDate: "1-6-2026",
    id: "lic-3390",
    taxPaid: true,
    citizenName: "Risemes Soep"
  },
  {
    issuedByDiscordId: "1250892233776042128",
    managementFeePaid: true,
    issuedBy: "military_touch",
    issueDate: "1-6-2026",
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenId: "BSN-93146354",
    citizenName: "Vito Glock",
    id: "lic-1129",
    taxPaid: true
  },
  {
    id: "lic-9503",
    taxPaid: true,
    citizenName: "Tom Beuker",
    employeeCommissionPaid: true,
    licenseType: "helicopter",
    citizenId: "BSN-53477119",
    issuedByDiscordId: "1250892233776042128",
    issuedBy: "military_touch",
    managementFeePaid: true,
    issueDate: "1-6-2026"
  }
,
  {
    id: "thread-001",
    citizenName: "Ramon Alvarez",
    citizenId: "BSN-87477415",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "4-8-2026",
    remarks: "Thread: Ramon Alvarez | Datum: 4-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-002",
    citizenName: "Mahmoed Kliko",
    citizenId: "BSN-59605617",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "3-8-2026",
    remarks: "Thread: Mahmoed Kliko | Datum: 3-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-003",
    citizenName: "Luciano Bullet",
    citizenId: "BSN-50728938",
    licenseType: "helicopter",
    issuedBy: "Gijs",
    issueDate: "3-8-2026",
    remarks: "Thread: Luciano Bullet | Datum: 3-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-004",
    citizenName: "Diego Mara",
    citizenId: "BSN-68105342",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "2-8-2026",
    remarks: "Thread: Diego Mara | Datum: 2-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-005",
    citizenName: "John Gaming",
    citizenId: "BSN-79719282",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "2-8-2026",
    remarks: "Thread: John Gaming | Datum: 2-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-006",
    citizenName: "Djanairo bosh",
    citizenId: "BSN-57638335",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "2-8-2026",
    remarks: "Thread: Djanairo bosh | Datum: 2-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-007",
    citizenName: "Benjamin Dorsselaer",
    citizenId: "BSN-47201926",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "2-8-2026",
    remarks: "Thread: Benjamin Dorsselaer | Datum: 2-8-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-008",
    citizenName: "Sjoerd Haan",
    citizenId: "BSN-16972917",
    licenseType: "helicopter",
    issuedBy: "Gijs",
    issueDate: "1-8-2026",
    remarks: "Thread: Sjoerd Haan | Datum: 1-8-2026 | Betaald factuur: 250.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-009",
    citizenName: "Bryan Jaa Tochh",
    citizenId: "BSN-48464715",
    licenseType: "helicopter",
    issuedBy: "Gijs",
    issueDate: "1-8-2026",
    remarks: "Thread: Bryan Jaa Tochh | Datum: 1-8-2026 | Betaald factuur: 250.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-010",
    citizenName: "Zeph Saint",
    citizenId: "BSN-18532589",
    licenseType: "helicopter",
    issuedBy: "Gijs",
    issueDate: "31-7-2026",
    remarks: "Thread: Zeph Saint | Datum: 31-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-011",
    citizenName: "Luna Ciao",
    citizenId: "BSN-11287862",
    licenseType: "helicopter",
    issuedBy: "Gijs",
    issueDate: "31-7-2026",
    remarks: "Thread: Luna Ciao | Datum: 31-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-012",
    citizenName: "Aetoo Don",
    citizenId: "BSN-75397319",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "26-07-2026",
    remarks: "Thread: Aetoo Don | Datum: 26-07-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-013",
    citizenName: "Renzo Defermez",
    citizenId: "BSN-69717785",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "26-07-2026",
    remarks: "Thread: Renzo Defermez | Datum: 26-07-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-014",
    citizenName: "Ben Balpen",
    citizenId: "BSN-29466357",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "26-07-2026",
    remarks: "Thread: Ben Balpen | Datum: 26-07-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-015",
    citizenName: "Lucifer Morningstar",
    citizenId: "BSN-75995618",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "22-07-2026",
    remarks: "Thread: Lucifer Morningstar | Datum: 22-07-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-016",
    citizenName: "Ryan Bombo",
    citizenId: "BSN-24942738",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "21-07-2026",
    remarks: "Thread: Ryan Bombo | Datum: 21-07-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-017",
    citizenName: "Riet Van",
    citizenId: "BSN-31103646",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "21-07-2026",
    remarks: "Thread: Riet Van | Datum: 21-07-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-018",
    citizenName: "Bodien Pookie",
    citizenId: "BSN-34945239",
    licenseType: "helicopter",
    issuedBy: "duwp",
    issueDate: "18-5-2026",
    remarks: "Thread: Bodien Pookie | Datum: 18-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-019",
    citizenName: "Opa Kogel",
    citizenId: "BSN-44472039",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "17-5-2026",
    remarks: "Thread: Opa Kogel | Datum: 17-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-020",
    citizenName: "Jona De jong",
    citizenId: "BSN-31393020",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "16-7-2026",
    remarks: "Thread: Jona De jong | Datum: 16-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-021",
    citizenName: "Boris Kruiwagen",
    citizenId: "BSN-55161462",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "14-7-2026",
    remarks: "Thread: Boris Kruiwagen | Datum: 14-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-022",
    citizenName: "Ruben Buikvet",
    citizenId: "BSN-16522038",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "14-7-2026",
    remarks: "Thread: Ruben Buikvet | Datum: 14-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-023",
    citizenName: "Super Mario",
    citizenId: "BSN-48468797",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "14-7-2026",
    remarks: "Thread: Super Mario | Datum: 14-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-024",
    citizenName: "Frans De lang",
    citizenId: "BSN-56265991",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "14-7-2026",
    remarks: "Thread: Frans De lang | Datum: 14-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-025",
    citizenName: "Yari Kever",
    citizenId: "BSN-67777835",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "12-7-2026",
    remarks: "Thread: Yari Kever | Datum: 12-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-026",
    citizenName: "Dex Bloempie",
    citizenId: "BSN-76894939",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "12-7-2026",
    remarks: "Thread: Dex Bloempie | Datum: 12-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-027",
    citizenName: "Robin Don",
    citizenId: "BSN-41311314",
    licenseType: "helicopter",
    issuedBy: "Finn",
    issueDate: "11-7-2026",
    remarks: "Thread: Robin Don | Datum: 11-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-028",
    citizenName: "Jef Deslipper",
    citizenId: "BSN-26278929",
    licenseType: "helicopter",
    issuedBy: "Robin",
    issueDate: "12-7-2026",
    remarks: "Thread: Jef Deslipper | Datum: 12-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-029",
    citizenName: "Karel Master",
    citizenId: "BSN-141741414",
    licenseType: "helicopter",
    issuedBy: "Mike",
    issueDate: "3-5-2026",
    remarks: "Thread: Karel Master | Datum: 3-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-030",
    citizenName: "Shiiri Shiiri",
    citizenId: "BSN-84937575",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "8-7-2026",
    remarks: "Thread: Shiiri Shiiri | Datum: 8-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-031",
    citizenName: "Abdelhakaziz Sbe",
    citizenId: "BSN-66986723",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "7-7-2026",
    remarks: "Thread: Abdelhakaziz Sbe | Datum: 7-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-032",
    citizenName: "Dion Beun",
    citizenId: "BSN-38381831",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "4-7-2026",
    remarks: "Thread: Dion Beun | Datum: 4-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-033",
    citizenName: "Luca Kaal",
    citizenId: "BSN-58445870",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "02-07-2026",
    remarks: "Thread: Luca Kaal | Datum: 02-07-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-034",
    citizenName: "Lisa Druif",
    citizenId: "BSN-43501111",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "2-7-2026",
    remarks: "Thread: Lisa Druif | Datum: 2-7-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-035",
    citizenName: "Pacho Herrera",
    citizenId: "BSN-82739415",
    licenseType: "helicopter",
    issuedBy: "duwp",
    issueDate: "2-7-2026",
    remarks: "Thread: Pacho Herrera | Datum: 2-7-2026 | Betaald factuur: 750.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-036",
    citizenName: "Evert Baptist",
    citizenId: "BSN-86107615",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "29-5-2026",
    remarks: "Thread: Evert Baptist | Datum: 29-5-2026 | Betaald factuur: 100.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-037",
    citizenName: "Finn Spiekske",
    citizenId: "BSN-53176628",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "30-6-2026",
    remarks: "Thread: Finn Spiekske | Datum: 30-6-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-038",
    citizenName: "Mike Magic",
    citizenId: "BSN-49933279",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "30-6-2026",
    remarks: "Thread: Mike Magic | Datum: 30-6-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-039",
    citizenName: "Blam Metje",
    citizenId: "BSN-69354442",
    licenseType: "helicopter",
    issuedBy: "Reggie G.",
    issueDate: "29-6-2026",
    remarks: "Thread: Blam Metje | Datum: 29-6-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-040",
    citizenName: "Djino Aza",
    citizenId: "BSN-21977982",
    licenseType: "helicopter",
    issuedBy: "duwp",
    issueDate: "29-6-2026",
    remarks: "Thread: Djino Aza | Datum: 29-6-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-041",
    citizenName: "Bertske Pink",
    citizenId: "BSN-10391459",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "29-6-2026",
    remarks: "Thread: Bertske Pink | Datum: 29-6-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-042",
    citizenName: "Enzo Baksteen",
    citizenId: "BSN-37169129",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "29-06-2026",
    remarks: "Thread: Enzo Baksteen | Datum: 29-06-2026 | Betaald factuur: 100.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-043",
    citizenName: "Mehmet Kogel",
    citizenId: "BSN-71875688",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "28-06-2026",
    remarks: "Thread: Mehmet Kogel | Datum: 28-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-044",
    citizenName: "Sill De Wit",
    citizenId: "BSN-92681628",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "26-06-2026",
    remarks: "Thread: Sill De Wit | Datum: 26-06-2026 | Betaald factuur: 150.000 | Site bewerkt: nee",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-045",
    citizenName: "Peter Pan",
    citizenId: "BSN-49889697",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "16-6-2026",
    remarks: "Thread: Peter Pan | Datum: 16-6-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-046",
    citizenName: "Quinten Frikandel",
    citizenId: "BSN-97958020",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "22-6-2026",
    remarks: "Thread: Quinten Frikandel | Datum: 22-6-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-047",
    citizenName: "Jay Kaas",
    citizenId: "BSN-73848669",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "24-6-2026",
    remarks: "Thread: Jay Kaas | Datum: 24-6-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-048",
    citizenName: "Gert Verhulst",
    citizenId: "BSN-39256039",
    licenseType: "helicopter",
    issuedBy: "Reggie G.",
    issueDate: "13-06-2026",
    remarks: "Thread: Gert Verhulst | Datum: 13-06-2026 | Betaald factuur: 150.000 | Site bewerkt: niet gemarkeerd",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-049",
    citizenName: "Mike Bizon",
    citizenId: "BSN-47909099",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "07-06-2026",
    remarks: "Thread: Mike Bizon | Datum: 07-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-050",
    citizenName: "Dwayne The Rock",
    citizenId: "BSN-86551022",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "04-06-2026",
    remarks: "Thread: Dwayne The Rock | Datum: 04-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-051",
    citizenName: "Jason White",
    citizenId: "BSN-81463127",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "03-06-2026",
    remarks: "Thread: Jason White | Datum: 03-06-2026 | Betaald factuur: 100.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-052",
    citizenName: "Joey Winkelwagen",
    citizenId: "BSN-10849091",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "03-06-2026",
    remarks: "Thread: Joey Winkelwagen | Datum: 03-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-053",
    citizenName: "Milan de kok",
    citizenId: "BSN-75683537",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "03-06-2026",
    remarks: "Thread: Milan de kok | Datum: 03-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-054",
    citizenName: "Bennie Wies",
    citizenId: "BSN-58684993",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "03-06-2026",
    remarks: "Thread: Bennie Wies | Datum: 03-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-055",
    citizenName: "Zoe Cuore",
    citizenId: "BSN-92681628",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "02-06-2026",
    remarks: "Thread: Zoe Cuore | Datum: 02-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-056",
    citizenName: "Bryan Mehewez",
    citizenId: "BSN-62608820",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "01-06-2026",
    remarks: "Thread: Bryan Mehewez | Datum: 01-06-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-057",
    citizenName: "Tom Beuker",
    citizenId: "BSN-53477119",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "31-5-2026",
    remarks: "Thread: Tom Beuker | Datum: 31-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-058",
    citizenName: "Vito Glock",
    citizenId: "BSN-93146354",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "31-5-2026",
    remarks: "Thread: Vito Glock | Datum: 31-5-2026 | Betaald factuur: 100.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-059",
    citizenName: "Risemes Soep",
    citizenId: "BSN-85473758",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "30-5-2026",
    remarks: "Thread: Risemes Soep | Datum: 30-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-060",
    citizenName: "Jack Moon",
    citizenId: "BSN-29626160",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "30-5-2026",
    remarks: "Thread: Jack Moon | Datum: 30-5-2026 | Betaald factuur: 100.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-061",
    citizenName: "Autumn Azc",
    citizenId: "BSN-16849219",
    licenseType: "helicopter",
    issuedBy: "Military_Touch",
    issueDate: "29-5-2026",
    remarks: "Thread: Autumn Azc | Datum: 29-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-062",
    citizenName: "Jaya Glauco",
    citizenId: "BSN-90154099",
    licenseType: "helicopter",
    issuedBy: "WVK VISUALS",
    issueDate: "30-5-2026",
    remarks: "Thread: Jaya Glauco | Datum: 30-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-063",
    citizenName: "Carlos Bombo",
    citizenId: "BSN-21977982",
    licenseType: "helicopter",
    issuedBy: "WVK VISUALS",
    issueDate: "30-5-2026",
    remarks: "Thread: Carlos Bombo | Datum: 30-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-064",
    citizenName: "Adam Mahmoud",
    citizenId: "BSN-91931636",
    licenseType: "helicopter",
    issuedBy: "Mike",
    issueDate: "29-5-2026",
    remarks: "Thread: Adam Mahmoud | Datum: 29-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-065",
    citizenName: "Luciano Stof",
    citizenId: "BSN-82739415",
    licenseType: "helicopter",
    issuedBy: "WVK VISUALS",
    issueDate: "27-5-2026",
    remarks: "Thread: Luciano Stof | Datum: 27-5-2026 | Betaald factuur: 150.000 | Site bewerkt: nee",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-066",
    citizenName: "Keano batsbak",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Reggie G.",
    issueDate: "28-5-2026",
    remarks: "Thread: Keano batsbak | Datum: 28-5-2026 | Betaald factuur: 150k | Site bewerkt: nee",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-067",
    citizenName: "Nawid Afg",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Reggie G.",
    issueDate: "27-5-2026",
    remarks: "Thread: Nawid Afg | Datum: 27-5-2026 | Betaald factuur: 150.000 | Site bewerkt: nee",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-068",
    citizenName: "Jacob Van Gompel",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "20-5-2026",
    remarks: "Thread: Jacob Van Gompel | Datum: 20-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-069",
    citizenName: "Quin Gerro",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "17-5-2026",
    remarks: "Thread: Quin Gerro | Datum: 17-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-070",
    citizenName: "Pim Fortuin",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Mike",
    issueDate: "19-5-2026",
    remarks: "Thread: Pim Fortuin | Datum: 19-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-071",
    citizenName: "Jimmy Fufu",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "13-5-2026",
    remarks: "Thread: Jimmy Fufu | Datum: 13-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-072",
    citizenName: "Thijs Arend",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "sjanz",
    issueDate: "11-5-2026",
    remarks: "Thread: Thijs Arend | Datum: 11-5-2026 | Betaald factuur: 200.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-073",
    citizenName: "Jerry Lee",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "11-5-2026",
    remarks: "Thread: Jerry Lee | Datum: 11-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-074",
    citizenName: "Jayden Lee",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "10-5-2026",
    remarks: "Thread: Jayden Lee | Datum: 10-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-075",
    citizenName: "Muddy Lee",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "10-5-2026",
    remarks: "Thread: Muddy Lee | Datum: 10-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-076",
    citizenName: "Joa Lee",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "10-5-2026",
    remarks: "Thread: Joa Lee | Datum: 10-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-077",
    citizenName: "Nadir Bxois",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "10-5-2026",
    remarks: "Thread: Nadir Bxois | Datum: 10-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-078",
    citizenName: "Dex Pieter",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "9-5-2026",
    remarks: "Thread: Dex Pieter | Datum: 9-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  },
  {
    id: "thread-079",
    citizenName: "James Ramirez",
    citizenId: "BSN-NIL",
    licenseType: "helicopter",
    issuedBy: "Yahro",
    issueDate: "9-5-2026",
    remarks: "Thread: James Ramirez | Datum: 9-5-2026 | Betaald factuur: 150.000 | Site bewerkt: ja",
    taxPaid: true,
    employeeCommissionPaid: false
  }
];

export const DEFAULT_INVENTORY = [
  {
    aircraftId: "cessna-172",
    stockCount: 5,
    status: "Op voorraad" as const
  },
  {
    aircraftId: "cirrus-sr22",
    stockCount: 3,
    status: "Op voorraad" as const
  },
  {
    aircraftId: "robinson-r44",
    stockCount: 2,
    status: "Op voorraad" as const
  },
  {
    aircraftId: "airbus-h135",
    stockCount: 1,
    status: "Op voorraad" as const
  },
  {
    aircraftId: "embraer-phenom",
    stockCount: 0,
    status: "Uitverkocht" as const
  }
];

