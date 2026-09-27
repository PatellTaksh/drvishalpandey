import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICON_NAMES } from "@/components/site/DynamicIcon";
import { UploadField } from "./UploadField";
import type { Field } from "@/lib/admin-collections";

export type RowValues = Record<string, unknown>;

function toText(value: unknown) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join("\n");
  return String(value);
}

export function RecordForm({
  fields,
  initial,
  relations,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: {
  fields: Field[];
  initial: RowValues;
  relations?: Record<string, Array<{ id: string; name: string }>>;
  submitLabel?: string;
  onSubmit: (values: RowValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<RowValues>(initial);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (name: string, value: unknown) =>
    setValues((current) => ({ ...current, [name]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !toText(values[field.name]).trim()) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: RowValues = {};
    for (const field of fields) {
      const raw = values[field.name];
      if (field.type === "list") {
        payload[field.name] = toText(raw)
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      } else if (field.type === "number") {
        const text = toText(raw).trim();
        payload[field.name] = text === "" ? null : Number(text);
      } else if (field.type === "boolean") {
        payload[field.name] = Boolean(raw);
      } else if (field.type === "relation") {
        const text = toText(raw).trim();
        payload[field.name] = text === "" ? null : text;
      } else {
        payload[field.name] = toText(raw);
      }
    }

    setSaving(true);
    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {fields.map((field) => {
        const id = `field-${field.name}`;
        const text = toText(values[field.name]);

        return (
          <div key={field.name} className="space-y-2">
            {field.type === "boolean" ? (
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <Label htmlFor={id}>{field.label}</Label>
                <Switch
                  id={id}
                  checked={Boolean(values[field.name])}
                  onCheckedChange={(checked) => set(field.name, checked)}
                />
              </div>
            ) : (
              <>
                <Label htmlFor={id}>
                  {field.label}
                  {field.required ? <span className="text-destructive"> *</span> : null}
                </Label>

                {field.type === "textarea" || field.type === "list" ? (
                  <Textarea
                    id={id}
                    rows={field.rows ?? 4}
                    value={text}
                    onChange={(event) => set(field.name, event.target.value)}
                  />
                ) : field.type === "image" || field.type === "file" ? (
                  <UploadField
                    value={text}
                    onChange={(next) => set(field.name, next)}
                    folder={field.folder ?? "uploads"}
                    accept={field.type === "image" ? "image/*" : ".pdf,.doc,.docx,image/*"}
                    preview={field.type === "image"}
                  />
                ) : field.type === "select" || field.type === "icon" || field.type === "relation" ? (
                  <Select
                    value={text || "__none"}
                    onValueChange={(next) => set(field.name, next === "__none" ? "" : next)}
                  >
                    <SelectTrigger id={id}>
                      <SelectValue placeholder="Choose…" />
                    </SelectTrigger>
                    <SelectContent>
                      {!field.required ? <SelectItem value="__none">None</SelectItem> : null}
                      {field.type === "icon"
                        ? ICON_NAMES.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))
                        : field.type === "relation"
                          ? (relations?.[field.name] ?? []).map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))
                          : (field.options ?? []).map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={id}
                    type={field.type === "number" ? "number" : "text"}
                    value={text}
                    onChange={(event) => set(field.name, event.target.value)}
                  />
                )}
              </>
            )}

            {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
            {errors[field.name] ? (
              <p className="text-xs text-destructive">{errors[field.name]}</p>
            ) : null}
          </div>
        );
      })}

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
