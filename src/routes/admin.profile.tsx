import { createFileRoute } from "@tanstack/react-router";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { PROFILE_FIELDS } from "@/lib/admin-collections";

export const Route = createFileRoute("/admin/profile")({
  component: () => (
    <SingletonEditor
      table="profile"
      title="Profile & hero"
      description="Your name, title, bio, photo and the buttons in the hero area."
      fields={PROFILE_FIELDS}
    />
  ),
});
