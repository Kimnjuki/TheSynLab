import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForumCategories, useForumActions } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

const ForumNewThread = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories } = useForumCategories();
  const { createThread } = useForumActions();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const preselectedSlug = searchParams.get("category");
  const preselectedCat = categories.find((c: any) => c.slug === preselectedSlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in"); return; }
    if (!title.trim() || !content.trim() || (!categoryId && !preselectedCat)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const selectedCatId = categoryId || preselectedCat?._id;
      await createThread({
        categoryId: selectedCatId,
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      });
      toast.success("Thread created!");
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      navigate(`/forum/thread/${slug}`);
    } catch {
      toast.error("Failed to create thread");
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in Required</h1>
          <p className="text-muted-foreground mt-2">You need to sign in to create a thread.</p>
          <Link to="/auth"><Button className="mt-4">Sign In</Button></Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>New Thread – Forum | TheSynLab</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/forum">Forum</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>New Thread</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create New Thread</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  {preselectedCat ? (
                    <Input value={preselectedCat.name} disabled />
                  ) : (
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: any) => (
                          <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's your question or topic?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">{title.length}/200</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Provide details, context, and what you've already tried..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. smart-home, matter, automation"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link to="/forum">
                    <Button type="button" variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={submitting}>
                    <Send className="h-4 w-4 mr-1" />
                    {submitting ? "Creating..." : "Create Thread"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ForumNewThread;
