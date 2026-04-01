import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForumThread, useForumActions } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MessageSquare, Eye, Heart, CheckCircle2, Clock, ArrowLeft,
  ThumbsUp, Award, Send, Flag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { AdSlot } from "@/components/ads/AdSlot";

const ForumThread = () => {
  const { slug } = useParams<{ slug: string }>();
  const { thread, isLoading, error } = useForumThread(slug || "");
  const { user } = useAuth();
  const { createReply, toggleLike, markSolution, likeReply, incrementView, reportThread, reportReply } = useForumActions();
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (thread && !hasViewed) {
      try { incrementView(thread._id); } catch {}
      setHasViewed(true);
    }
  }, [thread?._id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container py-16"><div className="h-8 w-64 bg-muted animate-pulse rounded" /></div>
        <Footer />
      </>
    );
  }

  if (!thread) {
    return (
      <>
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error ? "Forum not yet deployed" : "Thread not found"}
          </h1>
          <Link to="/forum" className="text-primary hover:underline mt-2 inline-block">← Back to Forum</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    if (!user) { toast.error("Please sign in to reply"); return; }
    setSubmitting(true);
    try {
      await createReply(thread._id, replyContent);
      setReplyContent("");
      toast.success("Reply posted!");
    } catch { toast.error("Failed to post reply"); }
    setSubmitting(false);
  };

  const handleLike = () => {
    if (!user) { toast.error("Please sign in to like"); return; }
    toggleLike(thread._id);
  };

  const handleReportThread = async () => {
    if (!user) { toast.error("Please sign in to report content"); return; }
    try {
      await reportThread(thread._id, "Reported by community member");
      toast.success("Thread reported for moderation review.");
    } catch {
      toast.error("Failed to submit report");
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": thread.title,
    "text": thread.content,
    "author": { "@type": "Person", "name": thread.authorName },
    "datePublished": new Date(thread._creationTime).toISOString(),
    "interactionStatistic": [
      { "@type": "InteractionCounter", "interactionType": "https://schema.org/CommentAction", "userInteractionCount": thread.replyCount },
      { "@type": "InteractionCounter", "interactionType": "https://schema.org/ViewAction", "userInteractionCount": thread.viewCount },
    ],
    ...(thread.replies?.filter((r: any) => r.isSolution).length > 0 && {
      "acceptedAnswer": {
        "@type": "Answer",
        "text": thread.replies.find((r: any) => r.isSolution)?.content,
        "author": { "@type": "Person", "name": thread.replies.find((r: any) => r.isSolution)?.authorName },
      },
    }),
  };

  return (
    <>
      <Helmet>
        <title>{`${thread.title} – Forum | TheSynLab`}</title>
        <meta name="description" content={thread.content.slice(0, 155)} />
        <link rel="canonical" href={`https://www.thesynlab.com/forum/thread/${slug}`} />
        <meta property="og:title" content={thread.title} />
        <meta property="og:description" content={thread.content.slice(0, 155)} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container max-w-4xl py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/forum">Forum</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              {thread.category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/forum/category/${thread.category.slug}`}>{thread.category.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem><BreadcrumbPage className="max-w-[200px] truncate">{thread.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <article>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {thread.authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {thread.isSolved && (
                        <Badge className="bg-success/10 text-success border-success/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Solved
                        </Badge>
                      )}
                      <h1 className="text-xl font-bold text-foreground">{thread.title}</h1>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="font-medium text-foreground">{thread.authorName}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(thread._creationTime, { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {thread.viewCount} views</span>
                    </div>

                    <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                      {thread.content}
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                      {(thread.tags || []).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      <div className="flex-1" />
                      <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleLike}>
                        <Heart className="h-4 w-4" /> {thread.likeCount}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <MessageSquare className="h-4 w-4" /> {thread.replyCount}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleReportThread}>
                        <Flag className="h-4 w-4" /> Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section aria-label="Replies">
              <h2 className="text-base font-semibold text-foreground mb-4">
                {thread.replies?.length || 0} {thread.replies?.length === 1 ? "Reply" : "Replies"}
              </h2>
              {(thread.replies?.length || 0) > 5 && (
                <AdSlot
                  slotName="forum_in_article_1"
                  pageTemplate="forum_thread"
                  iabFormat="in_article"
                  position="in_article_1"
                />
              )}

              <div className="space-y-3">
                {(thread.replies || []).map((reply: any) => (
                  <Card key={reply._id} className={reply.isSolution ? "border-success/40 bg-success/5" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                            {reply.authorName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-medium text-foreground">{reply.authorName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(reply._creationTime, { addSuffix: true })}
                            </span>
                            {reply.isSolution && (
                              <Badge className="bg-success text-success-foreground text-xs h-5">
                                <Award className="h-3 w-3 mr-1" /> Solution
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-foreground whitespace-pre-wrap">
                            {reply.content}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => {
                                if (!user) { toast.error("Please sign in"); return; }
                                likeReply(reply._id);
                              }}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" /> {reply.likeCount}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={async () => {
                                if (!user) { toast.error("Please sign in"); return; }
                                try {
                                  await reportReply(reply._id, "Reported by community member");
                                  toast.success("Reply reported for moderation review.");
                                } catch {
                                  toast.error("Failed to submit report");
                                }
                              }}
                            >
                              <Flag className="h-3.5 w-3.5" /> Report
                            </Button>
                            {user && thread.authorId === user.id && !thread.isSolved && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1 text-success hover:text-success"
                                onClick={() => markSolution(reply._id, thread._id)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Solution
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mt-6" aria-label="Write a reply">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Write a Reply</h3>
                  {user ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your thoughts, tips, or solutions..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSubmitReply} disabled={submitting || !replyContent.trim()} size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          {submitting ? "Posting..." : "Post Reply"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">Sign in to join the discussion</p>
                      <Link to="/auth">
                        <Button size="sm">Sign In</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ForumThread;
