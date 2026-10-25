import type { DemoCategory } from "./components/product-placement/types";

export const DEMO_CATEGORIES: DemoCategory[] = [
  // =====================================================
  // FASHION
  // =====================================================

  {
    id: "fashion",
    name: "Fashion",
    parentId: null,
  },

  {
    id: "cloth",
    name: "Cloth",
    parentId: "fashion",
  },

  {
    id: "mens-cloth",
    name: "Men's Cloth",
    parentId: "cloth",
  },

  {
    id: "womens-cloth",
    name: "Women's Cloth",
    parentId: "cloth",
  },

  {
    id: "kids-cloth",
    name: "Kids Cloth",
    parentId: "cloth",
  },

  {
    id: "panjabi",
    name: "Panjabi",
    parentId: "fashion",
  },

  {
    id: "shirt",
    name: "Shirt",
    parentId: "fashion",
  },

  // =====================================================
  // GROCERY
  // =====================================================

  {
    id: "grocery",
    name: "Grocery",
    parentId: null,
  },

  {
    id: "food",
    name: "Food",
    parentId: "grocery",
  },

  {
    id: "rice",
    name: "Rice",
    parentId: "food",
  },

  {
    id: "oil",
    name: "Oil",
    parentId: "food",
  },

  // =====================================================
  // ELECTRONICS
  // =====================================================

  {
    id: "electronics",
    name: "Electronics",
    parentId: null,
  },

  {
    id: "mobile",
    name: "Mobile",
    parentId: "electronics",
  },

  {
    id: "laptop",
    name: "Laptop",
    parentId: "electronics",
  },

  // =====================================================
  // HOME & LIVING
  // =====================================================

  {
    id: "home",
    name: "Home & Living",
    parentId: null,
  },

  {
    id: "furniture",
    name: "Furniture",
    parentId: "home",
  },

  {
    id: "chair",
    name: "Chair",
    parentId: "furniture",
  },

  {
    id: "table",
    name: "Table",
    parentId: "furniture",
  },
];