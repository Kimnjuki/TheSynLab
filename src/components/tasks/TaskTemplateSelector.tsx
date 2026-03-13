import { TaskTemplate } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Clock, Tag } from "lucide-react";
import { useState } from "react";

interface TaskTemplateSelectorProps {
  templates: TaskTemplate[];
  onSelectTemplate: (template: TaskTemplate) => void;
  onCreateTemplate?: () => void;
}

export const TaskTemplateSelector = ({
  templates,
  onSelectTemplate,
  onCreateTemplate,
}: TaskTemplateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (template: TaskTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-1" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {onCreateTemplate && (
              <Button onClick={onCreateTemplate}>
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No templates found</p>
                {onCreateTemplate && (
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={onCreateTemplate}
                  >
                    Create your first template
                  </Button>
                )}
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleSelect(template)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {template.use_count} uses
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {template.estimated_hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimated_hours}h
                      </div>
                    )}
                    {template.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {template.tags.slice(0, 3).join(", ")}
                      </div>
                    )}
                    {template.checklist.length > 0 && (
                      <span>{template.checklist.length} checklist items</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
