import { AppShell } from "@/components/app-shell";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/mock-data";

const CATEGORIES = ["Portfolio", "Outreach", "Proposals", "Productivity"];

const categoryDescriptions: Record<string, string> = {
  Portfolio: "Showcase your work and build credibility with potential clients.",
  Outreach: "Find clients and start conversations that convert.",
  Proposals: "Win projects with professional, persuasive proposals.",
  Productivity: "Stay organized, track time, and close more deals.",
};

export default function VaultPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tool Vault</h1>
        <p className="text-slate-400">
          Every tool you need to go from zero to first client — curated and
          categorized.
        </p>
      </div>

      <div className="space-y-12">
        {CATEGORIES.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat);
          return (
            <section key={cat}>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white mb-1">{cat} Tools</h2>
                <p className="text-sm text-slate-400">{categoryDescriptions[cat]}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
