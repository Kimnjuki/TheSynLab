import { useState, useEffect } from "react";
import { TimeEntry } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Clock, Plus, Trash2 } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";

interface TimeTrackerProps {
  taskId: string;
  timeEntries: TimeEntry[];
  activeEntry: TimeEntry | null;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (entryId: string) => void;
  onAddManualEntry: (taskId: string, minutes: number, description?: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

export const TimeTracker = ({
  taskId,
  timeEntries,
  activeEntry,
  onStartTimer,
  onStopTimer,
  onAddManualEntry,
  onDeleteEntry,
}: TimeTrackerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualMinutes, setManualMinutes] = useState("");
  const [manualDescription, setManualDescription] = useState("");

  const isTimerRunning = activeEntry?.task_id === taskId && !activeEntry?.end_time;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && activeEntry) {
      interval = setInterval(() => {
        setElapsedTime(
          differenceInMinutes(new Date(), new Date(activeEntry.start_time)) * 60 +
            Math.floor((Date.now() - new Date(activeEntry.start_time).getTime()) / 1000) % 60
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeEntry]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalMinutes = timeEntries.reduce(
    (acc, entry) => acc + (entry.duration_minutes || 0),
    0
  );

  const handleAddManual = () => {
    const mins = parseInt(manualMinutes);
    if (mins > 0) {
      onAddManualEntry(taskId, mins, manualDescription || undefined);
      setManualMinutes("");
      setManualDescription("");
      setIsAddingManual(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Tracking</span>
        </div>
        <span className="text-sm text-muted-foreground">
          Total: {formatDuration(totalMinutes)}
        </span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        {isTimerRunning ? (
          <>
            <div className="flex-1 font-mono text-lg">{formatTime(elapsedTime)}</div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onStopTimer(activeEntry!.id)}
            >
              <Pause className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => onStartTimer(taskId)}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Start Timer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingManual(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Manual
            </Button>
          </>
        )}
      </div>

      {/* Manual Entry Form */}
      {isAddingManual && (
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Minutes"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              className="w-24"
            />
            <Input
              placeholder="Description (optional)"
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddManual}>
              Add Entry
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAddingManual(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Time Entries List */}
      {timeEntries.length > 0 && (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {timeEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded group"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {formatDuration(entry.duration_minutes || 0)}
                </span>
                {entry.description && (
                  <span className="text-muted-foreground truncate max-w-[150px]">
                    {entry.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {format(new Date(entry.start_time), "MMM d, HH:mm")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
