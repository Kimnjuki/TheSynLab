import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScoringMethodologyDocs from "@/components/scoring/ScoringMethodologyDocs";
import EcosystemFitIndex from "@/components/scoring/EcosystemFitIndex";
import DecisionRecipes from "@/components/scoring/DecisionRecipes";
import IntegrationGraph from "@/components/scoring/IntegrationGraph";
import StackTemplates from "@/components/scoring/StackTemplates";
import TransparencyCenter from "@/components/scoring/TransparencyCenter";
import ScoreHistoryChart from "@/components/scoring/ScoreHistoryChart";
import { ScoreProposalVote } from "@/components/community/ScoreProposalVote";
import { Award, Layers, ChefHat, Network, FileStack, Eye, History, Vote } from "lucide-react";

export default function ScoringHub() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Scoring & Decision Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transparent methodology, ecosystem fit analysis, curated stacks, and personalized recommendations powered by our Trust & Integration Scores.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="methodology" className="space-y-8">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent">
              <TabsTrigger value="methodology" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Award className="h-4 w-4" /> Methodology
              </TabsTrigger>
              <TabsTrigger value="ecosystem" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Layers className="h-4 w-4" /> Ecosystem Fit
              </TabsTrigger>
              <TabsTrigger value="recipes" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ChefHat className="h-4 w-4" /> Decision Recipes
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Network className="h-4 w-4" /> Integration Graph
              </TabsTrigger>
              <TabsTrigger value="stacks" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileStack className="h-4 w-4" /> Stack Templates
              </TabsTrigger>
              <TabsTrigger value="transparency" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Eye className="h-4 w-4" /> Transparency
              </TabsTrigger>
              <TabsTrigger value="proposals" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Vote className="h-4 w-4" /> Proposals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="methodology"><ScoringMethodologyDocs /></TabsContent>
            <TabsContent value="ecosystem"><EcosystemFitIndex /></TabsContent>
            <TabsContent value="recipes"><DecisionRecipes /></TabsContent>
            <TabsContent value="graph"><IntegrationGraph /></TabsContent>
            <TabsContent value="stacks"><StackTemplates /></TabsContent>
            <TabsContent value="transparency"><TransparencyCenter /></TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}
