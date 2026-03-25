import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HubPost() {
  const { hubSlug, postSlug } = useParams<{ hubSlug: string; postSlug: string }>();
  const post = useQuery(api.posts.getBySlug, { slug: postSlug ?? "" });
  const hub = useQuery(api.hubs.getHubBySlug, { slug: hubSlug ?? "" });

  const title = post?.postTitle ?? "Loading…";
  const hubName = hub?.name ?? hubSlug ?? "Hub";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${title} | ${hubName} | TheSynLab`}
        metaDescription={post?.postExcerpt ?? post?.metaDescription ?? undefined}
        canonicalUrl={`/hubs/${hubSlug ?? ""}/${postSlug ?? ""}`}
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.thesynlab.com/" },
            { "@type": "ListItem", position: 2, name: hubName, item: `https://www.thesynlab.com/hubs/${hubSlug ?? ""}` },
            { "@type": "ListItem", position: 3, name: title, item: `https://www.thesynlab.com/hubs/${hubSlug ?? ""}/${postSlug ?? ""}` },
          ],
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: hubName, href: `/hubs/${hubSlug ?? ""}` },
            { label: title },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {post?.postContent ? (
              <div className="prose max-w-none whitespace-pre-wrap">{post.postContent}</div>
            ) : (
              <div className="text-muted-foreground">Loading article…</div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

