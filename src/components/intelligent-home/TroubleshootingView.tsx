import { useState } from "react";
import { Search, MessageCircle, ThumbsUp, ThumbsDown, Tag, Clock, CheckCircle, AlertTriangle, HelpCircle, Send, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface TroubleshootingIssue {
  id: number;
  title: string;
  description: string;
  category: string;
  device?: string;
  ecosystem?: string;
  solution: string[];
  tags: string[];
  votes: number;
  views: number;
  resolved: number;
  createdAt: string;
}

interface TroubleshootingViewProps {
  issues: TroubleshootingIssue[];
}

const TroubleshootingView = ({ issues }: TroubleshootingViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [votedIssues, setVotedIssues] = useState<Record<number, 'up' | 'down'>>({});
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: "", description: "", device: "", category: "" });

  const categories = [...new Set(issues.map(i => i.category))];
  const devices = [...new Set(issues.map(i => i.device).filter(Boolean))];
  const popularTags = [...new Set(issues.flatMap(i => i.tags))].slice(0, 10);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || issue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.votes - a.votes);

  const handleVote = (issueId: number, vote: 'up' | 'down') => {
    setVotedIssues(prev => ({ ...prev, [issueId]: vote }));
    toast.success(vote === 'up' ? 'Thanks for the feedback!' : 'We\'ll improve this solution');
  };

  const handleSubmitIssue = () => {
    if (!newIssue.title || !newIssue.description) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Issue submitted for review!");
    setShowSubmitForm(false);
    setNewIssue({ title: "", description: "", device: "", category: "" });
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  // Stats
  const totalIssues = issues.length;
  const avgResolutionRate = Math.round(issues.reduce((acc, i) => acc + i.resolved, 0) / totalIssues);
  const totalVotes = issues.reduce((acc, i) => acc + i.votes, 0);
  const totalViews = issues.reduce((acc, i) => acc + i.views, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{totalIssues}</p>
            <p className="text-sm text-muted-foreground">Known Issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{avgResolutionRate}%</p>
            <p className="text-sm text-muted-foreground">Avg Resolution</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{totalVotes.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Helpful Votes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary">{(totalViews / 1000).toFixed(1)}K</p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Describe your issue... (e.g., 'lights not responding', 'Matter pairing failed')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Submit Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit a New Issue</DialogTitle>
                  <DialogDescription>
                    Can't find a solution? Submit your issue and the community will help.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Issue Title *</label>
                    <Input
                      placeholder="Brief description of the problem"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description *</label>
                    <Textarea
                      placeholder="Provide details about what's happening, when it started, and what you've tried..."
                      value={newIssue.description}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Device</label>
                      <Input
                        placeholder="e.g., Philips Hue"
                        value={newIssue.device}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, device: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Input
                        placeholder="e.g., Connectivity"
                        value={newIssue.category}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, category: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSubmitIssue} className="w-full">Submit Issue</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Popular Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Popular:
            </span>
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {filteredIssues.length} issues
        </p>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        )}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No issues found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or submit a new issue</p>
              <Button onClick={() => setShowSubmitForm(true)}>Submit New Issue</Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredIssues.map((issue) => (
              <AccordionItem
                key={issue.id}
                value={issue.id.toString()}
                className="border rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex-1 text-left space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-medium text-base">{issue.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline">{issue.category}</Badge>
                        <div className="flex items-center gap-1">
                          <div className="w-16">
                            <Progress value={issue.resolved} className="h-2" />
                          </div>
                          <span className="text-sm text-success">{issue.resolved}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {issue.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {issue.votes} helpful
                      </span>
                      <span>{issue.views.toLocaleString()} views</span>
                      {issue.device && (
                        <Badge variant="secondary" className="text-xs">
                          {issue.device}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pt-2">
                    {/* Solution Steps */}
                    <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                      <h5 className="font-medium mb-3 flex items-center gap-2 text-success">
                        <CheckCircle className="h-5 w-5" />
                        Solution Steps
                      </h5>
                      <ol className="space-y-3">
                        {issue.solution.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="h-6 w-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm shrink-0 font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Warning if low resolution rate */}
                    {issue.resolved < 70 && (
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <strong>Note:</strong> This solution has a lower resolution rate. If it doesn't work, consider submitting additional details about your setup.
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {issue.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs gap-1 cursor-pointer hover:bg-primary/10"
                          onClick={() => handleTagClick(tag)}
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Feedback */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Was this solution helpful?
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant={votedIssues[issue.id] === 'up' ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(issue.id, 'up')}
                          disabled={!!votedIssues[issue.id]}
                          className="gap-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Yes ({issue.votes + (votedIssues[issue.id] === 'up' ? 1 : 0)})
                        </Button>
                        <Button
                          variant={votedIssues[issue.id] === 'down' ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleVote(issue.id, 'down')}
                          disabled={!!votedIssues[issue.id]}
                          className="gap-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default TroubleshootingView;
