import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogArticles, blogCategories, blogHubs, seoKeywords } from "@/data/blogArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, Calendar, Search, Star, Shield, TrendingUp, FlaskConical, Award } from "lucide-react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedHub, setSelectedHub] = useState("all");

  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesHub = selectedHub === "all" || article.hub === selectedHub;
    return matchesSearch && matchesCategory && matchesHub;
  });

  const featuredArticles = blogArticles.filter(a => a.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Insights & Reviews</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In-depth analysis powered by Trust & Integration Scores. Data-driven reviews of productivity tools, smart home devices, and office hardware.
          </p>
          
          {/* Top SEO Keywords - Trending Topics */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {Object.entries(seoKeywords).slice(0, 6).map(([key, data]) => (
              <Badge 
                key={key} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSearchQuery(data.keyword)}
              >
                🔥 {data.keyword}
                <span className="ml-1 text-xs text-muted-foreground">({(data.volume / 1000).toFixed(0)}k)</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-accent" />
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <Link key={article.id} to={`/blog/${article.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-all group">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                    <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readingTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                    </div>
                    {article.trustScore && (
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="text-xs gap-1">
                          <Shield className="h-3 w-3" />
                          Trust: {article.trustScore}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedHub} onValueChange={setSelectedHub}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Hub" />
            </SelectTrigger>
            <SelectContent>
              {blogHubs.map(hub => (
                <SelectItem key={hub.id} value={hub.id}>{hub.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredArticles.length} of {blogArticles.length} articles
        </p>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <Link key={article.id} to={`/blog/${article.slug}`}>
              <Card className="h-full hover:border-primary/50 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {article.hub.replace('_', ' ')}
                    </Badge>
                    {article.labTested && (
                      <Badge className="text-xs gap-1 bg-primary/90">
                        <FlaskConical className="h-2.5 w-2.5" />
                        Lab Tested
                      </Badge>
                    )}
                    {article.editorRating && article.editorRating >= 9 && (
                      <Badge className="text-xs gap-1 bg-accent text-accent-foreground">
                        <Award className="h-2.5 w-2.5" />
                        Top Pick
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readingTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {(article.trustScore || article.integrationScore) && (
                    <div className="flex gap-2 mt-3">
                      {article.trustScore && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Shield className="h-3 w-3 text-success" />
                          {article.trustScore}
                        </Badge>
                      )}
                      {article.integrationScore && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <TrendingUp className="h-3 w-3 text-primary" />
                          {article.integrationScore}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
