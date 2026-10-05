import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DataTableColumn<Row> = {
  header: string;
  render: (row: Row) => ReactNode;
};

type DataTableProps<Row> = {
  columns: Array<DataTableColumn<Row>>;
  variant?: "standalone" | "embedded";
  rows: Row[];
};

export function DataTable<Row>({
  columns,
  rows,
  variant = "standalone",
}: DataTableProps<Row>) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-white",
        variant === "standalone" &&
          "rounded-xl border border-slate-200 shadow-sm shadow-slate-200/50",
        variant === "embedded" && "rounded-b-xl",
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th className="px-4 py-3" key={column.header} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, rowIndex) => (
              <tr className="text-slate-700" key={rowIndex}>
                {columns.map((column) => (
                  <td className="px-4 py-3.5 align-middle" key={column.header}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
