import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_REVIEWS, PRODUCTS } from '../data/products';
import {
  CartItem,
  DemoOrder,
  Product,
  ProductReview,
} from '../types';
import { evaluateCoupon } from '../utils/currency';

export interface ToastMessage {
  id: string;
  message: string;
  variant: 'success' | 'info' | 'warning';
}

export interface DemoCustomerProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  demoOrders: DemoOrder[];
  profile: DemoCustomerProfile;
  couponCode: string;
  couponDiscount: number;
  cartSubtotal: number;
  cartTotalQuantity: number;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastMessage[];
  addToCart: (product: Product, variantId?: string, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, productName?: string) => void;
  isInWishlist: (productId: string) => boolean;
  recordRecentlyViewed: (productId: string) => void;
  applyCoupon: (code: string) => { valid: boolean; message: string };
  clearCoupon: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  showToast: (message: string, variant?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  placeDemoOrder: (order: DemoOrder) => void;
  updateProfile: (profile: DemoCustomerProfile) => void;
  getProductReviews: (productId: string) => ProductReview[];
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'avado_beauty_cart_v1',
  WISHLIST: 'avado_beauty_wishlist_v1',
  RECENT: 'avado_beauty_recent_v1',
  ORDERS: 'avado_beauty_orders_v1',
  PROFILE: 'avado_beauty_profile_v1',
  REVIEWS: 'avado_beauty_reviews_v1',
  COUPON: 'avado_beauty_coupon_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getItemUnitPrice(product: Product, variantId: string): number {
  const base = product.discountPrice ?? product.price;
  const variant = product.variants.find((v) => v.id === variantId);
  const delta = variant?.priceDelta ?? 0;
  return Math.max(50, base + delta);
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(STORAGE_KEYS.WISHLIST, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.RECENT, ['p-boj-relief-sun', 'p-cosrx-snail-mucin', 'p-maybelline-fitme-foundation'])
  );
  const [demoOrders, setDemoOrders] = useState<DemoOrder[]>(() => readStorage(STORAGE_KEYS.ORDERS, []));
  const [profile, setProfile] = useState<DemoCustomerProfile>(() =>
    readStorage(STORAGE_KEYS.PROFILE, {
      name: '',
      phone: '',
      email: '',
      city: 'Dhaka',
      address: '',
    })
  );
  const [customReviews, setCustomReviews] = useState<Record<string, ProductReview[]>>(() =>
    readStorage(STORAGE_KEYS.REVIEWS, {})
  );
  const [couponCode, setCouponCode] = useState<string>(() => readStorage(STORAGE_KEYS.COUPON, ''));

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
    } catch {}
  }, [demoOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(customReviews));
    } catch {}
  }, [customReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(couponCode));
    } catch {}
  }, [couponCode]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, variant: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
    window.setTimeout(() => {
      dismissToast(id);
    }, 3200);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + getItemUnitPrice(product, item.variantId) * item.quantity;
    }, 0);
  }, [cart]);

  const cartTotalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const couponDiscount = useMemo(() => {
    if (!couponCode) return 0;
    const result = evaluateCoupon(couponCode, cartSubtotal);
    return result.valid ? result.discount : 0;
  }, [couponCode, cartSubtotal]);

  const addToCart = (
    product: Product,
    variantId?: string,
    quantity = 1,
    openDrawer = false
  ) => {
    const chosenVariant =
      product.variants.find((v) => v.id === variantId) ?? product.variants[0];
    if (!chosenVariant) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.variantId === chosenVariant.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(20, updated[existingIndex].quantity + quantity),
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: chosenVariant.id,
          variantLabel: chosenVariant.label,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} (${chosenVariant.label}) to bag`, 'success');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: Math.min(20, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
    showToast('Item removed from your bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  const toggleWishlist = (productId: string, productName?: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [productId, ...prev];
      showToast(
        exists
          ? `Removed ${productName ?? 'item'} from wishlist`
          : `Saved ${productName ?? 'item'} to wishlist`,
        exists ? 'info' : 'success'
      );
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const recordRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const applyCoupon = (code: string) => {
    const res = evaluateCoupon(code, cartSubtotal);
    if (res.valid && res.coupon) {
      setCouponCode(res.coupon.code);
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'warning');
    }
    return { valid: res.valid, message: res.message };
  };

  const clearCoupon = () => {
    setCouponCode('');
    showToast('Coupon removed', 'info');
  };

  const placeDemoOrder = (order: DemoOrder) => {
    setDemoOrders((prev) => [order, ...prev]);
    setProfile({
      name: order.customerName,
      phone: order.phone,
      email: order.email,
      city: order.city,
      address: order.address,
    });
    clearCart();
  };

  const updateProfile = (next: DemoCustomerProfile) => {
    setProfile(next);
    showToast('Saved delivery details locally', 'success');
  };

  const getProductReviews = (productId: string): ProductReview[] => {
    const seeded = INITIAL_REVIEWS[productId] ?? [];
    const custom = customReviews[productId] ?? [];
    return [...custom, ...seeded];
  };

  const addProductReview = (
    productId: string,
    review: Omit<ProductReview, 'id' | 'date' | 'verified'>
  ) => {
    const created: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      verified: true,
    };
    setCustomReviews((prev) => ({
      ...prev,
      [productId]: [created, ...(prev[productId] ?? [])],
    }));
    showToast('Thank you! Your review has been published.', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        recentlyViewed,
        demoOrders,
        profile,
        couponCode,
        couponDiscount,
        cartSubtotal,
        cartTotalQuantity,
        isCartOpen,
        isSearchOpen,
        quickViewProduct,
        toasts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        recordRecentlyViewed,
        applyCoupon,
        clearCoupon,
        setIsCartOpen,
        setIsSearchOpen,
        setQuickViewProduct,
        showToast,
        dismissToast,
        placeDemoOrder,
        updateProfile,
        getProductReviews,
        addProductReview,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
