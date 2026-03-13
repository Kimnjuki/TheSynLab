import { useState } from "react";
import { Task, TaskStatus, COLUMNS, STATUS_CONFIG } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanViewProps {
  tasks: Task[];
  onUpdateTask: (task: Partial<Task> & { id: string }) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: (status: TaskStatus) => void;
}

export const KanbanView = ({
  tasks,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
  onCreateTask,
}: KanbanViewProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask({ id: draggedTask.id, status });
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const columnTasks = getTasksByStatus(status);
        const config = STATUS_CONFIG[status];
        const isOver = dragOverColumn === status;

        return (
          <div
            key={status}
            className={`flex-shrink-0 w-72 rounded-lg transition-colors ${
              isOver ? "bg-primary/10" : "bg-muted/50"
            }`}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {columnTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onCreateTask(status)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-2 space-y-2 min-h-[200px]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <TaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    isDragging={draggedTask?.id === task.id}
                  />
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
