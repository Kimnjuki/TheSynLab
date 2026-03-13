import { useState, useMemo } from "react";
import { Task, PRIORITY_CONFIG, STATUS_CONFIG } from "@/types/task";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  differenceInDays,
  isWithinInterval,
  isSameDay,
  isToday,
} from "date-fns";

interface GanttViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

type ViewMode = "week" | "month";

export const GanttView = ({ tasks, onEditTask }: GanttViewProps) => {
  const [startDate, setStartDate] = useState(startOfWeek(new Date()));
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  const daysToShow = viewMode === "week" ? 14 : 30;
  const endDate = addDays(startDate, daysToShow - 1);

  const days = useMemo(() => {
    const result: Date[] = [];
    let current = startDate;
    for (let i = 0; i < daysToShow; i++) {
      result.push(current);
      current = addDays(current, 1);
    }
    return result;
  }, [startDate, daysToShow]);

  const tasksWithDates = tasks.filter((task) => task.due_date);

  const getTaskPosition = (task: Task) => {
    if (!task.due_date) return null;

    const taskDate = new Date(task.due_date);
    const taskStart = addDays(taskDate, -(task.estimated_hours ? Math.ceil(task.estimated_hours / 8) : 1));
    const taskEnd = taskDate;

    // Check if task is visible in current range
    if (taskEnd < startDate || taskStart > endDate) return null;

    const effectiveStart = taskStart < startDate ? startDate : taskStart;
    const effectiveEnd = taskEnd > endDate ? endDate : taskEnd;

    const startOffset = differenceInDays(effectiveStart, startDate);
    const duration = differenceInDays(effectiveEnd, effectiveStart) + 1;

    const cellWidth = 100 / daysToShow;
    const left = startOffset * cellWidth;
    const width = duration * cellWidth;

    return { left: `${left}%`, width: `${Math.max(width, cellWidth)}%` };
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      {/* Header controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartDate(subWeeks(startDate, viewMode === "week" ? 1 : 2))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStartDate(startOfWeek(new Date()))}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartDate(addWeeks(startDate, viewMode === "week" ? 1 : 2))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm font-medium">
          {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
        </div>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "week" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            2 Weeks
          </Button>
          <Button
            variant={viewMode === "month" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            <ZoomOut className="h-4 w-4 mr-1" />
            Month
          </Button>
        </div>
      </div>

      {/* Timeline header */}
      <div className="flex border-b bg-muted/30">
        <div className="w-48 shrink-0 p-2 border-r font-medium text-sm">
          Task
        </div>
        <div className="flex-1 flex">
          {days.map((day, index) => (
            <div
              key={index}
              className={`flex-1 text-center py-1 text-xs border-r ${
                isToday(day) ? "bg-primary/10" : ""
              }`}
            >
              <div className="font-medium">{format(day, "EEE")}</div>
              <div className={isToday(day) ? "text-primary font-bold" : "text-muted-foreground"}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="max-h-[500px] overflow-y-auto">
        {tasksWithDates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tasks with due dates found
          </div>
        ) : (
          tasksWithDates.map((task) => {
            const position = getTaskPosition(task);
            const statusConfig = STATUS_CONFIG[task.status];
            const priorityConfig = PRIORITY_CONFIG[task.priority];

            return (
              <div key={task.id} className="flex border-b hover:bg-muted/30">
                <div className="w-48 shrink-0 p-2 border-r">
                  <div
                    className="text-sm font-medium truncate cursor-pointer hover:text-primary"
                    onClick={() => onEditTask(task)}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
                <div className="flex-1 relative h-14">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`flex-1 border-r ${isToday(day) ? "bg-primary/5" : ""}`}
                      />
                    ))}
                  </div>
                  {/* Task bar */}
                  {position && (
                    <div
                      className={`absolute top-2 h-10 rounded cursor-pointer transition-all hover:opacity-80 ${priorityConfig.color}`}
                      style={{ left: position.left, width: position.width }}
                      onClick={() => onEditTask(task)}
                    >
                      <div className="px-2 py-1 text-xs font-medium truncate h-full flex items-center">
                        {task.title}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
