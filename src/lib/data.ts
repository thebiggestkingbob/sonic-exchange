export type Role = "visitor" | "artist" | "brand" | "venue";
export const navigation = [
  ["SONIC NOW", "/sonic-now"],
  ["INDEX", "/index"],
  ["ARTISTS", "/artists"],
  ["BRANDS", "/brands"],
  ["VENUES", "/venues"],
  ["DISTRIBUTION", "/distribution"],
  ["FACTS SHOW", "/facts-show"],
] as const;
export type Artist = {
  id: string;
  name: string;
  genre: string;
  city: string;
  score: number;
  change: number;
  audience: number;
  track: string;
  image: string;
  bio: string;
};
export const artists: Artist[] = [
  {
    id: "amara",
    name: "Amara Sol",
    genre: "Afro Soul",
    city: "Johannesburg",
    score: 98.4,
    change: 12.8,
    audience: 184000,
    track: "Between the Light",
    image: "/images/artist-1.jpg",
    bio: "A warm, expansive voice finding new ground between soul, jazz and the rhythms of home.",
  },
  {
    id: "kabelo",
    name: "Kabelo West",
    genre: "Amapiano",
    city: "Pretoria",
    score: 96.2,
    change: 18.6,
    audience: 245000,
    track: "After Hours",
    image: "/images/artist-2.jpg",
    bio: "Deep grooves and unhurried melodies from the next generation of Pretoria producers.",
  },
  {
    id: "lindi",
    name: "Lindi M",
    genre: "R&B",
    city: "Cape Town",
    score: 94.7,
    change: 8.4,
    audience: 126000,
    track: "Soft Landing",
    image: "/images/artist-3.jpg",
    bio: "Intimate stories and layered harmonies, written by the ocean and made for late nights.",
  },
  {
    id: "nalu",
    name: "Nalu",
    genre: "Afro House",
    city: "Durban",
    score: 93.1,
    change: 24.2,
    audience: 98000,
    track: "Open Water",
    image: "/images/artist-4.jpg",
    bio: "A Durban electronic project connecting coastal textures with global dance floors.",
  },
  {
    id: "sello",
    name: "Sello & The City",
    genre: "Jazz",
    city: "Johannesburg",
    score: 91.8,
    change: 6.3,
    audience: 87000,
    track: "Sunday in Braam",
    image: "/images/artist-2.jpg",
    bio: "An independent collective putting Johannesburg jazz in conversation with the present.",
  },
  {
    id: "zola",
    name: "Zola Ray",
    genre: "Hip Hop",
    city: "Cape Town",
    score: 90.3,
    change: -2.1,
    audience: 154000,
    track: "On My Way",
    image: "/images/artist-3.jpg",
    bio: "Observational verses and independent spirit from the Mother City.",
  },
  {
    id: "echo",
    name: "Echo District",
    genre: "Electronic",
    city: "Durban",
    score: 88.9,
    change: 9.1,
    audience: 64000,
    track: "Slow Motion",
    image: "/images/artist-4.jpg",
    bio: "Analog textures, broken beats and music for the spaces in between.",
  },
  {
    id: "thandi",
    name: "Thandi Blue",
    genre: "Afro Soul",
    city: "Pretoria",
    score: 87.5,
    change: 4.8,
    audience: 52000,
    track: "Coming Home",
    image: "/images/artist-1.jpg",
    bio: "Honest songwriting grounded in South African soul.",
  },
  {
    id: "milo",
    name: "Milo North",
    genre: "R&B",
    city: "Johannesburg",
    score: 85.4,
    change: 3.2,
    audience: 43000,
    track: "Stay Awhile",
    image: "/images/artist-2.jpg",
    bio: "Minimal production meets a restless curiosity for melody.",
  },
  {
    id: "nomsa",
    name: "Nomsa",
    genre: "Jazz",
    city: "Cape Town",
    score: 84.1,
    change: 7.9,
    audience: 38000,
    track: "First Light",
    image: "/images/artist-3.jpg",
    bio: "Piano-led songs and stories of belonging.",
  },
  {
    id: "tempo",
    name: "Tempo Theory",
    genre: "Amapiano",
    city: "Pretoria",
    score: 82.6,
    change: 11.4,
    audience: 71000,
    track: "Outside",
    image: "/images/artist-4.jpg",
    bio: "Rhythm experiments from an independent Pretoria production duo.",
  },
  {
    id: "leo",
    name: "Leo June",
    genre: "Hip Hop",
    city: "Durban",
    score: 80.2,
    change: -1.4,
    audience: 46000,
    track: "New Ground",
    image: "/images/artist-1.jpg",
    bio: "Reflective writing and warm, sample-driven production.",
  },
];
export const genres = [...new Set(artists.map((a) => a.genre))];
export const venues = [
  {
    id: "orbit",
    name: "The Listening Room",
    city: "Johannesburg",
    capacity: 350,
    style: "An intimate room. A powerful connection.",
    image: "/images/studio.jpg",
  },
  {
    id: "shore",
    name: "Shoreline Sessions",
    city: "Cape Town",
    capacity: 600,
    style: "An open stage on the Atlantic coast.",
    image: "/images/crowd.jpg",
  },
  {
    id: "warehouse",
    name: "Warehouse 031",
    city: "Durban",
    capacity: 1000,
    style: "Built for the next wave of live music.",
    image: "/images/studio.jpg",
  },
];
export const episodes = [
  {
    id: "01",
    title: "What does independence really pay?",
    guest: "Amara Sol",
    category: "Artist economics",
    description:
      "An honest conversation about ownership, the cost of a release and building a sustainable music career.",
    duration: 32,
    image: "/images/artist-1.jpg",
  },
  {
    id: "02",
    title: "Behind the split sheet",
    guest: "Kabelo West",
    category: "Rights & royalties",
    description:
      "From the studio to the statement: making sense of credits, splits and getting paid.",
    duration: 28,
    image: "/images/studio.jpg",
  },
  {
    id: "03",
    title: "A room full of possibility",
    guest: "The Listening Room",
    category: "Live culture",
    description:
      "The people building a new circuit for independent music, one room at a time.",
    duration: 24,
    image: "/images/crowd.jpg",
  },
];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(cents / 100);
export const compact = (n: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
