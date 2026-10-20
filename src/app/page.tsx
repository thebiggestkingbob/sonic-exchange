import IndexPage from "@/components/index-page";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <IndexPage key={q ?? ""} initialQuery={q ?? ""} />;
}
