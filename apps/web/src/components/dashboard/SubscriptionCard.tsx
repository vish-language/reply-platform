interface Props {
  plan: string;
  status: string;
}

export default function SubscriptionCard({ plan, status }: Props) {
  return (
    <div
      className="
bg-white
border
rounded-xl
p-5
"
    >
      <p className="text-gray-500">Current Plan</p>

      <h2
        className="
text-2xl
font-bold
mt-2
"
      >
        {plan}
      </h2>

      <p className="mt-2">
        Status:
        <span className="font-semibold">{status}</span>
      </p>
    </div>
  );
}
