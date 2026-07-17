import { useEffect, useState } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api/v1';

function App() {
  const [health, setHealth] = useState<string>('checking…');

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((body) => {
        setHealth(body?.success ? `API OK (${body.data?.status})` : 'API returned error');
      })
      .catch(() => setHealth('API offline — run npm run dev:api'));
  }, []);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">e-Food Admin</div>
        <nav>
          <a className="active" href="#dashboard">
            Dashboard
          </a>
          <a href="#orders">Orders</a>
          <a href="#products">Products</a>
          <a href="#staff">Staff</a>
          <a href="#reports">Reports</a>
        </nav>
      </aside>
      <main className="main">
        <header className="top">
          <h1>Dashboard</h1>
          <span className="pill">{health}</span>
        </header>
        <p className="lede">
          Scaffold aligned to <code>docs/wireframes/08-admin-dashboard.md</code>. Wire real
          endpoints from <code>docs/openapi.yaml</code> next.
        </p>
        <section className="kpis">
          <article>
            <span>Orders today</span>
            <strong>—</strong>
          </article>
          <article>
            <span>Revenue</span>
            <strong>—</strong>
          </article>
          <article>
            <span>Pending</span>
            <strong>—</strong>
          </article>
          <article>
            <span>COD due</span>
            <strong>—</strong>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
