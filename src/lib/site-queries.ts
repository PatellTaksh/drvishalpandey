import { queryOptions } from "@tanstack/react-query";
import { getProjectBySlug, getSiteData } from "./portfolio.functions";

export const siteDataQuery = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
  staleTime: 30_000,
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
    staleTime: 30_000,
  });
