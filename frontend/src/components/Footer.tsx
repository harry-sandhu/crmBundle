export default function Footer() {
  return (
    <footer className="bg-green-700 text-white text-center p-4 text-sm">
      <p>© {new Date().getFullYear()} BundleMaker. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2 text-yellow-300">
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
        <a href="#">About Us</a>
      </div>
    </footer>
  );
}
