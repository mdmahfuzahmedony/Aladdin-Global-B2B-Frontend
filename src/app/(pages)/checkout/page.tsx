import CheckoutPage from "./components/CheckoutPage";

type Role = "customer" | "wholesaler" | "dropshipper";

type SearchParams = Promise<{
  role?: string;
}>;

export default async function Checkout({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  let role: Role = "customer";

  if (params.role === "wholesaler") {
    role = "wholesaler";
  } else if (params.role === "dropshipper") {
    role = "dropshipper";
  }

  return <CheckoutPage role={role} />;
}