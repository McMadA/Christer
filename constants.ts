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
  {
    id: '1',
    title: 'Groot is Uw trouw',
    artist: 'Opwekking',
    year: 1989,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(1)
  },
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
    id: '3',
    title: '10.000 redenen',
    artist: 'Matt Redman / Opwekking',
    year: 2012,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(3)
  },
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
    id: '5',
    title: 'Onze God is een machtige God',
    artist: 'Opwekking',
    year: 1996,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(5)
  },
  {
    id: '6',
    title: 'Abba Vader',
    artist: 'Opwekking',
    year: 1980,
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(6)
  },
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
    id: '8',
    title: 'Zo lief had God de wereld',
    artist: 'Johannes de Heer',
    year: 1905, 
    category: 'Basis',
    difficulty: 'Geel',
    spotifyPreviewUrl: getPreview(8)
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
    id: '10',
    title: 'Psalm 130 (Uit diepten van ellende)',
    artist: 'Oude Berijming',
    year: 1773,
    category: 'Basis',
    difficulty: 'Rood',
    spotifyPreviewUrl: getPreview(10)
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
    id: '13',
    title: 'Jezus Overwinnaar',
    artist: 'Mozaiek Worship',
    year: 2019,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(13)
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
    id: '15',
    title: 'De Rivier',
    artist: 'Brian Doerksen / Opwekking',
    year: 2005,
    category: 'Inhoud',
    difficulty: 'Geel',
    question: 'Welk lied gaat over levend water?',
    spotifyPreviewUrl: getPreview(15)
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
    id: '17',
    title: 'Houd vol',
    artist: 'Sela',
    year: 2021,
    category: 'Basis',
    difficulty: 'Groen',
    spotifyPreviewUrl: getPreview(17)
  },
  {
    id: 'wild1',
    title: 'JOKER: Plaats waar je wilt!',
    artist: 'Gratis Punt',
    year: 2024, // Year is revealed after placement, acting as a new anchor
    category: 'Wildcard',
    difficulty: 'Groen',
    question: 'Deze kaart is een cadeau! Je mag hem op elke plek in de tijdlijn leggen.'
  }
];