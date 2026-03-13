import { useState } from "react";
import { Task, STATUS_CONFIG, PRIORITY_CONFIG, TaskStatus, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, ArrowUpDown, Calendar, Clock, ChevronRight, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Partial<Task> & { id: string }) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  selectedTasks?: Task[];
  onSelectTask?: (task: Task, isSelected: boolean) => void;
  getSubtasks?: (parentId: string) => Task[];
}

type SortField = "title" | "status" | "priority" | "due_date" | "created_at";
type SortDirection = "asc" | "desc";

export const ListView = ({
  tasks,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
  selectedTasks = [],
  onSelectTask,
  getSubtasks,
}: ListViewProps) => {
  const [localSelectedTasks, setLocalSelectedTasks] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Use external or local selection
  const selectedSet = onSelectTask
    ? new Set(selectedTasks.map((t) => t.id))
    : localSelectedTasks;

  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "priority":
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "due_date":
        comparison = (a.due_date ?? "").localeCompare(b.due_date ?? "");
        break;
      case "created_at":
        comparison = a.created_at.localeCompare(b.created_at);
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleToggleTaskSelection = (task: Task) => {
    const isCurrentlySelected = selectedSet.has(task.id);
    if (onSelectTask) {
      onSelectTask(task, !isCurrentlySelected);
    } else {
      const newSelected = new Set(localSelectedTasks);
      if (newSelected.has(task.id)) {
        newSelected.delete(task.id);
      } else {
        newSelected.add(task.id);
      }
      setLocalSelectedTasks(newSelected);
    }
  };

  const toggleAllTasks = () => {
    if (onSelectTask) {
      if (selectedSet.size === tasks.length) {
        tasks.forEach((t) => onSelectTask(t, false));
      } else {
        tasks.forEach((t) => onSelectTask(t, true));
      }
    } else {
      if (localSelectedTasks.size === tasks.length) {
        setLocalSelectedTasks(new Set());
      } else {
        setLocalSelectedTasks(new Set(tasks.map((t) => t.id)));
      }
    }
  };

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 -ml-3 hover:bg-transparent"
      onClick={() => toggleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const renderTaskRow = (task: Task, depth: number = 0) => {
    const subtasks = getSubtasks ? getSubtasks(task.id) : [];
    const hasSubtasks = subtasks.length > 0;
    const isExpanded = expandedTasks.has(task.id);

    return (
      <>
        <TableRow key={task.id} className="group">
          <TableCell>
            <div className="flex items-center gap-1" style={{ paddingLeft: `${depth * 20}px` }}>
              {hasSubtasks && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleExpanded(task.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasSubtasks && depth > 0 && <div className="w-6" />}
              <Checkbox
                checked={selectedSet.has(task.id)}
                onCheckedChange={() => handleToggleTaskSelection(task)}
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <span className="font-medium">{task.title}</span>
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {task.description}
                </p>
              )}
              {hasSubtasks && (
                <span className="text-xs text-muted-foreground">
                  {subtasks.filter((s) => s.status === "done").length}/{subtasks.length} subtasks
                </span>
              )}
            </div>
          </TableCell>
          <TableCell>
            <Select
              value={task.status}
              onValueChange={(value: TaskStatus) =>
                onUpdateTask({ id: task.id, status: value })
              }
            >
              <SelectTrigger className="h-8 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select
              value={task.priority}
              onValueChange={(value: TaskPriority) =>
                onUpdateTask({ id: task.id, priority: value })
              }
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_CONFIG).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            {task.due_date && (
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "MMM d")}
              </div>
            )}
          </TableCell>
          <TableCell>
            {task.estimated_hours && (
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3" />
                {task.estimated_hours}h
              </div>
            )}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEditTask(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded && subtasks.map((subtask) => renderTaskRow(subtask, depth + 1))}
      </>
    );
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">
              <div className="flex items-center gap-1 pl-7">
                <Checkbox
                  checked={selectedSet.size === tasks.length && tasks.length > 0}
                  onCheckedChange={toggleAllTasks}
                />
              </div>
            </TableHead>
            <TableHead>
              <SortButton field="title">Title</SortButton>
            </TableHead>
            <TableHead className="w-32">
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="w-28">
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead className="w-32">
              <SortButton field="due_date">Due Date</SortButton>
            </TableHead>
            <TableHead className="w-24">Est. Hours</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => renderTaskRow(task))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No tasks found. Create your first task!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
