import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogArticles } from "@/data/blogArticles";
import { Star, Clock, ArrowRight, TrendingUp, Flame } from "lucide-react";

const FeaturedReviews = () => {
  const featured = blogArticles
    .filter((a) => a.isFeatured)
    .slice(0, 3);

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
              <Flame className="h-4 w-4" />
              Featured
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Latest Expert Reviews
            </h2>
            <p className="text-muted-foreground max-w-xl">
              In-depth, lab-tested reviews with Trust & Integration Scores you can rely on.
            </p>
          </div>
          <Link to="/blog" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((article) => (
            <Link key={article.id} to={`/blog/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30 group overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {article.labTested && (
                    <Badge className="absolute top-3 left-3 bg-success text-success-foreground text-xs">
                      🔬 Lab Tested
                    </Badge>
                  )}
                  {article.editorRating && (
                    <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                      <span className="text-sm font-bold text-foreground">{article.editorRating}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readingTime} min
                    </span>
                    <span>{article.author}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              View All Articles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
