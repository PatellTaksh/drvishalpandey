import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/portfolio.functions";

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm() {
  const send = useServerFn(sendContactMessage);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      name: String(new FormData(form).get("name") ?? "").trim(),
      email: String(new FormData(form).get("email") ?? "").trim(),
      subject: String(new FormData(form).get("subject") ?? "").trim(),
      message: String(new FormData(form).get("message") ?? "").trim(),
    };

    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      nextErrors.email = "Please enter a valid email address";
    if (values.message.length < 5) nextErrors.message = "Please write a short message";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    try {
      await send({ data: values });
      setSent(true);
      form.reset();
      toast.success("Message sent successfully.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
        <p className="font-display text-2xl">Message sent successfully.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out — you'll get a reply soon.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cf-name">Name</Label>
          <Input id="cf-name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-email">Email</Label>
          <Input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-subject">Subject</Label>
        <Input id="cf-subject" name="subject" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-message">Message</Label>
        <Textarea id="cf-message" name="message" rows={6} aria-invalid={!!errors.message} />
        {errors.message ? <p className="text-xs text-destructive">{errors.message}</p> : null}
      </div>
      <Button type="submit" disabled={sending} className="w-full sm:w-auto">
        {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {sending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
