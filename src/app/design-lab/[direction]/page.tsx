import { notFound } from "next/navigation";
import DesignDirection from "@/components/design-directions";
export function generateStaticParams() {
  return ["liquid", "kinetic", "kinetic-light", "culture", "chrome"].map(
    (direction) => ({
      direction,
    }),
  );
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
    direction !== "kinetic-light" &&
    direction !== "culture" &&
    direction !== "chrome"
  )
    notFound();
  return (
    <DesignDirection
      direction={
        direction === "kinetic-light" || direction === "culture"
          ? "kinetic"
          : direction
      }
      light={direction === "kinetic-light" || direction === "culture"}
      platformLook={direction === "culture" ? "culture" : "kinetic-light"}
    />
  );
}
