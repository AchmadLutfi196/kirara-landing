import { KiraraApp } from "@/components/app";
export default async function Page({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  return <KiraraApp route={route.join("/")} />;
}
