import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteRow, listRows, saveRow } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/messages")({
  component: Messages,
});

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function Messages() {
  const queryClient = useQueryClient();
  const list = useServerFn(listRows);
  const save = useServerFn(saveRow);
  const remove = useServerFn(deleteRow);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const key = ["admin", "contact_messages"];
  const { data: rows = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: () => list({ data: { table: "contact_messages" } }),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: key });
    void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const readMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) =>
      save({ data: { table: "contact_messages", id, values: { is_read } } }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => remove({ data: { table: "contact_messages", id } }),
    onSuccess: () => {
      invalidate();
      toast.success("Message deleted.");
    },
  });

  const messages = (rows as unknown as Message[]).filter((message) => {
    if (filter === "unread" && message.is_read) return false;
    if (!search.trim()) return true;
    const needle = search.toLowerCase();
    return [message.name, message.email, message.subject ?? "", message.message].some((value) =>
      value.toLowerCase().includes(needle),
    );
  });

  return (
    <div>
      <h2 className="text-2xl">Messages</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything sent through your contact form.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search messages…"
          className="max-w-sm"
        />
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread
        </Button>
      </div>

      {isLoading ? (
        <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      ) : messages.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No messages to show.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {messages.map((message) => (
            <li key={message.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {message.name}
                    {!message.is_read ? (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-accent-foreground">
                        New
                      </span>
                    ) : null}
                  </p>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <span className="mr-2 text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={message.is_read ? "Mark as unread" : "Mark as read"}
                    onClick={() =>
                      readMutation.mutate({ id: message.id, is_read: !message.is_read })
                    }
                  >
                    {message.is_read ? (
                      <Mail className="size-4" />
                    ) : (
                      <MailOpen className="size-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete message"
                    onClick={() => deleteMutation.mutate(message.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {message.subject ? (
                <p className="mt-3 text-sm font-medium">{message.subject}</p>
              ) : null}
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
