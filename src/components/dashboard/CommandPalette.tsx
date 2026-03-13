import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  LayoutDashboard,
  CheckSquare,
  GitCompare,
  Calculator,
  Settings,
  Users,
  Zap,
  FileText,
  Search,
  Plus,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  group: string;
}

interface CommandPaletteProps {
  onCreateTask?: () => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

export const CommandPalette = ({ 
  onCreateTask, 
  onToggleTheme, 
  isDarkMode 
}: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Navigation
    { id: "home", label: "Go to Home", icon: Home, action: () => navigate("/"), group: "Navigation" },
    { id: "tasks", label: "Go to Tasks", icon: CheckSquare, action: () => navigate("/tasks"), shortcut: "⌘T", group: "Navigation" },
    { id: "compare", label: "Go to Compare", icon: GitCompare, action: () => navigate("/compare"), group: "Navigation" },
    { id: "budget", label: "Go to Budget Calculator", icon: Calculator, action: () => navigate("/budget-calculator"), group: "Navigation" },
    { id: "automations", label: "Go to Automations", icon: Zap, action: () => navigate("/automations"), group: "Navigation" },
    { id: "community", label: "Go to Community Setups", icon: Users, action: () => navigate("/community-setups"), group: "Navigation" },
    { id: "profile", label: "Go to Profile", icon: Settings, action: () => navigate("/profile"), group: "Navigation" },
    
    // Actions
    ...(onCreateTask ? [{ 
      id: "create-task", 
      label: "Create New Task", 
      icon: Plus, 
      action: () => { setOpen(false); onCreateTask(); }, 
      shortcut: "⌘N",
      group: "Actions" 
    }] : []),
    ...(onToggleTheme ? [{ 
      id: "toggle-theme", 
      label: isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode", 
      icon: isDarkMode ? Sun : Moon, 
      action: () => { onToggleTheme(); setOpen(false); }, 
      shortcut: "⌘D",
      group: "Actions" 
    }] : []),
    
    // Quick Links
    { id: "docs", label: "View Documentation", icon: FileText, action: () => window.open("https://docs.lovable.dev", "_blank"), group: "Quick Links" },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 rounded-md border border-border hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedCommands).map(([group, items], idx) => (
            <div key={group}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {items.map((cmd) => (
                  <CommandItem
                    key={cmd.id}
                    onSelect={() => runCommand(cmd.action)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <cmd.icon className="h-4 w-4" />
                      <span>{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
