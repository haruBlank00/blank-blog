import { ColumnDef } from "@tanstack/react-table";
import CellActions from "~/components/ui/cell-actions";

export type Blog = {
  id: string;
  semanticHtml: string;
};

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "id",
    header: "S.N.",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "semanticHtml",
    header: "Content",
    cell: ({ row }) => {
      const html = row.original.semanticHtml;
      return (
        <div
          className="truncate"
          dangerouslySetInnerHTML={{ __html: row.original.semanticHtml }}
        ></div>
      );
    },
  },
  {
    id: "cell-actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />;
    },
  },
];
