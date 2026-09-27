import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, GripVertical, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RecordForm, type RowValues } from "./RecordForm";
import type { Collection } from "@/lib/admin-collections";
import {
  deleteRow,
  listRows,
  reorderRows,
  saveRow,
  setActiveResume,
} from "@/lib/admin.functions";

function blankRow(collection: Collection): RowValues {
  const row: RowValues = {};
  for (const field of collection.fields) {
    row[field.name] = field.type === "boolean" ? field.name !== "is_active" : "";
  }
  return row;
}

export function CollectionManager({ collection }: { collection: Collection }) {
  const queryClient = useQueryClient();
  const list = useServerFn(listRows);
  const save = useServerFn(saveRow);
  const remove = useServerFn(deleteRow);
  const reorder = useServerFn(reorderRows);
  const activate = useServerFn(setActiveResume);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<RowValues | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const key = ["admin", collection.table];
  const { data: rows = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: () => list({ data: { table: collection.table } }),
  });

  const relationTable = collection.fields.find((field) => field.type === "relation")?.relationTable;
  const { data: relationRows = [] } = useQuery({
    queryKey: ["admin", relationTable ?? "none"],
    queryFn: () => list({ data: { table: relationTable! } }),
    enabled: Boolean(relationTable),
  });

  const relations = useMemo(() => {
    const field = collection.fields.find((entry) => entry.type === "relation");
    if (!field) return {};
    return {
      [field.name]: relationRows.map((row) => ({
        id: String(row["id"]),
        name: String(row["name"] ?? row["title"] ?? ""),
      })),
    };
  }, [collection.fields, relationRows]);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: key });
    void queryClient.invalidateQueries({ queryKey: ["site-data"] });
  };

  const saveMutation = useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: RowValues }) =>
      save({ data: { table: collection.table, ...(id ? { id } : {}), values } }),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("Saved.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => remove({ data: { table: collection.table, id } }),
    onSuccess: () => {
      invalidate();
      setConfirmId(null);
      toast.success("Deleted.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete."),
  });

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) => reorder({ data: { table: collection.table, ids } }),
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message || "Could not reorder."),
  });

  const activateMutation = useMutation({
    mutationFn: async (id: string) => activate({ data: { id } }),
    onSuccess: () => {
      invalidate();
      toast.success("Active resume updated.");
    },
  });

  const filtered = rows.filter((row) => {
    if (!search.trim()) return true;
    const needle = search.toLowerCase();
    return collection.searchFields.some((field) =>
      String(row[field] ?? "")
        .toLowerCase()
        .includes(needle),
    );
  });

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const ids = rows.map((row) => String(row["id"]));
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]!);
    setDragId(null);
    reorderMutation.mutate(ids);
  }

  if (editing) {
    const id = editing["id"] ? String(editing["id"]) : undefined;
    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl">
          {id ? "Edit" : "Add"} · {collection.title}
        </h2>
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <RecordForm
            fields={collection.fields}
            initial={editing}
            relations={relations}
            submitLabel={id ? "Save changes" : "Add"}
            onSubmit={async (values) =>
              saveMutation.mutateAsync(id ? { id, values } : { values }).then(() => undefined)
            }
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl">{collection.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
        </div>
        <Button onClick={() => setEditing(blankRow(collection))}>
          <Plus className="size-4" /> Add new
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${collection.title.toLowerCase()}…`}
          className="max-w-sm"
        />
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {rows.length}
        </span>
      </div>

      {isLoading ? (
        <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Use “Add new” to create the first entry.
        </p>
      ) : (
        <ul className="mt-5 space-y-2">
          {filtered.map((row) => {
            const id = String(row["id"]);
            const visibilityField = collection.visibilityField;
            return (
              <li
                key={id}
                draggable={collection.sortable && !search}
                onDragStart={() => setDragId(id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(id)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 pl-2"
              >
                {collection.sortable ? (
                  <span
                    className="cursor-grab text-muted-foreground"
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                  >
                    <GripVertical className="size-4" />
                  </span>
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {String(row[collection.titleField] ?? "Untitled")}
                  </p>
                  {collection.subtitleField ? (
                    <p className="truncate text-xs text-muted-foreground">
                      {String(row[collection.subtitleField] ?? "")}
                    </p>
                  ) : null}
                </div>

                {collection.table === "resumes" ? (
                  row["is_active"] ? (
                    <Badge>
                      <Check className="size-3" /> Active
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => activateMutation.mutate(id)}
                      title="Make this the active resume"
                    >
                      <Star className="size-4" /> Make active
                    </Button>
                  )
                ) : null}

                {visibilityField ? (
                  <Switch
                    checked={Boolean(row[visibilityField])}
                    aria-label="Visible on site"
                    onCheckedChange={(checked) =>
                      saveMutation.mutate({ id, values: { [visibilityField]: checked } })
                    }
                  />
                ) : null}

                <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(row)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete"
                  onClick={() => setConfirmId(id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      {collection.sortable ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag the handle to change the order shown on the site. Clear the search box to reorder.
        </p>
      ) : null}

      <AlertDialog open={Boolean(confirmId)} onOpenChange={(open) => !open && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from your site straight away and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmId && deleteMutation.mutate(confirmId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
