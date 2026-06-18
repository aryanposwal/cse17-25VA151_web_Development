import { useEffect, useMemo, useState } from "react";
import "./App.css";

const PRODUCTS = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro",
    category: "Electronics",
    price: 79999,
    originalPrice: 89999,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    category: "Electronics",
    price: 114999,
    originalPrice: 124999,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Electronics",
    price: 24999,
    originalPrice: 34999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e736769a7e?w=600&h=600&fit=crop",
  },
  {
    id: 4,
    name: "Nike Air Max 270",
    category: "Fashion",
    price: 8995,
    originalPrice: 12995,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  },
  {
    id: 5,
    name: "Levi's 511 Slim Jeans",
    category: "Fashion",
    price: 2999,
    originalPrice: 4999,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
  },
  {
    id: 6,
    name: "Instant Pot Duo 7-in-1",
    category: "Home & Kitchen",
    price: 6499,
    originalPrice: 9999,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop",
  },
  {
    id: 7,
    name: "Philips Air Fryer XXL",
    category: "Home & Kitchen",
    price: 8999,
    originalPrice: 13999,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1648147934047-a5f52c7b1aa3?w=600&h=600&fit=crop",
  },
  {
    id: 8,
    name: "Atomic Habits",
    category: "Books",
    price: 399,
    originalPrice: 599,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=600&fit=crop",
  },
  {
    id: 9,
    name: "The Alchemist",
    category: "Books",
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop",
  },
  {
    id: 10,
    name: "Adidas Ultraboost 23",
    category: "Fashion",
    price: 11999,
    originalPrice: 15999,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
  },
];

const CATEGORIES = ["All", ...new Set(PRODUCTS.map((product) => product.category))];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const savedCart = window.localStorage.getItem("shopeasy-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("shopeasy-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 49;
  const tax = Math.round(cartSubtotal * 0.18);
  const totalAmount = cartSubtotal + shipping + tax;

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.toastTimeout);
    window.toastTimeout = window.setTimeout(() => setToast(""), 2200);
  };

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
    showToast("Item removed from cart");
  };

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared");
  };

  const checkout = () => {
    if (cart.length === 0) {
      showToast("Add items to cart before checkout");
      return;
    }
    setCart([]);
    showToast("Thank you! Your order has been placed.");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span>Shop</span>Easy
        </div>
        <div className="topbar-actions">
          <div className="search-wrapper">
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="cart-status">
            <span>🛒</span>
            <strong>{cartCount}</strong>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="catalog">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Welcome to India’s favorite store</p>
              <h1>Discover top products with secure checkout.</h1>
            </div>
            <div className="filter-row">
              <label>
                Category
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <div className="stats">
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? "" : "s"} found
              </div>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div className="product-copy">
                  <div className="category-label">{product.category}</div>
                  <h2>{product.name}</h2>
                  <div className="rating">⭐ {product.rating.toFixed(1)}</div>
                  <div className="price-row">
                    <span className="price-current">{formatPrice(product.price)}</span>
                    <span className="price-original">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </article>
            ))}
            {filteredProducts.length === 0 && (
              <div className="empty-state">
                No products match your search. Try another term.
              </div>
            )}
          </div>
        </section>

        <aside className="cart-panel">
          <div className="cart-header">
            <div>
              <p className="eyebrow">Your cart</p>
              <h2>{cartCount} item{cartCount === 1 ? "" : "s"}</h2>
            </div>
            <button className="secondary" onClick={clearCart}>
              Clear
            </button>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="item-meta">
                  <div>{item.name}</div>
                  <div>{formatPrice(item.price)}</div>
                </div>
                <div className="item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="empty-state small">
                Your cart is empty. Add products to start shopping.
              </div>
            )}
          </div>

          <div className="summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(cartSubtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{shipping === 0 ? "FREE" : formatPrice(shipping)}</strong>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <strong>{formatPrice(tax)}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
            <button className="checkout-btn" onClick={checkout}>
              Checkout Now
            </button>
          </div>
        </aside>
      </main>

      <footer className="page-footer">
        <p>ShopEasy ● Simple shopping experience built in React + Vite.</p>
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;