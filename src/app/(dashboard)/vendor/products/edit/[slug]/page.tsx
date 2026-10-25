"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductEditForm from "@/components/products/ProductEditForm";

export default function VendorEditProductPageBySlug() {
  const params = useParams<{ slug?: string; id?: string }>();
  const slugOrId = params.slug || params.id || "";

  return <ProductEditForm role="VENDOR" slugOrId={slugOrId} />;
}
