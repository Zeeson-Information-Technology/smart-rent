type ActivityItemProps = {
  date: string;
  location: string;
  time: string;
  title: string;
};

export function ActivityItem({ date, location, time, title }: ActivityItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
        <span className="text-xs font-semibold">{date.split(" ")[0]}</span>
        <span className="text-[10px] uppercase">{date.split(" ")[1]}</span>
      </div>
      <div className="min-w-0">
        <p className="font-medium text-slate-950">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{location}</p>
        <p className="mt-1 text-xs font-medium text-blue-700">{time}</p>
      </div>
    </div>
  );
}
