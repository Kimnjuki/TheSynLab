import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const setupSchema = z.object({
  setup_name: z.string().min(5, "Setup name must be at least 5 characters").max(100),
  user_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  user_email: z.string().email("Invalid email address"),
  hub: z.enum(["ai_workflow", "intelligent_home", "hybrid_office"]),
  setup_description: z.string().min(200, "Description must be at least 200 characters").max(2000),
  equipment_list: z.string().min(10, "Please list your equipment"),
  total_cost: z.string().optional(),
  favorite_integration: z.string().optional(),
});

type SetupFormData = z.infer<typeof setupSchema>;

interface SetupSubmissionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SetupSubmissionForm({ onClose, onSuccess }: SetupSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const createPost = useMutation(api.posts.create);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      setup_name: "",
      user_name: user?.name || "",
      user_email: user?.email || "",
      setup_description: "",
      equipment_list: "",
      total_cost: "",
      favorite_integration: "",
    },
  });

  const onSubmit = async (data: SetupFormData) => {
    setIsSubmitting(true);
    
    try {
      await createPost({
        postTitle: data.setup_name,
        postSlug: data.setup_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        postContent: data.setup_description,
        postExcerpt: data.setup_description.substring(0, 200),
        postType: "blueprint",
        hub: data.hub,
        userId: user?.id || "anonymous",
      });

      toast({
        title: "Setup Submitted!",
        description: "Your setup has been submitted for review. We'll notify you within 48 hours.",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Setup</DialogTitle>
          <DialogDescription>
            Submit your desk setup, smart home configuration, or workflow integration. 
            The best setup each month wins a $100 Amazon gift card!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="setup_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setup Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="My Ultimate Home Office Setup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hub"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ai_workflow">AI Workflow Hub</SelectItem>
                      <SelectItem value="intelligent_home">Intelligent Home Hub</SelectItem>
                      <SelectItem value="hybrid_office">Hybrid Office Hub</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="setup_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setup Description * (min 200 characters)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your setup, why you chose these products, and how they work together..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value.length}/200 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipment_list"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment List *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List all your equipment (one per line)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Total Cost (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="$2,500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favorite_integration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Integration (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Notion + Zapier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Setup
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
