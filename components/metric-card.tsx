import { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
}) {
  const content = (
    <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] hover:border-violet-200 hover:shadow-sm transition-all duration-200 cursor-default">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[#78716C] font-medium uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-[#1C1917]">{value}</p>
        </div>
        <div className="grid size-11 place-items-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}
