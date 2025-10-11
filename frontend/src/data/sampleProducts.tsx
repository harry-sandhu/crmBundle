export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Organic Wheat",
    description: "High-quality organic wheat grain for flour production.",
    price: 2500,
    image: "/images/wheat.jpg",
    category: "Cereals",
  },
  {
    id: "2",
    name: "Basmati Rice",
    description: "Premium long-grain aromatic rice grown in Punjab.",
    price: 3000,
    image: "/images/rice.jpg",
    category: "Cereals",
  },
  {
    id: "3",
    name: "Cotton",
    description: "Soft, high-yield cotton fiber for textiles.",
    price: 4200,
    image: "/images/cotton.jpg",
    category: "Fiber Crops",
  },
  {
    id: "4",
    name: "Mustard Seeds",
    description: "Rich in oil content, perfect for mustard oil extraction.",
    price: 1900,
    image: "/images/mustard.jpg",
    category: "Oilseeds",
  },
];
