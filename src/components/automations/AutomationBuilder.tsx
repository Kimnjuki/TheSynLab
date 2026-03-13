import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  Zap,
  ChevronDown,
  GripVertical
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TRIGGER_OPTIONS, ACTION_OPTIONS, TriggerType, ActionType, ActionConfig, Automation } from "@/types/automation";

interface AutomationBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (automation: Partial<Automation>) => void;
  initialData?: Automation | null;
  isLoading?: boolean;
}

export function AutomationBuilder({ 
  open, 
  onOpenChange, 
  onSave, 
  initialData,
  isLoading 
}: AutomationBuilderProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [triggerType, setTriggerType] = useState<TriggerType>(
    (initialData?.trigger_type as TriggerType) || "task_created"
  );
  const [triggerConfig, setTriggerConfig] = useState(initialData?.trigger_config || {});
  const [actions, setActions] = useState<ActionConfig[]>(
    initialData?.actions || []
  );
  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  const handleAddAction = () => {
    setActions([...actions, { type: "send_notification", config: { message: "" } }]);
    setExpandedAction(actions.length);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleActionTypeChange = (index: number, type: ActionType) => {
    const newActions = [...actions];
    newActions[index] = { type, config: getDefaultConfig(type) };
    setActions(newActions);
  };

  const handleActionConfigChange = (index: number, key: string, value: any) => {
    const newActions = [...actions];
    newActions[index].config[key] = value;
    setActions(newActions);
  };

  const getDefaultConfig = (type: ActionType): Record<string, any> => {
    switch (type) {
      case "send_notification":
        return { message: "", title: "" };
      case "send_email":
        return { to: "", subject: "", body: "" };
      case "assign_task":
        return { method: "round_robin", user_id: "" };
      case "update_status":
        return { status: "" };
      case "update_priority":
        return { priority: "high" };
      case "add_tag":
        return { tag: "" };
      case "create_task":
        return { title: "", description: "" };
      case "webhook":
        return { url: "", method: "POST", headers: {} };
      default:
        return {};
    }
  };

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      name,
      description,
      trigger_type: triggerType,
      trigger_config: triggerConfig,
      actions,
    });
  };

  const selectedTrigger = TRIGGER_OPTIONS.find(t => t.value === triggerType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {initialData ? "Edit Automation" : "Create Automation"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Automation Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Notify team on high priority"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this automation do?"
                  rows={2}
                />
              </div>
            </div>

            {/* Trigger Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">When this happens...</Label>
              <Card className="p-4 border-primary/30 bg-primary/5">
                <div className="space-y-3">
                  <Select value={triggerType} onValueChange={(v) => setTriggerType(v as TriggerType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_OPTIONS.map((trigger) => (
                        <SelectItem key={trigger.value} value={trigger.value}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{trigger.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTrigger && (
                    <p className="text-sm text-muted-foreground">{selectedTrigger.description}</p>
                  )}
                  
                  {/* Trigger-specific config */}
                  {triggerType === "schedule" && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Frequency</Label>
                        <Select 
                          value={triggerConfig.frequency || "daily"}
                          onValueChange={(v) => setTriggerConfig({...triggerConfig, frequency: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Time</Label>
                        <Input 
                          type="time" 
                          value={triggerConfig.time || "09:00"}
                          onChange={(e) => setTriggerConfig({...triggerConfig, time: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Actions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Then do this...</Label>
                <Button variant="outline" size="sm" onClick={handleAddAction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Action
                </Button>
              </div>

              {actions.length === 0 ? (
                <Card className="p-8 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No actions yet</p>
                    <p className="text-xs mt-1">Add an action to define what happens when the trigger fires</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-2">
                  {actions.map((action, index) => (
                    <Collapsible 
                      key={index} 
                      open={expandedAction === index}
                      onOpenChange={(open) => setExpandedAction(open ? index : null)}
                    >
                      <Card className="overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="secondary" className="font-normal">
                              {index + 1}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 text-sm font-medium">
                              {ACTION_OPTIONS.find(a => a.value === action.type)?.label || action.type}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveAction(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <ChevronDown className={`h-4 w-4 transition-transform ${expandedAction === index ? 'rotate-180' : ''}`} />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-0 space-y-3 border-t">
                            <div className="space-y-2">
                              <Label className="text-xs">Action Type</Label>
                              <Select 
                                value={action.type} 
                                onValueChange={(v) => handleActionTypeChange(index, v as ActionType)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ACTION_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Action-specific config */}
                            {action.type === "send_notification" && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-xs">Title</Label>
                                  <Input
                                    value={action.config.title || ""}
                                    onChange={(e) => handleActionConfigChange(index, "title", e.target.value)}
                                    placeholder="Notification title"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Message</Label>
                                  <Textarea
                                    value={action.config.message || ""}
                                    onChange={(e) => handleActionConfigChange(index, "message", e.target.value)}
                                    placeholder="Use {{task.name}}, {{user.name}} for dynamic values"
                                    rows={2}
                                  />
                                </div>
                              </>
                            )}

                            {action.type === "send_email" && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-xs">To</Label>
                                  <Input
                                    value={action.config.to || ""}
                                    onChange={(e) => handleActionConfigChange(index, "to", e.target.value)}
                                    placeholder="email@example.com or {{user.email}}"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Subject</Label>
                                  <Input
                                    value={action.config.subject || ""}
                                    onChange={(e) => handleActionConfigChange(index, "subject", e.target.value)}
                                    placeholder="Email subject"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Body</Label>
                                  <Textarea
                                    value={action.config.body || ""}
                                    onChange={(e) => handleActionConfigChange(index, "body", e.target.value)}
                                    placeholder="Email content"
                                    rows={3}
                                  />
                                </div>
                              </>
                            )}

                            {action.type === "update_priority" && (
                              <div className="space-y-2">
                                <Label className="text-xs">New Priority</Label>
                                <Select
                                  value={action.config.priority || "high"}
                                  onValueChange={(v) => handleActionConfigChange(index, "priority", v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {action.type === "webhook" && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-xs">URL</Label>
                                  <Input
                                    value={action.config.url || ""}
                                    onChange={(e) => handleActionConfigChange(index, "url", e.target.value)}
                                    placeholder="https://..."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Method</Label>
                                  <Select
                                    value={action.config.method || "POST"}
                                    onValueChange={(v) => handleActionConfigChange(index, "method", v)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="GET">GET</SelectItem>
                                      <SelectItem value="POST">POST</SelectItem>
                                      <SelectItem value="PUT">PUT</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}

                            {action.type === "add_tag" && (
                              <div className="space-y-2">
                                <Label className="text-xs">Tag</Label>
                                <Input
                                  value={action.config.tag || ""}
                                  onChange={(e) => handleActionConfigChange(index, "tag", e.target.value)}
                                  placeholder="Tag name"
                                />
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name || actions.length === 0 || isLoading}
          >
            {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Automation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
