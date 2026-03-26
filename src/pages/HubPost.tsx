import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQSection } from "@/components/seo/FAQSection";
import { blogArticles } from "@/data/blogArticles";

export default function HubPost() {
  const { hubSlug, postSlug } = useParams<{ hubSlug: string; postSlug: string }>();
  const post = useQuery(api.posts.getBySlug, { slug: postSlug ?? "" });
  const hub = useQuery(api.hubs.getHubBySlug, { slug: hubSlug ?? "" });
  const [showConnectionWarning, setShowConnectionWarning] = useState(false);

  useEffect(() => {
    setShowConnectionWarning(false);
    if (post !== undefined) return;
    const timeout = window.setTimeout(() => setShowConnectionWarning(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [post, postSlug]);

  const fallbackArticle = useMemo(
    () => blogArticles.find((article) => article.slug === (postSlug ?? "")),
    [postSlug],
  );

  const title = post?.postTitle ?? fallbackArticle?.title ?? "Loading…";
  const hubName = hub?.name ?? hubSlug ?? "Hub";
  const content = post?.postContent ?? fallbackArticle?.content ?? "";
  const metaDescription =
    post?.postExcerpt ?? post?.metaDescription ?? fallbackArticle?.metaDescription ?? undefined;
  const isMissingPost = post === null && !fallbackArticle;
  const isTimedOut = post === undefined && showConnectionWarning;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${title} | ${hubName} | TheSynLab`}
        metaDescription={metaDescription}
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
            {isTimedOut ? (
              <div className="text-amber-700">
                The article service is taking longer than expected. Retry in a few seconds.
              </div>
            ) : isMissingPost ? (
              <div className="text-muted-foreground">
                This article is not available yet. It may still be publishing.
              </div>
            ) : content ? (
              <div className="prose max-w-none whitespace-pre-wrap">{content}</div>
            ) : (
              <div className="text-muted-foreground">Loading article…</div>
            )}
          </CardContent>
        </Card>

        <FAQSection keyword={(post as any)?.primaryKeyword} hubSlug={hubSlug} />
      </main>
      <Footer />
    </div>
  );
}

