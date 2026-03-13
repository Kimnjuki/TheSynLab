import { Task, TaskStatus, TaskPriority, STATUS_CONFIG, PRIORITY_CONFIG } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Trash2, Tag, CheckSquare } from "lucide-react";

interface BulkActionToolbarProps {
  selectedTasks: Task[];
  onClearSelection: () => void;
  onBulkStatusChange: (status: TaskStatus) => void;
  onBulkPriorityChange: (priority: TaskPriority) => void;
  onBulkDelete: () => void;
}

export const BulkActionToolbar = ({
  selectedTasks,
  onClearSelection,
  onBulkStatusChange,
  onBulkPriorityChange,
  onBulkDelete,
}: BulkActionToolbarProps) => {
  if (selectedTasks.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-3 flex items-center gap-3 z-50">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span className="font-medium">{selectedTasks.length} selected</span>
      </div>

      <div className="h-6 w-px bg-border" />

      <Select onValueChange={(v) => onBulkStatusChange(v as TaskStatus)}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <SelectItem key={status} value={status}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => onBulkPriorityChange(v as TaskPriority)}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Change priority" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
            <SelectItem key={priority} value={priority}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        className="h-8"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClearSelection}
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
