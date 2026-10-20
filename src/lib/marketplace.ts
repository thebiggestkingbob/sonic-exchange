export type License = "sync" | "master" | "publishing";
export const licenses: {
  id: License;
  label: string;
  factor: number;
  terms: string;
}[] = [
  {
    id: "sync",
    label: "Sync licence",
    factor: 1,
    terms:
      "Illustrative non-exclusive use in one film, campaign or digital project for 12 months. No ownership transfer.",
  },
  {
    id: "master",
    label: "Master rights",
    factor: 4,
    terms:
      "Illustrative exclusive recording ownership. Publishing and third-party clearances are excluded.",
  },
  {
    id: "publishing",
    label: "Publishing rights",
    factor: 2,
    terms:
      "Illustrative 25% composition interest. Recording ownership is excluded. No actual rights are transferred.",
  },
];
export type MusicAsset = {
  id: string;
  title: string;
  creator: string;
  city: string;
  genre: string;
  kind: "Track" | "Sample pack" | "Instrumental";
  price: number;
  bpm: number;
  key: string;
  theme: string;
  image: string;
  tag: string;
  description: string;
};
// Original fictional listings. These assets are not recordings by the real artists in INDEX.
export const musicAssets: MusicAsset[] = [
  {
    id: "after-hours",
    title: "After Hours in Jozi",
    creator: "Lerato Sound Lab",
    city: "Johannesburg",
    genre: "Amapiano",
    kind: "Track",
    price: 850000,
    bpm: 112,
    key: "F minor",
    theme: "orchid",
    image: "/images/artist-1.jpg",
    tag: "Editor's pick",
    description:
      "A slow-burning piano journey. Warm chords, a rolling log drum and space for the city to breathe. Made for stories that move after dark.",
  },
  {
    id: "cape-sunrise",
    title: "Cape Sunrise",
    creator: "Atlantic Room",
    city: "Cape Town",
    genre: "Afro House",
    kind: "Instrumental",
    price: 620000,
    bpm: 120,
    key: "A minor",
    theme: "sunrise",
    image: "/images/crowd.jpg",
    tag: "New arrival",
    description:
      "Organic percussion meets an open-air melody. An uplifting instrumental for travel films, summer campaigns and new beginnings.",
  },
  {
    id: "pheli-frequencies",
    title: "Pheli Frequencies",
    creator: "Westside Archive",
    city: "Pretoria",
    genre: "Hip Hop",
    kind: "Track",
    price: 1200000,
    bpm: 92,
    key: "C minor",
    theme: "cobalt",
    image: "/images/artist-2.jpg",
    tag: "In focus",
    description:
      "Dusty textures, a considered bassline and drums with something to say. A cinematic beat rooted in Pretoria's independent energy.",
  },
  {
    id: "velvet-signal",
    title: "Velvet Signal",
    creator: "Moonroom Sessions",
    city: "Johannesburg",
    genre: "R&B",
    kind: "Track",
    price: 740000,
    bpm: 84,
    key: "D minor",
    theme: "rose",
    image: "/images/artist-3.jpg",
    tag: "Editor's pick",
    description:
      "Late-night R&B with luminous keys and an intimate groove. A delicate, spacious foundation for a human story.",
  },
  {
    id: "durban-motion",
    title: "Durban Motion",
    creator: "Coastline Collective",
    city: "Durban",
    genre: "Gqom",
    kind: "Sample pack",
    price: 250000,
    bpm: 126,
    key: "Unpitched",
    theme: "lime",
    image: "/images/studio.jpg",
    tag: "New arrival",
    description:
      "Percussive shapes and gritty club textures inspired by the coast. An illustrative pack for the next wave of beatmakers.",
  },
  {
    id: "golden-state",
    title: "Golden State of Mind",
    creator: "Highveld Studio",
    city: "Pretoria",
    genre: "Afro Soul",
    kind: "Instrumental",
    price: 930000,
    bpm: 96,
    key: "G major",
    theme: "amber",
    image: "/images/artist-4.jpg",
    tag: "In focus",
    description:
      "A warm, soulful instrumental built around gentle rhythm and a generous melody. For moments with heart and a little sunlight.",
  },
];
export function assetPrice(asset: MusicAsset, license: License) {
  const option = licenses.find((l) => l.id === license);
  if (!option) throw new Error("Choose an available licence.");
  return asset.price * option.factor;
}
export function rand(cents: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
export type MarketState = {
  version: 1;
  saved: string[];
  purchases: {
    assetId: string;
    license: License;
    amount: number;
    date: string;
  }[];
  offers: {
    assetId: string;
    license: License;
    amount: number;
    message: string;
    date: string;
  }[];
};
export function initialMarket(): MarketState {
  return { version: 1, saved: [], purchases: [], offers: [] };
}
export type MarketCommand =
  | { type: "save"; assetId: string }
  | { type: "purchase"; assetId: string; license: License }
  | {
      type: "offer";
      assetId: string;
      license: License;
      amount: number;
      message: string;
    }
  | { type: "reset" };
export function marketTransition(
  state: MarketState,
  command: MarketCommand,
  date = new Date().toISOString(),
): MarketState {
  if (command.type === "reset") return initialMarket();
  const asset = musicAssets.find((a) => a.id === command.assetId);
  if (!asset) throw new Error("This asset is unavailable.");
  if (command.type === "save")
    return {
      ...state,
      saved: state.saved.includes(asset.id)
        ? state.saved.filter((id) => id !== asset.id)
        : [...state.saved, asset.id],
    };
  const amount = assetPrice(asset, command.license);
  if (command.type === "purchase") {
    if (
      state.purchases.some(
        (p) => p.assetId === asset.id && p.license === command.license,
      )
    )
      throw new Error("This licence is already in your demo collection.");
    return {
      ...state,
      purchases: [
        { assetId: asset.id, license: command.license, amount, date },
        ...state.purchases,
      ],
    };
  }
  if (
    !Number.isSafeInteger(command.amount) ||
    command.amount < 100 ||
    command.amount > 100000000
  )
    throw new Error("Enter an offer between R1 and R1,000,000.");
  if (command.message.trim().length < 10 || command.message.length > 1000)
    throw new Error("Describe your intended use in 10–1,000 characters.");
  return {
    ...state,
    offers: [
      {
        assetId: asset.id,
        license: command.license,
        amount: command.amount,
        message: command.message.trim(),
        date,
      },
      ...state.offers,
    ],
  };
}
export function readMarket(value: unknown): MarketState {
  if (!value || typeof value !== "object") return initialMarket();
  const s = value as MarketState;
  const validId = (id: unknown) => musicAssets.some((a) => a.id === id);
  const validLicense = (license: unknown) =>
    licenses.some((l) => l.id === license);
  if (
    s.version !== 1 ||
    !Array.isArray(s.saved) ||
    !s.saved.every(validId) ||
    !Array.isArray(s.purchases) ||
    !Array.isArray(s.offers)
  )
    return initialMarket();
  if (
    !s.purchases.every(
      (p) =>
        p &&
        validId(p.assetId) &&
        validLicense(p.license) &&
        p.amount ===
          assetPrice(musicAssets.find((a) => a.id === p.assetId)!, p.license) &&
        typeof p.date === "string",
    ) ||
    !s.offers.every(
      (o) =>
        o &&
        validId(o.assetId) &&
        validLicense(o.license) &&
        Number.isSafeInteger(o.amount) &&
        o.amount >= 100 &&
        o.amount <= 100000000 &&
        typeof o.message === "string" &&
        typeof o.date === "string",
    )
  )
    return initialMarket();
  return s;
}
