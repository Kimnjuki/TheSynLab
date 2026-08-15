import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogArticles } from "@/data/blogArticles";
import { Clock, ArrowRight, Star } from "lucide-react";

const FeaturedComparisons = () => {
  const featured = blogArticles
    .filter((a) => a.isFeatured)
    .slice(0, 6);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="bg-tsl-bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-tsl-text mb-3">
              Top Comparisons &amp; Guides
            </h2>
            <p className="text-tsl-text-secondary max-w-xl">
              Our most-read lab-tested comparisons, refreshed weekly with updated scores.
            </p>
          </div>
          <Link to="/blog" className="hidden md:block">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-tsl-accent hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((article) => (
            <Link key={article.id} to={`/blog/${article.slug}`}>
              <Card className="h-full bg-tsl-surface border-tsl-border hover:border-tsl-accent/40 transition-all duration-200 hover:-translate-y-1 group overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-tsl-accent/10 to-tsl-accent-secondary/10 relative">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {article.labTested && (
                    <Badge className="absolute top-3 left-3 bg-tsl-trust-high text-tsl-bg-primary text-xs font-semibold">
                      Lab Tested
                    </Badge>
                  )}
                  {article.editorRating && (
                    <div className="absolute top-3 right-3 bg-tsl-bg-primary/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-tsl-trust-mid fill-tsl-trust-mid" />
                      <span className="text-sm font-bold text-tsl-text">{article.editorRating}/10</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-tsl-bg-secondary text-tsl-text-secondary border-tsl-border">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-tsl-text-secondary">
                      {formatDate(article.updatedAt || article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-tsl-text group-hover:text-tsl-accent transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-tsl-text-secondary line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="flex items-center gap-1 text-xs text-tsl-text-secondary">
                      <Clock className="h-3 w-3" />
                      {article.readingTime} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-tsl-accent">
                      Read comparison <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/blog">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-tsl-accent hover:underline">
              View all comparisons <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedComparisons;
