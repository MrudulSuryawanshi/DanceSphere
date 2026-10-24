import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { readClasses, saveClasses } from "./data";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import ClassDetail from "./pages/ClassDetail.jsx";
import CitiesPage from "./pages/CitiesPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import StudioPage from "./pages/StudioPage.jsx";
import InfoPage from "./pages/InfoPage.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import EnquiryPage from "./pages/EnquiryPage.jsx";
import ClassForm from "./pages/ClassForm.jsx";
import ManageClasses from "./pages/ManageClasses.jsx";
import OwnerEnquiries from "./pages/OwnerEnquiries.jsx";
import StudioManage from "./pages/StudioManage.jsx";
import AdminClasses from "./pages/AdminClasses.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Taxonomy from "./pages/Taxonomy.jsx";
import Practicals from "./pages/Practicals.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const [classes, setClasses] = useState(readClasses);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ds_user")); } catch { return null; }
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
    localStorage.removeItem("ds_token");
  };
  const updateClass = (record) => setClasses((old) => {
    const exists = old.some((c) => c.id === record.id);
    return exists ? old.map((c) => c.id === record.id ? record : c) : [{ ...record, id: Date.now(), status: "pending", rating: null }, ...old];
  });
  const removeClass = (id) => setClasses((old) => old.filter((c) => c.id !== id));
  const setStatus = (id, status) => setClasses((old) => old.map((c) => c.id === id ? { ...c, status } : c));
  const context = { classes, user, login, logout, updateClass, removeClass, setStatus, setClasses };
  return <div className="app-shell">
    <Header user={user} logout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    <Routes>
      <Route path="/" element={<Home {...context} />} />
      <Route path="/classes" element={<Explore {...context} />} />
      <Route path="/classes/:id" element={<ClassDetail {...context} />} />
      <Route path="/cities" element={<CitiesPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/studios/:studio" element={<StudioPage {...context} />} />
      <Route path="/instructors" element={<InfoPage title="Meet the teachers" eyebrow="GOOD PEOPLE, GOOD MOVEMENT" intro="A great class starts with a teacher who makes room for you to learn." />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<AuthPage mode="register" role="student" login={login} />} />
      <Route path="/login" element={<AuthPage mode="login" role="student" login={login} />} />
      <Route path="/owner/register" element={<AuthPage mode="register" role="owner" login={login} />} />
      <Route path="/owner/login" element={<AuthPage mode="login" role="owner" login={login} />} />
      <Route path="/admin/login" element={<AuthPage mode="login" role="admin" login={login} />} />
      <Route path="/dashboard" element={<Dashboard {...context} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="/enquiry/:id" element={<EnquiryPage {...context} />} />
      <Route path="/owner/classes/new" element={<ClassForm {...context} />} />
      <Route path="/owner/classes/:id/edit" element={<ClassForm {...context} />} />
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
  </div>;
}
export default App;
