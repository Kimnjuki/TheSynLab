import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForumCategories, useForumThreads, useForumStats, useForumSearch, useForumActions } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare, Eye, Heart, CheckCircle2, Pin, Search,
  TrendingUp, Clock, Users, BarChart3, Home, Star, Wrench,
  Zap, Tag, Plus, ArrowRight, Flame, Award, AlertTriangle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const iconMap: Record<string, any> = {
  Home, Star, Wrench, Zap, Tag, MessageSquare,
};

const Forum = () => {
  const { categories, isLoading: catsLoading, error: catsError } = useForumCategories();
  const { threads, isLoading: threadsLoading, error: threadsError } = useForumThreads();
  const { stats } = useForumStats();
  const { user } = useAuth();
  const { seedForum } = useForumActions();
  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults } = useForumSearch(searchQuery);
  const [activeTab, setActiveTab] = useState("categories");

  const hasError = catsError || threadsError;

  const recentThreads = [...(threads || [])]
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
    .slice(0, 10);

  const trendingThreads = [...(threads || [])]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "name": "TheSynLab Community Forum",
    "description": "Community forum for smart home, tech reviews, and automation discussions",
    "url": "https://www.thesynlab.com/forum",
  };

  return (
    <>
      <Helmet>
        <title>Community Forum – Smart Home & Tech Discussions | TheSynLab</title>
        <meta name="description" content="Join TheSynLab community forum. Discuss smart home setups, share product reviews, troubleshoot devices, and discover automation workflows." />
        <meta name="keywords" content="smart home forum, tech community, product reviews discussion, home automation help, smart home troubleshooting" />
        <link rel="canonical" href="https://www.thesynlab.com/forum" />
        <meta property="og:title" content="Community Forum – TheSynLab" />
        <meta property="og:description" content="Join thousands of smart home enthusiasts. Discuss setups, reviews, and automations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thesynlab.com/forum" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Users className="h-4 w-4" />
                {stats ? `${stats.totalMembers.toLocaleString()} members` : "Growing community"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Community Forum
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ask questions, share setups, discuss products, and connect with fellow tech enthusiasts.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search threads, topics, tags..."
                  className="pl-12 h-12 text-base rounded-xl border-border/60 bg-card shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search forum threads"
                />
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && searchResults.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl z-50 mt-2">
                  <Card className="shadow-lg border">
                    <CardContent className="p-2">
                      {searchResults.map((thread: any) => (
                        <Link
                          key={thread._id}
                          to={`/forum/thread/${thread.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                          <div className="text-left min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">{thread.title}</p>
                            <p className="text-xs text-muted-foreground">
                              by {thread.authorName} · {thread.replyCount} replies
                            </p>
                          </div>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
                {[
                  { label: "Threads", value: stats.totalThreads, icon: MessageSquare },
                  { label: "Replies", value: stats.totalReplies, icon: BarChart3 },
                  { label: "Solved", value: stats.solvedThreads, icon: CheckCircle2 },
                  { label: "Members", value: stats.totalMembers, icon: Users },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="container py-8">
          {/* Deployment Notice */}
          {hasError && (
            <Card className="mb-6 border-accent/40 bg-accent/5">
              <CardContent className="flex items-center gap-4 p-5">
                <AlertTriangle className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Forum Backend Not Deployed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The forum functions need to be deployed to Convex. Run <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">npx convex deploy</code> to activate the forum.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              {categories.length === 0 && !hasError && (
                <Button variant="outline" size="sm" onClick={() => seedForum()}>
                  <Flame className="h-4 w-4 mr-1" />
                  Seed Forum
                </Button>
              )}
              {user && (
                <Link to="/forum/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Thread
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Categories View */}
          {activeTab === "categories" && (
            <div className="space-y-3">
              {catsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))
              ) : categories.length === 0 ? (
                <Card className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No categories yet</h3>
                  <p className="text-muted-foreground mt-1">
                    {hasError
                      ? "Deploy forum functions to get started."
                      : 'Click "Seed Forum" to populate with sample data.'}
                  </p>
                </Card>
              ) : (
                categories.map((cat: any) => {
                  const IconComponent = iconMap[cat.icon] || MessageSquare;
                  return (
                    <Link key={cat._id} to={`/forum/category/${cat.slug}`}>
                      <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
                        <CardContent className="flex items-center gap-5 p-5">
                          <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `hsl(${cat.color} / 0.12)` }}
                          >
                            <IconComponent
                              className="h-6 w-6"
                              style={{ color: `hsl(${cat.color})` }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                              {cat.name}
                            </h2>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          </div>
                          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{cat.threadCount}</p>
                              <p className="text-xs">Threads</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{cat.postCount}</p>
                              <p className="text-xs">Posts</p>
                            </div>
                            {cat.lastActivityAt && (
                              <div className="text-center">
                                <p className="text-xs">
                                  {formatDistanceToNow(cat.lastActivityAt, { addSuffix: true })}
                                </p>
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* Recent Threads */}
          {activeTab === "recent" && (
            <ThreadList threads={recentThreads} isLoading={threadsLoading} />
          )}

          {/* Trending Threads */}
          {activeTab === "trending" && (
            <ThreadList threads={trendingThreads} isLoading={threadsLoading} />
          )}

          {/* Sidebar-style widgets */}
          {trendingThreads.length > 0 && activeTab === "categories" && (
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Trending Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingThreads.map((thread: any, i: number) => (
                    <Link
                      key={thread._id}
                      to={`/forum/thread/${thread.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <span className="text-lg font-bold text-muted-foreground/50 w-6">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {thread.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {thread.viewCount} views · {thread.replyCount} replies
                        </p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> Be respectful and constructive</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> Search before posting duplicates</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> Mark threads as solved when resolved</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> Use appropriate tags and categories</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> No spam, self-promotion, or affiliate links</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

function ThreadList({ threads, isLoading }: { threads: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No threads yet</h3>
        <p className="text-muted-foreground mt-1">Be the first to start a discussion!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread: any) => (
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
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {thread.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span>{thread.authorName}</span>
                  {thread.category && (
                    <Badge variant="secondary" className="text-xs h-5">{thread.category.name}</Badge>
                  )}
                  {(thread.tags || []).slice(0, 2).map((tag: string) => (
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
  );
}

export default Forum;
