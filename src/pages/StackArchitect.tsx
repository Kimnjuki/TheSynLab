import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { StackArchitectChat } from "@/components/ai/StackArchitectChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layers, Sparkles } from "lucide-react";

export default function StackArchitect() {
  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="AI Stack Architect"
        description="Tell the AI Stack Architect about your role, budget, and goals to get a personalized tool stack recommendation with cost estimates and trust risk ratings."
        canonical="/ai/stack-architect"
      />
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                AI Stack Architect
              </h1>
              <p className="text-muted-foreground max-w-2xl mt-3">
                Describe your role, budget, and goals — the AI Stack Architect will
                recommend a personalized product stack with estimated costs, trust
                risk levels, and integration complexity.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat */}
            <div className="lg:col-span-2">
              <StackArchitectChat />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4" />
                    Explore More
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/stack-builder" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Layers className="h-4 w-4" />
                      Stack Builder
                    </Button>
                  </Link>
                  <Link to="/stack-quiz" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      Stack Quiz
                    </Button>
                  </Link>
                  <Link to="/my-stack" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      My Stack
                    </Button>
                  </Link>
                  <Link to="/workflows" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      Workflow Blueprints
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">How it works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    1. Tell the architect your role, team size, and budget.
                  </p>
                  <p>
                    2. Receive a recommended product stack with cost estimates.
                  </p>
                  <p>
                    3. Build and validate your final stack with the Stack Builder.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}