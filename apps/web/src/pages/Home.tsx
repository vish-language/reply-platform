import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}

      <nav
        className="
        flex
        justify-between
        items-center
        px-10
        py-5
        border-b
        "
      >
        <h1 className="text-2xl font-bold">Reply Platform</h1>

        <div className="flex gap-6">
          <Link to="/">Home</Link>

          <Link to="/pricing">Pricing</Link>

          <Link to="/contact">Contact</Link>

          <Link to="/login">Login</Link>

          <Link
            to="/pricing"
            className="
            bg-black
            text-white
            px-4
            py-2
            rounded-lg
            "
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}

      <section
        className="
        text-center
        py-24
        px-5
        "
      >
        <h2
          className="
          text-5xl
          font-bold
          "
        >
          AI Powered Review Management
        </h2>

        <p
          className="
          mt-5
          text-gray-600
          text-xl
          "
        >
          Automatically generate professional replies to your customer reviews
          using AI.
        </p>

        <Link
          to="/register"
          className="
          inline-block
          mt-8
          bg-blue-600
          text-white
          px-8
          py-3
          rounded-lg
          "
        >
          Start Free Trial
        </Link>
      </section>

      {/* Features */}

      <section
        className="
        grid
        grid-cols-3
        gap-5
        px-10
        "
      >
        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-xl">AI Replies</h3>

          <p className="mt-2 text-gray-600">
            Generate customer responses automatically.
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-xl">Review Sync</h3>

          <p className="mt-2 text-gray-600">
            Manage reviews from one dashboard.
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-xl">Analytics</h3>

          <p className="mt-2 text-gray-600">Track your customer engagement.</p>
        </div>
      </section>

      {/* Pricing preview */}

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">Simple Pricing</h2>

        <p className="mt-3 text-gray-500">
          Start free and upgrade when you grow.
        </p>
      </section>

      {/* Contact */}

      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold">Contact Us</h2>

        <p className="text-gray-500 mt-2">support@replyplatform.com</p>
      </section>
    </div>
  );
}
