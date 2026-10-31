import CategoryBrowser from "@/components/category/CategoryBrowser";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <CategoryBrowser slug={slug} />;
}
