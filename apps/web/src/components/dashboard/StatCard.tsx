interface Props {
  title: string;
  value: string | number;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div
      className="
bg-white
border
rounded-xl
p-5
"
    >
      <p className="text-gray-500">{title}</p>

      <h2
        className="
text-3xl
font-bold
mt-3
"
      >
        {value}
      </h2>
    </div>
  );
}
