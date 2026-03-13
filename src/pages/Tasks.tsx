import { useState, useCallback } from "react";
import { Task, TaskStatus, TaskTemplate } from "@/types/task";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useBulkUpdateTaskStatus } from "@/hooks/convex/useTasks";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TaskForm } from "@/components/tasks/TaskForm";
import { KanbanView } from "@/components/tasks/KanbanView";
import { ListView } from "@/components/tasks/ListView";
import { CalendarView } from "@/components/tasks/CalendarView";
import { GanttView } from "@/components/tasks/GanttView";
import { DashboardView } from "@/components/tasks/DashboardView";
import { BulkActionToolbar } from "@/components/tasks/BulkActionToolbar";
import { TaskTemplateSelector } from "@/components/tasks/TaskTemplateSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  BarChart3,
  GanttChartSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type ViewType = "kanban" | "list" | "calendar" | "gantt" | "dashboard";

const Tasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, isLoading } = useTasks();
  const { createTask } = useCreateTask();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();
  const { bulkUpdateStatus } = useBulkUpdateTaskStatus();

  const [activeView, setActiveView] = useState<ViewType>("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [templateDefaults, setTemplateDefaults] = useState<Partial<Task> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const templates: TaskTemplate[] = []; // Templates not yet migrated to Convex

  // Filter to only show root tasks (no parent) and match search
  const filteredTasks = tasks.filter(
    (task: any) =>
      !task.parentTaskId &&
      (task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateTask = (status?: TaskStatus) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setNewTaskStatus(status ?? "todo");
    setEditingTask(null);
    setTemplateDefaults(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTemplateDefaults(null);
    setIsFormOpen(true);
  };

  const handleSubmitTask = async (data: Partial<Task>) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id as any, ...data });
        toast.success("Task updated");
      } else if (data.title) {
        await createTask({ 
          title: data.title, 
          description: data.description,
          status: data.status || newTaskStatus,
          priority: data.priority || "medium",
          dueDate: data.due_date ? new Date(data.due_date).getTime() : undefined,
          tags: data.tags,
        });
        toast.success("Task created");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setIsSaving(false);
      setTemplateDefaults(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        toast.success("Task deleted");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleCreateTaskForDate = (date: Date) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setEditingTask(null);
    setNewTaskStatus("todo");
    setTemplateDefaults({ due_date: date.toISOString() });
    setIsFormOpen(true);
  };

  // Template selection handler
  const handleSelectTemplate = (template: TaskTemplate) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setEditingTask(null);
    setTemplateDefaults({
      title: template.name,
      description: template.description,
      priority: template.default_priority,
      status: template.default_status,
      estimated_hours: template.estimated_hours,
      tags: template.tags,
    });
    setIsFormOpen(true);
  };

  // Bulk operations
  const handleSelectTask = useCallback((task: Task, isSelected: boolean) => {
    setSelectedTasks((prev) =>
      isSelected ? [...prev, task] : prev.filter((t) => t.id !== task.id)
    );
  }, []);

  const handleClearSelection = () => setSelectedTasks([]);

  const handleBulkStatusChange = async (status: TaskStatus) => {
    try {
      await bulkUpdateStatus(selectedTasks.map((t) => t.id), status);
      setSelectedTasks([]);
      toast.success("Tasks updated");
    } catch (error) {
      toast.error("Failed to update tasks");
    }
  };

  const handleBulkPriorityChange = async (priority: Task["priority"]) => {
    // Update each task individually for now
    for (const task of selectedTasks) {
      await updateTask({ id: task.id as any, priority });
    }
    setSelectedTasks([]);
    toast.success("Tasks updated");
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedTasks.length} tasks?`)) {
      for (const task of selectedTasks) {
        await deleteTask(task.id);
      }
      setSelectedTasks([]);
      toast.success("Tasks deleted");
    }
  };

  // Subtask handlers
  const handleCreateSubtask = async (title: string, parentId: string) => {
    await createTask({ title, parentTaskId: parentId as any, status: "todo" });
  };

  // Get subtasks helper
  const getSubtasks = (parentId: string) => {
    return tasks.filter((t: any) => t.parentTaskId === parentId);
  };

  const views = [
    { id: "kanban", label: "Kanban", icon: LayoutGrid },
    { id: "list", label: "List", icon: List },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "gantt", label: "Gantt", icon: GanttChartSquare },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks with multiple views
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ViewType)}>
              <TabsList>
                {views.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger key={id} value={id} className="gap-1.5">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <TaskTemplateSelector
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
            />
            <Button onClick={() => handleCreateTask()}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* View Content */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {activeView === "kanban" && (
              <KanbanView
                tasks={filteredTasks}
                onUpdateTask={async (task) => { await updateTask(task as any); }}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onCreateTask={handleCreateTask}
              />
            )}
            {activeView === "list" && (
              <ListView
                tasks={filteredTasks}
                onUpdateTask={async (task) => { await updateTask(task as any); }}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                selectedTasks={selectedTasks}
                onSelectTask={handleSelectTask}
                getSubtasks={getSubtasks}
              />
            )}
            {activeView === "calendar" && (
              <CalendarView
                tasks={filteredTasks}
                onEditTask={handleEditTask}
                onCreateTaskForDate={handleCreateTaskForDate}
              />
            )}
            {activeView === "gantt" && (
              <GanttView tasks={filteredTasks} onEditTask={handleEditTask} />
            )}
            {activeView === "dashboard" && (
              <DashboardView tasks={filteredTasks} />
            )}
          </>
        )}

        {/* Bulk Action Toolbar */}
        <BulkActionToolbar
          selectedTasks={selectedTasks}
          onClearSelection={handleClearSelection}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkPriorityChange={handleBulkPriorityChange}
          onBulkDelete={handleBulkDelete}
        />

        {/* Task Form Modal */}
        <TaskForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          task={editingTask}
          defaultValues={templateDefaults || undefined}
          onSubmit={handleSubmitTask}
          isLoading={isSaving}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Tasks;
