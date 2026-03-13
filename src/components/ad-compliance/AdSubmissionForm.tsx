import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useAdCompliance } from "@/hooks/useAdCompliance";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Link2, 
  FileText,
  Eye
} from "lucide-react";

const categories = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Education",
  "Entertainment",
  "Retail",
  "Travel",
  "Food & Beverage",
  "Real Estate",
  "Automotive",
  "Other",
];

interface ValidationResult {
  status: string;
  compliance_score: number;
  violations: Array<{
    level: number;
    category: string;
    rule: string;
    matched_keywords: string[];
    severity: string;
    description: string;
    ai_confidence: number;
  }>;
  summary: string;
  risk_score: number;
}

interface LandingPageResult {
  url: string;
  is_functional: boolean;
  status_code: number | null;
  has_privacy_policy: boolean;
  has_terms_of_service: boolean;
  has_cookie_notice: boolean;
  has_excessive_popups: boolean;
  load_time_ms: number | null;
  issues: string[];
  score: number;
}

export function AdSubmissionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [category, setCategory] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [landingPageResult, setLandingPageResult] = useState<LandingPageResult | null>(null);

  const { validateAdContent, checkLandingPage, isValidating, isCheckingUrl } = useAdCompliance();

  const handleValidate = async () => {
    const result = await validateAdContent({
      title,
      description,
      content,
      destination_url: destinationUrl,
      category,
    });
    if (result) {
      setValidationResult(result);
    }
  };

  const handleCheckUrl = async () => {
    if (!destinationUrl) return;
    const result = await checkLandingPage(destinationUrl);
    if (result) {
      setLandingPageResult(result);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "destructive";
      case "MEDIUM": return "secondary";
      case "LOW": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected": return <XCircle className="h-5 w-5 text-red-500" />;
      case "requires_review": return <Eye className="h-5 w-5 text-yellow-500" />;
      case "flagged": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved": return "Ad content passes all compliance checks";
      case "rejected": return "Ad content violates critical policies";
      case "requires_review": return "Ad requires manual review before approval";
      case "flagged": return "Ad has potential issues that need attention";
      default: return "Validation pending";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ad Content Submission
          </CardTitle>
          <CardDescription>
            Enter your ad content below for compliance validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Ad Title *</Label>
            <Input
              id="title"
              placeholder="Enter ad headline..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the ad..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">{description.length}/300 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Ad Content *</Label>
            <Textarea
              id="content"
              placeholder="Full ad copy, including any calls to action..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="url">Destination URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/landing"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCheckUrl}
                  disabled={!destinationUrl || isCheckingUrl}
                >
                  {isCheckingUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleValidate}
            disabled={!title || !content || isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Validate Ad Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Landing Page Results */}
      {landingPageResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Landing Page Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Page Score</span>
              <div className="flex items-center gap-2">
                <Progress value={landingPageResult.score} className="w-32" />
                <span className="text-sm font-bold">{landingPageResult.score}/100</span>
              </div>
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Page Functional</span>
                {landingPageResult.is_functional ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Privacy Policy</span>
                {landingPageResult.has_privacy_policy ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Terms of Service</span>
                {landingPageResult.has_terms_of_service ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Cookie Notice</span>
                {landingPageResult.has_cookie_notice ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              {landingPageResult.load_time_ms && (
                <div className="flex items-center justify-between">
                  <span>Load Time</span>
                  <span className={landingPageResult.load_time_ms > 5000 ? "text-red-500" : "text-green-500"}>
                    {(landingPageResult.load_time_ms / 1000).toFixed(2)}s
                  </span>
                </div>
              )}
            </div>

            {landingPageResult.issues.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Issues Found</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc pl-4 text-sm">
                    {landingPageResult.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationResult.status)}
              Compliance Results
            </CardTitle>
            <CardDescription>{getStatusMessage(validationResult.status)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compliance Score</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={validationResult.compliance_score} 
                  className="w-32"
                />
                <span className={`text-sm font-bold ${
                  validationResult.compliance_score >= 80 ? "text-green-500" :
                  validationResult.compliance_score >= 50 ? "text-yellow-500" : "text-red-500"
                }`}>
                  {validationResult.compliance_score}/100
                </span>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Summary</AlertTitle>
              <AlertDescription>{validationResult.summary}</AlertDescription>
            </Alert>

            {validationResult.violations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Violations Found ({validationResult.violations.length})</h4>
                {validationResult.violations.map((violation, index) => (
                  <div key={index} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getSeverityColor(violation.severity) as "destructive" | "secondary" | "outline"}>
                        {violation.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Level {violation.level} • {(violation.ai_confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="font-medium text-sm">{violation.category}</p>
                    <p className="text-sm text-muted-foreground">{violation.description}</p>
                    {violation.matched_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {violation.matched_keywords.map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground italic">{violation.rule}</p>
                  </div>
                ))}
              </div>
            )}

            {validationResult.violations.length === 0 && validationResult.status === "approved" && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700 dark:text-green-300">No Violations</AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Your ad content passes all compliance checks and is ready for submission.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
