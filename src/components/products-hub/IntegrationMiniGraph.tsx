import { motion } from "framer-motion";

type Node = { id: string; name: string; logoUrl?: string | null; connectionMethod: string; strength: number };
type Props = { centerLabel: string; nodes: Node[] };

const colorByMethod: Record<string, string> = {
  native: "#22c55e",
  zapier: "#3b82f6",
  n8n: "#3b82f6",
  api: "#9ca3af",
  middleware: "#9ca3af",
};

export function IntegrationMiniGraph({ centerLabel, nodes }: Props) {
  const cx = 100;
  const cy = 100;
  const r = 70;
  const visibleNodes = nodes.slice(0, 5);

  return (
    <svg width={200} height={200} viewBox="0 0 200 200" role="img" aria-label="Integration mini graph">
      {visibleNodes.map((node, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const methodColor = colorByMethod[node.connectionMethod] ?? colorByMethod.api;
        const dx = x - cx;
        const dy = y - cy;
        const lineLength = Math.sqrt(dx * dx + dy * dy);
        return (
          <g key={node.id}>
            <motion.line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={methodColor}
              strokeWidth={2}
              strokeDasharray={`${lineLength} ${lineLength}`}
              initial={{ strokeDashoffset: lineLength }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <title>{node.connectionMethod}</title>
            </motion.line>
            <circle cx={x} cy={y} r={14} fill="#0f172a" stroke={methodColor} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={20} fill="#111827" stroke="#a855f7" />
      <text x={cx} y={cy + 4} textAnchor="middle" className="fill-white text-[8px]">
        {centerLabel.slice(0, 8)}
      </text>
    </svg>
  );
}
