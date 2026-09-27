import { createFileRoute } from "@tanstack/react-router";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { CONTACT_FIELDS } from "@/lib/admin-collections";

export const Route = createFileRoute("/admin/contact")({
  component: () => (
    <SingletonEditor
      table="contact_info"
      title="Contact details"
      description="What visitors see in the contact section, and what stays private."
      fields={CONTACT_FIELDS}
    />
  ),
});
