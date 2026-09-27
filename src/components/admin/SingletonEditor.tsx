import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RecordForm, type RowValues } from "./RecordForm";
import type { Field } from "@/lib/admin-collections";
import { listRows, saveRow, type AdminTable } from "@/lib/admin.functions";

/** Editor for tables that hold exactly one row (profile, contact, settings). */
export function SingletonEditor({
  table,
  title,
  description,
  fields,
}: {
  table: AdminTable;
  title: string;
  description: string;
  fields: Field[];
}) {
  const queryClient = useQueryClient();
  const list = useServerFn(listRows);
  const save = useServerFn(saveRow);

  const key = ["admin", table];
  const { data: rows, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => list({ data: { table } }),
  });

  const row = rows?.[0];

  const mutation = useMutation({
    mutationFn: async (values: RowValues) =>
      save({ data: { table, ...(row ? { id: String(row["id"]) } : {}), values } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      void queryClient.invalidateQueries({ queryKey: ["site-data"] });
      toast.success("Saved.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save."),
  });

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      {isLoading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <RecordForm
            key={String(row?.["id"] ?? "new")}
            fields={fields}
            initial={row ?? {}}
            submitLabel="Save changes"
            onSubmit={async (values) => {
              await mutation.mutateAsync(values);
            }}
          />
        </div>
      )}
    </div>
  );
}
