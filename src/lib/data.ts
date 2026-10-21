export type Role = "visitor" | "artist" | "brand" | "venue";
export const navigation = [
  ["HOME", "/"],
  ["MARKETPLACE", "/marketplace"],
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
  source: string;
  imageCredit: string;
  imageSource?: string;
  songs: {
    title: string;
    credits: string;
    likes: number;
    shares: number;
    creations: number;
  }[];
};
// Real artist and song references. Every numeric metric below is a simulated fixture.
export const artists: Artist[] = [
  {
    id: "kabza",
    name: "Kabza De Small",
    genre: "Amapiano",
    city: "Pretoria",
    score: 98.4,
    change: 12.8,
    audience: 184000,
    track: "Imithandazo",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/a9/db/bd/a9dbbd62-5d23-57a4-73d3-50ea096e2bfa/ami-identity-9c13b55e614ebd5664f017e603acc4c9-2025-07-04T08-52-30.371Z_cropped.png/600x600bb.jpg",
    bio: "A South African producer and DJ at the heart of amapiano and the Scorpion Kings collaboration.",
    source: "https://en.wikipedia.org/wiki/Kabza_de_Small",
    imageCredit:
      "Artist image via Shazam / Apple Music · rights retained by original owners",
    imageSource: "https://www.shazam.com/artist/kabza-de-small/1021730955",
    songs: [
      {
        title: "Imithandazo",
        credits:
          "Kabza de Small & Mthunzi · feat. DJ Maphorisa, Sizwe Alakine, Young Stunna & Umthakathi Kush",
        likes: 18400,
        shares: 2100,
        creations: 940,
      },
      {
        title: "Sponono",
        credits: "Catalogue selection · see music search for full credits",
        likes: 10200,
        shares: 1200,
        creations: 420,
      },
    ],
  },
  {
    id: "25k",
    name: "25K",
    genre: "Hip Hop",
    city: "Pretoria",
    score: 96.2,
    change: 18.6,
    audience: 245000,
    track: "Culture Vulture",
    image: "https://i.scdn.co/image/ab6761610000e5eb65e9e7336553eab109c77aac",
    bio: "Atteridgeville rapper whose catalogue includes Culture Vulture and the album Pheli Makaveli.",
    source: "https://en.wikipedia.org/wiki/25K",
    imageCredit:
      "Artist image via Spotify · rights retained by original owners",
    imageSource: "https://open.spotify.com/artist/2mIr9ReJuFyuWJvSQ2nWM9",
    songs: [
      {
        title: "Culture Vulture",
        credits: "25K",
        likes: 20100,
        shares: 2360,
        creations: 1055,
      },
      {
        title: "Hustler’s Prayer",
        credits: "Catalogue selection · see music search for full credits",
        likes: 11150,
        shares: 1340,
        creations: 500,
      },
    ],
  },
  {
    id: "tyla",
    name: "Tyla",
    genre: "Pop / R&B",
    city: "Johannesburg",
    score: 94.7,
    change: 8.4,
    audience: 126000,
    track: "Water",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Tyla_Seethal_2022_a.png",
    bio: "Johannesburg singer-songwriter bringing pop, R&B and amapiano together. Water introduced her sound to a global audience.",
    source: "https://en.wikipedia.org/wiki/Tyla",
    imageCredit: "Capital FM Kenya · CC BY 3.0 · cropped for display",
    songs: [
      {
        title: "Water",
        credits: "Tyla",
        likes: 21800,
        shares: 2620,
        creations: 1170,
      },
      {
        title: "PUSH 2 START",
        credits: "Catalogue selection · see music search for full credits",
        likes: 12100,
        shares: 1480,
        creations: 580,
      },
    ],
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Tyla_Seethal_2022_a.png",
  },
  {
    id: "a-reece",
    name: "A-Reece",
    genre: "Hip Hop",
    city: "Pretoria",
    score: 93.1,
    change: 24.2,
    audience: 98000,
    track: "Couldn’t",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages126/v4/45/c5/91/45c5915c-61fb-3bb0-35ae-c9c5f83bbb2c/a3569f4c-5284-45cb-b2df-865a0b11e1e4_file_cropped.png/600x600bb.png",
    bio: "Pretoria rapper and songwriter whose catalogue spans Paradise and an extensive independent discography.",
    source: "https://en.wikipedia.org/wiki/A-Reece",
    imageCredit:
      "Artist image via Apple Music · rights retained by original owners",
    imageSource: "https://music.apple.com/na/artist/a-reece/914928001",
    songs: [
      {
        title: "Couldn’t",
        credits: "A-Reece · feat. Emtee",
        likes: 23500,
        shares: 2880,
        creations: 1285,
      },
      {
        title: "Meanwhile in Honeydew",
        credits: "Catalogue selection · see music search for full credits",
        likes: 13050,
        shares: 1620,
        creations: 660,
      },
    ],
  },
  {
    id: "maphorisa",
    name: "DJ Maphorisa",
    genre: "Amapiano",
    city: "Pretoria",
    score: 91.8,
    change: 6.3,
    audience: 87000,
    track: "Banyana",
    image: "https://i.scdn.co/image/ab6761610000e5eba88d4cd0766ca61511335b01",
    bio: "Soshanguve producer and DJ, also known as Madumane, and one half of Scorpion Kings with Kabza De Small.",
    source: "https://en.wikipedia.org/wiki/DJ_Maphorisa",
    imageCredit:
      "Artist image via Spotify · rights retained by original owners",
    imageSource: "https://open.spotify.com/artist/0mMqD2uqwvCjFvlzo6ayGi",
    songs: [
      {
        title: "Banyana",
        credits:
          "DJ Maphorisa & Tyler ICU · feat. Kabza De Small, Sir Trill & Daliwonga",
        likes: 25200,
        shares: 3140,
        creations: 1400,
      },
      {
        title: "Izolo",
        credits: "Catalogue selection · see music search for full credits",
        likes: 14000,
        shares: 1760,
        creations: 740,
      },
    ],
  },
  {
    id: "nasty-c",
    name: "Nasty C",
    genre: "Hip Hop",
    city: "Durban",
    score: 90.3,
    change: -2.1,
    audience: 154000,
    track: "SMA",
    image: "https://i.scdn.co/image/ab6761610000e5ebd41561009824fcd239d04352",
    bio: "Durban-raised rapper whose catalogue includes Strings and Bling and Zulu Man with Some Power.",
    source: "https://en.wikipedia.org/wiki/Nasty_C",
    imageCredit:
      "Artist image via Spotify · rights retained by original owners",
    imageSource: "https://open.spotify.com/artist/2gzWmhOZhDN6gXL49JW9qj",
    songs: [
      {
        title: "SMA",
        credits: "Nasty C · feat. Rowlene",
        likes: 26900,
        shares: 3400,
        creations: 1515,
      },
      {
        title: "Strings and Bling",
        credits: "Catalogue selection · see music search for full credits",
        likes: 14950,
        shares: 1900,
        creations: 820,
      },
    ],
  },
  {
    id: "black-coffee",
    name: "Black Coffee",
    genre: "Afro House",
    city: "Durban",
    score: 88.9,
    change: 9.1,
    audience: 64000,
    track: "Drive",
    image:
      "https://hiibiza.b-cdn.net/assets/7bd296c8-161c-4624-9ed2-442a373a689e--2026_HI_BLACK_COFFEE_WEBSITE_1920X1080px.png?aspect_ratio=1%3A1&format=webp&quality=80&width=840",
    bio: "South African DJ and producer known for a global house sound rooted in home.",
    source: "https://en.wikipedia.org/wiki/Black_Coffee_(DJ)",
    imageCredit:
      "Artist image via Hï Ibiza · rights retained by original owners",
    imageSource: "https://www.hiibiza.com/artists",
    songs: [
      {
        title: "Drive",
        credits: "Black Coffee & David Guetta · feat. Delilah Montagu",
        likes: 28600,
        shares: 3660,
        creations: 1630,
      },
      {
        title: "Superman",
        credits: "Catalogue selection · see music search for full credits",
        likes: 15900,
        shares: 2040,
        creations: 900,
      },
    ],
  },
  {
    id: "ami-faku",
    name: "Ami Faku",
    genre: "Afro Soul",
    city: "Gqeberha",
    score: 87.5,
    change: 4.8,
    audience: 52000,
    track: "Imali",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/8c/1f/e6/8c1fe60d-084a-0010-87a0-ed8ee7d650ae/pr_source.png/600x600bb.jpg",
    bio: "Eastern Cape singer-songwriter whose soulful catalogue includes her debut album Imali.",
    source: "https://en.wikipedia.org/wiki/Ami_Faku",
    imageCredit:
      "Artist image via Shazam / Apple Music · rights retained by original owners",
    imageSource: "https://www.shazam.com/artist/ami-faku/1424323496",
    songs: [
      {
        title: "Imali",
        credits: "Ami Faku · feat. Blaq Diamond",
        likes: 30300,
        shares: 3920,
        creations: 1745,
      },
      {
        title: "Ubuhle Bakho",
        credits: "Catalogue selection · see music search for full credits",
        likes: 16850,
        shares: 2180,
        creations: 980,
      },
    ],
  },
  {
    id: "simmy",
    name: "Simmy",
    genre: "Afro Pop",
    city: "Tugela Ferry",
    score: 85.4,
    change: 3.2,
    audience: 43000,
    track: "Umahlalela",
    image: "https://i.scdn.co/image/ab6761610000e5eb954d6260d4509cb0f141778e",
    bio: "South African singer-songwriter blending electronic production with soulful melodies.",
    source: "https://en.wikipedia.org/wiki/Simmy",
    imageCredit:
      "Artist image via Spotify · rights retained by original owners",
    imageSource: "https://open.spotify.com/artist/3MjlXVCfmLdY9QQ2GCd7iA",
    songs: [
      {
        title: "Umahlalela",
        credits: "Simmy · feat. Sun-EL Musician",
        likes: 32000,
        shares: 4180,
        creations: 1860,
      },
      {
        title: "Ngiyesaba",
        credits: "Catalogue selection · see music search for full credits",
        likes: 17800,
        shares: 2320,
        creations: 1060,
      },
    ],
  },
  {
    id: "sun-el",
    name: "Sun-EL Musician",
    genre: "Afro House",
    city: "Mooi River",
    score: 84.1,
    change: 7.9,
    audience: 38000,
    track: "Akanamali",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Features221/v4/19/df/fd/19dffd03-cee6-dca3-a9e5-ba6be5b5e3c8/mza_10067673978954604490.png/600x600bb.jpg",
    bio: "South African producer and DJ whose catalogue includes Akanamali and Africa to the World.",
    source: "https://en.wikipedia.org/wiki/Sun-EL_Musician",
    imageCredit:
      "Artist image via Shazam / Apple Music · rights retained by original owners",
    imageSource: "https://www.shazam.com/artist/sun-el-musician/1240936356",
    songs: [
      {
        title: "Akanamali",
        credits: "Sun-EL Musician · feat. Samthing Soweto",
        likes: 33700,
        shares: 4440,
        creations: 1975,
      },
      {
        title: "Sonini",
        credits: "Catalogue selection · see music search for full credits",
        likes: 18750,
        shares: 2460,
        creations: 1140,
      },
    ],
  },
  {
    id: "young-stunna",
    name: "Young Stunna",
    genre: "Amapiano",
    city: "Daveyton",
    score: 82.6,
    change: 11.4,
    audience: 71000,
    track: "Adiwele",
    image: "https://i.scdn.co/image/ab6761610000e5eb24a6d973ef9ed685c3f4ab27",
    bio: "Daveyton vocalist known for amapiano collaborations and the album Notumato.",
    source: "https://en.wikipedia.org/wiki/Young_Stunna",
    imageCredit:
      "Artist image via Concert Archives / Spotify CDN · rights retained by original owners",
    imageSource: "https://www.concertarchives.org/bands/young-stunna?year=2024",
    songs: [
      {
        title: "Adiwele",
        credits: "Young Stunna · feat. Kabza De Small & DJ Maphorisa",
        likes: 35400,
        shares: 4700,
        creations: 2090,
      },
      {
        title: "Sete",
        credits: "Catalogue selection · see music search for full credits",
        likes: 19700,
        shares: 2600,
        creations: 1220,
      },
    ],
  },
  {
    id: "ko",
    name: "K.O",
    genre: "Hip Hop",
    city: "Johannesburg",
    score: 80.2,
    change: -1.4,
    audience: 46000,
    track: "SETE",
    image: "https://i.scdn.co/image/ab6761610000e5ebf8b5060732621d3a8db8cc45",
    bio: "South African rapper whose solo catalogue includes Caracara and SETE.",
    source: "https://en.wikipedia.org/wiki/K.O_(musician)",
    imageCredit:
      "Artist image via Spotify · rights retained by original owners",
    imageSource: "https://open.spotify.com/artist/3ilw3NJXRWd153LIBsme1z",
    songs: [
      {
        title: "SETE",
        credits: "K.O · feat. Young Stunna & Blxckie",
        likes: 37100,
        shares: 4960,
        creations: 2205,
      },
      {
        title: "Caracara",
        credits: "Catalogue selection · see music search for full credits",
        likes: 20650,
        shares: 2740,
        creations: 1300,
      },
    ],
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
    guest: "South African music · concept episode",
    category: "Artist economics",
    description:
      "An honest conversation about ownership, the cost of a release and building a sustainable music career.",
    duration: 32,
    image: "/images/artist-1.jpg",
  },
  {
    id: "02",
    title: "Behind the split sheet",
    guest: "Amapiano credits · concept episode",
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
