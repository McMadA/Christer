import { SongCard } from './types';

// Placeholder audio for demonstration purposes
// In a real app, these would be valid Spotify Preview URLs provided by their API.
const SAMPLE_TRACKS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
];

const getPreview = (index: number) => SAMPLE_TRACKS[index % SAMPLE_TRACKS.length];

export const MOCK_DECK: SongCard[] = [
  // ==================== OPWEKKING ====================
  {
    id: '1',
    title: 'Groot is Uw trouw',
    artist: 'Opwekking 277',
    year: 1989,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(1)
  },
  {
    id: '5',
    title: 'Onze God is een machtige God',
    artist: 'Opwekking 220',
    year: 1996,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(5)
  },
  {
    id: '6',
    title: 'Abba Vader',
    artist: 'Opwekking 136',
    year: 1980,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(6)
  },
  {
    id: '20',
    title: 'Heer, U bent mijn leven',
    artist: 'Opwekking 518',
    year: 2001,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(20)
  },
  {
    id: '21',
    title: 'Vrede van God',
    artist: 'Opwekking 58',
    year: 1973,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(21)
  },
  {
    id: '22',
    title: 'Laat het feest zijn in de huizen',
    artist: 'Opwekking 503',
    year: 2000,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(22)
  },
  {
    id: '23',
    title: 'Heer, ik kom tot U',
    artist: 'Opwekking 488',
    year: 1999,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(23)
  },
  {
    id: '24',
    title: 'Doorgrond mijn hart',
    artist: 'Opwekking 599',
    year: 2006,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(24)
  },
  {
    id: '25',
    title: 'Maak ons één',
    artist: 'Opwekking 194',
    year: 1982,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(25)
  },
  {
    id: '26',
    title: 'De vreugde van U is mijn kracht',
    artist: 'Opwekking 657',
    year: 2010,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(26)
  },
  {
    id: '27',
    title: 'Kroon Hem',
    artist: 'Opwekking 533',
    year: 2003,
    category: 'Herkenning',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(27)
  },

  // ==================== SELA ====================
  {
    id: '2',
    title: 'Ik zal er zijn',
    artist: 'Sela',
    year: 2013,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(2)
  },
  {
    id: '9',
    title: 'Ik bouw op U',
    artist: 'Sela',
    year: 2010,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(9)
  },
  {
    id: '17',
    title: 'Houd vol',
    artist: 'Sela',
    year: 2021,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(17)
  },
  {
    id: '30',
    title: 'Heer wijs mij Uw weg',
    artist: 'Sela',
    year: 2008,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(30)
  },
  {
    id: '31',
    title: 'Als alles om mij heen bezwijkt',
    artist: 'Sela',
    year: 2015,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(31)
  },
  {
    id: '32',
    title: 'Genade zo oneindig groot',
    artist: 'Sela',
    year: 2005,
    category: 'Herkenning',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(32)
  },
  {
    id: '33',
    title: 'U bent de God die roept',
    artist: 'Sela',
    year: 2018,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(33)
  },

  // ==================== MODERN WORSHIP ====================
  {
    id: '3',
    title: '10.000 redenen',
    artist: 'Matt Redman / Opwekking',
    year: 2012,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(3)
  },
  {
    id: '13',
    title: 'Jezus Overwinnaar',
    artist: 'Mozaiek Worship',
    year: 2019,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(13)
  },
  {
    id: '15',
    title: 'De Rivier',
    artist: 'Brian Doerksen / Opwekking',
    year: 2005,
    category: 'Inhoud',
    difficulty: 'Geel',
    question: 'Welk lied gaat over levend water dat vanuit Gods troon stroomt?',
    spotifyPreviewUrl: getPreview(15)
  },
  {
    id: '40',
    title: 'Way Maker',
    artist: 'Leeland / Sinach',
    year: 2019,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(40)
  },
  {
    id: '41',
    title: 'Goodness of God',
    artist: 'Bethel Music',
    year: 2019,
    category: 'Herkenning',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(41)
  },
  {
    id: '42',
    title: 'Reckless Love',
    artist: 'Cory Asbury',
    year: 2017,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(42)
  },
  {
    id: '43',
    title: 'What a Beautiful Name',
    artist: 'Hillsong Worship',
    year: 2016,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(43)
  },
  {
    id: '44',
    title: 'Build My Life',
    artist: 'Housefires',
    year: 2016,
    category: 'Inhoud',
    difficulty: 'Geel',
    question: 'Welk lied bevat de zin "Worthy of every song we could ever sing"?',
    spotifyPreviewUrl: getPreview(44)
  },
  {
    id: '45',
    title: 'Oceans (Where Feet May Fail)',
    artist: 'Hillsong United',
    year: 2013,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(45)
  },

  // ==================== PSALMEN ====================
  {
    id: '7',
    title: 'Psalm 42 (Zoals een hert)',
    artist: 'Geneefse Psalmen',
    year: 1551,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(7)
  },
  {
    id: '10',
    title: 'Psalm 130 (Uit diepten van ellende)',
    artist: 'Oude Berijming',
    year: 1773,
    category: 'Basis',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(10)
  },
  {
    id: '50',
    title: 'De HEER is mijn Herder (Psalm 23)',
    artist: 'Nieuwe Berijming',
    year: 1968,
    category: 'Inhoud',
    difficulty: 'Groen',
    question: 'Op welke bekende psalm is dit lied gebaseerd?',
    spotifyPreviewUrl: getPreview(50)
  },
  {
    id: '51',
    title: 'Psalm 84 (Hoe lieflijk, hoe goed)',
    artist: 'Psalmen voor Nu',
    year: 2010,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(51)
  },
  {
    id: '52',
    title: 'Psalm 100 (Juich aarde, juich)',
    artist: 'Klassieke Berijming',
    year: 1773,
    category: 'Basis',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(52)
  },
  {
    id: '53',
    title: 'Psalm 27 (Mijn licht, mijn heil)',
    artist: 'Psalmen voor Nu',
    year: 2012,
    category: 'Herkenning',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(53)
  },
  {
    id: '54',
    title: 'Psalm 139 (Heer, U doorgrondt)',
    artist: 'Nieuwe Berijming',
    year: 1968,
    category: 'Inhoud',
    difficulty: 'Geel',
    question: 'Welke psalm gaat over Gods alwetendheid en alomtegenwoordigheid?',
    spotifyPreviewUrl: getPreview(54)
  },

  // ==================== GEZANGEN & KLASSIEK ====================
  {
    id: '4',
    title: 'U zij de glorie',
    artist: 'Edmond Budry / Händel',
    year: 1885,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(4)
  },
  {
    id: '8',
    title: 'Zo lief had God de wereld',
    artist: 'Johannes de Heer',
    year: 1905,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(8)
  },
  {
    id: '11',
    title: 'Een vaste burcht is onze God',
    artist: 'Maarten Luther',
    year: 1529,
    category: 'Basis',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(11)
  },
  {
    id: '12',
    title: 'O hoofd vol bloed en wonden',
    artist: 'Paul Gerhardt / Bach',
    year: 1656,
    category: 'Basis',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(12)
  },
  {
    id: '14',
    title: 'Lichtstad met uw paarlen poorten',
    artist: 'F.A. Sankey',
    year: 1900,
    category: 'Herkenning',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(14)
  },
  {
    id: '16',
    title: 'Wat de toekomst brengen moge',
    artist: 'Jacqueline van der Waals',
    year: 1920,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(16)
  },
  {
    id: '60',
    title: 'Welk een vriend is onze Jezus',
    artist: 'Joseph Scriven',
    year: 1868,
    category: 'Inhoud',
    difficulty: 'Geel',
    question: 'Dit lied moedigt aan om alles in gebed te brengen. Welk lied is het?',
    spotifyPreviewUrl: getPreview(60)
  },
  {
    id: '61',
    title: 'Stil maar, wacht maar',
    artist: 'Janny van den Bos',
    year: 1985,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(61)
  },
  {
    id: '62',
    title: 'Machtig God, sterke Rots',
    artist: 'Gezang / Liedboek',
    year: 1973,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(62)
  },
  {
    id: '63',
    title: 'Wij knielen voor Uw zetel neer',
    artist: 'Oude Gezangen',
    year: 1807,
    category: 'Basis',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(63)
  },
  {
    id: '64',
    title: 'Ere zij God',
    artist: 'Traditioneel (Kerst)',
    year: 1850,
    category: 'Herkenning',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(64)
  },
  {
    id: '65',
    title: 'Stille nacht, heilige nacht',
    artist: 'Joseph Mohr / Franz Gruber',
    year: 1818,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(65)
  },
  {
    id: '66',
    title: 'In de hemel is de Heer',
    artist: 'Elly & Rikkert',
    year: 1975,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(66)
  },

  // ==================== INHOUD CARDS (MORE QUESTIONS) ====================
  {
    id: '70',
    title: 'Amazing Grace',
    artist: 'John Newton',
    year: 1779,
    category: 'Inhoud',
    difficulty: 'Groen',
    question: 'Dit lied werd geschreven door een voormalige slavenhandelaar. Welk lied?',
    spotifyPreviewUrl: getPreview(70)
  },
  {
    id: '71',
    title: 'How Great Thou Art',
    artist: 'Stuart Hine',
    year: 1949,
    category: 'Inhoud',
    difficulty: 'Geel',
    question: 'Dit lied begint met de verwondering over Gods schepping. Welk lied?',
    spotifyPreviewUrl: getPreview(71)
  },
  {
    id: '72',
    title: 'Blessed Assurance',
    artist: 'Fanny Crosby',
    year: 1873,
    category: 'Inhoud',
    difficulty: 'Rood',
    question: 'Dit lied van een blinde dichteres gaat over zekerheid in Jezus. Welk lied?',
    spotifyPreviewUrl: getPreview(72)
  },

  // ==================== HERKENNING CARDS (MORE) ====================
  {
    id: '80',
    title: 'Dit is de dag',
    artist: 'Opwekking 157',
    year: 1978,
    category: 'Herkenning',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(80)
  },
  {
    id: '81',
    title: 'Veilig in Jezus armen',
    artist: 'Fanny Crosby',
    year: 1868,
    category: 'Herkenning',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(81)
  },
  {
    id: '82',
    title: 'Glorie aan God',
    artist: 'Opwekking 354',
    year: 1991,
    category: 'Herkenning',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(82)
  },

  // ==================== WILDCARDS ====================
  {
    id: 'wild1',
    title: 'JOKER: Plaats waar je wilt!',
    artist: 'Gratis Punt',
    year: 2024,
    category: 'Wildcard',
    difficulty: 'Groen',
    question: 'Deze kaart is een cadeau! Je mag hem op elke plek in de tijdlijn leggen.'
  },
  {
    id: 'wild2',
    title: 'JOKER: Vrije keuze!',
    artist: 'Bonus Kaart',
    year: 2000,
    category: 'Wildcard',
    difficulty: 'Groen',
    question: 'Wildcard! Plaats deze kaart waar je maar wilt.'
  },
  {
    id: 'wild3',
    title: 'JOKER: Genade!',
    artist: 'Extra Leven',
    year: 1990,
    category: 'Wildcard',
    difficulty: 'Groen',
    question: 'Genade kaart! Past overal in de tijdlijn.'
  }
];
