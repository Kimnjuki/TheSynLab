import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface SubtaskListProps {
  parentTaskId: string;
  subtasks: Task[];
  onCreateSubtask: (title: string, parentId: string) => void;
  onUpdateSubtask: (task: Partial<Task> & { id: string }) => void;
  onDeleteSubtask: (id: string) => void;
}

export const SubtaskList = ({
  parentTaskId,
  subtasks,
  onCreateSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}: SubtaskListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = subtasks.filter((t) => t.status === "done").length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onCreateSubtask(newSubtaskTitle.trim(), parentTaskId);
      setNewSubtaskTitle("");
      setIsAdding(false);
    }
  };

  const toggleSubtaskCompletion = (subtask: Task) => {
    onUpdateSubtask({
      id: subtask.id,
      status: subtask.status === "done" ? "todo" : "done",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm font-medium">
          Subtasks ({completedCount}/{totalCount})
        </span>
        {totalCount > 0 && (
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="pl-6 space-y-1">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 group py-1"
            >
              <Checkbox
                checked={subtask.status === "done"}
                onCheckedChange={() => toggleSubtaskCompletion(subtask)}
              />
              <span
                className={`flex-1 text-sm ${
                  subtask.status === "done"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteSubtask(subtask.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}

          {isAdding ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSubtask();
                  if (e.key === "Escape") setIsAdding(false);
                }}
                className="h-8 text-sm"
                autoFocus
              />
              <Button size="sm" onClick={handleAddSubtask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add subtask
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
