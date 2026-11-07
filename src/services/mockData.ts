import { Product, CategoryInfo, User, Order, StockLog, MongoQueryPreset } from '../types';
import { ADDITIONAL_PRODUCTS } from '../data/additionalProducts';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    "id": "cat-1",
    "_id": "67c51001a1e0b2001e000c01",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Next-gen mobiles, laptops, high-res audio, 4K OLED TVs, and smart computing devices.",
    "icon": "Smartphone",
    "itemCount": 8,
    "gradient": "from-blue-600 to-indigo-600",
    "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Mobiles",
      "Laptops",
      "Tablets",
      "Smart Watches",
      "Headphones",
      "Cameras",
      "Speakers",
      "TVs",
      "Computer Accessories"
    ]
  },
  {
    "id": "cat-2",
    "_id": "67c51001a1e0b2001e000c02",
    "name": "Fashion – Men",
    "slug": "fashion-men",
    "description": "Premium casual & formal shirts, denim jeans, leather accessories, and jackets.",
    "icon": "Shirt",
    "itemCount": 6,
    "gradient": "from-slate-700 to-slate-900",
    "image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Shirts",
      "T-Shirts",
      "Jeans",
      "Trousers",
      "Shoes",
      "Watches",
      "Wallets",
      "Jackets"
    ]
  },
  {
    "id": "cat-3",
    "_id": "67c51001a1e0b2001e000c03",
    "name": "Fashion – Women",
    "slug": "fashion-women",
    "description": "Designer sarees, graceful kurtis, elegant dresses, footwear, and trending handbags.",
    "icon": "ShoppingBag",
    "itemCount": 6,
    "gradient": "from-rose-500 to-pink-600",
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Sarees",
      "Kurtis",
      "Dresses",
      "Tops",
      "Jeans",
      "Handbags",
      "Heels",
      "Jewellery"
    ]
  },
  {
    "id": "cat-4",
    "_id": "67c51001a1e0b2001e000c04",
    "name": "Fashion – Kids",
    "slug": "fashion-kids",
    "description": "Vibrant boys and girls apparel, soft baby clothing, comfortable footwear, and toys.",
    "icon": "Baby",
    "itemCount": 5,
    "gradient": "from-amber-400 to-orange-500",
    "image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Boys Clothing",
      "Girls Clothing",
      "Baby Clothing",
      "Kids Shoes",
      "Toys"
    ]
  },
  {
    "id": "cat-5",
    "_id": "67c51001a1e0b2001e000c05",
    "name": "Home & Kitchen",
    "slug": "home-kitchen",
    "description": "Ergonomic furniture, smart kitchen appliances, non-stick cookware, and ambient decor.",
    "icon": "Home",
    "itemCount": 6,
    "gradient": "from-emerald-600 to-teal-700",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Furniture",
      "Sofas",
      "Beds",
      "Kitchen Appliances",
      "Cookware",
      "Home Decor",
      "Lighting",
      "Storage"
    ]
  },
  {
    "id": "cat-6",
    "_id": "67c51001a1e0b2001e000c06",
    "name": "Beauty & Personal Care",
    "slug": "beauty-personal-care",
    "description": "Dermatologist-tested skincare, luxury fragrances, haircare, and daily grooming.",
    "icon": "Sparkles",
    "itemCount": 5,
    "gradient": "from-purple-500 to-indigo-600",
    "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Skincare",
      "Makeup",
      "Haircare",
      "Perfumes",
      "Grooming",
      "Bath Products"
    ]
  },
  {
    "id": "cat-7",
    "_id": "67c51001a1e0b2001e000c07",
    "name": "Grocery & Essentials",
    "slug": "grocery-essentials",
    "description": "Farm-fresh fruits, organic pulses, healthy snacks, gourmet beverages, and cleaning.",
    "icon": "Apple",
    "itemCount": 5,
    "gradient": "from-green-600 to-emerald-700",
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Fruits",
      "Vegetables",
      "Rice",
      "Pulses",
      "Snacks",
      "Beverages",
      "Dairy",
      "Household Cleaning"
    ]
  },
  {
    "id": "cat-8",
    "_id": "67c51001a1e0b2001e000c08",
    "name": "Sports & Fitness",
    "slug": "sports-fitness",
    "description": "Pro gym equipment, athletic activewear, running shoes, and training essentials.",
    "icon": "Dumbbell",
    "itemCount": 5,
    "gradient": "from-red-500 to-orange-600",
    "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Gym Equipment",
      "Sportswear",
      "Shoes",
      "Cricket",
      "Football",
      "Fitness Accessories"
    ]
  },
  {
    "id": "cat-9",
    "_id": "67c51001a1e0b2001e000c09",
    "name": "Books & Stationery",
    "slug": "books-stationery",
    "description": "Bestselling novels, academic guides, leather journals, fountain pens, and desk supplies.",
    "icon": "BookOpen",
    "itemCount": 4,
    "gradient": "from-indigo-600 to-cyan-700",
    "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Academic Books",
      "Novels",
      "Notebooks",
      "Pens",
      "Office Supplies"
    ]
  },
  {
    "id": "cat-10",
    "_id": "67c51001a1e0b2001e000c10",
    "name": "Toys & Baby Products",
    "slug": "toys-baby-products",
    "description": "STEM educational toys, licensed action figures, safe baby strollers, and nursery gear.",
    "icon": "Gamepad2",
    "itemCount": 4,
    "gradient": "from-yellow-400 to-amber-600",
    "image": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Educational Toys",
      "Action Figures",
      "Baby Care",
      "Baby Accessories"
    ]
  },
  {
    "id": "cat-11",
    "_id": "67c51001a1e0b2001e000c11",
    "name": "Automotive",
    "slug": "automotive",
    "description": "Car phone mounts, smart dash cams, aerodynamic helmets, tools, and detailing gear.",
    "icon": "Car",
    "itemCount": 4,
    "gradient": "from-zinc-700 to-slate-900",
    "image": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Car Accessories",
      "Bike Accessories",
      "Helmets",
      "Vehicle Care",
      "Tools"
    ]
  },
  {
    "id": "cat-12",
    "_id": "67c51001a1e0b2001e000c12",
    "name": "Health & Wellness",
    "slug": "health-wellness",
    "description": "Air purifiers, orthopedic sleep supports, smart body scales, and wellness supplements.",
    "icon": "HeartPulse",
    "itemCount": 4,
    "gradient": "from-teal-500 to-emerald-600",
    "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Personal Care",
      "Fitness Accessories",
      "Wellness Essentials"
    ]
  },
  {
    "id": "cat-13",
    "_id": "67c51001a1e0b2001e000c13",
    "name": "Footwear",
    "slug": "footwear",
    "description": "Men, women and kids casual sneakers, formal brogues, sports cleats, and comfort sandals.",
    "icon": "Footprints",
    "itemCount": 5,
    "gradient": "from-blue-700 to-indigo-900",
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Men Shoes",
      "Women Shoes",
      "Kids Shoes",
      "Sandals",
      "Slippers"
    ]
  },
  {
    "id": "cat-14",
    "_id": "67c51001a1e0b2001e000c14",
    "name": "Jewellery & Accessories",
    "slug": "jewellery-accessories",
    "description": "Gold-finish necklaces, luxury chronograph watches, polarized sunglasses, and belts.",
    "icon": "Gem",
    "itemCount": 4,
    "gradient": "from-amber-500 to-yellow-600",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Gold-style Jewellery",
      "Fashion Jewellery",
      "Sunglasses",
      "Belts",
      "Watches"
    ]
  },
  {
    "id": "cat-15",
    "_id": "67c51001a1e0b2001e000c15",
    "name": "Pet Supplies",
    "slug": "pet-supplies",
    "description": "Nutritious dog and cat foods, interactive chew toys, grooming kits, and pet beds.",
    "icon": "PawPrint",
    "itemCount": 4,
    "gradient": "from-orange-500 to-rose-600",
    "image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80",
    "subcategories": [
      "Dog Food",
      "Cat Food",
      "Pet Toys",
      "Grooming Accessories"
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "_id": "67c51001a1e0b2001e000001",
    "id": "prod-01",
    "name": "Apple iPhone 15 Pro Max (256GB Titanium)",
    "slug": "apple-iphone-15-pro-max-titanium",
    "sku": "ELE-AP-001",
    "category": "Electronics",
    "subcategory": "Mobiles",
    "brand": "Apple",
    "price": 1199,
    "originalPrice": 1299,
    "discountPercentage": 8,
    "stock": 28,
    "rating": 4.9,
    "ratingCount": 320,
    "description": "Forged in aerospace-grade titanium with the breakthrough A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.",
    "features": [
      "A17 Pro chip with 6-core GPU",
      "Super Retina XDR display with ProMotion",
      "48MP Main camera with 5x Telephoto zoom",
      "Aerospace Titanium finish"
    ],
    "specifications": {
      "Processor": "A17 Pro",
      "Storage": "256GB",
      "Display": "6.7-inch OLED 120Hz",
      "Material": "Grade 5 Titanium"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-01",
        "userName": "Sarah Chen",
        "userEmail": "sarah.chen@example.com",
        "rating": 5,
        "comment": "The titanium weight reduction is immediately noticeable. Stunning camera performance.",
        "date": "2026-02-14",
        "verifiedPurchase": true
      },
      {
        "id": "rev-02",
        "userName": "Alexander Wright",
        "userEmail": "alex.wright@example.com",
        "rating": 5,
        "comment": "Battery lasts through 2 full days of travel. Incredible screen brightness outdoors.",
        "date": "2026-02-18",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-10T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000002",
    "id": "prod-02",
    "name": "Apple MacBook Pro 16\" M3 Max",
    "slug": "apple-macbook-pro-16-m3-max",
    "sku": "ELE-AP-002",
    "category": "Electronics",
    "subcategory": "Laptops",
    "brand": "Apple",
    "price": 3499,
    "originalPrice": 3899,
    "discountPercentage": 10,
    "stock": 14,
    "rating": 4.9,
    "ratingCount": 145,
    "description": "Equipped with M3 Max 16-core CPU, 40-core GPU, 48GB unified memory and Liquid Retina XDR display with 1600 nits peak brightness.",
    "features": [
      "Apple M3 Max chip",
      "16.2-inch Liquid Retina XDR display",
      "48GB Unified RAM + 1TB SSD",
      "Up to 22 hours battery life"
    ],
    "specifications": {
      "RAM": "48GB Unified",
      "Storage": "1TB SSD",
      "Battery": "Up to 22h",
      "Weight": "2.16 kg"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Pro Choice",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-03",
        "userName": "Marcus Sterling",
        "userEmail": "marcus.sterling@example.com",
        "rating": 5,
        "comment": "Compiles massive codebases and renders 8K video without the fans spinning up. Pure power.",
        "date": "2026-02-10",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-12T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000003",
    "id": "prod-03",
    "name": "Apple Watch Ultra 2 Titanium Cellular",
    "slug": "apple-watch-ultra-2-titanium",
    "sku": "ELE-AP-003",
    "category": "Electronics",
    "subcategory": "Smart Watches",
    "brand": "Apple",
    "price": 799,
    "originalPrice": 899,
    "discountPercentage": 11,
    "stock": 22,
    "rating": 4.8,
    "ratingCount": 189,
    "description": "Rugged and capable smartwatch designed for endurance athletes and ocean explorers with 49mm titanium case and 3000 nits display.",
    "features": [
      "49mm Grade 5 Titanium case",
      "Precision dual-frequency GPS",
      "Up to 72 hours in Low Power Mode",
      "100m water resistance"
    ],
    "specifications": {
      "Case Size": "49mm",
      "Material": "Titanium",
      "GPS": "Dual Frequency L1/L5",
      "Depth": "100m Certified"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Top Rated",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-04",
        "userName": "David Kim",
        "userEmail": "david.kim@example.com",
        "rating": 5,
        "comment": "The titanium bezel took a beating on granite boulders without a single scratch.",
        "date": "2026-02-05",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-15T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000004",
    "id": "prod-04",
    "name": "Sony WH-1000XM5 Wireless ANC Headphones",
    "slug": "sony-wh-1000xm5-wireless-anc-headphones",
    "sku": "ELE-SN-004",
    "category": "Electronics",
    "subcategory": "Headphones",
    "brand": "Sony",
    "price": 348,
    "originalPrice": 399,
    "discountPercentage": 13,
    "stock": 35,
    "rating": 4.9,
    "ratingCount": 260,
    "description": "Industry-leading noise canceling with two processors and 8 microphones. Specially designed 30mm driver unit delivers unmatched sound clarity.",
    "features": [
      "Integrated Processor V1 & HD Noise Canceling QN1",
      "Ultra-comfortable lightweight leather fit",
      "30-hour battery life with quick charge",
      "Crystal clear hands-free calling"
    ],
    "specifications": {
      "Battery": "30 hours",
      "Weight": "250g",
      "Codecs": "LDAC, AAC, SBC",
      "Bluetooth": "5.2 Multipoint"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Editor's Choice",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-05",
        "userName": "Elena Rostova",
        "userEmail": "elena.rostova@example.com",
        "rating": 5,
        "comment": "Cancels out subway noise completely. Best purchase of the year.",
        "date": "2026-02-20",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-18T11:00:00Z",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000005",
    "id": "prod-05",
    "name": "Sony Alpha A7 IV Full-Frame Mirrorless Camera",
    "slug": "sony-alpha-a7-iv-mirrorless",
    "sku": "ELE-SN-005",
    "category": "Electronics",
    "subcategory": "Cameras",
    "brand": "Sony",
    "price": 2298,
    "originalPrice": 2499,
    "discountPercentage": 8,
    "stock": 12,
    "rating": 4.9,
    "ratingCount": 94,
    "description": "33MP full-frame Exmor R back-illuminated CMOS sensor with real-time Eye AF for humans, animals, and birds. 4K 60p 10-bit recording.",
    "features": [
      "33MP Full-Frame Exmor R Sensor",
      "BIONZ XR image processing engine",
      "4K 60p 10-Bit 4:2:2 video",
      "759-point phase-detection AF"
    ],
    "specifications": {
      "Sensor": "33MP Full-Frame",
      "ISO Range": "100-51200",
      "Mount": "Sony E-Mount",
      "Stabilization": "5-Axis In-Body"
    },
    "isTrending": false,
    "isFeatured": true,
    "badge": "Pro Gear",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-06",
        "userName": "Chloe Dupont",
        "userEmail": "chloe.dupont@example.com",
        "rating": 5,
        "comment": "The autofocus tracking is magical. Incredible dynamic range.",
        "date": "2026-02-15",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-20T12:00:00Z",
    "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000006",
    "id": "prod-06",
    "name": "Ralph Lauren Classic Oxford Cotton Shirt",
    "slug": "ralph-lauren-classic-oxford-cotton-shirt",
    "sku": "FAS-RL-006",
    "category": "Fashion – Men",
    "subcategory": "Shirts",
    "brand": "Ralph Lauren",
    "price": 115,
    "originalPrice": 145,
    "discountPercentage": 21,
    "stock": 45,
    "rating": 4.8,
    "ratingCount": 178,
    "description": "Crafted from breathable long-staple cotton, this iconic button-down shirt is washed for a relaxed, lived-in feel from day one.",
    "features": [
      "100% Cotton Oxford fabric",
      "Button-down point collar",
      "Signature embroidered pony at left chest",
      "Split back yoke with box pleat"
    ],
    "specifications": {
      "Material": "100% Long-Staple Cotton",
      "Fit": "Custom Slim Fit",
      "Care": "Machine washable"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Classic",
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-07",
        "userName": "Omar Farooq",
        "userEmail": "omar.farooq@example.com",
        "rating": 5,
        "comment": "Superb drape and collar structure. Perfect under a blazer or with jeans.",
        "date": "2026-02-19",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-22T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000007",
    "id": "prod-07",
    "name": "Levi's 511 Slim Fit Selvedge Denim Jeans",
    "slug": "levis-511-slim-fit-selvedge-denim",
    "sku": "FAS-LV-007",
    "category": "Fashion – Men",
    "subcategory": "Jeans",
    "brand": "Levi's",
    "price": 98,
    "originalPrice": 128,
    "discountPercentage": 23,
    "stock": 60,
    "rating": 4.7,
    "ratingCount": 215,
    "description": "A modern slim with room to move. Premium selvedge denim woven on traditional shuttle looms with built-in stretch for all-day comfort.",
    "features": [
      "Premium red-line selvedge denim",
      "Slim through the hip and thigh",
      "Zip fly with signature button closure",
      "Leather Two Horse patch"
    ],
    "specifications": {
      "Fabric": "99% Cotton, 1% Elastane",
      "Rise": "Mid rise",
      "Inseam": "32 inches"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-08",
        "userName": "Lucas Silva",
        "userEmail": "lucas.silva@example.com",
        "rating": 5,
        "comment": "The selvedge roll-up looks sharp with boots. True to size.",
        "date": "2026-02-11",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-24T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000008",
    "id": "prod-08",
    "name": "Schott NYC Lambskin Leather Moto Jacket",
    "slug": "schott-nyc-lambskin-leather-moto-jacket",
    "sku": "FAS-SC-008",
    "category": "Fashion – Men",
    "subcategory": "Jackets",
    "brand": "Schott NYC",
    "price": 680,
    "originalPrice": 850,
    "discountPercentage": 20,
    "stock": 12,
    "rating": 4.9,
    "ratingCount": 88,
    "description": "Supple, drum-dyed full-grain lambskin with heavy brass hardware, bi-swing back panels, and quilted insulated interior lining.",
    "features": [
      "Full-grain genuine lambskin leather",
      "Heavy-duty antique brass zippers",
      "Quilted satin thermal interior",
      "Underarm footballs for arm movement"
    ],
    "specifications": {
      "Outer": "100% Genuine Lambskin",
      "Hardware": "Solid Brass",
      "Origin": "Handcrafted USA"
    },
    "isTrending": false,
    "isFeatured": true,
    "badge": "Heritage",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-09",
        "userName": "Alexander Wright",
        "userEmail": "alex.wright@example.com",
        "rating": 5,
        "comment": "Lifelong heirloom quality. The leather smells divine and breaks in gracefully.",
        "date": "2026-02-01",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-26T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000009",
    "id": "prod-09",
    "name": "Sabyasachi Heritage Banarasi Silk Saree",
    "slug": "sabyasachi-heritage-banarasi-silk-saree",
    "sku": "FAS-SB-009",
    "category": "Fashion – Women",
    "subcategory": "Sarees",
    "brand": "Sabyasachi",
    "price": 495,
    "originalPrice": 620,
    "discountPercentage": 20,
    "stock": 15,
    "rating": 4.9,
    "ratingCount": 112,
    "description": "Woven in Varanasi on antique jacquard looms, this pure mulberry silk saree features hand-spun gold zari floral jaal with an unstitched blouse piece.",
    "features": [
      "100% Pure Mulberry Silk",
      "Intricate gold zari kadhwa weaving",
      "Includes matching unstitched blouse fabric",
      "Dry clean only"
    ],
    "specifications": {
      "Length": "5.5 meters saree + 0.8m blouse",
      "Fabric": "Pure Katan Silk",
      "Zari": "Tested Fine Metallic Gold"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Exclusive",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-10",
        "userName": "Priya Patel",
        "userEmail": "priya.patel@example.com",
        "rating": 5,
        "comment": "The zari sheen and silk fall are breathtaking. Wore it to a wedding and got endless compliments.",
        "date": "2026-02-14",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-28T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000010",
    "id": "prod-10",
    "name": "Reformation Floral Linen Midi Dress",
    "slug": "reformation-floral-linen-midi-dress",
    "sku": "FAS-RF-010",
    "category": "Fashion – Women",
    "subcategory": "Dresses",
    "brand": "Reformation",
    "price": 248,
    "originalPrice": 298,
    "discountPercentage": 16,
    "stock": 30,
    "rating": 4.8,
    "ratingCount": 140,
    "description": "Sustainably woven from lightweight European flax linen, featuring a sweetheart neckline, smocked back bodice, and a side thigh slit.",
    "features": [
      "100% European Flax Linen",
      "Sweetheart neckline with tie detail",
      "Smocked back for customized fit",
      "Invisible back zipper"
    ],
    "specifications": {
      "Length": "Midi length 46 inches",
      "Fabric": "100% Linen",
      "Lining": "Viscose"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Trending",
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-11",
        "userName": "Sarah Chen",
        "userEmail": "sarah.chen@example.com",
        "rating": 5,
        "comment": "Linen stays cool in hot weather and the cut is so flattering.",
        "date": "2026-02-09",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-01-30T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000011",
    "id": "prod-11",
    "name": "Coach Willow Pebbled Leather Tote Bag",
    "slug": "coach-willow-pebbled-leather-tote",
    "sku": "FAS-CH-011",
    "category": "Fashion – Women",
    "subcategory": "Handbags",
    "brand": "Coach",
    "price": 350,
    "originalPrice": 425,
    "discountPercentage": 17,
    "stock": 20,
    "rating": 4.9,
    "ratingCount": 165,
    "description": "The carry-it-all tote crafted of polished pebble leather and signature canvas with a turnlock closure and center zip compartment.",
    "features": [
      "Polished pebble leather and coated canvas",
      "Center zip compartment",
      "Turnlock and magnetic snap closures",
      "Handles with 11.5\" drop"
    ],
    "specifications": {
      "Dimensions": "13.5\" (L) x 10.75\" (H) x 5.75\" (W)",
      "Hardware": "Polished Brass"
    },
    "isTrending": false,
    "isFeatured": true,
    "badge": "Luxury",
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-12",
        "userName": "Chloe Dupont",
        "userEmail": "chloe.dupont@example.com",
        "rating": 5,
        "comment": "Fits my 15-inch laptop, planner, and cosmetic bag with room to spare.",
        "date": "2026-02-18",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-01T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000012",
    "id": "prod-12",
    "name": "Nike Dri-FIT Sportswear Active Kids Hoodie",
    "slug": "nike-dri-fit-sportswear-active-kids-hoodie",
    "sku": "KID-NK-012",
    "category": "Fashion – Kids",
    "subcategory": "Boys Clothing",
    "brand": "Nike",
    "price": 48,
    "originalPrice": 60,
    "discountPercentage": 20,
    "stock": 50,
    "rating": 4.8,
    "ratingCount": 92,
    "description": "Soft fleece fabric with sweat-wicking Dri-FIT technology keeps young athletes warm and dry during practice and weekend play.",
    "features": [
      "Dri-FIT moisture wicking technology",
      "Fleece lining for lightweight warmth",
      "Front kangaroo hand pocket",
      "Ribbed cuffs and hem"
    ],
    "specifications": {
      "Material": "80% Cotton, 20% Polyester",
      "Fit": "Standard Athletic Fit"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Popular",
    "images": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-13",
        "userName": "Elena Rostova",
        "userEmail": "elena.rostova@example.com",
        "rating": 5,
        "comment": "Durable stitching and hasn't shrunk after multiple washes.",
        "date": "2026-02-12",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-02T11:00:00Z",
    "image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000013",
    "id": "prod-13",
    "name": "Burt's Bees Organic Cotton Zip Sleepsuit (Pack of 2)",
    "slug": "burts-bees-organic-cotton-sleepsuit",
    "sku": "KID-BB-013",
    "category": "Fashion – Kids",
    "subcategory": "Baby Clothing",
    "brand": "Burt's Bees Baby",
    "price": 32,
    "originalPrice": 40,
    "discountPercentage": 20,
    "stock": 75,
    "rating": 4.9,
    "ratingCount": 310,
    "description": "GOTS-certified 100% organic combed cotton sleeper with diagonal front zipper and protective snap tab for easy midnight diaper changes.",
    "features": [
      "GOTS Certified 100% Organic Cotton",
      "Inverted zipper for easy diaper access",
      "Non-slip bee-grip booties",
      "Elastic ankles keep feet in place"
    ],
    "specifications": {
      "Certification": "GOTS Standard",
      "Count": "2 Pack",
      "Safety": "Lead-free brass snaps"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Organic",
    "images": [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-14",
        "userName": "Priya Patel",
        "userEmail": "priya.patel@example.com",
        "rating": 5,
        "comment": "Gentle on sensitive newborn skin. The zipper guard prevents chin scratches.",
        "date": "2026-02-17",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-03T12:00:00Z",
    "image": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000014",
    "id": "prod-14",
    "name": "Breville Barista Touch Touchscreen Espresso Machine",
    "slug": "breville-barista-touch-espresso-machine",
    "sku": "HOM-BR-014",
    "category": "Home & Kitchen",
    "subcategory": "Kitchen Appliances",
    "brand": "Breville",
    "price": 999,
    "originalPrice": 1199,
    "discountPercentage": 16,
    "stock": 18,
    "rating": 4.9,
    "ratingCount": 220,
    "description": "Automated touchscreen technology allows you to easily swipe and select your favorite café coffee with 3-second heat up and automatic microfoam milk texturing.",
    "features": [
      "ThermoJet heating system reaches ideal temp in 3s",
      "Automated microfoam milk texturing with auto purge",
      "Integrated hardened steel conical burr grinder",
      "Pre-programmed café favorites menu"
    ],
    "specifications": {
      "Water Tank": "67 fl oz",
      "Heating": "ThermoJet 1680W",
      "Grinder": "Stainless Conical Burr"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-15",
        "userName": "Alexander Wright",
        "userEmail": "alex.wright@example.com",
        "rating": 5,
        "comment": "Silky microfoam latte art quality every morning. Paid for itself in 4 months.",
        "date": "2026-02-16",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-04T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000015",
    "id": "prod-15",
    "name": "Le Creuset Enameled Cast Iron Dutch Oven 5.5 Qt",
    "slug": "le-creuset-enameled-cast-iron-dutch-oven",
    "sku": "HOM-LC-015",
    "category": "Home & Kitchen",
    "subcategory": "Cookware",
    "brand": "Le Creuset",
    "price": 379,
    "originalPrice": 420,
    "discountPercentage": 9,
    "stock": 25,
    "rating": 4.9,
    "ratingCount": 380,
    "description": "Handcrafted in France since 1925, this indispensable kitchen classic delivers superior heat retention and distribution with crack-resistant vibrant enamel.",
    "features": [
      "Enameled cast iron provides uniform heat",
      "Ready to use, requires no seasoning",
      "Oven-safe up to 500°F with stainless steel knob",
      "Tight-fitting lid locks in moisture"
    ],
    "specifications": {
      "Capacity": "5.5 Quarts",
      "Origin": "Made in France",
      "Compatibility": "Gas, Electric, Ceramic, Halogen, Induction"
    },
    "isTrending": false,
    "isFeatured": true,
    "badge": "Lifetime Warranty",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-397a61d68a9f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-16",
        "userName": "Sarah Chen",
        "userEmail": "sarah.chen@example.com",
        "rating": 5,
        "comment": "Bakes the crispiest sourdough boules and braises meat into butter.",
        "date": "2026-02-08",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-05T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1584990347449-397a61d68a9f?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000016",
    "id": "prod-16",
    "name": "Estée Lauder Advanced Night Repair Serum 50ml",
    "slug": "estee-lauder-advanced-night-repair-serum",
    "sku": "BEA-EL-016",
    "category": "Beauty & Personal Care",
    "subcategory": "Skincare",
    "brand": "Estée Lauder",
    "price": 115,
    "originalPrice": 135,
    "discountPercentage": 14,
    "stock": 40,
    "rating": 4.9,
    "ratingCount": 420,
    "description": "Patented Chronolux Power Signal Technology penetrates deeply into skin to visibly reduce lines, boost firmness, and deliver 72-hour hydration.",
    "features": [
      "Chronolux Power Signal Technology",
      "Multi-molecular hyaluronic acid hydration",
      "Oil-free, fragrance-free formula",
      "Dermatologist and ophthalmologist-tested"
    ],
    "specifications": {
      "Volume": "50ml / 1.7 fl oz",
      "Skin Type": "All Skin Types",
      "Formulation": "Lightweight Liquid Serum"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Top Rated",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-17",
        "userName": "Chloe Dupont",
        "userEmail": "chloe.dupont@example.com",
        "rating": 5,
        "comment": "I wake up with radiant, supple skin every single day. Holy grail product.",
        "date": "2026-02-17",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-06T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000017",
    "id": "prod-17",
    "name": "Dyson Supersonic Ionic Hair Dryer",
    "slug": "dyson-supersonic-ionic-hair-dryer",
    "sku": "BEA-DY-017",
    "category": "Beauty & Personal Care",
    "subcategory": "Haircare",
    "brand": "Dyson",
    "price": 429,
    "originalPrice": 499,
    "discountPercentage": 14,
    "stock": 20,
    "rating": 4.9,
    "ratingCount": 198,
    "description": "Engineered for different hair types with intelligent heat control that measures air temperature over 40 times a second to prevent extreme heat damage.",
    "features": [
      "Dyson V9 digital motor rotates up to 110,000 RPM",
      "Intelligent heat control protects hair shine",
      "Includes 5 magnetic styling attachments",
      "Acoustically tuned for minimal noise"
    ],
    "specifications": {
      "Power": "1600W",
      "Weight": "1.8 lbs",
      "Cord Length": "9 ft"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Editor's Choice",
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-18",
        "userName": "Elena Rostova",
        "userEmail": "elena.rostova@example.com",
        "rating": 5,
        "comment": "Dries thick hair in under 6 minutes without leaving any frizz.",
        "date": "2026-02-04",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-07T11:00:00Z",
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000018",
    "id": "prod-18",
    "name": "Royal Basmati Authentic Aged Long Grain Rice (10 lbs)",
    "slug": "royal-basmati-authentic-aged-rice-10lb",
    "sku": "GRO-RY-018",
    "category": "Grocery & Essentials",
    "subcategory": "Rice",
    "brand": "Royal",
    "price": 24,
    "originalPrice": 29,
    "discountPercentage": 17,
    "stock": 80,
    "rating": 4.8,
    "ratingCount": 290,
    "description": "Naturally aged for 12 months in the Himalayan foothills to develop its delicate aroma and slender grains that cook up fluffy and non-sticky.",
    "features": [
      "Aged minimum 12 months",
      "Non-GMO Project Verified",
      "Naturally gluten-free grain",
      "Grows 2x in length upon boiling"
    ],
    "specifications": {
      "Weight": "10 lbs (4.54 kg)",
      "Origin": "Himalayan Region",
      "Packaging": "Resealable burlap zipper pouch"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Pantry Staple",
    "images": [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-19",
        "userName": "Omar Farooq",
        "userEmail": "omar.farooq@example.com",
        "rating": 5,
        "comment": "Fragrant and every grain separates cleanly for biryani.",
        "date": "2026-02-15",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-08T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000019",
    "id": "prod-19",
    "name": "Blue Bottle Coffee Bella Donovan Whole Bean Roast (12 oz)",
    "slug": "blue-bottle-coffee-bella-donovan-whole-bean",
    "sku": "GRO-BB-019",
    "category": "Grocery & Essentials",
    "subcategory": "Beverages",
    "brand": "Blue Bottle Coffee",
    "price": 21,
    "originalPrice": 25,
    "discountPercentage": 16,
    "stock": 65,
    "rating": 4.9,
    "ratingCount": 175,
    "description": "A decadent blend of organic Ethiopia and Sumatra specialty beans featuring luscious notes of raspberry, chocolate, and molasses.",
    "features": [
      "100% Certified Organic whole beans",
      "Notes of dark chocolate and ripe raspberry",
      "Nitrogen-flushed freshness packaging",
      "Small-batch artisan roasted"
    ],
    "specifications": {
      "Net Weight": "12 oz (340g)",
      "Roast Level": "Medium Dark",
      "Certifications": "USDA Organic"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Artisan",
    "images": [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-20",
        "userName": "Marcus Sterling",
        "userEmail": "marcus.sterling@example.com",
        "rating": 5,
        "comment": "Rich crema on the espresso machine. Deep berry finish.",
        "date": "2026-02-13",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-09T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000020",
    "id": "prod-20",
    "name": "Bowflex SelectTech 552 Adjustable Dumbbells (Pair)",
    "slug": "bowflex-selecttech-552-adjustable-dumbbells",
    "sku": "SPO-BX-020",
    "category": "Sports & Fitness",
    "subcategory": "Gym Equipment",
    "brand": "Bowflex",
    "price": 399,
    "originalPrice": 479,
    "discountPercentage": 16,
    "stock": 22,
    "rating": 4.8,
    "ratingCount": 340,
    "description": "Replaces 15 sets of weights. Adjusts from 5 to 52.5 lbs in 2.5 lb increments with a simple turn of the mechanical dial.",
    "features": [
      "Rapid adjustment from 5 to 52.5 lbs",
      "Durable molding around metal plates for quiet clanks",
      "Includes storage cradles for both dumbbells",
      "Access to JRNY on-demand workouts"
    ],
    "specifications": {
      "Weight Range": "5 to 52.5 lbs per dumbbell",
      "Dimensions": "16.9\" L x 8.3\" W x 9\" H"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Top Seller",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-21",
        "userName": "David Kim",
        "userEmail": "david.kim@example.com",
        "rating": 5,
        "comment": "Saved so much floor space in my apartment gym. The dial click is crisp and secure.",
        "date": "2026-02-11",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-10T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000021",
    "id": "prod-21",
    "name": "Nike ZoomX Vaporfly NEXT% 3 Road Racing Shoes",
    "slug": "nike-zoomx-vaporfly-next-3",
    "sku": "SPO-NK-021",
    "category": "Sports & Fitness",
    "subcategory": "Shoes",
    "brand": "Nike",
    "price": 260,
    "originalPrice": 295,
    "discountPercentage": 11,
    "stock": 30,
    "rating": 4.9,
    "ratingCount": 160,
    "description": "The peak of marathon racing speed. Features a full-length carbon fiber Flyplate nestled inside responsive ZoomX foam cushioning.",
    "features": [
      "Full-length carbon fiber Flyplate",
      "Nike ZoomX resilient foam midsole",
      "Engineered Flyknit breathable upper",
      "Waffle outsole pattern with directional traction"
    ],
    "specifications": {
      "Weight": "6.5 oz (Men's size 10)",
      "Drop": "8mm",
      "Terrain": "Road Racing / Marathon"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Marathon Pro",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-22",
        "userName": "Lucas Silva",
        "userEmail": "lucas.silva@example.com",
        "rating": 5,
        "comment": "Shaved 4 minutes off my half-marathon PR. Energy return is staggering.",
        "date": "2026-02-03",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-11T11:00:00Z",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000022",
    "id": "prod-22",
    "name": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "slug": "clean-code-robert-martin-hardcover",
    "sku": "BOK-PH-022",
    "category": "Books & Stationery",
    "subcategory": "Academic Books",
    "brand": "Prentice Hall",
    "price": 44,
    "originalPrice": 55,
    "discountPercentage": 20,
    "stock": 70,
    "rating": 4.8,
    "ratingCount": 512,
    "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. The definitive manual on software craftsmanship.",
    "features": [
      "Comprehensive principles, patterns, and practices",
      "Extensive case studies with progressive refactoring",
      "Collection of heuristics and smells",
      "Hardcover collector edition"
    ],
    "specifications": {
      "Author": "Robert C. Martin",
      "Pages": "464 pages",
      "Publisher": "Prentice Hall",
      "Binding": "Hardcover"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Must Read",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-23",
        "userName": "Sarah Chen",
        "userEmail": "sarah.chen@example.com",
        "rating": 5,
        "comment": "Required reading for every engineer. Transformed how our squad reviews PRs.",
        "date": "2026-02-14",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-12T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000023",
    "id": "prod-23",
    "name": "Montblanc Meisterstück Classique Ballpoint Pen",
    "slug": "montblanc-meisterstuck-classique-ballpoint",
    "sku": "BOK-MB-023",
    "category": "Books & Stationery",
    "subcategory": "Pens",
    "brand": "Montblanc",
    "price": 485,
    "originalPrice": 540,
    "discountPercentage": 10,
    "stock": 15,
    "rating": 4.9,
    "ratingCount": 78,
    "description": "The timeless icon of luxury writing. Deep black precious resin inlaid with the white Montblanc emblem, complemented by platinum-coated clip and rings.",
    "features": [
      "Deep black precious resin barrel",
      "Platinum-coated clip with individual serial number",
      "Smooth twist mechanism",
      "Handcrafted in Germany"
    ],
    "specifications": {
      "Writing System": "Ballpoint Pen",
      "Refills": "Montblanc Mystery Black / Pacific Blue",
      "Length": "137.1 mm"
    },
    "isTrending": false,
    "isFeatured": true,
    "badge": "Luxury",
    "images": [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-24",
        "userName": "Alexander Wright",
        "userEmail": "alex.wright@example.com",
        "rating": 5,
        "comment": "Signs contracts like butter on silk. An heirloom piece.",
        "date": "2026-02-09",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-13T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000024",
    "id": "prod-24",
    "name": "LEGO NASA Apollo Saturn V 1969-Piece Iconic Set",
    "slug": "lego-nasa-apollo-saturn-v-set",
    "sku": "TOY-LG-024",
    "category": "Toys & Baby Products",
    "subcategory": "Educational Toys",
    "brand": "LEGO",
    "price": 119,
    "originalPrice": 139,
    "discountPercentage": 14,
    "stock": 35,
    "rating": 4.9,
    "ratingCount": 450,
    "description": "Build the first rocket to put humans on the Moon! Features 3 removable rocket stages, lunar lander, lunar orbiter, and 3 astronaut microfigures.",
    "features": [
      "1969 pieces matching year of lunar landing",
      "1 meter (over 39 inches) high when built",
      "Horizontal display stands included",
      "Removable stages with rocket engine details"
    ],
    "specifications": {
      "Piece Count": "1969",
      "Height": "100 cm (39 inches)",
      "Age": "14+"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Iconic",
    "images": [
      "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-25",
        "userName": "Kenji Sato",
        "userEmail": "kenji.sato@example.com",
        "rating": 5,
        "comment": "Masterpiece build experience. The staging mechanisms are brilliantly engineered.",
        "date": "2026-02-16",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-14T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000025",
    "id": "prod-25",
    "name": "Shoei RF-1400 Aerodynamic Full Face Carbon Helmet",
    "slug": "shoei-rf-1400-full-face-helmet",
    "sku": "AUT-SH-025",
    "category": "Automotive",
    "subcategory": "Helmets",
    "brand": "Shoei",
    "price": 579,
    "originalPrice": 649,
    "discountPercentage": 10,
    "stock": 20,
    "rating": 4.9,
    "ratingCount": 135,
    "description": "Wind tunnel refined aerodynamics reduce wind noise and buffeting. Multi-ply AIM+ matrix shell provides Snell M2020 and DOT impact protection.",
    "features": [
      "Snell M2020 and DOT certified safety",
      "Wind tunnel tested noise reduction",
      "CWR-F2 Pinlock-ready optical shield",
      "Emergency Quick Release System (E.Q.R.S.)"
    ],
    "specifications": {
      "Certifications": "Snell M2020D & DOT",
      "Weight": "3.62 lbs",
      "Ventilation": "6 Air Intakes & 4 Outlets"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Safety First",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-26",
        "userName": "David Kim",
        "userEmail": "david.kim@example.com",
        "rating": 5,
        "comment": "Whisper quiet at 75mph highway speeds. Superior optical clarity.",
        "date": "2026-02-10",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-15T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000026",
    "id": "prod-26",
    "name": "Theragun PRO Plus 6-in-1 Percussive Therapy Massager",
    "slug": "theragun-pro-plus-percussive-therapy",
    "sku": "HEA-TH-026",
    "category": "Health & Wellness",
    "subcategory": "Fitness Accessories",
    "brand": "Therabody",
    "price": 499,
    "originalPrice": 599,
    "discountPercentage": 16,
    "stock": 25,
    "rating": 4.9,
    "ratingCount": 165,
    "description": "Multi-therapy device combining deep muscle percussive massage, near-infrared LED light therapy, vibration therapy, and heat therapy.",
    "features": [
      "16mm percussive amplitude for 60% deeper tissue penetration",
      "Near-infrared LED light therapy stimulates circulation",
      "Built-in biometric heart rate sensor",
      "Ergonomic multi-grip patented triangle handle"
    ],
    "specifications": {
      "Amplitude": "16mm",
      "Stall Force": "60 lbs",
      "Battery": "150 min runtime"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Pro Athlete",
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-27",
        "userName": "Lucas Silva",
        "userEmail": "lucas.silva@example.com",
        "rating": 5,
        "comment": "Relieves tight hamstrings and lower back knots immediately.",
        "date": "2026-02-18",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-16T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000027",
    "id": "prod-27",
    "name": "Nike Air Jordan 1 Retro High OG \"Chicago\"",
    "slug": "nike-air-jordan-1-retro-high-og-chicago",
    "sku": "FOO-NK-027",
    "category": "Footwear",
    "subcategory": "Men Shoes",
    "brand": "Nike",
    "price": 180,
    "originalPrice": 220,
    "discountPercentage": 18,
    "stock": 24,
    "rating": 4.9,
    "ratingCount": 420,
    "description": "The sneaker that started it all. Premium genuine leather construction with encapsulated Air-Sole cushioning in the iconic red, black, and white colorway.",
    "features": [
      "Full-grain premium leather upper",
      "Encapsulated Nike Air-Sole heel unit",
      "Solid rubber cupsole with deep flex grooves",
      "Woven Nike Air tongue label"
    ],
    "specifications": {
      "Colorway": "Varsity Red/Black/Sail",
      "Style": "High Top Basketball / Lifestyle"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Grail",
    "images": [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-28",
        "userName": "Kenji Sato",
        "userEmail": "kenji.sato@example.com",
        "rating": 5,
        "comment": "The leather quality is supple and the silhouette is pure perfection.",
        "date": "2026-02-15",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-17T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000028",
    "id": "prod-28",
    "name": "Birkenstock Arizona Soft Footbed Suede Sandals",
    "slug": "birkenstock-arizona-soft-footbed-suede",
    "sku": "FOO-BK-028",
    "category": "Footwear",
    "subcategory": "Sandals",
    "brand": "Birkenstock",
    "price": 140,
    "originalPrice": 165,
    "discountPercentage": 15,
    "stock": 45,
    "rating": 4.8,
    "ratingCount": 310,
    "description": "Legendary two-strap design crafted in velvety suede with an extra foam layer in the anatomically shaped cork-latex footbed for day-one comfort.",
    "features": [
      "Original Birkenstock soft footbed with integrated latex cushion",
      "Velvety natural suede upper",
      "Flexible lightweight EVA shock-absorbing sole",
      "Two individually adjustable metal pin buckles"
    ],
    "specifications": {
      "Upper": "Natural Suede Leather",
      "Footbed": "Natural Cork & Latex",
      "Origin": "Made in Germany"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Comfort Icon",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-29",
        "userName": "Sarah Chen",
        "userEmail": "sarah.chen@example.com",
        "rating": 5,
        "comment": "The soft footbed makes walking 15,000 steps completely painless.",
        "date": "2026-02-11",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-18T11:00:00Z",
    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000029",
    "id": "prod-29",
    "name": "Ray-Ban Classic Polarized Aviator Total Gold Sunglasses",
    "slug": "ray-ban-classic-polarized-aviator-gold",
    "sku": "JEW-RB-029",
    "category": "Jewellery & Accessories",
    "subcategory": "Sunglasses",
    "brand": "Ray-Ban",
    "price": 180,
    "originalPrice": 220,
    "discountPercentage": 18,
    "stock": 35,
    "rating": 4.8,
    "ratingCount": 280,
    "description": "Originally designed for U.S. aviators in 1937, featuring classic gold metal teardrop frames with G-15 polarized crystal green lenses.",
    "features": [
      "Polarized crystal green G-15 lenses block 99% reflected glare",
      "Lightweight yet durable gold monel frame",
      "Adjustable soft silicone nose pads",
      "100% UV400 radiation protection"
    ],
    "specifications": {
      "Lens Width": "58 mm",
      "Bridge": "14 mm",
      "Temple": "135 mm",
      "Lens": "Polarized Mineral Crystal"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Iconic",
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-30",
        "userName": "Omar Farooq",
        "userEmail": "omar.farooq@example.com",
        "rating": 5,
        "comment": "Reduces driving glare dramatically. Timeless pilot style.",
        "date": "2026-02-14",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-19T08:00:00Z",
    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000030",
    "id": "prod-30",
    "name": "Tissot PRX Powermatic 80 Automatic Stainless Steel Watch",
    "slug": "tissot-prx-powermatic-80-blue-dial",
    "sku": "JEW-TS-030",
    "category": "Jewellery & Accessories",
    "subcategory": "Watches",
    "brand": "Tissot",
    "price": 675,
    "originalPrice": 750,
    "discountPercentage": 10,
    "stock": 18,
    "rating": 4.9,
    "ratingCount": 195,
    "description": "1978 retro-modern masterpiece with an integrated brushed stainless steel bracelet, waffle textured sunray blue dial, and Swiss Powermatic 80 movement.",
    "features": [
      "Swiss Made Powermatic 80 automatic movement",
      "Up to 80 hours power reserve",
      "Patented Nivachron anti-magnetic balance spring",
      "Scratch-resistant sapphire crystal with anti-reflective coating"
    ],
    "specifications": {
      "Case Diameter": "40 mm",
      "Thickness": "10.9 mm",
      "Water Resistance": "100 meters / 330 ft"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Swiss Made",
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-31",
        "userName": "Marcus Sterling",
        "userEmail": "marcus.sterling@example.com",
        "rating": 5,
        "comment": "Punche way above its price point. The bracelet catches light beautifully.",
        "date": "2026-02-16",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-20T09:00:00Z",
    "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000031",
    "id": "prod-31",
    "name": "Royal Canin Golden Retriever Adult Dry Dog Food (30 lb)",
    "slug": "royal-canin-golden-retriever-adult-30lb",
    "sku": "PET-RC-031",
    "category": "Pet Supplies",
    "subcategory": "Dog Food",
    "brand": "Royal Canin",
    "price": 94,
    "originalPrice": 109,
    "discountPercentage": 13,
    "stock": 50,
    "rating": 4.9,
    "ratingCount": 380,
    "description": "Tailor-made nutrition designed exclusively for purebred Golden Retrievers 15 months and older with EPA and DHA to reinforce the skin barrier and cardiac health.",
    "features": [
      "Exclusive kibble shape encourages chewing",
      "Enriched with EPA and DHA omega-3 fatty acids",
      "Optimal calories maintain ideal healthy weight",
      "Taurine supports healthy cardiac function"
    ],
    "specifications": {
      "Weight": "30 lb bag",
      "Breed": "Golden Retriever 15mo+",
      "Primary Protein": "Chicken Meal & Brown Rice"
    },
    "isTrending": true,
    "isFeatured": true,
    "badge": "Veterinarian Recommended",
    "images": [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-32",
        "userName": "Elena Rostova",
        "userEmail": "elena.rostova@example.com",
        "rating": 5,
        "comment": "My Golden's coat is gleaming and silky since switching to this formula.",
        "date": "2026-02-17",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-21T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
  },
  {
    "_id": "67c51001a1e0b2001e000032",
    "id": "prod-32",
    "name": "KONG Classic Durable Rubber Treat Dog Toy (Large)",
    "slug": "kong-classic-dog-toy-large",
    "sku": "PET-KG-032",
    "category": "Pet Supplies",
    "subcategory": "Pet Toys",
    "brand": "KONG",
    "price": 16,
    "originalPrice": 20,
    "discountPercentage": 20,
    "stock": 85,
    "rating": 4.8,
    "ratingCount": 520,
    "description": "The gold standard of dog toys for over 40 years. Ultra-durable red natural rubber formula with unpredictable bounce for games of fetch and stuffing treats.",
    "features": [
      "Mentally stimulating erratic bounce",
      "Stuff with peanut butter, kibble, or treats",
      "Durable all-natural red rubber",
      "Veterinarians and trainers worldwide recommend"
    ],
    "specifications": {
      "Size": "Large (for dogs 30-65 lbs)",
      "Material": "Natural Vulcanized Rubber"
    },
    "isTrending": true,
    "isFeatured": false,
    "badge": "Durable",
    "images": [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
    ],
    "reviews": [
      {
        "id": "rev-33",
        "userName": "Kenji Sato",
        "userEmail": "kenji.sato@example.com",
        "rating": 5,
        "comment": "Freezing it with peanut butter keeps our pup entertained for an hour straight.",
        "date": "2026-02-14",
        "verifiedPurchase": true
      }
    ],
    "createdAt": "2026-02-22T11:00:00Z",
    "image": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80"
  },
  ...(ADDITIONAL_PRODUCTS as any[]),
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Administrator',
    email: 'admin@shopease.com',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    avatarColor: 'bg-indigo-600',
    savedAddresses: [],
    joinedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr-cust-01',
    name: 'Alexander Wright',
    email: 'alex.wright@example.com',
    role: 'customer',
    phone: '+1 (555) 392-1049',
    avatarColor: 'bg-blue-600',
    savedAddresses: [],
    joinedAt: '2025-06-12T10:15:00Z',
    totalOrders: 3,
    totalSpent: 748.0,
  },
  {
    id: 'usr-cust-02',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'customer',
    phone: '+1 (555) 782-3490',
    avatarColor: 'bg-violet-600',
    savedAddresses: [],
    joinedAt: '2025-09-04T14:32:00Z',
    totalOrders: 4,
    totalSpent: 1120.0,
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_STOCK_LOGS: StockLog[] = [
  {
    id: 'log-1',
    productId: 'prod-02',
    productName: 'ChronoX Titanium Smartwatch',
    previousStock: 15,
    newStock: 8,
    changeAmount: -7,
    reason: 'Customer Order',
    timestamp: '2026-02-28T14:32:00Z',
    performedBy: 'Automated Checkout Engine',
  },
  {
    id: 'log-2',
    productId: 'prod-06',
    productName: 'PrecisionGlide 4K Wireless Mouse',
    previousStock: 20,
    newStock: 4,
    changeAmount: -16,
    reason: 'Customer Order',
    timestamp: '2026-03-01T10:15:00Z',
    performedBy: 'Automated Checkout Engine',
  },
  {
    id: 'log-3',
    productId: 'prod-01',
    productName: 'UltraPulse Studio ANC Headphones',
    previousStock: 10,
    newStock: 25,
    changeAmount: 15,
    reason: 'Restock',
    timestamp: '2026-02-26T09:00:00Z',
    performedBy: 'admin@shopease.com',
  },
];

export const MONGO_QUERY_PRESETS: MongoQueryPreset[] = [
  {
    id: 'q1',
    title: 'Find In-Stock Audio Products',
    category: 'Filtering & Projection',
    description: 'Retrieves all audio category products with stock greater than zero, sorted by rating descending.',
    collection: 'products',
    queryCode: `db.products.find(
  { 
    category: "Audio", 
    stock: { $gt: 0 } 
  },
  { 
    name: 1, 
    price: 1, 
    rating: 1, 
    stock: 1 
  }
).sort({ rating: -1 })`,
    equivalentSql: `SELECT name, price, rating, stock 
FROM products 
WHERE category = 'Audio' AND stock > 0 
ORDER BY rating DESC;`,
    explanation: 'MongoDB uses declarative BSON query objects. The second parameter specifies projection (1 = include, 0 = exclude). Uses compound index { category: 1, rating: -1 } for instant sub-millisecond execution.',
  },
  {
    id: 'q2',
    title: 'Aggregate Revenue by Order Status',
    category: 'Aggregation Pipeline',
    description: 'Groups orders by their delivery status and calculates total sales volume and order count.',
    collection: 'orders',
    queryCode: `db.orders.aggregate([
  {
    $group: {
      _id: "$orderStatus",
      totalRevenue: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
])`,
    equivalentSql: `SELECT 
  order_status, 
  SUM(total) AS total_revenue, 
  AVG(total) AS avg_order_value, 
  COUNT(*) AS order_count 
FROM orders 
GROUP BY order_status 
ORDER BY total_revenue DESC;`,
    explanation: 'The MongoDB Aggregation Framework processes documents through an assembly-line pipeline. $group accumulates values, and $sort reorders the result set.',
  },
  {
    id: 'q3',
    title: 'Low Stock Inventory Alert (< 10 units)',
    category: 'Conditional Query',
    description: 'Finds products requiring immediate replenishment with remaining stock below 10 units.',
    collection: 'products',
    queryCode: `db.products.find(
  { stock: { $lte: 10 } },
  { name: 1, sku: 1, stock: 1, price: 1 }
).sort({ stock: 1 })`,
    equivalentSql: `SELECT name, sku, stock, price 
FROM products 
WHERE stock <= 10 
ORDER BY stock ASC;`,
    explanation: 'Employs comparison operator $lte (less than or equal). Ideal for real-time warehouse threshold monitors and scheduled restock webhooks.',
  },
  {
    id: 'q4',
    title: 'Customer Orders $lookup (LEFT OUTER JOIN)',
    category: 'Joins & Relations',
    description: 'Performs a document join between the customers collection and their placed orders.',
    collection: 'customers',
    queryCode: `db.customers.aggregate([
  {
    $match: { role: "customer" }
  },
  {
    $lookup: {
      from: "orders",
      localField: "id",
      foreignField: "customerId",
      as: "orderHistory"
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      totalOrdersPlaced: { $size: "$orderHistory" },
      lifetimeSpent: { $sum: "$orderHistory.total" }
    }
  }
])`,
    equivalentSql: `SELECT 
  c.name, 
  c.email, 
  COUNT(o.id) AS total_orders_placed, 
  COALESCE(SUM(o.total), 0) AS lifetime_spent 
FROM customers c 
LEFT JOIN orders o ON c.id = o.customer_id 
WHERE c.role = 'customer' 
GROUP BY c.id, c.name, c.email;`,
    explanation: '$lookup performs an idiomatic left outer join to an unsharded collection in the same database. Perfect when referencing separate collections without embedding large arrays.',
  },
  {
    id: 'q5',
    title: 'Atomic Inventory Stock Decrement',
    category: 'Atomic Mutations',
    description: 'Safely decreases product inventory upon customer checkout using atomic $inc with condition.',
    collection: 'products',
    queryCode: `db.products.updateOne(
  { 
    _id: ObjectId("67c51001a1e0b2001e000001"), 
    stock: { $gte: 2 } 
  },
  { 
    $inc: { stock: -2 },
    $set: { updatedAt: new Date() }
  }
)`,
    equivalentSql: `UPDATE products 
SET stock = stock - 2, updated_at = NOW() 
WHERE id = '67c51001a1e0b2001e000001' AND stock >= 2;`,
    explanation: 'Guarantees isolation without requiring heavy distributed table locks. The query condition `stock >= 2` prevents race conditions and overselling.',
  },
];
