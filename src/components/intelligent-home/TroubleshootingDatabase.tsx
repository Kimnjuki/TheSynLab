import { useState } from "react";
import { Search, MessageCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronRight, Tag, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface TroubleshootingIssue {
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

interface TroubleshootingDatabaseProps {
  issues: TroubleshootingIssue[];
}

const TroubleshootingDatabase = ({ issues }: TroubleshootingDatabaseProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [votedIssues, setVotedIssues] = useState<Record<number, 'up' | 'down'>>({});

  const categories = [...new Set(issues.map(i => i.category))];

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || issue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVote = (issueId: number, vote: 'up' | 'down') => {
    setVotedIssues(prev => ({ ...prev, [issueId]: vote }));
    toast.success(vote === 'up' ? 'Thanks for the feedback!' : 'We\'ll improve this solution');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues, devices, or symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No issues found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
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
                        <span className="text-sm text-success flex items-center gap-1">
                          ✓ {issue.resolved}% resolved
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {issue.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {issue.votes}
                      </span>
                      <span>{issue.views} views</span>
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
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm">✓</span>
                        Solution Steps
                      </h5>
                      <ol className="space-y-2">
                        {issue.solution.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {issue.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Was this helpful?
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant={votedIssues[issue.id] === 'up' ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(issue.id, 'up')}
                          disabled={!!votedIssues[issue.id]}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Yes
                        </Button>
                        <Button
                          variant={votedIssues[issue.id] === 'down' ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleVote(issue.id, 'down')}
                          disabled={!!votedIssues[issue.id]}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
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

export default TroubleshootingDatabase;
export type { TroubleshootingIssue };
