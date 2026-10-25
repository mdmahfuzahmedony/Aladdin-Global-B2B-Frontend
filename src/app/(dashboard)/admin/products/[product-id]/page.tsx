import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ "product-id": string }>;
}) {
  const { "product-id": id } = await params;
  redirect(`/admin/products/${encodeURIComponent(id)}/edit`);
}
