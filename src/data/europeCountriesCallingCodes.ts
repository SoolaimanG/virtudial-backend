import { ICountryCallingCode } from "./../types";

export const europeCountries: ICountryCallingCode[] = [
  {
    country: {
      name: "Germany",
      price: "0.15",
      callingCode: "+49",
      phoneNumberLength: 11,
      states: {
        Bavaria: { callingCode: "+4989", phoneNumberLength: 11 },
        Berlin: { callingCode: "+4930", phoneNumberLength: 11 },
        Hesse: { callingCode: "+4969", phoneNumberLength: 11 },
      },
    },
  },
  {
    country: {
      name: "France",
      price: "0.18",
      callingCode: "+33",
      phoneNumberLength: 11,
      states: {
        "Île-de-France": { callingCode: "+331", phoneNumberLength: 11 },
        "Provence-Alpes-Côte-d'Azur": {
          callingCode: "+334",
          phoneNumberLength: 11,
        },
        "Nouvelle-Aquitaine": { callingCode: "+335", phoneNumberLength: 11 },
      },
    },
  },
  {
    country: {
      name: "United-Kingdom",
      price: "0.20",
      callingCode: "+44",
      phoneNumberLength: 10,
      states: {
        England: { callingCode: "+4420", phoneNumberLength: 10 },
        Scotland: { callingCode: "+44131", phoneNumberLength: 10 },
        Wales: { callingCode: "+4429", phoneNumberLength: 10 },
        "Northern-Ireland": { callingCode: "+4428", phoneNumberLength: 10 },
      },
    },
  },
  {
    country: {
      name: "Italy",
      price: "0.15",
      callingCode: "+39",
      phoneNumberLength: 11,
      states: {
        Lazio: { callingCode: "+3906", phoneNumberLength: 11 },
        Lombardy: { callingCode: "+3902", phoneNumberLength: 11 },
        Tuscany: { callingCode: "+39055", phoneNumberLength: 11 },
      },
    },
  },
  {
    country: {
      name: "Spain",
      price: "0.18",
      callingCode: "+34",
      phoneNumberLength: 11,
      states: {
        Madrid: { callingCode: "+3491", phoneNumberLength: 11 },
        Catalonia: { callingCode: "+3493", phoneNumberLength: 11 },
        Andalusia: { callingCode: "+3495", phoneNumberLength: 11 },
      },
    },
  },
  {
    country: {
      name: "Netherlands",
      price: "0.17",
      callingCode: "+31",
      phoneNumberLength: 10,
      states: {
        "North Holland": { callingCode: "+3120", phoneNumberLength: 10 },
        "South Holland": { callingCode: "+3110", phoneNumberLength: 10 },
        Utrecht: { callingCode: "+3130", phoneNumberLength: 10 },
      },
    },
  },
  {
    country: {
      name: "Belgium",
      price: "0.16",
      callingCode: "+32",
      phoneNumberLength: 9,
      states: {
        Brussels: { callingCode: "+322", phoneNumberLength: 9 },
        Antwerp: { callingCode: "+323", phoneNumberLength: 9 },
        Flanders: { callingCode: "+324", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Switzerland",
      price: "0.22",
      callingCode: "+41",
      phoneNumberLength: 9,
      states: {
        Zurich: { callingCode: "+4144", phoneNumberLength: 9 },
        Geneva: { callingCode: "+4122", phoneNumberLength: 9 },
        Basel: { callingCode: "+4161", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Austria",
      price: "0.19",
      callingCode: "+43",
      phoneNumberLength: 10,
      states: {
        Vienna: { callingCode: "+431", phoneNumberLength: 10 },
        Salzburg: { callingCode: "+43662", phoneNumberLength: 10 },
        Graz: { callingCode: "+43316", phoneNumberLength: 10 },
      },
    },
  },
  {
    country: {
      name: "Sweden",
      price: "0.18",
      callingCode: "+46",
      phoneNumberLength: 9,
      states: {
        Stockholm: { callingCode: "+468", phoneNumberLength: 9 },
        Gothenburg: { callingCode: "+4631", phoneNumberLength: 9 },
        Malmö: { callingCode: "+4640", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Norway",
      price: "0.21",
      callingCode: "+47",
      phoneNumberLength: 8,
      states: {
        Oslo: { callingCode: "+4721", phoneNumberLength: 8 },
        Bergen: { callingCode: "+4755", phoneNumberLength: 8 },
        Trondheim: { callingCode: "+4773", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Denmark",
      price: "0.17",
      callingCode: "+45",
      phoneNumberLength: 8,
      states: {
        Copenhagen: { callingCode: "+4532", phoneNumberLength: 8 },
        Aarhus: { callingCode: "+4586", phoneNumberLength: 8 },
        Odense: { callingCode: "+4565", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Finland",
      price: "0.19",
      callingCode: "+358",
      phoneNumberLength: 10,
      states: {
        Helsinki: { callingCode: "+3589", phoneNumberLength: 10 },
        Espoo: { callingCode: "+3589", phoneNumberLength: 10 },
        Tampere: { callingCode: "+3583", phoneNumberLength: 10 },
      },
    },
  },
  {
    country: {
      name: "Ireland",
      price: "0.20",
      callingCode: "+353",
      phoneNumberLength: 9,
      states: {
        Dublin: { callingCode: "+3531", phoneNumberLength: 9 },
        Cork: { callingCode: "+35321", phoneNumberLength: 9 },
        Galway: { callingCode: "+35391", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Portugal",
      price: "0.18",
      callingCode: "+351",
      phoneNumberLength: 9,
      states: {
        Lisbon: { callingCode: "+35121", phoneNumberLength: 9 },
        Porto: { callingCode: "+35122", phoneNumberLength: 9 },
        Braga: { callingCode: "+351253", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Greece",
      price: "0.22",
      callingCode: "+30",
      phoneNumberLength: 10,
      states: {
        Athens: { callingCode: "+30210", phoneNumberLength: 10 },
        Thessaloniki: { callingCode: "+30231", phoneNumberLength: 10 },
        Patras: { callingCode: "+30261", phoneNumberLength: 10 },
      },
    },
  },
  {
    country: {
      name: "Poland",
      price: "0.17",
      callingCode: "+48",
      phoneNumberLength: 9,
      states: {
        Warsaw: { callingCode: "+4822", phoneNumberLength: 9 },
        Kraków: { callingCode: "+4812", phoneNumberLength: 9 },
        Łódź: { callingCode: "+4842", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Czech-Republic",
      price: "0.16",
      callingCode: "+420",
      phoneNumberLength: 9,
      states: {
        Prague: { callingCode: "+4202", phoneNumberLength: 9 },
        Brno: { callingCode: "+4205", phoneNumberLength: 9 },
        Ostrava: { callingCode: "+42059", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Hungary",
      price: "0.18",
      callingCode: "+36",
      phoneNumberLength: 9,
      states: {
        Budapest: { callingCode: "+361", phoneNumberLength: 9 },
        Debrecen: { callingCode: "+3652", phoneNumberLength: 9 },
        Szeged: { callingCode: "+3662", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Romania",
      price: "0.20",
      callingCode: "+40",
      phoneNumberLength: 10,
      states: {
        Bucharest: { callingCode: "+4021", phoneNumberLength: 10 },
        "Cluj-Napoca": { callingCode: "+40264", phoneNumberLength: 10 },
        Timișoara: { callingCode: "+40256", phoneNumberLength: 10 },
      },
    },
  },
  {
    country: {
      name: "Bulgaria",
      price: "0.19",
      callingCode: "+359",
      phoneNumberLength: 9,
      states: {
        Sofia: { callingCode: "+3592", phoneNumberLength: 9 },
        Plovdiv: { callingCode: "+35932", phoneNumberLength: 9 },
        Varna: { callingCode: "+35952", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Slovakia",
      price: "0.18",
      callingCode: "+421",
      phoneNumberLength: 9,
      states: {
        Bratislava: { callingCode: "+4212", phoneNumberLength: 9 },
        Košice: { callingCode: "+42155", phoneNumberLength: 9 },
        Prešov: { callingCode: "+42151", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Croatia",
      price: "0.20",
      callingCode: "+385",
      phoneNumberLength: 9,
      states: {
        Zagreb: { callingCode: "+3851", phoneNumberLength: 9 },
        Split: { callingCode: "+38521", phoneNumberLength: 9 },
        Rijeka: { callingCode: "+38551", phoneNumberLength: 9 },
      },
    },
  },
  {
    country: {
      name: "Slovenia",
      price: "0.19",
      callingCode: "+386",
      phoneNumberLength: 8,
      states: {
        Ljubljana: { callingCode: "+3861", phoneNumberLength: 8 },
        Maribor: { callingCode: "+3862", phoneNumberLength: 8 },
        Celje: { callingCode: "+3863", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Lithuania",
      price: "0.17",
      callingCode: "+370",
      phoneNumberLength: 8,
      states: {
        Vilnius: { callingCode: "+3705", phoneNumberLength: 8 },
        Kaunas: { callingCode: "+37037", phoneNumberLength: 8 },
        Klaipėda: { callingCode: "+37046", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Latvia",
      price: "0.18",
      callingCode: "+371",
      phoneNumberLength: 8,
      states: {
        Riga: { callingCode: "+3716", phoneNumberLength: 8 },
        Daugavpils: { callingCode: "+37154", phoneNumberLength: 8 },
        Liepāja: { callingCode: "+37134", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Estonia",
      price: "0.19",
      callingCode: "+372",
      phoneNumberLength: 8,
      states: {
        Tallinn: { callingCode: "+3726", phoneNumberLength: 8 },
        Tartu: { callingCode: "+3727", phoneNumberLength: 8 },
        Narva: { callingCode: "+37235", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Luxembourg",
      price: "0.22",
      callingCode: "+352",
      phoneNumberLength: 6,
      states: {
        "Luxembourg-City": { callingCode: "+35222", phoneNumberLength: 6 },
        "Esch-sur-Alzette": { callingCode: "+35254", phoneNumberLength: 6 },
        Differdange: { callingCode: "+35258", phoneNumberLength: 6 },
      },
    },
  },
  {
    country: {
      name: "Malta",
      price: "0.20",
      callingCode: "+356",
      phoneNumberLength: 8,
      states: {
        Valletta: { callingCode: "+35621", phoneNumberLength: 8 },
        Sliema: { callingCode: "+35627", phoneNumberLength: 8 },
        Birkirkara: { callingCode: "+35623", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Cyprus",
      price: "0.21",
      callingCode: "+357",
      phoneNumberLength: 8,
      states: {
        Nicosia: { callingCode: "+35722", phoneNumberLength: 8 },
        Limassol: { callingCode: "+35725", phoneNumberLength: 8 },
        Larnaca: { callingCode: "+35724", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Iceland",
      price: "0.23",
      callingCode: "+354",
      phoneNumberLength: 7,
      states: {
        Reykjavík: { callingCode: "+3545", phoneNumberLength: 7 },
        Akureyri: { callingCode: "+35446", phoneNumberLength: 7 },
        Keflavík: { callingCode: "+35442", phoneNumberLength: 7 },
      },
    },
  },
  {
    country: {
      name: "Serbia",
      price: "0.22",
      callingCode: "+381",
      phoneNumberLength: 9,
      states: {
        Belgrade: { callingCode: "+38111", phoneNumberLength: 9 },
        "Novi-Sad": { callingCode: "+38121", phoneNumberLength: 9 },
        Niš: { callingCode: "+38118", phoneNumberLength: 9 },
      },
    },
  },
  {
    //
    country: {
      name: "Bosnia-and-Herzegovina",
      price: "0.20",
      callingCode: "+387",
      phoneNumberLength: 8,
      states: {
        Sarajevo: { callingCode: "+38733", phoneNumberLength: 8 },
        "Banja-Luka": { callingCode: "+38751", phoneNumberLength: 8 },
        Mostar: { callingCode: "+38736", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Albania",
      price: "0.21",
      callingCode: "+355",
      phoneNumberLength: 8,
      states: {
        Tirana: { callingCode: "+3554", phoneNumberLength: 8 },
        Durrës: { callingCode: "+35552", phoneNumberLength: 8 },
        Vlorë: { callingCode: "+35533", phoneNumberLength: 8 },
      },
    },
  },
  {
    country: {
      name: "Montenegro",
      price: "0.22",
      callingCode: "+382",
      phoneNumberLength: 8,
      states: {
        Podgorica: { callingCode: "+38220", phoneNumberLength: 8 },
        Nikšić: { callingCode: "+38252", phoneNumberLength: 8 },
        "Herceg-Novi": { callingCode: "+38231", phoneNumberLength: 8 },
      },
    },
  },
];
