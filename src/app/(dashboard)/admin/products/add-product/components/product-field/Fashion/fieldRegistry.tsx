import type { ComponentType } from "react";

import FashionField1 from "./Kid's Fashion/Backpacks";
import FashionField2 from "./Kid's Fashion/Belts";
import FashionField3 from "./Kid's Fashion/Caps";
import FashionField4 from "./Kid's Fashion/Footwear/Boys Footwear/Ballerinas";
import FashionField5 from "./Kid's Fashion/Footwear/Boys Footwear/Boots";
import FashionField6 from "./Kid's Fashion/Footwear/Boys Footwear/Clogs";
import FashionField7 from "./Kid's Fashion/Footwear/Boys Footwear/Flip-Flops";
import FashionField8 from "./Kid's Fashion/Footwear/Boys Footwear/Sandals";
import FashionField9 from "./Kid's Fashion/Footwear/Boys Footwear/School-Footwear";
import FashionField10 from "./Kid's Fashion/Footwear/Boys Footwear/Slippers";
import FashionField11 from "./Kid's Fashion/Footwear/Boys Footwear/Sneakers";
import FashionField12 from "./Kid's Fashion/Footwear/Boys Footwear/Sports-Footwear";
import FashionField13 from "./Kid's Fashion/Footwear/Boys-Footwear";
import FashionField14 from "./Kid's Fashion/Footwear/Girls Footwear/Ballerinas";
import FashionField15 from "./Kid's Fashion/Footwear/Girls Footwear/Flats";
import FashionField16 from "./Kid's Fashion/Footwear/Girls Footwear/Flip-Flops";
import FashionField17 from "./Kid's Fashion/Footwear/Girls Footwear/Heels";
import FashionField18 from "./Kid's Fashion/Footwear/Girls Footwear/Sandals";
import FashionField19 from "./Kid's Fashion/Footwear/Girls Footwear/School-Footwear";
import FashionField20 from "./Kid's Fashion/Footwear/Girls Footwear/Sneakers";
import FashionField21 from "./Kid's Fashion/Footwear/Girls Footwear/Sports-Footwear";
import FashionField22 from "./Kid's Fashion/Footwear/Girls-Footwear";
import FashionField23 from "./Kid's Fashion/Jewellery/Bracelets";
import FashionField24 from "./Kid's Fashion/Jewellery/Chains";
import FashionField25 from "./Kid's Fashion/Jewellery/Pendants";
import FashionField26 from "./Kid's Fashion/Jewellery/Rings";
import FashionField27 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Accessories";
import FashionField28 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Activewear";
import FashionField29 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Bottoms";
import FashionField30 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Clothing-Set";
import FashionField31 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Ethnic-Wear";
import FashionField32 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Innerwear";
import FashionField33 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Jackets-Coats";
import FashionField34 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Jeans-Pants";
import FashionField35 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Muslim-Wear";
import FashionField36 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Sportswear";
import FashionField37 from "./Kid's Fashion/Kids Clothing/Boys Clothing/T-Shirts-Shirts";
import FashionField38 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Trousers";
import FashionField39 from "./Kid's Fashion/Kids Clothing/Boys Clothing/Winterwear";
import FashionField40 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Activewear";
import FashionField41 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Bottomwear";
import FashionField42 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Clothing-Set";
import FashionField43 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Dresses";
import FashionField44 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Ethnic-Wear";
import FashionField45 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Innerwear";
import FashionField46 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Jackets-Coats";
import FashionField47 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Jeans";
import FashionField48 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Jumpsuits";
import FashionField49 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Muslim-Wear";
import FashionField50 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Pants";
import FashionField51 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Sarees";
import FashionField52 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Shalwar-Kameez";
import FashionField53 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Shorts";
import FashionField54 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Skirts";
import FashionField55 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Sportswear";
import FashionField56 from "./Kid's Fashion/Kids Clothing/Girls Clothing/T-Shirts";
import FashionField57 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Tops-Tees";
import FashionField58 from "./Kid's Fashion/Kids Clothing/Girls Clothing/Winterwear";
import FashionField59 from "./Kid's Fashion/Sunglasses@frames";
import FashionField60 from "./Kid's Fashion/Wallets";
import FashionField61 from "./Kid's Fashion/Watches/Accessories";
import FashionField62 from "./Kid's Fashion/Watches/Classic-Watches";
import FashionField63 from "./Kid's Fashion/Watches/Premium-Watches";
import FashionField64 from "./Kid's Fashion/Watches/Smart-Watches";
import FashionField65 from "./Men's Fashion/Backpacks";
import FashionField66 from "./Men's Fashion/Belts";
import FashionField67 from "./Men's Fashion/Caps";
import FashionField68 from "./Men's Fashion/Footwear/Boots";
import FashionField69 from "./Men's Fashion/Footwear/Casual-Footwear";
import FashionField70 from "./Men's Fashion/Footwear/Flip-Flops";
import FashionField71 from "./Men's Fashion/Footwear/Footwear-Accessories";
import FashionField72 from "./Men's Fashion/Footwear/Formal-Footwear";
import FashionField73 from "./Men's Fashion/Footwear/Loafers";
import FashionField74 from "./Men's Fashion/Footwear/Oxfords";
import FashionField75 from "./Men's Fashion/Footwear/Sandals-Slippers";
import FashionField76 from "./Men's Fashion/Footwear/Sneakers";
import FashionField77 from "./Men's Fashion/Footwear/Sports-Footwear";
import FashionField78 from "./Men's Fashion/Jewellery/Bracelets";
import FashionField79 from "./Men's Fashion/Jewellery/Chains";
import FashionField80 from "./Men's Fashion/Jewellery/Pendants";
import FashionField81 from "./Men's Fashion/Jewellery/Rings";
import FashionField82 from "./Men's Fashion/Sunglasses@frames";
import FashionField83 from "./Men's Fashion/Wallets";
import FashionField84 from "./Men's Fashion/Watches/Accessories";
import FashionField85 from "./Men's Fashion/Watches/Classic-Watches";
import FashionField86 from "./Men's Fashion/Watches/Premium-Watches";
import FashionField87 from "./Men's Fashion/Watches/Smart-Watches";
import FashionField88 from "./Women's Fashion/Backpacks";
import FashionField89 from "./Women's Fashion/Belts";
import FashionField90 from "./Women's Fashion/Caps";
import FashionField91 from "./Women's Fashion/Clothing/Accessories/Socks";
import FashionField92 from "./Women's Fashion/Clothing/Ethnic Wear/Blouses";
import FashionField93 from "./Women's Fashion/Clothing/Ethnic Wear/Kurtis";
import FashionField94 from "./Women's Fashion/Clothing/Ethnic Wear/Salwar-Suits-Gowns";
import FashionField95 from "./Women's Fashion/Clothing/Ethnic Wear/Sarees";
import FashionField96 from "./Women's Fashion/Clothing/Ethnic Wear/Shalwar-Kameez";
import FashionField97 from "./Women's Fashion/Clothing/Innerwear/Bras";
import FashionField98 from "./Women's Fashion/Clothing/Innerwear/Lingerie-Sets";
import FashionField99 from "./Women's Fashion/Clothing/Innerwear/Nightwear";
import FashionField100 from "./Women's Fashion/Clothing/Innerwear/Panties";
import FashionField101 from "./Women's Fashion/Clothing/Innerwear/Robes-Bodysuits";
import FashionField102 from "./Women's Fashion/Clothing/Innerwear/Shapewear";
import FashionField103 from "./Women's Fashion/Clothing/Innerwear/Sleepwear-Loungewear";
import FashionField104 from "./Women's Fashion/Clothing/Muslim Wear/Abaya";
import FashionField105 from "./Women's Fashion/Clothing/Muslim Wear/Burqa";
import FashionField106 from "./Women's Fashion/Clothing/Muslim Wear/Hijab";
import FashionField107 from "./Women's Fashion/Clothing/Muslim Wear/Jilbab";
import FashionField108 from "./Women's Fashion/Clothing/Muslim Wear/Kaftan";
import FashionField109 from "./Women's Fashion/Clothing/Muslim Wear/Niqab";
import FashionField110 from "./Women's Fashion/Clothing/Muslim Wear/Scarves-Long-Dresses";
import FashionField111 from "./Women's Fashion/Clothing/Western Wear/Dresses";
import FashionField112 from "./Women's Fashion/Clothing/Western Wear/Jackets-Coats";
import FashionField113 from "./Women's Fashion/Clothing/Western Wear/Jeans-Pants";
import FashionField114 from "./Women's Fashion/Clothing/Western Wear/Jumpsuits-Playsuits";
import FashionField115 from "./Women's Fashion/Clothing/Western Wear/Sportswear";
import FashionField116 from "./Women's Fashion/Clothing/Western Wear/T-Shirts-Polo-Shirts";
import FashionField117 from "./Women's Fashion/Clothing/Western Wear/Trousers";
import FashionField118 from "./Women's Fashion/Clothing/Western Wear/Winter-Wear-Sweaters";
import FashionField119 from "./Women's Fashion/Footwear/Boots";
import FashionField120 from "./Women's Fashion/Footwear/Casual-Footwear";
import FashionField121 from "./Women's Fashion/Footwear/Clogs";
import FashionField122 from "./Women's Fashion/Footwear/Comfort-Footwear";
import FashionField123 from "./Women's Fashion/Footwear/Ethnic-Footwear";
import FashionField124 from "./Women's Fashion/Footwear/Flats";
import FashionField125 from "./Women's Fashion/Footwear/Flip-Flops";
import FashionField126 from "./Women's Fashion/Footwear/Formal-Footwear";
import FashionField127 from "./Women's Fashion/Footwear/Heels";
import FashionField128 from "./Women's Fashion/Footwear/Protective-Footwear";
import FashionField129 from "./Women's Fashion/Footwear/Sandals";
import FashionField130 from "./Women's Fashion/Footwear/Slippers";
import FashionField131 from "./Women's Fashion/Footwear/Sneakers";
import FashionField132 from "./Women's Fashion/Footwear/Sports-Footwear";
import FashionField133 from "./Women's Fashion/Jewellery/Bracelets";
import FashionField134 from "./Women's Fashion/Jewellery/Charms";
import FashionField135 from "./Women's Fashion/Jewellery/Earrings";
import FashionField136 from "./Women's Fashion/Jewellery/Hair-Accessories";
import FashionField137 from "./Women's Fashion/Jewellery/Jewellery-Set";
import FashionField138 from "./Women's Fashion/Jewellery/Necklaces";
import FashionField139 from "./Women's Fashion/Jewellery/Rings";
import FashionField140 from "./Women's Fashion/Sunglasses@frames";
import FashionField141 from "./Women's Fashion/Wallets";
import FashionField142 from "./Women's Fashion/Watches/Accessories";
import FashionField143 from "./Women's Fashion/Watches/Classic-Watches";
import FashionField144 from "./Women's Fashion/Watches/Premium-Watches";
import FashionField145 from "./Women's Fashion/Watches/Smart-Watches";

