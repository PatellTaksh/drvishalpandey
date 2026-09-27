import { createFileRoute } from "@tanstack/react-router";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { SETTINGS_FIELDS } from "@/lib/admin-collections";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <SingletonEditor
      table="site_settings"
      title="Site & search preview"
      description="Site name, logo, footer text and how your site looks when shared."
      fields={SETTINGS_FIELDS}
    />
  ),
});
