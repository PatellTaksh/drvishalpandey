import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectQuery } from "@/lib/site-queries";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!data.project) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.project) {
      return { meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }] };
    }
    const { project, settings } = loaderData;
    const title = `${project.title} — ${settings?.site_name ?? "Portfolio"}`;
    const description = project.short_description;
    const image = project.thumbnail_url;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image && image.startsWith("http")
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <h1 className="text-3xl">Project not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This project may have been moved or is no longer published.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to portfolio</Link>
      </Button>
    </div>
  ),
  component: ProjectPage,
});

function toList(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(projectQuery(slug));
  const project = data.project!;

  const facts = [
    project.role ? ["Role", project.role] : null,
    project.status ? ["Status", project.status] : null,
    project.category ? ["Category", project.category] : null,
    project.team_size ? ["Team", String(project.team_size)] : null,
    project.start_date || project.end_date
      ? ["Timeline", [project.start_date, project.end_date].filter(Boolean).join(" — ")]
      : null,
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to portfolio
        </Link>
      </Button>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {project.featured ? <Badge>Featured</Badge> : null}
        {project.category ? <Badge variant="outline">{project.category}</Badge> : null}
      </div>
      <h1 className="mt-3 text-4xl sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {project.short_description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.demo_url ? (
          <Button asChild>
            <a href={project.demo_url} target="_blank" rel="noreferrer noopener">
              <ExternalLink className="size-4" /> Live demo
            </a>
          </Button>
        ) : null}
        {project.github_url ? (
          <Button asChild variant="outline">
            <a href={project.github_url} target="_blank" rel="noreferrer noopener">
              <Github className="size-4" /> Source code
            </a>
          </Button>
        ) : null}
      </div>

      {project.thumbnail_url ? (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="mt-10 aspect-[16/9] w-full rounded-xl border border-border object-cover shadow-card"
        />
      ) : null}

      {facts.length > 0 ? (
        <dl className="mt-8 grid gap-4 rounded-xl border border-border bg-paper p-5 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {project.detailed_description ? (
        <section className="mt-10 space-y-4">
          {project.detailed_description
            .split("\n")
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
        </section>
      ) : null}

      <Block title="Key features" items={toList(project.features)} />
      <Block title="Challenges" items={toList(project.challenges)} />
      <Block title="Solutions" items={toList(project.solutions)} />

      {project.technologies.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl">Tech stack</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <Badge variant="secondary">{tech}</Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(project.images ?? []).length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl">Gallery</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {(project.images ?? []).map((image) => (
              <li key={image}>
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
