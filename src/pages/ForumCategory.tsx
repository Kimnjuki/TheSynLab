import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForumCategory, useForumThreads } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MessageSquare, Eye, Heart, CheckCircle2, Pin, Clock, Plus, ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ForumCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { category, isLoading: catLoading, error } = useForumCategory(slug || "");
  const { threads, isLoading: threadsLoading } = useForumThreads(category?._id);
  const { user } = useAuth();

  if (catLoading) {
    return (
      <>
        <Header />
        <div className="container py-16 text-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
        </div>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error ? "Forum not yet deployed" : "Category not found"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {error ? "Run `npx convex deploy` to activate the forum." : "This category doesn't exist."}
          </p>
          <Link to="/forum" className="text-primary hover:underline mt-2 inline-block">
            ← Back to Forum
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const pinnedThreads = threads.filter((t: any) => t.isPinned);
  const regularThreads = threads.filter((t: any) => !t.isPinned);

  return (
    <>
      <Helmet>
        <title>{`${category.name} – Forum | TheSynLab`}</title>
        <meta name="description" content={category.description || `Discussions about ${category.name}`} />
        <link rel="canonical" href={`https://www.thesynlab.com/forum/category/${slug}`} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/forum">Forum</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{category.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
              <p className="text-muted-foreground mt-1">{category.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>{category.threadCount} threads</span>
                <span>{category.postCount} posts</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/forum">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              </Link>
              {user && (
                <Link to={`/forum/new?category=${slug}`}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" /> New Thread
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {threadsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : threads.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No threads in this category</h3>
              <p className="text-muted-foreground mt-1">Be the first to start a discussion!</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {[...pinnedThreads, ...regularThreads].map((thread: any) => (
                <Link key={thread._id} to={`/forum/thread/${thread.slug}`}>
                  <Card className="hover:shadow-sm transition-all hover:border-primary/20 group">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {thread.isPinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                          {thread.isSolved && (
                            <Badge variant="outline" className="text-xs border-success/30 text-success bg-success/5">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Solved
                            </Badge>
                          )}
                          <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {thread.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span>{thread.authorName}</span>
                          {(thread.tags || []).slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs h-5">{tag}</Badge>
                          ))}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(thread._creationTime, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{thread.replyCount}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{thread.viewCount}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{thread.likeCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ForumCategory;
