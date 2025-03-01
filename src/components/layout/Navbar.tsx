import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">🍽️ Foodie</Link>
        <div>
          <Link href="/" className="px-4">Home</Link>
          <Link href="/favorites" className="px-4">Favorites</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
