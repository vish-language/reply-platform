import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPaymentHistory } from "../api/billing.api";

export default function PaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await getPaymentHistory();

        if (response.success) {
          setPayments(response.data);
        } else {
          setError("Unable to load payment history");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load payment history");
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment History</h1>

          <p className="text-gray-500 mt-2">
            View your previous payments and transactions
          </p>
        </div>

        <Link
          to="/billing"
          className="
            border
            border-black
            px-5
            py-2
            rounded-lg
          "
        >
          Back to Billing
        </Link>
      </div>

      <div className="mt-8 bg-white border rounded-xl">
        {payments.length === 0 ? (
          <div className="p-6 text-gray-500">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4">Date</th>

                  <th className="px-6 py-4">Amount</th>

                  <th className="px-6 py-4">Currency</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4">Payment ID</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      ₹{(payment.amount / 100).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">{payment.currency}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`
      inline-flex
      px-3
      py-1
      rounded-full
      text-sm
      font-medium
      ${
        payment.status === "SUCCESS"
          ? "bg-green-100 text-green-700"
          : payment.status === "FAILED"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
      }
    `}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {payment.razorpayPaymentId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
