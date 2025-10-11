import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <Header />
      <main className="flex-grow px-4 md:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
