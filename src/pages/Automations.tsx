import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Zap, 
  LayoutGrid,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { 
  useAutomations, 
  useAutomationTemplates, 
  useCreateAutomation, 
  useUpdateAutomation, 
  useDeleteAutomation, 
  useToggleAutomation, 
  useCreateFromTemplate 
} from "@/hooks/convex/useAutomations";
import { useAuth } from "@/contexts/AuthContext";
import { AutomationCard } from "@/components/automations/AutomationCard";
import { TemplateCard } from "@/components/automations/TemplateCard";
import { AutomationBuilder } from "@/components/automations/AutomationBuilder";
import { Automation, AutomationTemplate } from "@/types/automation";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Automations() {
  const { user } = useAuth();
  const { automations, isLoading } = useAutomations();
  const { templates, isLoading: templatesLoading } = useAutomationTemplates();
  const { createAutomation } = useCreateAutomation();
  const { updateAutomation } = useUpdateAutomation();
  const { deleteAutomation } = useDeleteAutomation();
  const { toggleActive } = useToggleAutomation();
  const { createFromTemplate } = useCreateFromTemplate();

  const [search, setSearch] = useState("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredAutomations = automations.filter(
    (a: any) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTemplates = templates.filter(
    (t: any) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveAutomation = async (automation: Partial<Automation>) => {
    setIsSaving(true);
    try {
      if (automation.id) {
        await updateAutomation(automation as any);
        toast.success("Automation updated");
      } else {
        await createAutomation(automation as any);
        toast.success("Automation created");
      }
      setBuilderOpen(false);
      setEditingAutomation(null);
    } catch (error) {
      toast.error("Failed to save automation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation);
    setBuilderOpen(true);
  };

  const handleUseTemplate = async (template: AutomationTemplate) => {
    try {
      await createFromTemplate(template.id);
      toast.success("Automation created from template");
    } catch (error) {
      toast.error("Failed to create automation");
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleActive(id);
      toast.success(isActive ? "Automation activated" : "Automation deactivated");
    } catch (error) {
      toast.error("Failed to toggle automation");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAutomation(id);
      toast.success("Automation deleted");
    } catch (error) {
      toast.error("Failed to delete automation");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Automations</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Automate repetitive tasks and workflows. Set up triggers and actions to save time and ensure consistency.
          </p>
        </div>

        {/* Auth Check */}
        {!user ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to create automations</h2>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to create and manage your automations.
            </p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search automations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setBuilderOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Automation
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="my-automations" className="space-y-6">
              <TabsList>
                <TabsTrigger value="my-automations" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  My Automations
                  {automations.length > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                      {automations.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="templates" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-automations">
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : filteredAutomations.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-12 text-center">
                    <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                      {search ? "No automations found" : "No automations yet"}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {search
                        ? "Try a different search term"
                        : "Create your first automation or start from a template"}
                    </p>
                    {!search && (
                      <Button onClick={() => setBuilderOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Automation
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAutomations.map((automation: any) => (
                      <AutomationCard
                        key={automation._id || automation.id}
                        automation={{ ...automation, id: automation._id || automation.id }}
                        onToggle={(id, isActive) => handleToggle(id, isActive)}
                        onEdit={handleEditAutomation}
                        onDelete={(id) => handleDelete(id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates">
                {templatesLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-12 text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No templates found</h2>
                    <p className="text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((template: any) => (
                      <TemplateCard
                        key={template._id || template.id}
                        template={{ ...template, id: template._id || template.id }}
                        onUse={handleUseTemplate}
                        isLoading={isSaving}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <Footer />

      {/* Automation Builder Modal */}
      <AutomationBuilder
        open={builderOpen}
        onOpenChange={(open) => {
          setBuilderOpen(open);
          if (!open) setEditingAutomation(null);
        }}
        onSave={handleSaveAutomation}
        initialData={editingAutomation}
        isLoading={isSaving}
      />
    </div>
  );
}
