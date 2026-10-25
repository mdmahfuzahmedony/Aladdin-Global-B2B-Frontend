"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductEditForm from "@/components/products/ProductEditForm";

export default function AdminEditProductPage() {
  const params = useParams<{ slug?: string; id?: string; "product-id"?: string }>();
  const slugOrId = params.slug || params.id || params["product-id"] || "";

  return <ProductEditForm role="ADMIN" slugOrId={slugOrId} />;
}
