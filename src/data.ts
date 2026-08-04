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

