import { createFileRoute, notFound } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { collectionBySlug } from "@/lib/admin-collections";

export const Route = createFileRoute("/admin/c/$slug")({
  component: CollectionPage,
  notFoundComponent: () => (
    <p className="text-sm text-muted-foreground">That content section does not exist.</p>
  ),
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const collection = collectionBySlug(slug);
  if (!collection) throw notFound();
  return <CollectionManager key={collection.slug} collection={collection} />;
}
