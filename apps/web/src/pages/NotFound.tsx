import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      "
    >
      <div
        className="
        text-center
        "
      >
        <h1
          className="
          text-6xl
          font-bold
          "
        >
          404
        </h1>

        <p
          className="
          text-gray-500
          mt-3
          "
        >
          Page not found
        </p>

        <Link
          to="/dashboard"
          className="
          inline-block
          mt-5
          bg-black
          text-white
          px-5
          py-2
          rounded-lg
          "
        >
          Go Dashboard
        </Link>
      </div>
    </div>
  );
}
