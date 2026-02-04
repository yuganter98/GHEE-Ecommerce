import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    cartDetails: any[]; // Rich data (name, price, image) from server
    isCartOpen: boolean;
    serverTotal: number;
    warnings: string[];
    addItem: (id: number) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    openCart: () => void;
    closeCart: () => void;
    validateCart: () => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            cartDetails: [], // Initial state
            isCartOpen: false,
            serverTotal: 0,
            warnings: [],

            addItem: (id) => {
                const items = get().items;
                const exists = items.find(i => i.id === id);
                if (exists) {
                    set({ items: items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i) });
                } else {
                    set({ items: [...items, { id, quantity: 1 }] });
                }
                get().openCart();
                get().validateCart(); // Validates on server immediately
            },

            removeItem: (id) => {
                set({ items: get().items.filter(i => i.id !== id) });
                get().validateCart();
            },

            updateQuantity: (id, q) => {
                if (q < 1) return get().removeItem(id);
                set({ items: get().items.map(i => i.id === id ? { ...i, quantity: q } : i) });
                get().validateCart();
            },

            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),
            clearCart: () => set({ items: [], cartDetails: [], serverTotal: 0, warnings: [] }),

            validateCart: async () => {
                const items = get().items;
                if (items.length === 0) {
                    set({ serverTotal: 0, warnings: [] });
                    return;
                }

                try {
                    const res = await fetch('/api/cart/validate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items }),
                        cache: 'no-store'
                    });
                    if (!res.ok) throw new Error('Validation failed');
                    const data = await res.json();

                    // If warnings exist (e.g. stock clamp), update client state if needed
                    // Ideally we sync client items to server items here
                    const validatedItems = data.items;

                    set({
                        serverTotal: data.total,
                        warnings: data.warnings || [],
                        cartDetails: validatedItems // Save rich data
                    });

                } catch (err) {
                    console.error(err);
                }
            }
        }),
        {
            name: 'ghee-cart',
            skipHydration: true // Avoid Next.js hydration mismatch
        }
    )
);
