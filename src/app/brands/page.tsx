import BrandsPage from "@/components/brands-page";
export const metadata = { title: "BRANDS" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string }>;
}) {
  const { artist } = await searchParams;
  return <BrandsPage key={artist ?? ""} initialArtist={artist} />;
}
