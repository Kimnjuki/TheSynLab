import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogArticles, seoKeywords, competitorFeatures } from "@/data/blogArticles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Calendar, ArrowLeft, Bookmark, Share2, ThumbsUp, Eye, FlaskConical, Award, CheckCircle } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { Separator } from "@/components/ui/separator";

const BlogArticle = () => {
  const { slug } = useParams();
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedArticles = blogArticles.filter(a => article.relatedArticles.includes(a.id));
  const articleUrl = `https://thesynlab.com/blog/${article.slug}`;

  // Parse content into structured sections
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-4 ml-6 space-y-2 list-disc">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/80 leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="my-6 overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted">
                  {tableRows[0]?.map((cell, idx) => (
                    <th key={idx} className="border border-border px-4 py-2 text-left font-semibold text-foreground">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(2).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-border px-4 py-2 text-foreground/80">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle tables
      if (trimmedLine.startsWith('|')) {
        flushList();
        inTable = true;
        const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim());
        if (!trimmedLine.includes('---')) {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Handle list items
      if (trimmedLine.startsWith('- ')) {
        listItems.push(trimmedLine.replace('- ', ''));
        return;
      } else {
        flushList();
      }

      // Handle headings
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground border-l-4 border-primary pl-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Handle bold text blocks
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        elements.push(
          <p key={index} className="font-semibold text-foreground my-3 text-lg">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
        return;
      }

      // Handle horizontal rules
      if (trimmedLine === '---') {
        elements.push(<Separator key={index} className="my-8" />);
        return;
      }

      // Handle empty lines
      if (trimmedLine === '') return;

      // Handle regular paragraphs with inline formatting
      const formattedContent = trimmedLine
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

      elements.push(
        <p 
          key={index} 
          className="text-foreground/80 my-4 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      );
    });

    flushList();
    flushTable();

    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title={article.title}
        description={article.excerpt || article.title}
        canonical={articleUrl}
        ogImage={article.image}
        ogType="article"
      />
      <JsonLd
        type="Article"
        article={{
          title: article.title,
          description: article.excerpt || article.title,
          image: article.image,
          url: articleUrl,
        }}
      />
      <Header />
      <main className="container py-8">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">{article.category}</Badge>
              <Badge variant="outline" className="capitalize text-sm">{article.hub.replace('_', ' ')}</Badge>
              {article.labTested && (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Lab Tested
                </Badge>
              )}
              {article.editorRating && article.editorRating >= 9 && (
                <Badge className="bg-amber-600 hover:bg-amber-700 gap-1">
                  <Award className="h-3 w-3" />
                  Editor's Choice
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{article.excerpt}</p>

            {/* Editor Rating - PCMag Style */}
            {article.editorRating && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{article.editorRating}</div>
                    <div className="text-xs text-muted-foreground">/ 10</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">Editor Rating</div>
                    <div className="text-sm text-muted-foreground">
                      {article.editorRating >= 9 ? 'Outstanding' : article.editorRating >= 8 ? 'Excellent' : article.editorRating >= 7 ? 'Very Good' : 'Good'}
                    </div>
                  </div>
                  {article.testingMethodology && (
                    <div className="hidden md:block text-right">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        {article.testingMethodology}
                      </div>
                      {article.lastLabTest && (
                        <div className="text-xs text-muted-foreground">
                          Last tested: {new Date(article.lastLabTest).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scores */}
            {(article.trustScore || article.integrationScore) && (
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                {article.trustScore && (
                  <ScoreBadge score={article.trustScore} label="Trust Score" type="trust" />
                )}
                {article.integrationScore && (
                  <ScoreBadge score={article.integrationScore} label="Integration Score" type="integration" />
                )}
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">{article.authorAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{article.author}</p>
                  <p className="text-xs text-muted-foreground">{article.authorBio.substring(0, 50)}...</p>
                </div>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.wordCount.toLocaleString()} words
              </span>
            </div>
          </header>

          {/* Full Content */}
          <div className="prose-lg max-w-none">
            {renderContent(article.content)}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Topics covered in this article:</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="hover:bg-primary/10 cursor-pointer transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-6 flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              Helpful
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Author Bio Card */}
          <Card className="mt-10 bg-muted/30">
            <CardContent className="p-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">About the Author</h4>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{article.authorAvatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{article.author}</p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{article.authorBio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedArticles.map(related => (
                  <Link key={related.id} to={`/blog/${related.slug}`}>
                    <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="text-xs mb-2">{related.category}</Badge>
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{related.excerpt}</p>
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {related.readingTime} min read
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticle;
