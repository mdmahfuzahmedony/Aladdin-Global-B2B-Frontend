"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductEditForm from "@/components/products/ProductEditForm";

export default function AdminEditProductPageById() {
  const params = useParams<{ slug?: string; id?: string; "product-id"?: string }>();
  const slugOrId = params["product-id"] || params.id || params.slug || "";

  return <ProductEditForm role="ADMIN" slugOrId={slugOrId} />;
}
