"use client";

import { useMemo } from "react";
import ToyCategoryField from "./ToyCategoryField";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function ToysDispatcher({
  value = {},
  onChange,
  categoryName = "Toys & Games",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  const initialGroup = useMemo(() => {
    // 1. Educational & Learning Toys
    if (
      catLower.includes("educational") ||
      catLower.includes("learning") ||
      catLower.includes("stem") ||
      catLower.includes("science") ||
      catLower.includes("montessori") ||
      catLower.includes("flash card") ||
      catLower.includes("alphabet") ||
      catLower.includes("শিক্ষা") ||
      catLower.includes("লার্নিং")
    ) {
      return "EDUCATIONAL";
    }

    // 2. Building & Construction Toys
    if (
      catLower.includes("building") ||
      catLower.includes("construction") ||
      catLower.includes("block") ||
      catLower.includes("lego") ||
      catLower.includes("magnetic block") ||
      catLower.includes("model building") ||
      catLower.includes("বিল্ডিং") ||
      catLower.includes("ব্লক")
    ) {
      return "BUILDING";
    }

    // 3. Electronic & Remote Control Toys
    if (
      catLower.includes("electronic") ||
      catLower.includes("remote") ||
      catLower.includes("rc") ||
      catLower.includes("drone") ||
      catLower.includes("helicopter") ||
      catLower.includes("walkie") ||
      catLower.includes("ইলেকট্রনিক") ||
      catLower.includes("রিমোট")
    ) {
      return "ELECTRONIC_RC";
    }

    // 4. Action Figures & Collectibles
    if (
      catLower.includes("action figure") ||
      catLower.includes("superhero") ||
      catLower.includes("anime") ||
      catLower.includes("figurine") ||
      catLower.includes("collectible") ||
      catLower.includes("অ্যাকশন ফিগার")
    ) {
      return "ACTION_FIGURES";
    }

    // 5. Soft Toys & Dolls
    if (
      catLower.includes("doll") ||
      catLower.includes("plush") ||
      catLower.includes("teddy") ||
      catLower.includes("soft toy") ||
      catLower.includes("stuffed") ||
      catLower.includes("barbie") ||
      catLower.includes("পুতুল") ||
      catLower.includes("টেডি")
    ) {
      return "DOLLS_PLUSH";
    }

    // 6. Outdoor Toys & Ride-On
    if (
      catLower.includes("outdoor") ||
      catLower.includes("ride-on") ||
      catLower.includes("ride on") ||
      catLower.includes("tricycle") ||
      catLower.includes("scooter") ||
      catLower.includes("slide") ||
      catLower.includes("swing") ||
      catLower.includes("water gun") ||
      catLower.includes("bubble") ||
      catLower.includes("দোলনা") ||
      catLower.includes("সাইকেল")
    ) {
      return "OUTDOOR_RIDEON";
    }

    // 7. Indoor Games & Puzzles
    if (
      catLower.includes("indoor") ||
      catLower.includes("board game") ||
      catLower.includes("puzzle") ||
      catLower.includes("chess") ||
      catLower.includes("ludo") ||
      catLower.includes("card game") ||
      catLower.includes("tabletop") ||
      catLower.includes("দাবা") ||
      catLower.includes("লুডো") ||
      catLower.includes("পাজল")
    ) {
      return "INDOOR_GAMES";
    }

    // 8. Baby & Toddler Toys
    if (
      catLower.includes("baby") ||
      catLower.includes("toddler") ||
      catLower.includes("rattle") ||
      catLower.includes("teether") ||
      catLower.includes("infant") ||
      catLower.includes("crib") ||
      catLower.includes("sensory") ||
      catLower.includes("রেটল") ||
      catLower.includes("টিথার") ||
      catLower.includes("বাচ্চা")
    ) {
      return "BABY_TODDLER";
    }

    // 9. Arts & Crafts
    if (
      catLower.includes("art") ||
      catLower.includes("craft") ||
      catLower.includes("clay") ||
      catLower.includes("dough") ||
      catLower.includes("drawing") ||
      catLower.includes("painting") ||
      catLower.includes("origami") ||
      catLower.includes("ড্রয়িং") ||
      catLower.includes("আর্ট")
    ) {
      return "ARTS_CRAFTS";
    }

    // 10. Birthday Decor & More
    if (
      catLower.includes("birthday") ||
      catLower.includes("decor") ||
      catLower.includes("balloon") ||
      catLower.includes("party") ||
      catLower.includes("cake") ||
      catLower.includes("বার্থডে") ||
      catLower.includes("বেলুন")
    ) {
      return "PARTY_DECOR";
    }

    // Default to show all
    return "ALL";
  }, [catLower]);

  return (
    <ToyCategoryField
      value={value}
      onChange={onChange}
      categoryName={categoryName}
      initialGroup={initialGroup}
    />
  );
}
