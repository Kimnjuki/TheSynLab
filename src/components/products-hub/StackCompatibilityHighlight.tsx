import { cn } from "@/lib/utils";

type Props = {
  compatible: boolean;
  children: React.ReactNode;
};

export function StackCompatibilityHighlight({ compatible, children }: Props) {
  return (
    <div className={cn("rounded-xl", compatible ? "border-t-4 border-emerald-500" : "opacity-80 grayscale-[0.2]")}>
      {compatible ? <div className="mb-2 text-xs text-emerald-600">Matches your stack</div> : null}
      {children}
    </div>
  );
}
