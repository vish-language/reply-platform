import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    console.log("LOGOUT CLICKED");

    logout();

    console.log("TOKEN AFTER LOGOUT", localStorage.getItem("token"));

    navigate("/login");
  }

  return (
    <aside
      className="
      w-64
      min-h-screen
      bg-white
      border-r
      flex
      flex-col
      justify-between
      p-5
      "
    >
      {/* TOP SECTION */}

      <div>
        <h1
          className="
          text-2xl
          font-bold
          mb-8
          "
        >
          ReplyAI
        </h1>

        <nav
          className="
          space-y-2
          "
        >
          {/* DASHBOARD */}

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `
              block
              px-4
              py-2
              rounded-lg
              ${isActive ? "bg-black text-white" : "text-gray-700"}
              `
            }
          >
            Dashboard
          </NavLink>

          {/* REVIEWS */}

          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              `
              block
              px-4
              py-2
              rounded-lg
              ${isActive ? "bg-black text-white" : "text-gray-700"}
              `
            }
          >
            Reviews
          </NavLink>

          {/* GOOGLE REVIEWS */}

          <NavLink
            to="/google-reviews"
            className={({ isActive }) =>
              `
              block
              px-4
              py-2
              rounded-lg
              ${isActive ? "bg-black text-white" : "text-gray-700"}
              `
            }
          >
            Connect Google Reviews
          </NavLink>

          {/* AI SETTINGS */}

          <NavLink
            to="/settings/ai"
            className={({ isActive }) =>
              `
              block
              px-4
              py-2
              rounded-lg
              ${isActive ? "bg-black text-white" : "text-gray-700"}
              `
            }
          >
            AI Settings
          </NavLink>

          {/* BILLING */}

          <NavLink
            to="/billing"
            className={({ isActive }) =>
              `
              block
              px-4
              py-2
              rounded-lg
              ${isActive ? "bg-black text-white" : "text-gray-700"}
              `
            }
          >
            Billing
          </NavLink>

          {/* TEAM */}

          <NavLink
            to="/team"
            className={({ isActive }) =>
              `
              block
              px-4
              py-2
              rounded-lg
              ${isActive ? "bg-black text-white" : "text-gray-700"}
              `
            }
          >
            Team
          </NavLink>
        </nav>
      </div>

      {/* USER SECTION */}

      <div
        className="
        border-t
        pt-5
        "
      >
        <p
          className="
          font-semibold
          "
        >
          {user?.name}
        </p>

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          {user?.email}
        </p>

        <button
          onClick={handleLogout}
          className="
          mt-4
          w-full
          border
          border-red-500
          text-red-500
          py-2
          rounded-lg
          hover:bg-red-50
          "
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
