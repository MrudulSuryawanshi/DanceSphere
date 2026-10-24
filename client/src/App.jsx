import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Heart,
  Menu,
  X,
  Music2,
  Mail,
  Phone,
  ChevronDown,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  cities,
  categories,
  initialClasses,
  readClasses,
  saveClasses,
} from "./data";
import { api } from "./api";

const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg =
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function App() {
  const [classes, setClasses] = useState(readClasses);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ds_user"));
    } catch {
      return null;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => saveClasses(classes), [classes]);
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);
  const login = (role, email) => {
    const u = { role, email, name: email.split("@")[0].replace(/[._-]/g, " ") };
    setUser(u);
    localStorage.setItem("ds_user", JSON.stringify(u));
    return u;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ds_user");
  };
  const updateClass = (record) =>
    setClasses((old) => {
      const exists = old.some((c) => c.id === record.id);
      return exists
        ? old.map((c) => (c.id === record.id ? record : c))
        : [
            { ...record, id: Date.now(), status: "pending", rating: null },
            ...old,
          ];
    });
  const removeClass = (id) =>
    setClasses((old) => old.filter((c) => c.id !== id));
  const setStatus = (id, status) =>
    setClasses((old) => old.map((c) => (c.id === id ? { ...c, status } : c)));
  const context = {
    classes,
    user,
    login,
    logout,
    updateClass,
    removeClass,
    setStatus,
    setClasses,
  };
  return (
    <div className="app-shell">
      <Header
        user={user}
        logout={logout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Routes>
        <Route path="/" element={<Home {...context} />} />
        <Route path="/classes" element={<Explore {...context} />} />
        <Route path="/classes/:id" element={<ClassDetail {...context} />} />
        <Route path="/cities" element={<CitiesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/studios/:studio" element={<StudioPage {...context} />} />
        <Route
          path="/instructors"
          element={
            <InfoPage
              title="Meet the teachers"
              eyebrow="GOOD PEOPLE, GOOD MOVEMENT"
              intro="A great class starts with a teacher who makes room for you to learn."
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/register"
          element={<AuthPage mode="register" role="student" login={login} />}
        />
        <Route
          path="/login"
          element={<AuthPage mode="login" role="student" login={login} />}
        />
        <Route
          path="/owner/register"
          element={<AuthPage mode="register" role="owner" login={login} />}
        />
        <Route
          path="/owner/login"
          element={<AuthPage mode="login" role="owner" login={login} />}
        />
        <Route
          path="/admin/login"
          element={<AuthPage mode="login" role="admin" login={login} />}
        />
        <Route path="/dashboard" element={<Dashboard {...context} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/enquiry/:id" element={<EnquiryPage {...context} />} />
        <Route path="/owner/classes/new" element={<ClassForm {...context} />} />
        <Route
          path="/owner/classes/:id/edit"
          element={<ClassForm {...context} />}
        />
        <Route path="/owner/classes" element={<ManageClasses {...context} />} />
        <Route path="/owner/enquiries" element={<OwnerEnquiries />} />
        <Route path="/owner/studio" element={<StudioManage user={user} />} />
        <Route path="/admin/classes" element={<AdminClasses {...context} />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/taxonomy" element={<Taxonomy />} />
        <Route path="/practicals" element={<Practicals />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Header({ user, logout, mobileOpen, setMobileOpen }) {
  const links = [
    ["Explore", "/classes"],
    ["Cities", "/cities"],
    ["Dance styles", "/categories"],
    ["Our story", "/about"],
  ];
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Music2 size={20} />
          </span>
          <span>
            dance<span className="brand-light">sphere</span>
            <small>FIND YOUR RHYTHM</small>
          </span>
        </Link>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`}>
          {links.map(([t, p]) => (
            <NavLink key={p} to={p} onClick={() => setMobileOpen(false)}>
              {t}
            </NavLink>
          ))}
          <Link to="/contact" className="nav-mobile">
            Contact
          </Link>
        </nav>
        <div className="nav-actions">
          <Link to={user ? "/dashboard" : "/login"} className="nav-login">
            {user ? `Hi, ${user.name.split(" ")[0]}` : "Log in"}
          </Link>
          {user ? (
            <button
              className="button button-small button-outline"
              onClick={logout}
            >
              Log out
            </button>
          ) : (
            <Link className="button button-small" to="/owner/register">
              List your studio <ArrowRight size={15} />
            </Link>
          )}
          <button
            className="icon-button menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Music2 size={20} />
            </span>
            <span>
              dance<span className="brand-light">sphere</span>
              <small>FIND YOUR RHYTHM</small>
            </span>
          </Link>
          <p>Good classes. Good people. A little more room to move.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/classes">All classes</Link>
          <Link to="/cities">By city</Link>
          <Link to="/categories">Dance styles</Link>
        </div>
        <div>
          <h4>For studios</h4>
          <Link to="/owner/register">List your studio</Link>
          <Link to="/owner/login">Owner login</Link>
          <Link to="/admin/login">Admin login</Link>
        </div>
        <div>
          <h4>Say hello</h4>
          <a href="mailto:hello@dancesphere.example">
            <Mail size={15} /> hello@dancesphere.example
          </a>
          <a href="tel:+910000000000">
            <Phone size={15} /> +91 00000 00000
          </a>
          <div className="social-row">
            <span>◎</span>
            <Music2 size={17} />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DanceSphere · Made for the love of dance.</span>
        <span>Sample listings are for academic demonstration.</span>
        <Link to="/practicals">Web technologies practicals</Link>
      </div>
    </footer>
  );
}

function ClassCard({ item, compact = false }) {
  return (
    <article className={`class-card ${compact ? "compact" : ""}`}>
      <Link to={`/classes/${item.id}`} className="class-image-wrap">
        <img
          src={item.image || safeImg}
          alt={`${item.category} dance class`}
          onError={(e) => (e.currentTarget.src = safeImg)}
        />
        <span className="image-tag">{item.category}</span>
        <button
          className="heart-button"
          aria-label="Save class"
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.classList.toggle("hearted");
          }}
        >
          <Heart size={17} />
        </button>
      </Link>
      <div className="class-card-body">
        <div className="card-meta">
          <span>
            <MapPin size={13} />
            {item.city}
          </span>
          <span>{item.level}</span>
        </div>
        <Link to={`/classes/${item.id}`} className="class-title">
          {item.name}
        </Link>
        <p className="studio-name">{item.studio}</p>
        <div className="card-bottom">
          <strong>
            {money(item.fee)}
            <small> / month</small>
          </strong>
          <Link
            to={`/classes/${item.id}`}
            className="round-arrow"
            aria-label={`View ${item.name}`}
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Home({ classes }) {
  const [city, setCity] = useState("All cities");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    navigate(
      `/classes?city=${encodeURIComponent(city)}&q=${encodeURIComponent(query)}`,
    );
  };
  const featured = classes.filter((c) => c.status === "approved").slice(0, 4);
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line"></span> YOUR NEXT CHAPTER STARTS HERE
          </div>
          <h1>
            Find your rhythm.
            <br />
            <em>Find your people.</em>
          </h1>
          <p className="hero-description">
            From first steps to full-out choreography, find a dance class that
            feels like yours.
          </p>
          <form className="search-panel" onSubmit={submit}>
            <label className="search-field">
              <MapPin size={18} />
              <span>
                <small>WHERE</small>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </span>
              <ChevronDown size={15} />
            </label>
            <label className="search-field search-keyword">
              <Search size={18} />
              <span>
                <small>WHAT DO YOU FEEL LIKE?</small>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try hip-hop, Bollywood..."
                />
              </span>
            </label>
            <button className="button search-submit" type="submit">
              Find a class <ArrowRight size={17} />
            </button>
          </form>
          <div className="hero-note">
            <span className="avatar-stack">
              <i>A</i>
              <i>M</i>
              <i>R</i>
            </span>
            <span>
              <strong>Something for every body.</strong>
              <br />
              All levels. All kinds of movement.
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=85"
              alt="Dancers practising in a studio"
            />
          </div>
          <div className="photo-note">
            <span className="note-star">✳</span>
            <span>
              <strong>Move a little.</strong>
              <br />
              Feel a lot.
            </span>
          </div>
          <div className="vertical-label">A PLACE TO BEGIN · EST. 2026</div>
          <div className="hero-circle">
            MOVE
            <br />
            YOUR
            <br />
            <em>WAY</em>
          </div>
        </div>
      </section>
      <section className="category-strip section-pad">
        <div className="section-heading compact-heading">
          <div>
            <div className="eyebrow">PICK YOUR MOOD</div>
            <h2>What moves you?</h2>
          </div>
          <Link to="/categories" className="text-link">
            All dance styles <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.slice(1).map((c, i) => (
            <Link
              to={`/classes?category=${encodeURIComponent(c)}`}
              key={c}
              className={`category-tile cat-${i}`}
            >
              <span className="category-number">0{i + 1}</span>
              <span className="category-name">{c}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="featured-section section-pad">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A FEW GOOD PLACES</div>
            <h2>Classes worth showing up for.</h2>
            <p>Thoughtfully picked places to find your next favourite thing.</p>
          </div>
          <Link to="/classes" className="button button-outline">
            Explore all classes <ArrowRight size={16} />
          </Link>
        </div>
        <div className="class-grid">
          {featured.map((c) => (
            <ClassCard key={c.id} item={c} />
          ))}
        </div>
      </section>
      <section className="city-band">
        <div>
          <div className="eyebrow">CLOSE TO HOME</div>
          <h2>Your city, your scene.</h2>
          <p>Find a studio around the corner or somewhere new to explore.</p>
          <Link to="/cities" className="button button-light">
            Explore cities <ArrowRight size={16} />
          </Link>
        </div>
        <div className="city-pills">
          {cities.slice(1).map((c, i) => (
            <Link to={`/classes?city=${encodeURIComponent(c)}`} key={c}>
              <span>0{i + 1}</span>
              {c}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="owner-cta section-pad">
        <div className="owner-cta-image">
          <img
            src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=80"
            alt="Dance class in motion"
          />
        </div>
        <div className="owner-cta-copy">
          <div className="eyebrow">FOR THE PEOPLE WHO TEACH</div>
          <h2>
            Your studio deserves
            <br />
            to be <em>discovered.</em>
          </h2>
          <p>
            Bring your classes to a community that's looking for its next reason
            to move.
          </p>
          <Link to="/owner/register" className="button">
            List your studio <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Explore({ classes }) {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const [q, setQ] = useState(params.get("q") || "");
  const [city, setCity] = useState(params.get("city") || "All cities");
  const [cat, setCat] = useState(params.get("category") || "All styles");
  const [sort, setSort] = useState("featured");
  const [maxFee, setMaxFee] = useState("5000");
  useEffect(() => {
    const p = new URLSearchParams(loc.search);
    setQ(p.get("q") || "");
    setCity(p.get("city") || "All cities");
    setCat(p.get("category") || "All styles");
  }, [loc.search]);
  const filtered = useMemo(() => {
    let a = classes.filter((c) => c.status === "approved");
    if (city !== "All cities") a = a.filter((c) => c.city === city);
    if (cat !== "All styles") a = a.filter((c) => c.category === cat);
    if (q.trim()) {
      const term = q.toLowerCase();
      a = a.filter((c) =>
        [c.name, c.studio, c.category, c.instructor, c.city].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(term),
        ),
      );
    }
    a = a.filter((c) => Number(c.fee) <= Number(maxFee));
    if (sort === "fee-low") a.sort((x, y) => x.fee - y.fee);
    if (sort === "fee-high") a.sort((x, y) => y.fee - x.fee);
    if (sort === "name") a.sort((x, y) => x.name.localeCompare(y.name));
    return a;
  }, [classes, city, cat, q, sort, maxFee]);
  const reset = () => {
    setQ("");
    setCity("All cities");
    setCat("All styles");
    setMaxFee("5000");
    setSort("featured");
  };
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">THE CLASS DIRECTORY</div>
        <h1>
          A class for <em>your kind</em>
          <br />
          of movement.
        </h1>
        <p>Browse studios, find your style, and take the first step.</p>
      </div>
      <div className="explore-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <SlidersHorizontal size={17} /> <strong>Find your fit</strong>
            <button className="clear-button" onClick={reset}>
              Clear all
            </button>
          </div>
          <label className="form-label">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Class, studio, instructor"
            />
          </label>
          <label className="form-label">
            City
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Dance style
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Monthly fee up to <strong>{money(maxFee)}</strong>
            <input
              type="range"
              min="1000"
              max="5000"
              step="200"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
            />
            <div className="range-labels">
              <span>₹1,000</span>
              <span>₹5,000</span>
            </div>
          </label>
          <div className="filter-help">
            <Sparkles size={17} />
            <span>
              New to dance? Try a beginner class and take it one step at a time.
            </span>
          </div>
        </aside>
        <section className="results-panel">
          <div className="results-top">
            <div>
              <span className="results-count">{filtered.length} CLASSES</span>
              <h2>Find your next favourite.</h2>
            </div>
            <label className="sort-control">
              Sort by{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="fee-low">Fee: low to high</option>
                <option value="fee-high">Fee: high to low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="class-grid">
              {filtered.map((c) => (
                <ClassCard key={c.id} item={c} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                <Search size={25} />
              </span>
              <h3>No classes found just yet.</h3>
              <p>Try another city or loosen up your filters.</p>
              <button className="button" onClick={reset}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ClassDetail({ classes }) {
  const { id } = useParams();
  const c = classes.find((x) => String(x.id) === id);
  const [sent, setSent] = useState(false);
  if (!c) return <NotFound />;
  return (
    <main className="page-main detail-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/classes">Classes</Link> / {c.name}
      </div>
      <div className="detail-layout">
        <div>
          <img
            className="detail-image"
            src={c.image || safeImg}
            alt={c.name}
            onError={(e) => (e.currentTarget.src = safeImg)}
          />
          <div className="detail-description">
            <div className="eyebrow">A LITTLE ABOUT THE CLASS</div>
            <h2>Come as you are.</h2>
            <p>{c.description}</p>
            <h3>What to expect</h3>
            <p>
              Supportive teaching, time to practise, and space to grow at your
              own pace. Wear comfortable clothes and bring water.
            </p>
          </div>
        </div>
        <aside className="detail-card">
          <span className="image-tag static-tag">{c.category}</span>
          <h1>{c.name}</h1>
          <p className="studio-name">{c.studio}</p>
          <div className="detail-facts">
            <div>
              <MapPin size={17} />
              <span>
                <small>LOCATION</small>
                {c.city}
              </span>
            </div>
            <div>
              <CalendarDays size={17} />
              <span>
                <small>WHEN</small>
                {c.timing}
              </span>
            </div>
            <div>
              <Users size={17} />
              <span>
                <small>LEVEL & AGE</small>
                {c.level} · {c.age}
              </span>
            </div>
            <div>
              <Music2 size={17} />
              <span>
                <small>TEACHER</small>
                {c.instructor}
              </span>
            </div>
          </div>
          <div className="detail-price">
            <strong>{money(c.fee)}</strong>
            <span>/ month</span>
          </div>
          {sent ? (
            <div className="success-note">
              <CheckCircle2 size={18} /> Enquiry saved in this demo. The studio
              can follow up with you.
            </div>
          ) : (
            <Link to={`/enquiry/${c.id}`} className="button button-wide">
              Ask about this class <ArrowRight size={17} />
            </Link>
          )}
          <p className="fine-print">
            This is a demo listing for the college project. Please verify
            details before attending.
          </p>
        </aside>
      </div>
    </main>
  );
}

function CitiesPage() {
  const counts = initialClasses.reduce(
    (a, c) => ({ ...a, [c.city]: (a[c.city] || 0) + 1 }),
    {},
  );
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">FIND YOUR LOCAL SCENE</div>
        <h1>
          Good things happen
          <br />
          <em>close to home.</em>
        </h1>
        <p>Choose a city and see what's happening on the dance floor.</p>
      </div>
      <div className="city-card-grid">
        {cities.slice(1).map((c, i) => (
          <Link
            key={c}
            to={`/classes?city=${encodeURIComponent(c)}`}
            className={`city-card city-card-${i}`}
          >
            <span className="city-card-no">0{i + 1} / CITY GUIDE</span>
            <div>
              <h2>{c}</h2>
              <p>{counts[c] || 0} sample classes to explore</p>
            </div>
            <span className="city-card-arrow">
              <ArrowRight />
            </span>
          </Link>
        ))}
      </div>
      <p className="data-note">
        Listings shown here are sample project data, not verified businesses.
      </p>
    </main>
  );
}
function CategoriesPage() {
  const copy = {
    Bollywood: "Big expressions, familiar beats and feel-good choreography.",
    "Hip-Hop":
      "Find your groove through foundations, freestyle and musicality.",
    Contemporary: "Explore space, balance, floorwork and storytelling.",
    Classical: "Build technique and expression through traditional forms.",
    Salsa: "Partner work, rhythm and social dance in a welcoming room.",
    Ballet: "Posture, balance and technique, one careful step at a time.",
    Jazz: "Musical accents, dynamic movement and stage-inspired energy.",
    Zumba: "A dance-based workout that feels more like a party.",
  };
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">EVERY STYLE HAS A STORY</div>
        <h1>
          Follow the feeling.
          <br />
          <em>Find your style.</em>
        </h1>
        <p>You don't need to know the steps before you start.</p>
      </div>
      <div className="style-list">
        {categories.slice(1).map((c, i) => (
          <Link
            to={`/classes?category=${encodeURIComponent(c)}`}
            key={c}
            className="style-row"
          >
            <span className="style-no">0{i + 1}</span>
            <div>
              <h2>{c}</h2>
              <p>{copy[c]}</p>
            </div>
            <span className="style-count">
              {initialClasses.filter((x) => x.category === c).length} classes
            </span>
            <ArrowRight />
          </Link>
        ))}
      </div>
    </main>
  );
}
function StudioPage({ classes }) {
  const { studio } = useParams();
  const items = classes.filter(
    (c) => c.studio.toLowerCase() === decodeURIComponent(studio).toLowerCase(),
  );
  if (!items.length) return <NotFound />;
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">MEET THE STUDIO</div>
        <h1>
          {items[0].studio}
          <em>.</em>
        </h1>
        <p>
          <MapPin size={15} className="inline-icon" />
          {items[0].city} · A welcoming place to move and learn.
        </p>
      </div>
      <div className="class-grid">
        {items.map((c) => (
          <ClassCard key={c.id} item={c} />
        ))}
      </div>
    </main>
  );
}
function InfoPage({ title, eyebrow, intro }) {
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <em>.</em>
        </h1>
        <p>{intro}</p>
      </div>
      <div className="info-grid">
        {initialClasses.slice(0, 3).map((c) => (
          <div className="info-card" key={c.id}>
            <img src={c.image} alt="Dance studio" />
            <h3>{c.instructor}</h3>
            <p>
              {c.category} · {c.city}
            </p>
            <p className="muted">{c.studio}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
function About() {
  return (
    <main className="page-main">
      <div className="story-layout">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1000&q=85"
            alt="Dance community"
          />
        </div>
        <div className="story-copy">
          <div className="eyebrow">WHY WE'RE HERE</div>
          <h1>
            Dance is for <em>everybody.</em>
          </h1>
          <p>
            DanceSphere started with a simple thought: finding a class shouldn't
            be the hardest part of learning to dance.
          </p>
          <p>
            We're bringing studios, teachers and curious beginners together in
            one friendly place. Whether you're returning to a childhood passion
            or trying your first step, there's room for you here.
          </p>
          <p className="muted">
            This is an academic demonstration project. Studio listings are
            sample content.
          </p>
          <Link to="/classes" className="button">
            Find a class <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
function Contact() {
  const [done, setDone] = useState(false);
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">WE'RE ALL EARS</div>
        <h1>
          Let's have a <em>chat.</em>
        </h1>
        <p>Questions, feedback, or a studio to tell us about? Send a note.</p>
      </div>
      <div className="form-card contact-card">
        {done ? (
          <div className="success-large">
            <CheckCircle2 size={32} />
            <h2>Thanks for reaching out.</h2>
            <p>Your demo message has been recorded on this page.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <div className="form-two">
              <label className="form-label">
                Your name
                <input required minLength="2" placeholder="Name" />
              </label>
              <label className="form-label">
                Email address
                <input type="email" required placeholder="you@example.com" />
              </label>
            </div>
            <label className="form-label">
              What is this about?
              <select>
                <option>General question</option>
                <option>I'm a studio owner</option>
                <option>Listing correction</option>
                <option>Feedback</option>
              </select>
            </label>
            <label className="form-label">
              Your message
              <textarea
                required
                minLength="10"
                rows="5"
                placeholder="Tell us a little more..."
              />
            </label>
            <button className="button">
              Send your message <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function AuthPage({ mode, role, login }) {
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const title =
    role === "admin"
      ? "Welcome back, admin."
      : role === "owner"
        ? mode === "register"
          ? "Bring your studio here."
          : "Good to see you again."
        : mode === "register"
          ? "Your next chapter starts here."
          : "Come on in.";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register") {
      if (!name) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (password !== confirm) {
        setError("Those passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const result =
        mode === "register"
          ? await api.register({ name, email, password, role })
          : await api.login({ email, password, role });

      // Save the actual account returned by the backend.
      login(result.user.role, result.user.email);

      // Replace the demo session with the backend user and token.
      localStorage.setItem("ds_user", JSON.stringify(result.user));
      localStorage.setItem("ds_token", result.token);

      nav("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to connect. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-photo">
        <img
          src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=85"
          alt="Dancers in a studio"
        />
        <div className="auth-photo-copy">
          <span>MAKE SPACE TO MOVE</span>
          <h2>
            There's a place
            <br />
            for you here.
          </h2>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="eyebrow">
            {role === "admin"
              ? "ADMINISTRATION"
              : role === "owner"
                ? "STUDIO PARTNER"
                : "YOUR DANCESPHERE ACCOUNT"}
          </div>

          <h1>{title}</h1>
          <p>
            {mode === "register"
              ? "A few details and you’re on your way."
              : "Pick up where you left off."}
          </p>

          <form onSubmit={submit}>
            {mode === "register" && (
              <label className="form-label">
                Your name
                <input name="name" required placeholder="Full name" />
              </label>
            )}

            <label className="form-label">
              Email address
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="form-label">
              Password
              <input
                name="password"
                type={showPass ? "text" : "password"}
                minLength={mode === "register" ? 8 : 1}
                required
                placeholder={
                  mode === "register"
                    ? "At least 8 characters"
                    : "Your password"
                }
              />
            </label>

            {mode === "register" && (
              <label className="form-label">
                Confirm password
                <input
                  name="confirm"
                  type="password"
                  required
                  placeholder="Type it once more"
                />
              </label>
            )}

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
              />{" "}
              Show password
            </label>

            {error && <p className="error-message">{error}</p>}

            <button className="button button-wide" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Log in"}{" "}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "register"
              ? "Already have an account?"
              : "New around here?"}{" "}
            <Link
              to={
                role === "owner"
                  ? mode === "register"
                    ? "/owner/login"
                    : "/owner/register"
                  : role === "admin"
                    ? "/admin/login"
                    : mode === "register"
                      ? "/login"
                      : "/register"
              }
            >
              {mode === "register" ? "Log in" : "Create an account"}
            </Link>
          </p>

          <div className="demo-notice">
            Accounts are registered and verified through the DanceSphere API.
          </div>
        </div>
      </div>
    </main>
  );
}

function Dashboard({ user, classes, logout }) {
  if (!user) return <LoginRequired />;
  const mine = classes.filter((c) => c.ownerEmail === user.email);
  const owner = user.role === "owner",
    admin = user.role === "admin";
  return (
    <main className="page-main dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow">
            {admin
              ? "ADMIN WORKSPACE"
              : owner
                ? "STUDIO WORKSPACE"
                : "YOUR SPACE"}
          </div>
          <h1>
            Good to have you, <em>{user.name.split(" ")[0]}.</em>
          </h1>
          <p>
            {admin
              ? "Here’s what’s happening across DanceSphere."
              : owner
                ? "A quick look at your studio and classes."
                : "Your next favourite class could be one click away."}
          </p>
        </div>
        <button className="button button-outline" onClick={logout}>
          <LogOut size={16} /> Log out
        </button>
      </div>
      <div className="stats-grid">
        <Stat
          icon={<Music2 />}
          label={
            admin
              ? "All classes"
              : owner
                ? "Your classes"
                : "Classes to explore"
          }
          value={
            admin
              ? classes.length
              : owner
                ? mine.length
                : classes.filter((c) => c.status === "approved").length
          }
        />
        <Stat
          icon={<Users />}
          label={admin ? "Sample members" : "Enquiries"}
          value={admin ? "24" : owner ? "0" : "0"}
        />
        <Stat
          icon={<CalendarDays />}
          label="Upcoming sessions"
          value={owner ? "—" : "12"}
        />
      </div>
      {admin ? (
        <div className="dashboard-panels">
          <div className="panel-card">
            <h2>Needs a look</h2>
            <p>Review new class listings before they appear publicly.</p>
            <Link className="button" to="/admin/classes">
              Review classes <ArrowRight size={15} />
            </Link>
          </div>
          <div className="panel-card">
            <h2>Platform settings</h2>
            <p>Manage the cities and dance categories used in search.</p>
            <Link className="button button-outline" to="/admin/taxonomy">
              Manage categories
            </Link>
          </div>
          <div className="panel-card">
            <h2>People</h2>
            <p>View the demo users and account roles.</p>
            <Link className="button button-outline" to="/admin/users">
              Manage users
            </Link>
          </div>
        </div>
      ) : owner ? (
        <div className="dashboard-panels">
          <div className="panel-card">
            <h2>Your class listings</h2>
            <p>Add a class or update the details of an existing listing.</p>
            <Link className="button" to="/owner/classes/new">
              <Plus size={16} /> Add a class
            </Link>
            <Link className="text-link block-link" to="/owner/classes">
              Manage your classes <ArrowRight size={15} />
            </Link>
          </div>
          <div className="panel-card">
            <h2>Studio profile</h2>
            <p>Keep your studio details and contact information up to date.</p>
            <Link className="button button-outline" to="/owner/studio">
              Edit studio profile
            </Link>
          </div>
          <div className="panel-card">
            <h2>Enquiries</h2>
            <p>Review interest from people looking for a class.</p>
            <Link className="button button-outline" to="/owner/enquiries">
              View enquiries
            </Link>
          </div>
        </div>
      ) : (
        <div className="panel-card student-panel">
          <h2>Start exploring</h2>
          <p>Use city and style filters to find a class that fits your week.</p>
          <Link className="button" to="/classes">
            Browse classes <ArrowRight size={16} />
          </Link>
          <Link className="text-link block-link" to="/profile">
            Edit your profile
          </Link>
        </div>
      )}
    </main>
  );
}
function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function LoginRequired() {
  return (
    <main className="page-main empty-state">
      <h2>Log in to continue</h2>
      <p>This page is for registered demo users.</p>
      <Link className="button" to="/login">
        Go to login
      </Link>
    </main>
  );
}
function Profile({ user }) {
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">YOUR DETAILS</div>
        <h1>
          Your <em>profile.</em>
        </h1>
      </div>
      {user ? (
        <div className="form-card profile-card">
          <div className="profile-avatar">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="role-pill">{user.role}</span>
          <p className="muted">
            This profile belongs to your local demo session.
          </p>
        </div>
      ) : (
        <LoginRequired />
      )}
    </main>
  );
}

function EnquiryPage({ classes }) {
  const { id } = useParams();
  const c = classes.find((x) => String(x.id) === id);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!c) return <NotFound />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const enquiry = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      classId: c.id,
    };

    try {
      await api.createEnquiry(enquiry);
      setDone(true);
    } catch (err) {
      setError(
        err.message ||
          "Could not send the enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">TAKE THE FIRST STEP</div>
        <h1>
          Ask about <em>{c.name}.</em>
        </h1>
        <p>
          Leave a note and the studio can get back to you.
        </p>
      </div>

      <div className="form-card contact-card">
        {done ? (
          <div className="success-large">
            <CheckCircle2 size={32} />
            <h2>Enquiry sent successfully!</h2>
            <p>Your enquiry has been submitted to the DanceSphere API.</p>
            <Link to="/classes" className="button">
              Explore more classes
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="enquiry-summary">
              <strong>{c.name}</strong>
              <span>
                {c.studio} · {c.city} · {money(c.fee)}/month
              </span>
            </div>

            <div className="form-two">
              <label className="form-label">
                Your name
                <input
                  name="name"
                  required
                  minLength="2"
                  placeholder="Full name"
                />
              </label>

              <label className="form-label">
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="form-label">
              Message
              <textarea
                name="message"
                required
                minLength="5"
                rows="4"
                placeholder="I'd love to know more about this class..."
              />
            </label>

            {error && <p className="error-message">{error}</p>}

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send enquiry"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function ClassForm({ classes, user, updateClass }) {
  const { id } = useParams();
  const nav = useNavigate();
  const existing = classes.find((c) => String(c.id) === id);
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    if (Number(d.fee) <= 0) {
      setErr("Fee must be greater than zero.");
      return;
    }
    updateClass({
      ...existing,
      ...d,
      fee: Number(d.fee),
      ownerEmail: user?.email,
      studio: d.studio || "My Dance Studio",
    });
    nav("/owner/classes");
  };
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">STUDIO WORKSPACE</div>
        <h1>
          {existing ? "Edit your class" : "Add a new class"}
          <em>.</em>
        </h1>
        <p>Tell people what makes your class a good place to start.</p>
      </div>
      {!user ? (
        <LoginRequired />
      ) : (
        <div className="form-card wide-form">
          <form onSubmit={submit}>
            <div className="form-two">
              <label className="form-label">
                Class name
                <input
                  name="name"
                  required
                  defaultValue={existing?.name}
                  placeholder="e.g. Bollywood Foundations"
                />
              </label>
              <label className="form-label">
                Studio name
                <input
                  name="studio"
                  required
                  defaultValue={existing?.studio}
                  placeholder="Your studio"
                />
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                City
                <select name="city" defaultValue={existing?.city || "Pune"}>
                  {cities.slice(1).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="form-label">
                Dance style
                <select
                  name="category"
                  defaultValue={existing?.category || "Bollywood"}
                >
                  {categories.slice(1).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                Monthly fee (₹)
                <input
                  type="number"
                  name="fee"
                  min="1"
                  required
                  defaultValue={existing?.fee || 1800}
                />
              </label>
              <label className="form-label">
                Level
                <select
                  name="level"
                  defaultValue={existing?.level || "Beginner"}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>All levels</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                Schedule
                <input
                  name="timing"
                  required
                  defaultValue={existing?.timing}
                  placeholder="Mon, Wed · 6:30 PM"
                />
              </label>
              <label className="form-label">
                Duration
                <input
                  name="duration"
                  defaultValue={existing?.duration || "60 min"}
                  required
                />
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                Age group
                <input
                  name="age"
                  defaultValue={existing?.age || "16+"}
                  required
                />
              </label>
              <label className="form-label">
                Instructor
                <input
                  name="instructor"
                  defaultValue={existing?.instructor}
                  required
                />
              </label>
            </div>
            <label className="form-label">
              Class description
              <textarea
                name="description"
                rows="4"
                required
                defaultValue={existing?.description}
                placeholder="What will students learn?"
              />
            </label>
            <label className="form-label">
              Image URL (optional)
              <input
                name="image"
                defaultValue={existing?.image}
                placeholder="https://..."
              />
            </label>
            {err && <p className="error-message">{err}</p>}
            <button className="button">
              {existing ? "Save changes" : "Submit for approval"}{" "}
              <ArrowRight size={16} />
            </button>
            <p className="muted form-footnote">
              New listings are marked pending in this demo until reviewed by an
              administrator.
            </p>
          </form>
        </div>
      )}
    </main>
  );
}
function ManageClasses({ classes, user, removeClass }) {
  if (!user) return <LoginRequired />;
  const own = classes.filter((c) => c.ownerEmail === user.email);
  return (
    <main className="page-main">
      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow">STUDIO WORKSPACE</div>
          <h1>
            Manage your <em>classes.</em>
          </h1>
        </div>
        <Link to="/owner/classes/new" className="button">
          <Plus size={16} /> Add class
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>City</th>
              <th>Monthly fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {own.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                  <small>
                    {c.category} · {c.studio}
                  </small>
                </td>
                <td>{c.city}</td>
                <td>{money(c.fee)}</td>
                <td>
                  <span className={`status status-${c.status}`}>
                    {c.status || "pending"}
                  </span>
                </td>
                <td className="table-actions">
                  <Link to={`/owner/classes/${c.id}/edit`} aria-label="Edit">
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Delete this class from the demo?"))
                        removeClass(c.id);
                    }}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!own.length && (
              <tr>
                <td colSpan="5" className="table-empty">
                  No classes created by this demo account yet. Add your first
                  class to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
function OwnerEnquiries() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("ds_enquiries") || "[]"),
  );
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">STUDIO WORKSPACE</div>
        <h1>
          Class <em>enquiries.</em>
        </h1>
        <p>People who have asked to hear more about a class.</p>
      </div>
      <div className="enquiry-list">
        {items.map((x) => (
          <div className="enquiry-item" key={x.id}>
            <div>
              <strong>{x.name}</strong>
              <span>
                {x.email} · {x.className}
              </span>
              <p>{x.message}</p>
            </div>
            <span className="status status-pending">{x.status}</span>
          </div>
        ))}
        {!items.length && (
          <div className="empty-state">
            <h3>No enquiries yet.</h3>
            <p>
              When someone sends a class enquiry, it will appear here in this
              browser demo.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
function StudioManage({ user }) {
  const [saved, setSaved] = useState(false);
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">STUDIO WORKSPACE</div>
        <h1>
          Your studio, <em>your story.</em>
        </h1>
      </div>
      <div className="form-card wide-form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <label className="form-label">
            Studio name
            <input
              required
              defaultValue={user?.name ? `${user.name}'s Studio` : ""}
              placeholder="Your studio name"
            />
          </label>
          <div className="form-two">
            <label className="form-label">
              City
              <select>
                <option>Pune</option>
                <option>Mumbai</option>
                <option>Nashik</option>
                <option>Bengaluru</option>
                <option>Delhi</option>
                <option>Hyderabad</option>
              </select>
            </label>
            <label className="form-label">
              Contact email
              <input type="email" required defaultValue={user?.email} />
            </label>
          </div>
          <label className="form-label">
            About the studio
            <textarea rows="4" placeholder="What makes your studio special?" />
          </label>
          <button className="button">Save studio profile</button>
          {saved && (
            <p className="success-inline">
              <CheckCircle2 size={16} /> Saved in this demo view.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
function AdminClasses({ classes, setStatus }) {
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">ADMIN WORKSPACE</div>
        <h1>
          Listing <em>review.</em>
        </h1>
        <p>Approve or reject studio-submitted listings.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>City</th>
              <th>Studio</th>
              <th>Status</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                  <small>{c.category}</small>
                </td>
                <td>{c.city}</td>
                <td>{c.studio}</td>
                <td>
                  <span className={`status status-${c.status}`}>
                    {c.status}
                  </span>
                </td>
                <td className="review-actions">
                  <button
                    onClick={() => setStatus(c.id, "approved")}
                    className="approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStatus(c.id, "rejected")}
                    className="reject-button"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
function AdminUsers() {
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">ADMIN WORKSPACE</div>
        <h1>
          People make the <em>place.</em>
        </h1>
        <p>Role overview for the current demonstration.</p>
      </div>
      <div className="info-grid">
        <div className="info-card user-role-card">
          <Users />
          <h3>Students</h3>
          <p>Discover classes and submit enquiries.</p>
        </div>
        <div className="info-card user-role-card">
          <Music2 />
          <h3>Studio owners</h3>
          <p>Manage their own studio and class listings.</p>
        </div>
        <div className="info-card user-role-card">
          <LayoutDashboard />
          <h3>Administrators</h3>
          <p>Review listings and manage the directory.</p>
        </div>
      </div>
      <p className="data-note">
        The frontend demo does not maintain a central user database. See the
        Express API for database-backed authentication.
      </p>
    </main>
  );
}
function Taxonomy() {
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">ADMIN WORKSPACE</div>
        <h1>
          Places & <em>styles.</em>
        </h1>
        <p>Available city and category values used by the directory.</p>
      </div>
      <div className="taxonomy-grid">
        <div className="panel-card">
          <h2>Cities</h2>
          {cities.slice(1).map((c) => (
            <div className="taxonomy-item" key={c}>
              <MapPin size={15} />
              {c}
              <CheckCircle2 size={15} />
            </div>
          ))}
        </div>
        <div className="panel-card">
          <h2>Dance styles</h2>
          {categories.slice(1).map((c) => (
            <div className="taxonomy-item" key={c}>
              <Music2 size={15} />
              {c}
              <CheckCircle2 size={15} />
            </div>
          ))}
        </div>
      </div>
      <p className="data-note">
        This demonstration shows the taxonomy configuration. Persistent
        management endpoints are documented in the backend API guide.
      </p>
    </main>
  );
}
function Practicals() {
  const items = [
    [
      "HTML structure",
      "Semantic page structure, headings, lists and imagery.",
      "client/src/App.jsx",
    ],
    [
      "CSS design",
      "External stylesheet, responsive Flexbox/Grid, positioning and transitions.",
      "client/src/styles.css",
    ],
    [
      "JavaScript",
      "Filtering, sorting, event handlers, array methods and browser storage.",
      "client/src/App.jsx",
    ],
    [
      "React",
      "Functional components, JSX, props, hooks, routing and conditional rendering.",
      "client/src/App.jsx",
    ],
    [
      "Fetch & JSON",
      "Centralized API service with JSON requests.",
      "client/src/api.js",
    ],
    [
      "DOM events",
      "Interactive form controls and the dedicated HTML demonstration.",
      "client/public/practical-demo.html",
    ],
    [
      "PHP",
      "Validation, string functions, sessions and PDO CRUD.",
      "php-practicals/index.php",
    ],
    [
      "Node & Express",
      "Routes, middleware, static files and REST endpoints.",
      "server/src/index.js",
    ],
  ];
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">BUILT FOR THE CLASSROOM</div>
        <h1>
          Learning by <em>building.</em>
        </h1>
        <p>
          Find the practical examples and implementation notes in this project.
        </p>
      </div>
      <div className="practical-list">
        {items.map((x, i) => (
          <div className="practical-row" key={x[0]}>
            <span className="style-no">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{x[0]}</h3>
              <p>{x[1]}</p>
              <code>{x[2]}</code>
            </div>
          </div>
        ))}
      </div>
      <p className="data-note">
        The complete 15-practical mapping is available in
        docs/SYLLABUS_MAPPING.md.
      </p>
    </main>
  );
}
function NotFound() {
  return (
    <main className="page-main empty-state">
      <span className="eyebrow">WRONG TURN?</span>
      <h1>
        Let's find your <em>way back.</em>
      </h1>
      <p>That page isn't here, but your next class might be.</p>
      <Link to="/" className="button">
        Back to home <ArrowRight size={16} />
      </Link>
    </main>
  );
}
export default App;
