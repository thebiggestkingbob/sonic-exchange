import { notFound } from "next/navigation";
import DesignDirection from "@/components/design-directions";
export function generateStaticParams() {
  return ["liquid", "kinetic", "chrome"].map((direction) => ({ direction }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ direction: string }>;
}) {
  const { direction } = await params;
  if (
    direction !== "liquid" &&
    direction !== "kinetic" &&
    direction !== "chrome"
  )
    notFound();
  return <DesignDirection direction={direction} />;
}
