import { useEffect, useState } from "react";

import { getComments } from "../api/comments.api";

import ReviewCard from "../components/reviews/ReviewCard";

export default function Reviews() {
  const [comments, setComments] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  async function loadComments() {
    try {
      setLoading(true);

      const response = await getComments();

      console.log("COMMENTS RESPONSE", response);

      setComments(response.data);
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <div>
      <div
        className="
        flex
        justify-between
        items-center
        "
      >
        <div>
          <h1
            className="
            text-3xl
            font-bold
            "
          >
            Reviews
          </h1>

          <p
            className="
            text-gray-500
            mt-2
            "
          >
            Manage customer reviews and replies
          </p>
        </div>

        <button
          onClick={loadComments}
          disabled={loading}
          className="
          bg-blue-600
          text-white
          px-5
          py-2
          rounded-lg
          disabled:opacity-50
          "
        >
          {loading ? "Refreshing..." : "Refresh Reviews"}
        </button>
      </div>

      <div
        className="
        mt-8
        space-y-5
        "
      >
        {comments.map((comment) => (
          <ReviewCard key={comment.id} comment={comment} />
        ))}

        {comments.length === 0 && (
          <div
            className="
            bg-white
            border
            rounded-xl
            p-5
            "
          >
            No reviews found
          </div>
        )}
      </div>
    </div>
  );
}
