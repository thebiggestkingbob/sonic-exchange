import { notFound } from "next/navigation";
import AssetDetailPage from "@/components/asset-detail-page";
import { musicAssets } from "@/lib/marketplace";
export function generateStaticParams() {
  return musicAssets.map((a) => ({ slug: a.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: musicAssets.find((a) => a.id === slug)?.title ?? "Asset not found",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const asset = musicAssets.find((a) => a.id === slug);
  if (!asset) notFound();
  return <AssetDetailPage asset={asset} />;
}
