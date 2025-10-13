import { Link,  } from "react-router-dom";

export default function Header() {
 

 
  

  return (
    <header className="flex justify-between items-center p-4 bg-green-600 text-white shadow-md">
      <div className="flex items-center gap-3">
        <img src="../../finallogo.png" alt="Logo" className="h-10 w-10 rounded-full" />
        <h1 className="text-xl font-bold">GrowLifeSuprimo</h1>
      </div>

      <nav className="flex items-center gap-6">
        <Link to="/contact" className="hover:text-yellow-300">Contact Us</Link>
        <Link to="/Aboutus" className="hover:text-yellow-300">About Us</Link>
        <Link to="/Vision" className="hover:text-yellow-300">Vision</Link>
        {/* <button onClick={handleLogout} className="bg-yellow-400 text-green-900 px-3 py-1 rounded-md hover:bg-yellow-300">
          Logout
        </button> */}
      </nav>
    </header>
  );
}
