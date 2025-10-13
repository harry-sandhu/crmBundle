export interface Product {
  id: string;
  name: string;
  description: string;
  // price: number;
  image: string;
  category: string;
  mrp:number;
  dp:number;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Organic Wheat",
    description: "High-quality organic wheat grain for flour production.",
    // price: 2500,
    image: "../../wheat.webp",
    category: "Cereals",
    mrp:1500,
    dp:2000,
  },
  {
    id: "2",
    name: "Basmati Rice",
    description: "Premium long-grain aromatic rice grown in Punjab.",
    // price: 3000,
    image: "../../rice.jpg",
    category: "Cereals",
    mrp:1500,
    dp:2000,
  },
  {
    id: "3",
    name: "Cotton",
    description: "Soft, high-yield cotton fiber for textiles.",
    // price: 4200,
    image: "../../cotton.webp",
    category: "Fiber Crops",
    mrp:1500,
    dp:2000,
  },
  {
    id: "4",
    name: "Mustard Seeds",
    description: "Rich in oil content, perfect for mustard oil extraction.",
    // price: 1900,
    image: "../../MustardSeeds.webp",
    category: "Oilseeds",
    mrp:1500,
    dp:2000,
  },
  {
  id: "5",
  name: "SOHUM Gas Safety Device",
  description: "Ensure kitchen safety with the SOHUM gas safety regulator featuring real-time pressure meter and auto shut-off for leaks or excess flow.",
  // price: 1200,
  image: "../../safetydevice.jpeg",
  category: "Kitchen Safety",
  mrp:1500,
    dp:2000,
},

{
  id: "6",
  name: "Gas Safety Regulator",
  description: "Premium brass gas regulator with integrated pressure gauge for monitoring and controlling LPG cylinder usage. Enhances home safety.",
  // price: 1350,
  image: "../../regulator.jpeg",
  category: "Kitchen Safety",
  mrp:1500,
    dp:2000,
},

{
  id: "7",
  name: "Portable Water Geyser",
  description: "BIO portable geyser provides instant hot water for kitchens and bathrooms. Easy to install, energy efficient, and complete with safety controls.",
  // price: 1700,
  image: "../../geyser.jpeg",
  category: "Appliances",
  mrp:1500,
    dp:2000,
},

{
  id: "8",
  name: "Stainless Steel Water Camper",
  description: "Durable stainless steel water camper for safe storage and serving of drinking water. Leak-proof design, ideal for homes and travel.",
  // price: 750,
  image: "../../camper.jpeg",
  category: "Storage & Utility",
  mrp:1500,
    dp:2000,
},

{
  id: "9",
  name: "Louis Miller Magnetic Bracelet",
  description: "Elegant gold-finish Louis Miller bracelet embedded with health magnets. Stylish accessory for everyday wellness and fashion.",
  // price: 2200,
  image: "../../bracelet.jpeg",
  category: "Accessories",
  mrp:1500,
    dp:2000,
}

];
