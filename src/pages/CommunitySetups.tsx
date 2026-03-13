import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetupCard } from "@/components/community/SetupCard";
import { SetupSubmissionForm } from "@/components/community/SetupSubmissionForm";
import { useSetups } from "@/hooks/useSetups";
import { SkeletonProductCard } from "@/components/ui/skeleton-loaders";
import { EmptyState } from "@/components/ui/empty-states";
import { Plus } from "lucide-react";

export default function CommunitySetups() {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [hubFilter, setHubFilter] = useState<string>("all");
  const { setups, isLoading, refetch } = useSetups(hubFilter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Community Showcase
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Browse amazing desk setups, smart home configurations, and workflow integrations 
                  from our community. Get inspired and share your own setup!
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => setShowSubmitForm(true)}
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Share Your Setup
              </Button>
            </div>
          </div>
        </section>

        {/* Submission Form Modal */}
        {showSubmitForm && (
          <SetupSubmissionForm 
            onClose={() => setShowSubmitForm(false)}
            onSuccess={() => {
              setShowSubmitForm(false);
              refetch();
            }}
          />
        )}

        {/* Featured Stats */}
        <section className="bg-background border-b py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {setups?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Setups</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">1.2K+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">$100</div>
                <div className="text-sm text-muted-foreground">Monthly Prize</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Products Featured</div>
              </div>
            </div>
          </div>
        </section>

        {/* Setups Grid */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="all" className="w-full" onValueChange={setHubFilter}>
            <TabsList className="mb-8 w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All Setups</TabsTrigger>
              <TabsTrigger value="ai_workflow">AI Workflow</TabsTrigger>
              <TabsTrigger value="intelligent_home">Smart Home</TabsTrigger>
              <TabsTrigger value="hybrid_office">Home Office</TabsTrigger>
            </TabsList>

            <TabsContent value={hubFilter} className="mt-0">
              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonProductCard key={i} />
                  ))}
                </div>
              ) : setups?.length === 0 ? (
                <EmptyState
                  variant="no-data"
                  title="No setups in this category yet"
                  description="Be the first to share your amazing setup with the community!"
                  actionLabel="Share Your Setup"
                  onAction={() => setShowSubmitForm(true)}
                />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {setups?.map((setup) => (
                    <SetupCard key={setup.id} setup={setup} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Share Your Setup?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Win a $100 Amazon gift card and get featured on our homepage! 
              Best setup of the month gets spotlight.
            </p>
            <Button size="lg" onClick={() => setShowSubmitForm(true)}>
              Submit Your Setup
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
