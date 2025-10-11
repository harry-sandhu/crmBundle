import { type Product, sampleProducts } from "../data/sampleProducts";

export const fakeApi = {
  async getProducts(): Promise<Product[]> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    return sampleProducts;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    await new Promise((r) => setTimeout(r, 300));
    return sampleProducts.find((p) => p.id === id);
  },
};
