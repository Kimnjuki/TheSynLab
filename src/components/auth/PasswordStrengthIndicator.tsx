import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordCriteria {
  label: string;
  met: boolean;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const criteria: PasswordCriteria[] = useMemo(() => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    const metCount = criteria.filter((c) => c.met).length;
    if (metCount === 0) return { label: "", color: "", width: "0%" };
    if (metCount <= 2) return { label: "Weak", color: "bg-destructive", width: "33%" };
    if (metCount <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }, [criteria]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            "font-medium",
            strength.label === "Weak" && "text-destructive",
            strength.label === "Medium" && "text-yellow-500",
            strength.label === "Strong" && "text-green-500"
          )}>
            {strength.label}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", strength.color)}
            style={{ width: strength.width }}
          />
        </div>
      </div>

      {/* Criteria List */}
      <ul className="grid grid-cols-1 gap-1.5 text-xs">
        {criteria.map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "flex items-center gap-2 transition-colors",
              item.met ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {item.met ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
