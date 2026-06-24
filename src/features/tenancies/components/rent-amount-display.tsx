type RentAmountDisplayProps = {
  amount: number;
};

export function RentAmountDisplay({ amount }: RentAmountDisplayProps) {
  return (
    <span className="font-medium text-slate-950">
      {new Intl.NumberFormat("en-GB", {
        currency: "GBP",
        maximumFractionDigits: 0,
        style: "currency",
      }).format(amount)}
      <span className="font-normal text-slate-500"> / month</span>
    </span>
  );
}
