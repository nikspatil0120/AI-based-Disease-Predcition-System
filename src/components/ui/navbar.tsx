import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="w-full flex justify-end items-center p-4 bg-white shadow">
      {userName ? (
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="font-semibold">{userName}</span>
            <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              {userName[0]}
            </span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setOpen(false); navigate("/history"); }}
              >
                History
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover font-semibold"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
