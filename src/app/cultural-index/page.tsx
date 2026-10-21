import IndexPage from "@/components/index-page";
export const metadata = { title: "INDEX" };
export default async function Index({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <IndexPage key={q ?? ""} initialQuery={q ?? ""} />;
}
