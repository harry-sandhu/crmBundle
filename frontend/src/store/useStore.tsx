import { create } from "zustand";
import { persist } from "zustand/middleware";

// ===============================
// 🧩 BUNDLE TYPES
// ===============================
export interface BundleItem {
  productId: string;
  title: string;
  qty: number;
  // price: number;
   mrp: number;
   dp: number;
}

export interface BundleState {
  items: BundleItem[];
  notes: string;
  addItem: (item: BundleItem) => void;
  removeItem: (productId: string) => void;
  setNotes: (notes: string) => void;
  clearBundle: () => void;
}

// ===============================
// 👤 USER TYPES
// ===============================
export type UserRole = "user" | "admin";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
}

export interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

// ===============================
// 🧠 Bundle Store (Persistent)
// ===============================
export const useBundleStore = create<BundleState>()(
  persist(
    (set) => ({
      items: [],
      notes: "",

      addItem: (item: BundleItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setNotes: (notes: string) => set({ notes }),

      clearBundle: () => set({ items: [], notes: "" }),
    }),
    { name: "bundle-storage" }
  )
);

// ===============================
// 👤 User Store (Type-Safe)
// ===============================
export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user: UserProfile) => set({ user }),

  clearUser: () => set({ user: null }),
}));