type FashionFieldProps = {
  categoryName?: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

const fashionFieldsByCategory: Record<string, ComponentType<FashionFieldProps>> = {
  "backpacks-and-bags": FashionField1,
  "belts": FashionField2,
  "caps": FashionField3,
  "ballerinas": FashionField4,
  "boots": FashionField5,
  "clogs": FashionField6,
  "flip-flops": FashionField7,
  "sandals": FashionField8,
  "school-footwear": FashionField9,
  "slippers": FashionField10,
  "sneakers": FashionField11,
  "sports-footwear": FashionField12,
  "boys-footwear": FashionField13,
  "flats": FashionField15,
  "heels": FashionField17,
  "girls-footwear": FashionField22,
  "bracelets": FashionField23,
  "chains": FashionField24,
  "pendants": FashionField25,
  "rings": FashionField26,
  "clothing-accessories": FashionField27,
  "activewear": FashionField28,
  "bottoms": FashionField29,
  "clothing-set": FashionField30,
  "ethnic-wear": FashionField31,
  "innerwear": FashionField32,
  "jackets-and-coats": FashionField33,
  "jeans-and-pants": FashionField34,
  "muslim-wear": FashionField35,
  "sportswear": FashionField36,
  "t-shirts-and-shirts": FashionField37,
  "trousers": FashionField38,
  "winterwear": FashionField39,
  "bottomwear": FashionField41,
  "dresses": FashionField43,
  "jeans": FashionField47,
  "jumpsuits": FashionField48,
  "pants": FashionField50,
  "sarees": FashionField51,
  "shalwar-kameez": FashionField52,
  "shorts": FashionField53,
  "skirts": FashionField54,
  "t-shirts": FashionField56,
  "tops-and-tees": FashionField57,
  "sunglasses-and-frames": FashionField59,
  "wallets": FashionField60,
  "watch-accessories": FashionField61,
  "classic-watches": FashionField62,
  "premium-watches": FashionField63,
  "smart-watches": FashionField64,
  "casual-footwear": FashionField69,
  "footwear-accessories": FashionField71,
  "formal-footwear": FashionField72,
  "loafers": FashionField73,
  "oxfords": FashionField74,
  "sandals-and-slippers": FashionField75,
  "socks": FashionField91,
  "blouses": FashionField92,
  "kurtis": FashionField93,
  "salwar-suits-and-gowns": FashionField94,
  "bras": FashionField97,
  "lingerie-sets": FashionField98,
  "nightwear": FashionField99,
  "panties": FashionField100,
  "robes-and-bodysuits": FashionField101,
  "shapewear": FashionField102,
  "sleepwear-and-loungewear": FashionField103,
  "abaya": FashionField104,
  "burqa": FashionField105,
  "hijab": FashionField106,
  "jilbab": FashionField107,
  "kaftan": FashionField108,
  "niqab": FashionField109,
  "scarves-and-long-dresses": FashionField110,
  "jumpsuits-and-playsuits": FashionField114,
  "t-shirts-and-polo-shirts": FashionField116,
  "winter-wear-and-sweaters": FashionField118,
  "comfort-footwear": FashionField122,
  "ethnic-footwear": FashionField123,
  "protective-footwear": FashionField128,
  "charms": FashionField134,
  "earrings": FashionField135,
  "hair-accessories": FashionField136,
  "jewellery-set": FashionField137,
  "necklaces": FashionField138,
};

const fashionFieldsByPath: Record<string, ComponentType<FashionFieldProps>> = {
  "kid-s-fashion/backpacks-and-bags": FashionField1,
  "kid-s-fashion/belts": FashionField2,
  "kid-s-fashion/caps": FashionField3,
  "kid-s-fashion/footwear/boys-footwear/ballerinas": FashionField4,
  "kid-s-fashion/footwear/boys-footwear/boots": FashionField5,
  "kid-s-fashion/footwear/boys-footwear/clogs": FashionField6,
  "kid-s-fashion/footwear/boys-footwear/flip-flops": FashionField7,
  "kid-s-fashion/footwear/boys-footwear/sandals": FashionField8,
  "kid-s-fashion/footwear/boys-footwear/school-footwear": FashionField9,
  "kid-s-fashion/footwear/boys-footwear/slippers": FashionField10,
  "kid-s-fashion/footwear/boys-footwear/sneakers": FashionField11,
  "kid-s-fashion/footwear/boys-footwear/sports-footwear": FashionField12,
  "kid-s-fashion/footwear/boys-footwear": FashionField13,
  "kid-s-fashion/footwear/girls-footwear/ballerinas": FashionField14,
  "kid-s-fashion/footwear/girls-footwear/flats": FashionField15,
  "kid-s-fashion/footwear/girls-footwear/flip-flops": FashionField16,
  "kid-s-fashion/footwear/girls-footwear/heels": FashionField17,
  "kid-s-fashion/footwear/girls-footwear/sandals": FashionField18,
  "kid-s-fashion/footwear/girls-footwear/school-footwear": FashionField19,
  "kid-s-fashion/footwear/girls-footwear/sneakers": FashionField20,
  "kid-s-fashion/footwear/girls-footwear/sports-footwear": FashionField21,
  "kid-s-fashion/footwear/girls-footwear": FashionField22,
  "kid-s-fashion/jewellery/bracelets": FashionField23,
  "kid-s-fashion/jewellery/chains": FashionField24,
  "kid-s-fashion/jewellery/pendants": FashionField25,
  "kid-s-fashion/jewellery/rings": FashionField26,
  "kid-s-fashion/kids-clothing/boys-clothing/clothing-accessories": FashionField27,
  "kid-s-fashion/kids-clothing/boys-clothing/activewear": FashionField28,
  "kid-s-fashion/kids-clothing/boys-clothing/bottoms": FashionField29,
  "kid-s-fashion/kids-clothing/boys-clothing/clothing-set": FashionField30,
  "kid-s-fashion/kids-clothing/boys-clothing/ethnic-wear": FashionField31,
  "kid-s-fashion/kids-clothing/boys-clothing/innerwear": FashionField32,
  "kid-s-fashion/kids-clothing/boys-clothing/jackets-and-coats": FashionField33,
  "kid-s-fashion/kids-clothing/boys-clothing/jeans-and-pants": FashionField34,
  "kid-s-fashion/kids-clothing/boys-clothing/muslim-wear": FashionField35,
  "kid-s-fashion/kids-clothing/boys-clothing/sportswear": FashionField36,
  "kid-s-fashion/kids-clothing/boys-clothing/t-shirts-and-shirts": FashionField37,
  "kid-s-fashion/kids-clothing/boys-clothing/trousers": FashionField38,
  "kid-s-fashion/kids-clothing/boys-clothing/winterwear": FashionField39,
  "kid-s-fashion/kids-clothing/girls-clothing/activewear": FashionField40,
  "kid-s-fashion/kids-clothing/girls-clothing/bottomwear": FashionField41,
  "kid-s-fashion/kids-clothing/girls-clothing/clothing-set": FashionField42,
  "kid-s-fashion/kids-clothing/girls-clothing/dresses": FashionField43,
  "kid-s-fashion/kids-clothing/girls-clothing/ethnic-wear": FashionField44,
  "kid-s-fashion/kids-clothing/girls-clothing/innerwear": FashionField45,
  "kid-s-fashion/kids-clothing/girls-clothing/jackets-and-coats": FashionField46,
  "kid-s-fashion/kids-clothing/girls-clothing/jeans": FashionField47,
  "kid-s-fashion/kids-clothing/girls-clothing/jumpsuits": FashionField48,
  "kid-s-fashion/kids-clothing/girls-clothing/muslim-wear": FashionField49,
  "kid-s-fashion/kids-clothing/girls-clothing/pants": FashionField50,
  "kid-s-fashion/kids-clothing/girls-clothing/sarees": FashionField51,
  "kid-s-fashion/kids-clothing/girls-clothing/shalwar-kameez": FashionField52,
  "kid-s-fashion/kids-clothing/girls-clothing/shorts": FashionField53,
  "kid-s-fashion/kids-clothing/girls-clothing/skirts": FashionField54,
  "kid-s-fashion/kids-clothing/girls-clothing/sportswear": FashionField55,
  "kid-s-fashion/kids-clothing/girls-clothing/t-shirts": FashionField56,
  "kid-s-fashion/kids-clothing/girls-clothing/tops-and-tees": FashionField57,
  "kid-s-fashion/kids-clothing/girls-clothing/winterwear": FashionField58,
  "kid-s-fashion/sunglasses-and-frames": FashionField59,
  "kid-s-fashion/wallets": FashionField60,
  "kid-s-fashion/watches/watch-accessories": FashionField61,
  "kid-s-fashion/watches/classic-watches": FashionField62,
  "kid-s-fashion/watches/premium-watches": FashionField63,
  "kid-s-fashion/watches/smart-watches": FashionField64,
  "men-s-fashion/backpacks-and-bags": FashionField65,
  "men-s-fashion/belts": FashionField66,
  "men-s-fashion/caps": FashionField67,
  "men-s-fashion/footwear/boots": FashionField68,
  "men-s-fashion/footwear/casual-footwear": FashionField69,
  "men-s-fashion/footwear/flip-flops": FashionField70,
  "men-s-fashion/footwear/footwear-accessories": FashionField71,
  "men-s-fashion/footwear/formal-footwear": FashionField72,
  "men-s-fashion/footwear/loafers": FashionField73,
  "men-s-fashion/footwear/oxfords": FashionField74,
  "men-s-fashion/footwear/sandals-and-slippers": FashionField75,
  "men-s-fashion/footwear/sneakers": FashionField76,
  "men-s-fashion/footwear/sports-footwear": FashionField77,
  "men-s-fashion/jewellery/bracelets": FashionField78,
  "men-s-fashion/jewellery/chains": FashionField79,
  "men-s-fashion/jewellery/pendants": FashionField80,
  "men-s-fashion/jewellery/rings": FashionField81,
  "men-s-fashion/sunglasses-and-frames": FashionField82,
  "men-s-fashion/wallets": FashionField83,
  "men-s-fashion/watches/watch-accessories": FashionField84,
  "men-s-fashion/watches/classic-watches": FashionField85,
  "men-s-fashion/watches/premium-watches": FashionField86,
  "men-s-fashion/watches/smart-watches": FashionField87,
  "women-s-fashion/backpacks-and-bags": FashionField88,
  "women-s-fashion/belts": FashionField89,
  "women-s-fashion/caps": FashionField90,
  "women-s-fashion/clothing/accessories/socks": FashionField91,
  "women-s-fashion/clothing/ethnic-wear/blouses": FashionField92,
  "women-s-fashion/clothing/ethnic-wear/kurtis": FashionField93,
  "women-s-fashion/clothing/ethnic-wear/salwar-suits-and-gowns": FashionField94,
  "women-s-fashion/clothing/ethnic-wear/sarees": FashionField95,
  "women-s-fashion/clothing/ethnic-wear/shalwar-kameez": FashionField96,
  "women-s-fashion/clothing/innerwear/bras": FashionField97,
  "women-s-fashion/clothing/innerwear/lingerie-sets": FashionField98,
  "women-s-fashion/clothing/innerwear/nightwear": FashionField99,
  "women-s-fashion/clothing/innerwear/panties": FashionField100,
  "women-s-fashion/clothing/innerwear/robes-and-bodysuits": FashionField101,
  "women-s-fashion/clothing/innerwear/shapewear": FashionField102,
  "women-s-fashion/clothing/innerwear/sleepwear-and-loungewear": FashionField103,
  "women-s-fashion/clothing/muslim-wear/abaya": FashionField104,
  "women-s-fashion/clothing/muslim-wear/burqa": FashionField105,
  "women-s-fashion/clothing/muslim-wear/hijab": FashionField106,
  "women-s-fashion/clothing/muslim-wear/jilbab": FashionField107,
  "women-s-fashion/clothing/muslim-wear/kaftan": FashionField108,
  "women-s-fashion/clothing/muslim-wear/niqab": FashionField109,
  "women-s-fashion/clothing/muslim-wear/scarves-and-long-dresses": FashionField110,
  "women-s-fashion/clothing/western-wear/dresses": FashionField111,
  "women-s-fashion/clothing/western-wear/jackets-and-coats": FashionField112,
  "women-s-fashion/clothing/western-wear/jeans-and-pants": FashionField113,
  "women-s-fashion/clothing/western-wear/jumpsuits-and-playsuits": FashionField114,
  "women-s-fashion/clothing/western-wear/sportswear": FashionField115,
  "women-s-fashion/clothing/western-wear/t-shirts-and-polo-shirts": FashionField116,
  "women-s-fashion/clothing/western-wear/trousers": FashionField117,
  "women-s-fashion/clothing/western-wear/winter-wear-and-sweaters": FashionField118,
  "women-s-fashion/footwear/boots": FashionField119,
  "women-s-fashion/footwear/casual-footwear": FashionField120,
  "women-s-fashion/footwear/clogs": FashionField121,
  "women-s-fashion/footwear/comfort-footwear": FashionField122,
  "women-s-fashion/footwear/ethnic-footwear": FashionField123,
  "women-s-fashion/footwear/flats": FashionField124,
  "women-s-fashion/footwear/flip-flops": FashionField125,
  "women-s-fashion/footwear/formal-footwear": FashionField126,
  "women-s-fashion/footwear/heels": FashionField127,
  "women-s-fashion/footwear/protective-footwear": FashionField128,
  "women-s-fashion/footwear/sandals": FashionField129,
  "women-s-fashion/footwear/slippers": FashionField130,
  "women-s-fashion/footwear/sneakers": FashionField131,
  "women-s-fashion/footwear/sports-footwear": FashionField132,
  "women-s-fashion/jewellery/bracelets": FashionField133,
  "women-s-fashion/jewellery/charms": FashionField134,
  "women-s-fashion/jewellery/earrings": FashionField135,
  "women-s-fashion/jewellery/hair-accessories": FashionField136,
  "women-s-fashion/jewellery/jewellery-set": FashionField137,
  "women-s-fashion/jewellery/necklaces": FashionField138,
  "women-s-fashion/jewellery/rings": FashionField139,
  "women-s-fashion/sunglasses-and-frames": FashionField140,
  "women-s-fashion/wallets": FashionField141,
  "women-s-fashion/watches/watch-accessories": FashionField142,
  "women-s-fashion/watches/classic-watches": FashionField143,
  "women-s-fashion/watches/premium-watches": FashionField144,
  "women-s-fashion/watches/smart-watches": FashionField145,
};

function normalizeCategoryName(name: string) {
  return name.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getFashionFieldComponent(categoryName: string, parentNames: string[] = []): ComponentType<FashionFieldProps> | null {
  const key = normalizeCategoryName(categoryName);
  const parents = parentNames.map(normalizeCategoryName);
  const path = [...parents.reverse(), key];
  if (key === "accessories") {
    if (path.some((part) => part.includes("watch"))) return fashionFieldsByCategory["watch-accessories"] ?? null;
    if (path.some((part) => part.includes("clothing"))) return fashionFieldsByCategory["clothing-accessories"] ?? null;
  }
  for (let index = 0; index < path.length; index++) {
    const component = fashionFieldsByPath[path.slice(index).join("/")];
    if (component) return component;
  }
  const direct = fashionFieldsByCategory[key];
  if (direct) return direct;
  const aliases: Record<string, string> = { bag: "backpacks-and-bags", jewelry: "bracelets", jewellery: "bracelets", shoes: "sneakers", sandal: "sandals", shirt: "t-shirts", cap: "caps", panjabi: "ethnic-wear", pant: "pants", shari: "sarees", saree: "sarees", watch: "classic-watches", watches: "classic-watches", footwear: "sneakers", "three-piece": "sarees", "sunglasses-frames": "sunglasses-and-frames", "men-s-fashion": "t-shirts-and-polo-shirts", "women-s-fashion": "dresses", "kid-s-fashion": "dresses" };
  const alias = aliases[key];
  return alias ? fashionFieldsByCategory[alias] ?? null : null;
}
