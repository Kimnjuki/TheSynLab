import { useState } from "react";
import { Shield, Clock, ChevronRight, AlertTriangle, CheckCircle, Lock, BookOpen, Search, Filter, Eye, Bookmark, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface SecurityGuide {
  id: number;
  title: string;
  description: string;
  category: 'privacy' | 'network' | 'device' | 'data';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  steps: number;
  urgency: 'low' | 'medium' | 'high';
  updated: string;
  content?: string[];
  views?: number;
  bookmarks?: number;
}

interface SecurityGuidesViewProps {
  guides: SecurityGuide[];
}

const SecurityGuidesView = ({ guides }: SecurityGuidesViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedGuide, setSelectedGuide] = useState<SecurityGuide | null>(null);
  const [completedGuides, setCompletedGuides] = useState<number[]>([]);
  const [bookmarkedGuides, setBookmarkedGuides] = useState<number[]>([]);

  const categories = [
    { id: 'all', label: 'All', icon: BookOpen },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'network', label: 'Network', icon: Lock },
    { id: 'device', label: 'Device', icon: CheckCircle },
    { id: 'data', label: 'Data', icon: AlertTriangle },
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy': return <Shield className="h-5 w-5" />;
      case 'network': return <Lock className="h-5 w-5" />;
      case 'device': return <CheckCircle className="h-5 w-5" />;
      case 'data': return <AlertTriangle className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-accent/10 text-accent border-accent/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-accent text-accent-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleCompleteGuide = (guideId: number) => {
    setCompletedGuides(prev => 
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
    toast.success("Guide marked as complete!");
  };

  const handleBookmarkGuide = (guideId: number) => {
    setBookmarkedGuides(prev => 
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
    toast.success(bookmarkedGuides.includes(guideId) ? "Bookmark removed" : "Guide bookmarked!");
  };

  const progressPercentage = guides.length > 0 
    ? Math.round((completedGuides.length / guides.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Your Security Progress</h3>
              <p className="text-muted-foreground">
                {completedGuides.length} of {guides.length} guides completed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Progress value={progressPercentage} className="h-3" />
              </div>
              <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
            </div>
          </div>
          {progressPercentage === 100 && (
            <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-success font-medium">All security guides completed! Your smart home is well protected.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{guides.filter(g => g.urgency === 'high').length}</p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{completedGuides.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{bookmarkedGuides.length}</p>
            <p className="text-sm text-muted-foreground">Bookmarked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary">
              {guides.reduce((acc, g) => acc + g.readTime, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-1.5">
                <cat.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedDifficulty === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty("all")}
        >
          All Levels
        </Button>
        <Button
          variant={selectedDifficulty === "beginner" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty("beginner")}
          className={selectedDifficulty === "beginner" ? "bg-success hover:bg-success/90" : ""}
        >
          Beginner
        </Button>
        <Button
          variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty("intermediate")}
          className={selectedDifficulty === "intermediate" ? "bg-accent hover:bg-accent/90" : ""}
        >
          Intermediate
        </Button>
        <Button
          variant={selectedDifficulty === "advanced" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty("advanced")}
          className={selectedDifficulty === "advanced" ? "bg-destructive hover:bg-destructive/90" : ""}
        >
          Advanced
        </Button>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No guides found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card 
              key={guide.id} 
              className={`group hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer relative ${
                completedGuides.includes(guide.id) ? 'border-success/50 bg-success/5' : ''
              }`}
              onClick={() => setSelectedGuide(guide)}
            >
              {completedGuides.includes(guide.id) && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-success text-success-foreground gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Completed
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getUrgencyColor(guide.urgency)}`}>
                    {getCategoryIcon(guide.category)}
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkGuide(guide.id);
                      }}
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarkedGuides.includes(guide.id) ? 'fill-accent text-accent' : ''}`} />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {guide.readTime} min
                    </span>
                    <span>{guide.steps} steps</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                    Read <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Guide Detail Dialog */}
      <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedGuide && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getUrgencyColor(selectedGuide.urgency)}`}>
                      {getCategoryIcon(selectedGuide.category)}
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{selectedGuide.title}</DialogTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                          {selectedGuide.difficulty}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedGuide.readTime} min
                        </Badge>
                        <Badge variant="outline">{selectedGuide.steps} steps</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogDescription className="text-base mt-4">
                  {selectedGuide.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Steps to Complete</h4>
                  <ol className="space-y-3">
                    {(selectedGuide.content || [
                      "Review your current security settings",
                      "Update all device firmware to latest versions",
                      "Enable two-factor authentication where available",
                      "Configure privacy settings for each device",
                      "Test your setup to ensure everything works correctly"
                    ]).map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0 font-medium">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-2"
                    variant={completedGuides.includes(selectedGuide.id) ? "outline" : "default"}
                    onClick={() => handleCompleteGuide(selectedGuide.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {completedGuides.includes(selectedGuide.id) ? "Mark Incomplete" : "Mark as Complete"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityGuidesView;
