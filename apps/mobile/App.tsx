import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  api,
  type Address,
  type Banner,
  type Category,
  type OrderDetail,
  type OrderSummary,
  type Product,
  type UserProfile,
} from './src/api';
import { storage } from './src/storage';

type Tab = 'home' | 'orders' | 'cart' | 'profile';
type Screen =
  | 'tabs'
  | 'product'
  | 'orderDetail'
  | 'login'
  | 'done'
  | 'privacy'
  | 'terms';

type CartLine = { product: Product; qty: number };

const SUPPORT_EMAIL = 'support@efood.local';
const SUPPORT_PHONE = '+91-9000000000';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>('tabs');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profileName, setProfileName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('919876543210');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('Near market gate');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponNote, setCouponNote] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<{
    orderNumber: string;
    total: number;
    status: string;
  } | null>(null);
  const [loginReturn, setLoginReturn] = useState<Tab>('cart');

  const cartCount = cart.reduce((n, line) => n + line.qty, 0);
  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.price * line.qty, 0),
    [cart],
  );
  const deliveryFee = fulfillment === 'delivery' && cart.length ? 30 : 0;
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);

  useEffect(() => {
    (async () => {
      const saved = await storage.getToken();
      const savedPhone = await storage.getPhone();
      if (savedPhone) setPhone(savedPhone);
      if (saved) {
        try {
          const me = await api.getMe(saved);
          setToken(saved);
          setProfile(me);
          setProfileName(me.name);
        } catch {
          await storage.clearToken();
        }
      }
    })();
  }, []);

  useEffect(() => {
    api
      .listCategories()
      .then(setCategories)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    api
      .listBanners()
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .listProducts(categoryId, search)
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  useEffect(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponNote(null);
  }, [cart, subtotal]);

  const loadOrders = useCallback(async (access: string) => {
    const rows = await api.listOrders(access);
    setOrders(rows);
  }, []);

  const loadProfileBundle = useCallback(async (access: string) => {
    const [me, addrs] = await Promise.all([api.getMe(access), api.listAddresses(access)]);
    setProfile(me);
    setProfileName(me.name);
    setAddresses(addrs);
  }, []);

  useEffect(() => {
    if (!token) return;
    if (tab === 'orders') {
      loadOrders(token).catch((err: Error) => setError(err.message));
    }
    if (tab === 'profile') {
      loadProfileBundle(token).catch((err: Error) => setError(err.message));
    }
  }, [tab, token, loadOrders, loadProfileBundle]);

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setDetailQty(Math.max(1, product.minQty));
    setScreen('product');
  }

  function addToCart(product: Product, qty: number) {
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id
            ? { ...line, qty: Math.max(product.minQty, line.qty + qty) }
            : line,
        );
      }
      return [...prev, { product, qty: Math.max(product.minQty, qty) }];
    });
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.product.id !== productId) return line;
          const next = line.qty + delta;
          if (next < line.product.minQty) return { ...line, qty: 0 };
          return { ...line, qty: next };
        })
        .filter((line) => line.qty > 0),
    );
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((line) => line.product.id !== productId));
  }

  async function sendOtp() {
    setBusy(true);
    setError(null);
    try {
      await api.requestOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP failed');
    } finally {
      setBusy(false);
    }
  }

  async function registerDeviceStub(access: string) {
    try {
      await api.registerDeviceToken(access, {
        token: `expo-dev-${Date.now()}`,
        platform: 'android',
      });
    } catch {
      // Soft-launch stub — ignore registration failures
    }
  }

  async function completeLogin() {
    setBusy(true);
    setError(null);
    try {
      const auth = await api.verifyOtp(phone, otp);
      await storage.setToken(auth.accessToken);
      await storage.setPhone(phone);
      setToken(auth.accessToken);
      setProfile({
        id: auth.user.id,
        name: auth.user.name,
        phone: auth.user.phone,
        role: 'customer',
      });
      setProfileName(auth.user.name);
      await registerDeviceStub(auth.accessToken);
      setScreen('tabs');
      setTab(loginReturn);
      if (loginReturn === 'cart') {
        await placeOrderWithToken(auth.accessToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function applyCoupon() {
    if (!token) {
      setError('Login required to apply a coupon');
      return;
    }
    if (!couponInput.trim()) {
      setError('Enter a coupon code');
      return;
    }
    setBusy(true);
    setError(null);
    setCouponNote(null);
    try {
      const result = await api.validateCoupon(token, {
        code: couponInput.trim(),
        itemCount: cartCount,
        subtotal,
      });
      setAppliedCoupon(result.code);
      setCouponDiscount(result.discount);
      setCouponNote(`Coupon ${result.code} applied · −₹${result.discount}`);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setError(err instanceof Error ? err.message : 'Coupon invalid');
    } finally {
      setBusy(false);
    }
  }

  async function placeOrderWithToken(access: string) {
    setBusy(true);
    setError(null);
    try {
      const items = cart.map((line) => ({
        productId: line.product.id,
        qty: line.qty,
      }));
      await api.putCart(access, items);
      let addressId = addresses[0]?.id;
      if (fulfillment === 'delivery') {
        if (!addressId) {
          const addr = await api.createAddress(access, { line1: address });
          addressId = addr.id;
          setAddresses((prev) => [addr, ...prev]);
        }
      }
      const order = await api.placeOrder(access, {
        addressId,
        items,
        fulfillmentType: fulfillment,
        couponCode: appliedCoupon ?? undefined,
      });
      setLastOrder({
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      });
      setCart([]);
      setCouponInput('');
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponNote(null);
      setScreen('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setBusy(false);
    }
  }

  async function startCheckout() {
    if (!cart.length) return;
    if (!token) {
      setLoginReturn('cart');
      setOtpSent(false);
      setScreen('login');
      return;
    }
    await placeOrderWithToken(token);
  }

  async function openOrder(orderId: string) {
    if (!token) {
      setLoginReturn('orders');
      setScreen('login');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const detail = await api.getOrder(token, orderId);
      setOrderDetail(detail);
      setScreen('orderDetail');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setBusy(false);
    }
  }

  async function cancelOrder() {
    if (!token || !orderDetail) return;
    setBusy(true);
    setError(null);
    try {
      await api.cancelOrder(token, orderDetail.id);
      const detail = await api.getOrder(token, orderDetail.id);
      setOrderDetail(detail);
      await loadOrders(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setBusy(false);
    }
  }

  async function reorderFromDetail() {
    if (!orderDetail) return;
    setBusy(true);
    setError(null);
    try {
      const next: CartLine[] = [];
      for (const item of orderDetail.items) {
        try {
          const product = await api.getProduct(item.productId);
          if (!product.isAvailable) continue;
          next.push({
            product,
            qty: Math.max(product.minQty, item.qty),
          });
        } catch {
          // Skip unavailable / missing products
        }
      }
      if (!next.length) {
        setError('No available items to reorder');
        return;
      }
      setCart((prev) => {
        const merged = [...prev];
        for (const line of next) {
          const idx = merged.findIndex((m) => m.product.id === line.product.id);
          if (idx >= 0) {
            merged[idx] = {
              ...merged[idx],
              qty: merged[idx].qty + line.qty,
            };
          } else {
            merged.push(line);
          }
        }
        return merged;
      });
      setTab('cart');
      setScreen('tabs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reorder failed');
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile() {
    if (!token || !profileName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const me = await api.updateMe(token, { name: profileName.trim() });
      setProfile(me);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function addAddress() {
    if (!token || !newAddress.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const addr = await api.createAddress(token, { line1: newAddress.trim() });
      setAddresses((prev) => [addr, ...prev]);
      setNewAddress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Address failed');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await storage.clearToken();
    setToken(null);
    setProfile(null);
    setOrders([]);
    setAddresses([]);
    setTab('home');
  }

  function requireAuthTab(next: Tab) {
    if ((next === 'orders' || next === 'profile') && !token) {
      setLoginReturn(next);
      setOtpSent(false);
      setScreen('login');
      return;
    }
    setTab(next);
    setScreen('tabs');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.brand}>e-Food Center</Text>
        <Text style={styles.headerMeta}>v0.1 · COD</Text>
      </View>

      {error ? (
        <Pressable onPress={() => setError(null)}>
          <Text style={styles.error}>{error}</Text>
        </Pressable>
      ) : null}

      {screen === 'product' && selectedProduct ? (
        <ScrollView contentContainerStyle={styles.list}>
          <Pressable onPress={() => setScreen('tabs')}>
            <Text style={styles.link}>← Back to menu</Text>
          </Pressable>
          <Text style={styles.heading}>{selectedProduct.name}</Text>
          <Text style={styles.price}>₹{selectedProduct.price}</Text>
          <Text style={styles.meta}>
            {selectedProduct.categoryName ? `${selectedProduct.categoryName} · ` : ''}
            {selectedProduct.isAvailable ? 'In stock' : 'Sold out'}
            {selectedProduct.availableQty != null
              ? ` · qty ${selectedProduct.availableQty}`
              : ''}
          </Text>
          {selectedProduct.description ? (
            <Text style={styles.body}>{selectedProduct.description}</Text>
          ) : null}
          <Text style={styles.meta}>Quantity (min {selectedProduct.minQty})</Text>
          <View style={styles.qtyRow}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() =>
                setDetailQty((q) => Math.max(selectedProduct.minQty, q - 1))
              }
            >
              <Text style={styles.btnText}>-</Text>
            </Pressable>
            <Text style={styles.qty}>{detailQty}</Text>
            <Pressable style={styles.qtyBtn} onPress={() => setDetailQty((q) => q + 1)}>
              <Text style={styles.btnText}>+</Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.btnWide, !selectedProduct.isAvailable && styles.btnDisabled]}
            disabled={!selectedProduct.isAvailable}
            onPress={() => {
              addToCart(selectedProduct, detailQty);
              setTab('cart');
              setScreen('tabs');
            }}
          >
            <Text style={styles.btnText}>
              Add to cart · ₹{selectedProduct.price * detailQty}
            </Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {screen === 'orderDetail' && orderDetail ? (
        <ScrollView contentContainerStyle={styles.list}>
          <Pressable
            onPress={() => {
              setScreen('tabs');
              setTab('orders');
            }}
          >
            <Text style={styles.link}>← My orders</Text>
          </Pressable>
          <Text style={styles.heading}>{orderDetail.orderNumber}</Text>
          <Text style={styles.meta}>
            {orderDetail.status} · {orderDetail.fulfillmentType} ·{' '}
            {orderDetail.paymentMethod.toUpperCase()} · ₹{orderDetail.total}
          </Text>
          <Text style={styles.section}>Timeline</Text>
          {orderDetail.timeline.map((ev, idx) => (
            <Text key={`${ev.status}-${idx}`} style={styles.meta}>
              ● {ev.status} · {new Date(ev.at).toLocaleString()}
            </Text>
          ))}
          <Text style={styles.section}>Items</Text>
          {orderDetail.items.map((item) => (
            <Text key={`${item.productId}-${item.name}`} style={styles.meta}>
              {item.name} × {item.qty} · ₹{item.lineTotal}
            </Text>
          ))}
          <Pressable style={styles.btnWide} disabled={busy} onPress={reorderFromDetail}>
            <Text style={styles.btnText}>Reorder</Text>
          </Pressable>
          {orderDetail.canCancel ? (
            <Pressable style={styles.btnWide} disabled={busy} onPress={cancelOrder}>
              <Text style={styles.btnText}>Cancel order (5 min window)</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : null}

      {screen === 'login' ? (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.heading}>Login with OTP</Text>
          <Text style={styles.meta}>Stub mode: use OTP 123456</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Phone"
          />
          {!otpSent ? (
            <Pressable style={styles.btnWide} disabled={busy} onPress={sendOtp}>
              <Text style={styles.btnText}>Send OTP</Text>
            </Pressable>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                placeholder="OTP"
              />
              <Pressable style={styles.btnWide} disabled={busy} onPress={completeLogin}>
                <Text style={styles.btnText}>Verify & continue</Text>
              </Pressable>
            </>
          )}
          <Pressable onPress={() => setScreen('tabs')}>
            <Text style={styles.link}>Cancel</Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {screen === 'done' && lastOrder ? (
        <View style={styles.list}>
          <Text style={styles.heading}>Order placed</Text>
          <Text style={styles.name}>{lastOrder.orderNumber}</Text>
          <Text style={styles.meta}>
            Status: {lastOrder.status} · Total ₹{lastOrder.total} · COD
          </Text>
          <Text style={styles.meta}>Pay cash on delivery</Text>
          <Pressable
            style={styles.btnWide}
            onPress={() => {
              setLastOrder(null);
              setTab('orders');
              setScreen('tabs');
              if (token) loadOrders(token).catch(() => undefined);
            }}
          >
            <Text style={styles.btnText}>View orders</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setLastOrder(null);
              setTab('home');
              setScreen('tabs');
            }}
          >
            <Text style={styles.link}>Back to menu</Text>
          </Pressable>
        </View>
      ) : null}

      {screen === 'privacy' ? (
        <ScrollView contentContainerStyle={styles.list}>
          <Pressable onPress={() => setScreen('tabs')}>
            <Text style={styles.link}>← Profile</Text>
          </Pressable>
          <Text style={styles.heading}>Privacy Policy</Text>
          <Text style={styles.body}>
            e-Food Center collects account details (phone, name, delivery address) and order
            history to fulfill COD orders. We do not sell personal data. Soft-launch support
            may review order logs to resolve delivery issues.
          </Text>
          <Text style={styles.body}>
            Push device tokens may be stored to send order status updates. You can request
            account or data help via support.
          </Text>
          <Text style={styles.section}>Support</Text>
          <Text style={styles.meta}>{SUPPORT_EMAIL}</Text>
          <Text style={styles.meta}>{SUPPORT_PHONE}</Text>
        </ScrollView>
      ) : null}

      {screen === 'terms' ? (
        <ScrollView contentContainerStyle={styles.list}>
          <Pressable onPress={() => setScreen('tabs')}>
            <Text style={styles.link}>← Profile</Text>
          </Pressable>
          <Text style={styles.heading}>Terms of Service</Text>
          <Text style={styles.body}>
            Orders are cash on delivery (COD) during soft launch. Prices, availability, and
            delivery fees may change. Cancel within the app only while the cancel window is
            open. Pickup and delivery are subject to branch capacity.
          </Text>
          <Text style={styles.body}>
            Coupons apply only when validated at checkout. Misuse of accounts or coupons may
            lead to order cancellation.
          </Text>
          <Text style={styles.section}>Support</Text>
          <Text style={styles.meta}>{SUPPORT_EMAIL}</Text>
          <Text style={styles.meta}>{SUPPORT_PHONE}</Text>
        </ScrollView>
      ) : null}

      {screen === 'tabs' ? (
        <>
          {tab === 'home' ? (
            <ScrollView contentContainerStyle={styles.list}>
              {banners.map((banner) => (
                <View key={banner.id} style={styles.banner}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerBody}>{banner.body}</Text>
                </View>
              ))}
              <Text style={styles.tagline}>Order food in a few taps · COD</Text>
              <TextInput
                style={styles.input}
                value={search}
                onChangeText={setSearch}
                placeholder="Search menu"
                autoCorrect={false}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
                <Pressable
                  style={[styles.chip, !categoryId && styles.chipActive]}
                  onPress={() => setCategoryId(null)}
                >
                  <Text style={[styles.chipText, !categoryId && styles.chipTextActive]}>All</Text>
                </Pressable>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[styles.chip, categoryId === cat.id && styles.chipActive]}
                    onPress={() => setCategoryId(cat.id)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        categoryId === cat.id && styles.chipTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {loading ? (
                <ActivityIndicator color="#C45C26" style={{ marginTop: 24 }} />
              ) : (
                products.map((product) => (
                  <Pressable
                    key={product.id}
                    style={styles.card}
                    onPress={() => openProduct(product)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{product.name}</Text>
                      <Text style={styles.meta}>
                        {product.categoryName ? `${product.categoryName} · ` : ''}₹
                        {product.price} · Min {product.minQty}
                        {product.isAvailable ? '' : ' · Sold out'}
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          ) : null}

          {tab === 'orders' ? (
            <ScrollView contentContainerStyle={styles.list}>
              <View style={styles.rowBetween}>
                <Text style={styles.heading}>My orders</Text>
                <Pressable
                  disabled={busy || !token}
                  onPress={() => token && loadOrders(token)}
                >
                  <Text style={styles.link}>Refresh</Text>
                </Pressable>
              </View>
              {orders.length === 0 ? (
                <Text style={styles.meta}>No orders yet. Place a COD order from Cart.</Text>
              ) : (
                orders.map((order) => (
                  <Pressable
                    key={order.id}
                    style={styles.card}
                    onPress={() => openOrder(order.id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{order.orderNumber}</Text>
                      <Text style={styles.meta}>
                        {order.status} · ₹{order.total} · {order.itemCount} items
                      </Text>
                      <Text style={styles.meta}>
                        {new Date(order.placedAt).toLocaleString()}
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          ) : null}

          {tab === 'cart' ? (
            <ScrollView contentContainerStyle={styles.list}>
              <Text style={styles.heading}>Cart</Text>
              {cart.length === 0 ? (
                <Text style={styles.meta}>Cart is empty. Tap a dish on Home.</Text>
              ) : (
                cart.map((line) => (
                  <View key={line.product.id} style={styles.card}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{line.product.name}</Text>
                      <Text style={styles.meta}>
                        ₹{line.product.price} × {line.qty} = ₹
                        {line.product.price * line.qty}
                      </Text>
                      <Pressable onPress={() => removeLine(line.product.id)}>
                        <Text style={styles.removeLink}>Remove</Text>
                      </Pressable>
                    </View>
                    <View style={styles.qtyRow}>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => changeQty(line.product.id, -1)}
                      >
                        <Text style={styles.btnText}>-</Text>
                      </Pressable>
                      <Text style={styles.qty}>{line.qty}</Text>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => changeQty(line.product.id, 1)}
                      >
                        <Text style={styles.btnText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
              {cart.length > 0 ? (
                <>
                  <Text style={styles.section}>Fulfillment</Text>
                  <View style={styles.chips}>
                    <Pressable
                      style={[styles.chip, fulfillment === 'delivery' && styles.chipActive]}
                      onPress={() => setFulfillment('delivery')}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          fulfillment === 'delivery' && styles.chipTextActive,
                        ]}
                      >
                        Delivery
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.chip, fulfillment === 'pickup' && styles.chipActive]}
                      onPress={() => setFulfillment('pickup')}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          fulfillment === 'pickup' && styles.chipTextActive,
                        ]}
                      >
                        Pickup
                      </Text>
                    </Pressable>
                  </View>
                  {fulfillment === 'delivery' ? (
                    <>
                      <Text style={styles.meta}>Deliver to</Text>
                      <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Address"
                      />
                    </>
                  ) : (
                    <Text style={styles.meta}>Pickup at Main Branch · no delivery fee</Text>
                  )}
                  <Text style={styles.section}>Coupon</Text>
                  <View style={styles.couponRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={couponInput}
                      onChangeText={setCouponInput}
                      placeholder="Coupon code"
                      autoCapitalize="characters"
                    />
                    <Pressable
                      style={[styles.btn, busy && styles.btnDisabled]}
                      disabled={busy}
                      onPress={applyCoupon}
                    >
                      <Text style={styles.btnText}>Apply</Text>
                    </Pressable>
                  </View>
                  {couponNote ? <Text style={styles.couponOk}>{couponNote}</Text> : null}
                  <Text style={styles.section}>Checkout summary</Text>
                  <Text style={styles.meta}>Subtotal ₹{subtotal}</Text>
                  <Text style={styles.meta}>Delivery ₹{deliveryFee}</Text>
                  {couponDiscount > 0 ? (
                    <Text style={styles.meta}>Discount −₹{couponDiscount}</Text>
                  ) : null}
                  <Text style={styles.heading}>Total ₹{total}</Text>
                  <Text style={styles.codNote}>Pay cash on delivery</Text>
                  <Pressable style={styles.btnWide} disabled={busy} onPress={startCheckout}>
                    <Text style={styles.btnText}>
                      {token ? 'Place COD order' : 'Login to checkout'}
                    </Text>
                  </Pressable>
                </>
              ) : null}
            </ScrollView>
          ) : null}

          {tab === 'profile' ? (
            <ScrollView contentContainerStyle={styles.list}>
              <Text style={styles.heading}>Profile</Text>
              {profile ? (
                <>
                  <Text style={styles.meta}>Phone {profile.phone}</Text>
                  <Text style={styles.meta}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={profileName}
                    onChangeText={setProfileName}
                  />
                  <Pressable style={styles.btnWide} disabled={busy} onPress={saveProfile}>
                    <Text style={styles.btnText}>Save name</Text>
                  </Pressable>
                  <Text style={styles.section}>Addresses</Text>
                  {addresses.map((addr) => (
                    <View key={addr.id} style={styles.card}>
                      <Text style={styles.name}>{addr.line1}</Text>
                      <Text style={styles.meta}>
                        {[addr.landmark, addr.pincode].filter(Boolean).join(' · ') ||
                          'Saved address'}
                      </Text>
                    </View>
                  ))}
                  <TextInput
                    style={styles.input}
                    value={newAddress}
                    onChangeText={setNewAddress}
                    placeholder="New address line"
                  />
                  <Pressable style={styles.btnWide} disabled={busy} onPress={addAddress}>
                    <Text style={styles.btnText}>Add address</Text>
                  </Pressable>
                  <Text style={styles.section}>Legal</Text>
                  <Pressable onPress={() => setScreen('privacy')}>
                    <Text style={styles.link}>Privacy Policy</Text>
                  </Pressable>
                  <Pressable onPress={() => setScreen('terms')}>
                    <Text style={styles.link}>Terms of Service</Text>
                  </Pressable>
                  <Text style={styles.meta}>Support {SUPPORT_EMAIL}</Text>
                  <Text style={styles.meta}>{SUPPORT_PHONE}</Text>
                  <Pressable onPress={logout}>
                    <Text style={styles.link}>Log out</Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.meta}>Not logged in.</Text>
              )}
            </ScrollView>
          ) : null}

          <View style={styles.tabBar}>
            {(
              [
                ['home', 'Home'],
                ['orders', 'Orders'],
                ['cart', `Cart${cartCount ? ` (${cartCount})` : ''}`],
                ['profile', 'Profile'],
              ] as Array<[Tab, string]>
            ).map(([key, label]) => (
              <Pressable
                key={key}
                style={styles.tabItem}
                onPress={() => requireAuthTab(key)}
              >
                <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8F3' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
  },
  brand: { fontSize: 22, fontWeight: '700', color: '#C45C26' },
  headerMeta: { color: '#57534E', fontWeight: '600', fontSize: 12 },
  list: { padding: 16, gap: 12, paddingBottom: 96 },
  tagline: { color: '#57534E', marginBottom: 4 },
  banner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5C8',
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#C45C26',
  },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#C45C26' },
  bannerBody: { color: '#57534E', marginTop: 4, lineHeight: 20 },
  chips: { flexGrow: 0, marginBottom: 4, flexDirection: 'row' },
  chip: {
    borderWidth: 1,
    borderColor: '#E7E5E4',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#C45C26', borderColor: '#C45C26' },
  chipText: { color: '#1C1917', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  heading: { fontSize: 20, fontWeight: '700', color: '#1C1917' },
  section: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#1C1917' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: { fontSize: 16, fontWeight: '600', color: '#1C1917' },
  price: { fontSize: 22, fontWeight: '700', color: '#C45C26' },
  meta: { color: '#57534E', marginTop: 2 },
  body: { color: '#1C1917', lineHeight: 22, marginVertical: 8 },
  chevron: { fontSize: 28, color: '#A8A29E', fontWeight: '300' },
  btn: {
    backgroundColor: '#C45C26',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnWide: {
    backgroundColor: '#C45C26',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    backgroundColor: '#1C1917',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { minWidth: 20, textAlign: 'center', fontWeight: '700' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  couponOk: { color: '#166534', fontWeight: '600' },
  codNote: { color: '#C45C26', fontWeight: '700', marginTop: 4 },
  removeLink: { color: '#B91C1C', marginTop: 6, fontWeight: '600', fontSize: 13 },
  link: { color: '#C45C26', marginTop: 4, fontWeight: '600' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  error: {
    color: '#B91C1C',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    paddingVertical: 10,
    paddingBottom: 14,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { color: '#78716C', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#C45C26' },
});
