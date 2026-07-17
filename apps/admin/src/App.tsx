import { useCallback, useEffect, useState } from 'react';
import {
  api,
  type AdminCategory,
  type AdminOrder,
  type AdminOrderDetail,
  type AdminProduct,
  type AdminUser,
  type Banner,
  type CodDayReport,
  type Coupon,
  type Dashboard,
} from './api';
import './App.css';

const BRANCH_ID = '00000000-0000-4000-8000-000000000010';
const TOKEN_KEY = 'efood_admin_token';

type View = 'login' | 'dashboard' | 'orders' | 'products' | 'ops';
type OpsTab = 'users' | 'cod' | 'coupons' | 'banners';

const emptyForm = {
  sku: '',
  name: '',
  description: '',
  categoryId: '',
  price: '100',
  minQty: '1',
  availableQty: '20',
  isActive: true,
};

const emptyCoupon = {
  code: '',
  description: '',
  discountValue: '50',
  minItems: '1',
};

const emptyBanner = {
  title: '',
  body: '',
};

function App() {
  const [view, setView] = useState<View>('login');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [phone, setPhone] = useState('919999999999');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [codReport, setCodReport] = useState<CodDayReport | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [opsTab, setOpsTab] = useState<OpsTab>('users');
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [bannerForm, setBannerForm] = useState(emptyBanner);
  const [health, setHealth] = useState('checking…');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState('');

  const loadOrders = useCallback(async (accessToken: string) => {
    const data = await api.listOrders(accessToken, BRANCH_ID);
    setOrders(data);
  }, []);

  const loadCatalog = useCallback(async (accessToken: string) => {
    const [productRows, categoryRows] = await Promise.all([
      api.listProducts(accessToken, BRANCH_ID),
      api.listCategories(accessToken),
    ]);
    setProducts(productRows);
    setCategories(categoryRows);
  }, []);

  const loadDashboard = useCallback(async (accessToken: string) => {
    const data = await api.dashboard(accessToken, BRANCH_ID);
    setDashboard(data);
  }, []);

  const loadOps = useCallback(async (accessToken: string, tab: OpsTab) => {
    if (tab === 'users') {
      setUsers(await api.listUsers(accessToken));
    } else if (tab === 'cod') {
      setCodReport(await api.codDay(accessToken, BRANCH_ID));
    } else if (tab === 'coupons') {
      setCoupons(await api.listCoupons(accessToken));
    } else {
      setBanners(await api.listBanners(accessToken));
    }
  }, []);

  useEffect(() => {
    api
      .health()
      .then((h) => setHealth(`API ${h.status} · DB ${h.db}`))
      .catch(() => setHealth('API offline'));
  }, []);

  useEffect(() => {
    if (!token) {
      setView('login');
      return;
    }
    if (view === 'login') {
      setView('dashboard');
      return;
    }

    let loader: Promise<void>;
    if (view === 'dashboard') {
      loader = loadDashboard(token);
    } else if (view === 'orders') {
      loader = loadOrders(token);
    } else if (view === 'products') {
      loader = loadCatalog(token);
    } else {
      loader = loadOps(token, opsTab);
    }

    loader.catch((err: Error) => {
      setError(err.message);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    });
  }, [token, view, opsTab, loadOrders, loadCatalog, loadDashboard, loadOps]);

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

  async function login() {
    setBusy(true);
    setError(null);
    try {
      const data = await api.verifyOtp(phone, otp);
      if (!['staff', 'manager', 'admin'].includes(data.user.role)) {
        throw new Error('This phone is not a staff/manager account');
      }
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      setToken(data.accessToken);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function openOrder(orderId: string) {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const detail = await api.getOrder(token, orderId);
      setSelectedOrder(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(orderId: string, status: string) {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await api.updateStatus(token, orderId, status);
      await loadOrders(token);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(await api.getOrder(token, orderId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(product: AdminProduct) {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description ?? '',
      categoryId: product.categoryId ?? '',
      price: String(product.price),
      minQty: String(product.minQty),
      availableQty: String(product.availableQty ?? 0),
      isActive: product.isActive,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveProduct() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        categoryId: form.categoryId || null,
        price: Number(form.price),
        minQty: Number(form.minQty),
        isActive: form.isActive,
        branchId: BRANCH_ID,
        availableQty: Number(form.availableQty),
        isAvailable: form.isActive,
      };
      if (editingId) {
        await api.updateProduct(token, editingId, payload);
      } else {
        await api.createProduct(token, {
          ...payload,
          sku: form.sku.trim().toUpperCase(),
        });
      }
      resetForm();
      await loadCatalog(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function toggleStock(product: AdminProduct) {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await api.updateProduct(token, product.id, {
        branchId: BRANCH_ID,
        isAvailable: !product.isAvailable,
        availableQty: product.isAvailable ? 0 : Math.max(product.availableQty, 10),
      });
      await loadCatalog(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stock update failed');
    } finally {
      setBusy(false);
    }
  }

  async function addCategory() {
    if (!token || !newCategory.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.createCategory(token, {
        name: newCategory.trim(),
        sortOrder: categories.length + 1,
      });
      setNewCategory('');
      await loadCatalog(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category failed');
    } finally {
      setBusy(false);
    }
  }

  async function changeUserRole(userId: string, role: string) {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await api.setUserRole(token, userId, role);
      await loadOps(token, 'users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Role update failed');
    } finally {
      setBusy(false);
    }
  }

  async function createCoupon() {
    if (!token || !couponForm.code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.createCoupon(token, {
        code: couponForm.code.trim().toUpperCase(),
        discountValue: Number(couponForm.discountValue),
        minItems: Number(couponForm.minItems) || undefined,
        description: couponForm.description.trim() || undefined,
      });
      setCouponForm(emptyCoupon);
      await loadOps(token, 'coupons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coupon create failed');
    } finally {
      setBusy(false);
    }
  }

  async function disableCoupon(id: string) {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await api.patchCoupon(token, id, { isActive: false });
      await loadOps(token, 'coupons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coupon update failed');
    } finally {
      setBusy(false);
    }
  }

  async function createBanner() {
    if (!token || !bannerForm.title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.createBanner(token, {
        title: bannerForm.title.trim(),
        body: bannerForm.body.trim() || undefined,
      });
      setBannerForm(emptyBanner);
      await loadOps(token, 'banners');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Banner create failed');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setOrders([]);
    setSelectedOrder(null);
    setProducts([]);
    setDashboard(null);
    setUsers([]);
    setCodReport(null);
    setCoupons([]);
    setBanners([]);
    setView('login');
  }

  const title =
    view === 'login'
      ? 'Staff login'
      : view === 'dashboard'
        ? 'Dashboard'
        : view === 'orders'
          ? 'Order queue'
          : view === 'products'
            ? 'Catalog'
            : 'Operations';

  function orderActions(order: AdminOrder | AdminOrderDetail) {
    return (
      <div className="actions">
        {order.status === 'placed' ? (
          <button
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              void setStatus(order.id, 'confirmed');
            }}
          >
            Confirm
          </button>
        ) : null}
        {['placed', 'confirmed'].includes(order.status) ? (
          <button
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              void setStatus(order.id, 'in_progress');
            }}
          >
            In progress
          </button>
        ) : null}
        {order.status === 'in_progress' ? (
          <button
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              void setStatus(order.id, 'completed');
            }}
          >
            Complete
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">e-Food Admin</div>
        <nav>
          <button
            type="button"
            className={view === 'dashboard' ? 'nav active' : 'nav'}
            disabled={!token}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={view === 'orders' ? 'nav active' : 'nav'}
            disabled={!token}
            onClick={() => {
              setSelectedOrder(null);
              setView('orders');
            }}
          >
            Orders
          </button>
          <button
            type="button"
            className={view === 'products' ? 'nav active' : 'nav'}
            disabled={!token}
            onClick={() => setView('products')}
          >
            Products
          </button>
          <button
            type="button"
            className={view === 'ops' ? 'nav active' : 'nav'}
            disabled={!token}
            onClick={() => setView('ops')}
          >
            Ops
          </button>
        </nav>
        {token ? (
          <button type="button" className="logout" onClick={logout}>
            Log out
          </button>
        ) : null}
      </aside>

      <main className="main">
        <header className="top">
          <h1>{title}</h1>
          <span className="pill">{health}</span>
        </header>

        {error ? <p className="error">{error}</p> : null}

        {view === 'login' ? (
          <section className="panel">
            <p className="lede">
              Use manager demo phone <code>919999999999</code> and OTP <code>123456</code> (stub
              mode).
            </p>
            <label>
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            {!otpSent ? (
              <button type="button" disabled={busy} onClick={sendOtp}>
                Send OTP
              </button>
            ) : (
              <>
                <label>
                  OTP
                  <input value={otp} onChange={(e) => setOtp(e.target.value)} />
                </label>
                <button type="button" disabled={busy} onClick={login}>
                  Verify & enter
                </button>
              </>
            )}
          </section>
        ) : null}

        {view === 'dashboard' && token ? (
          <>
            <section className="kpis kpis-5">
              <article>
                <span>Orders today</span>
                <strong>{dashboard?.ordersToday ?? '—'}</strong>
              </article>
              <article>
                <span>Pending</span>
                <strong>{dashboard?.pending ?? '—'}</strong>
              </article>
              <article>
                <span>In kitchen</span>
                <strong>{dashboard?.inKitchen ?? '—'}</strong>
              </article>
              <article>
                <span>Completed today</span>
                <strong>{dashboard?.completedToday ?? '—'}</strong>
              </article>
              <article>
                <span>COD total today</span>
                <strong>
                  {dashboard ? `₹${Number(dashboard.codTotalToday).toFixed(0)}` : '—'}
                </strong>
              </article>
            </section>

            <section className="panel auto-confirm">
              <h2>Auto-confirm window</h2>
              {dashboard?.autoConfirm ? (
                <p className="lede">
                  Orders auto-confirm between hour{' '}
                  <code>{dashboard.autoConfirm.startHour}</code> and{' '}
                  <code>{dashboard.autoConfirm.endHour}</code> (server hour{' '}
                  <code>{dashboard.autoConfirm.serverHour}</code>). Currently{' '}
                  <strong>
                    {dashboard.autoConfirm.currentlyAutoConfirm ? 'ON' : 'OFF'}
                  </strong>
                  .
                </p>
              ) : (
                <p className="lede">Loading auto-confirm settings…</p>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => token && void loadDashboard(token)}
              >
                Refresh
              </button>
            </section>
          </>
        ) : null}

        {view === 'orders' && token ? (
          selectedOrder ? (
            <section className="order-detail">
              <div className="queue-head">
                <h2>
                  {selectedOrder.orderNumber}{' '}
                  <span className={`badge status-${selectedOrder.status}`}>
                    {selectedOrder.status}
                  </span>
                </h2>
                <button type="button" className="secondary" onClick={() => setSelectedOrder(null)}>
                  Back to queue
                </button>
              </div>

              <div className="detail-grid">
                <div className="panel">
                  <h3>Customer</h3>
                  <p>
                    <strong>{selectedOrder.customerName}</strong>
                  </p>
                  <p className="muted">{selectedOrder.customerPhone}</p>
                  {selectedOrder.addressLine1 ? (
                    <p>
                      Address: <strong>{selectedOrder.addressLine1}</strong>
                    </p>
                  ) : (
                    <p className="muted">No delivery address (pickup)</p>
                  )}
                  <p>
                    {selectedOrder.fulfillmentType} · {selectedOrder.paymentMethod.toUpperCase()}
                  </p>
                  <p className="muted">
                    Placed {new Date(selectedOrder.placedAt).toLocaleString()}
                  </p>
                </div>

                <div className="panel">
                  <h3>Totals</h3>
                  <p>Subtotal: ₹{selectedOrder.subtotal}</p>
                  <p>Delivery: ₹{selectedOrder.deliveryFee}</p>
                  <p>Discount: ₹{selectedOrder.discount}</p>
                  <p>
                    <strong>Total: ₹{selectedOrder.total}</strong>
                  </p>
                  {orderActions(selectedOrder)}
                </div>
              </div>

              <div className="panel">
                <h3>Items</h3>
                <ul className="plain-list">
                  {selectedOrder.items.map((item) => (
                    <li key={`${item.productId}-${item.name}`}>
                      {item.qty}× {item.name} @ ₹{item.unitPrice} = ₹{item.lineTotal}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel">
                <h3>Timeline</h3>
                <ol className="timeline">
                  {selectedOrder.timeline.map((entry, i) => (
                    <li key={`${entry.status}-${entry.at}-${i}`}>
                      <span className={`badge status-${entry.status}`}>{entry.status}</span>
                      <span>{new Date(entry.at).toLocaleString()}</span>
                      {entry.note ? <span className="muted">{entry.note}</span> : null}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ) : (
            <section className="queue">
              <div className="queue-head">
                <h2>Needs action</h2>
                <button type="button" disabled={busy} onClick={() => loadOrders(token)}>
                  Refresh
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="lede">No orders yet. Place a COD order from mobile/API.</p>
              ) : (
                <ul className="order-list">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="order-row clickable"
                      onClick={() => void openOrder(order.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          void openOrder(order.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <span className={`badge status-${order.status}`}>{order.status}</span>
                        <p>
                          {order.customerName} · {order.customerPhone}
                        </p>
                        <p>
                          {order.fulfillmentType} · {order.paymentMethod.toUpperCase()} · ₹
                          {order.total}
                        </p>
                        <p className="muted">{new Date(order.placedAt).toLocaleString()}</p>
                        <p className="muted">Click for detail</p>
                      </div>
                      {orderActions(order)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        ) : null}

        {view === 'products' && token ? (
          <div className="catalog-grid">
            <section className="panel">
              <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
              {!editingId ? (
                <label>
                  SKU
                  <input
                    value={form.sku}
                    onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                    placeholder="BIR-VEG"
                  />
                </label>
              ) : (
                <p className="lede">
                  Editing <code>{form.sku}</code>
                </p>
              )}
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label>
                Description
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <label>
                Category
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                >
                  <option value="">— none —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  Price ₹
                  <input
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </label>
                <label>
                  Min qty
                  <input
                    value={form.minQty}
                    onChange={(e) => setForm((f) => ({ ...f, minQty: e.target.value }))}
                  />
                </label>
                <label>
                  Stock
                  <input
                    value={form.availableQty}
                    onChange={(e) => setForm((f) => ({ ...f, availableQty: e.target.value }))}
                  />
                </label>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active / sellable
              </label>
              <div className="form-actions">
                <button type="button" disabled={busy || !form.name} onClick={saveProduct}>
                  {editingId ? 'Save changes' : 'Create product'}
                </button>
                {editingId ? (
                  <button type="button" className="secondary" onClick={resetForm}>
                    Cancel
                  </button>
                ) : null}
              </div>

              <hr />
              <h3>Categories</h3>
              <ul className="chip-list">
                {categories.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
              <div className="form-row">
                <label>
                  New category
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Snacks"
                  />
                </label>
                <button type="button" disabled={busy || !newCategory.trim()} onClick={addCategory}>
                  Add
                </button>
              </div>
            </section>

            <section className="queue">
              <div className="queue-head">
                <h2>Products ({products.length})</h2>
                <button type="button" disabled={busy} onClick={() => loadCatalog(token)}>
                  Refresh
                </button>
              </div>
              <ul className="order-list">
                {products.map((product) => (
                  <li key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span
                        className={`badge ${product.isAvailable ? 'status-completed' : 'status-cancelled'}`}
                      >
                        {product.isAvailable ? 'in stock' : 'unavailable'}
                      </span>
                      <p>
                        {product.sku} · {product.categoryName ?? 'Uncategorized'} · ₹
                        {product.price} · min {product.minQty} · qty {product.availableQty}
                      </p>
                      {product.description ? <p className="muted">{product.description}</p> : null}
                    </div>
                    <div className="actions">
                      <button type="button" disabled={busy} onClick={() => startEdit(product)}>
                        Edit
                      </button>
                      <button type="button" disabled={busy} onClick={() => toggleStock(product)}>
                        {product.isAvailable ? 'Mark out' : 'Restock'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}

        {view === 'ops' && token ? (
          <section className="ops">
            <div className="tabs">
              {(
                [
                  ['users', 'Users'],
                  ['cod', 'COD day'],
                  ['coupons', 'Coupons'],
                  ['banners', 'Banners'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={opsTab === id ? 'tab active' : 'tab'}
                  onClick={() => setOpsTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {opsTab === 'users' ? (
              <div className="panel">
                <div className="queue-head">
                  <h2>Users ({users.length})</h2>
                  <button type="button" disabled={busy} onClick={() => loadOps(token, 'users')}>
                    Refresh
                  </button>
                </div>
                <ul className="order-list">
                  {users.map((user) => (
                    <li key={user.id}>
                      <div>
                        <strong>{user.name}</strong>
                        <span className="badge status-confirmed">{user.role}</span>
                        <p className="muted">{user.phone}</p>
                      </div>
                      <div className="actions">
                        <select
                          value={user.role}
                          disabled={busy}
                          onChange={(e) => void changeUserRole(user.id, e.target.value)}
                        >
                          <option value="customer">customer</option>
                          <option value="staff">staff</option>
                          <option value="manager">manager</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {opsTab === 'cod' ? (
              <div className="panel">
                <div className="queue-head">
                  <h2>COD day report</h2>
                  <button type="button" disabled={busy} onClick={() => loadOps(token, 'cod')}>
                    Refresh
                  </button>
                </div>
                {codReport ? (
                  <>
                    <p className="lede">
                      Day <code>{codReport.day}</code> · {codReport.orderCount} orders · Collected ₹
                      {codReport.collected} · Outstanding ₹{codReport.outstanding}
                    </p>
                    <ul className="order-list">
                      {codReport.orders.map((o) => (
                        <li key={o.id}>
                          <div>
                            <strong>{o.orderNumber}</strong>
                            <span className={`badge status-${o.status}`}>{o.status}</span>
                            <p>
                              {o.customerName} · {o.customerPhone} · ₹{o.total}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="lede">Loading COD report…</p>
                )}
              </div>
            ) : null}

            {opsTab === 'coupons' ? (
              <div className="ops-split">
                <div className="panel">
                  <h2>Create coupon</h2>
                  <label>
                    Code
                    <input
                      value={couponForm.code}
                      onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value }))}
                      placeholder="WELCOME50"
                    />
                  </label>
                  <label>
                    Description
                    <input
                      value={couponForm.description}
                      onChange={(e) =>
                        setCouponForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </label>
                  <div className="form-row form-row-2">
                    <label>
                      Discount ₹
                      <input
                        value={couponForm.discountValue}
                        onChange={(e) =>
                          setCouponForm((f) => ({ ...f, discountValue: e.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Min items
                      <input
                        value={couponForm.minItems}
                        onChange={(e) =>
                          setCouponForm((f) => ({ ...f, minItems: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    disabled={busy || !couponForm.code.trim()}
                    onClick={() => void createCoupon()}
                  >
                    Create coupon
                  </button>
                </div>
                <div className="panel">
                  <div className="queue-head">
                    <h2>Coupons ({coupons.length})</h2>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => loadOps(token, 'coupons')}
                    >
                      Refresh
                    </button>
                  </div>
                  <ul className="order-list">
                    {coupons.map((c) => (
                      <li key={c.id}>
                        <div>
                          <strong>{c.code}</strong>
                          <span
                            className={`badge ${c.isActive ? 'status-completed' : 'status-cancelled'}`}
                          >
                            {c.isActive ? 'active' : 'disabled'}
                          </span>
                          <p>
                            ₹{c.discountValue} off · min {c.minItems} items · min subtotal ₹
                            {c.minSubtotal}
                          </p>
                          {c.description ? <p className="muted">{c.description}</p> : null}
                        </div>
                        {c.isActive ? (
                          <div className="actions">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void disableCoupon(c.id)}
                            >
                              Disable
                            </button>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {opsTab === 'banners' ? (
              <div className="ops-split">
                <div className="panel">
                  <h2>Create banner</h2>
                  <label>
                    Title
                    <input
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm((f) => ({ ...f, title: e.target.value }))}
                    />
                  </label>
                  <label>
                    Body
                    <input
                      value={bannerForm.body}
                      onChange={(e) => setBannerForm((f) => ({ ...f, body: e.target.value }))}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={busy || !bannerForm.title.trim()}
                    onClick={() => void createBanner()}
                  >
                    Create banner
                  </button>
                </div>
                <div className="panel">
                  <div className="queue-head">
                    <h2>Banners ({banners.length})</h2>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => loadOps(token, 'banners')}
                    >
                      Refresh
                    </button>
                  </div>
                  <ul className="order-list">
                    {banners.map((b) => (
                      <li key={b.id}>
                        <div>
                          <strong>{b.title}</strong>
                          <span
                            className={`badge ${b.isActive ? 'status-completed' : 'status-cancelled'}`}
                          >
                            {b.isActive ? 'active' : 'off'}
                          </span>
                          <p className="muted">sort {b.sortOrder}</p>
                          {b.body ? <p>{b.body}</p> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default App;
