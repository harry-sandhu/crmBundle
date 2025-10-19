export interface Product {
  id: string;
  name: string;
  description: string;
  // price: number;
  image: string;
  category: string;
  mrp:number;
  dp:number;
  pv:number;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "ELECTRICAL BURNAL CHULHA",
    description: "Deliver fast, reliable cooking with a durable gas chulha designed for Indian kitchens and daily multitasking. Built with high‑efficiency brass burners for uniform heat, it offers precise flame control through smooth, ergonomic knobs for everything from high‑heat tadka to slow simmering. Toughened glass or stainless‑steel tops resist heat, stains, and corrosion, while anti‑skid feet and sturdy pan supports keep heavy kadhais stable.",
    // price: 2500,
    image: "../../stove.jpeg",
    category: "Stove",
    mrp:5500,
    dp:3550,
    pv:300,
  },
  {
    id: "2",
    name: "solar energy",
    description: "Generate clean, reliable power with high‑efficiency mono or polycrystalline solar panels engineered for rooftops and ground mounts. Tough, anti‑reflective tempered glass and an anodized aluminum frame deliver weather resistance against wind, rain, and UV, while bypass diodes reduce power drop from shade.",
    // price: 3000,
    image: "../../panel.jpeg",
    category: "Solar Panel",
    mrp:75000,
    dp:55000,
    pv:10,
  },
  {
    id: "3",
    name: "GEYSER AUTO CUT",
    description: "Stay safe and save power with a compact instant water geyser featuring automatic cut-off protection. The built‑in thermostat and thermal cut‑out stop the heating element when water reaches the set temperature or if overheating is detected, preventing dry‑heating and extending element life",
    // price: 4200,
    image: "../../geyser.jpeg",
    category: "Geyser",
    mrp:3500,
    dp:2850,
    pv:200,
  },
  {
    id: "4",
     
  name: "Sanitary Magnetic Napkin – 1 Packet = 8 Pieces, 5 Pack = 40 Pieces",

    description: "Stay fresh and protected with a soft, breathable sanitary napkin pack designed for day and night confidence. Each pad features a cotton‑feel top sheet that’s gentle on skin, an anion/magnetic layer branding for odor control, and a super‑absorbent core that locks leakage to keep the surface dry. Secure wings and a flexible, contoured shape prevent side spills, while a leak‑guard rim offers extra safety during movement.",
    // price: 1900,
    image: "../../napkin.jpeg",
    category: "napkin",
    mrp:1100,
    dp:1050,
    pv:100,
  },
  {
  id: "5",
  name: "SOHUM Gas Safety Device",
  description: "Ensure kitchen safety with the SOHUM gas safety regulator featuring real-time pressure meter and auto shut-off for leaks or excess flow.",
  // price: 1200,
  image: "../../safetydevice.jpeg",
  category: "Kitchen Safety",
  mrp:4500,
    dp:2550,
    pv:200,
},

// {
//   id: "6",
//   name: "Gas Safety Regulator",
//   description: "Premium brass gas regulator with integrated pressure gauge for monitoring and controlling LPG cylinder usage. Enhances home safety.",
//   // price: 1350,
//   image: "../../regulator.jpeg",
//   category: "Kitchen Safety",
//   mrp:1500,
//     dp:2000,
// },

// {
//   id: "7",
//   name: "Portable Water Geyser",
//   description: "BIO portable geyser provides instant hot water for kitchens and bathrooms. Easy to install, energy efficient, and complete with safety controls.",
//   // price: 1700,
//   image: "../../geyser.jpeg",
//   category: "Appliances",
//   mrp:1500,
//     dp:2000,
// },

{
  id: "6",
  name: "5 LITRE BADA ALKALINE WATER JAR",
  description: "Durable stainless steel water camper for safe storage and serving of drinking water. Leak-proof design, ideal for homes and travel.",
  // price: 750,
  image: "../../camper.jpeg",
  category: "Jar",
  mrp:9000,
  dp:6650,
  pv:600,
},

{
  id: "7",
  name: "2.5 LITRE  ALKALINE WATER JAR",
  description: "Durable stainless steel water camper for safe storage and serving of drinking water. Leak-proof design, ideal for homes and travel.",
  // price: 2200,
  image: "../../camper.jpeg",
  category: "Jar",
  mrp:7000,
    dp:4275,
    pv:400,
},
{
  id: "8",
  name: "Louis Miller Magnetic Bracelet",
  description: "Elegant gold-finish Louis Miller bracelet embedded with health magnets. Stylish accessory for everyday wellness and fashion",
  // price: 2200,
  image: "../../bracelet.jpeg",
  category: "Jar",
  mrp:4500,
  dp:2550,
  pv:200,
}


];
