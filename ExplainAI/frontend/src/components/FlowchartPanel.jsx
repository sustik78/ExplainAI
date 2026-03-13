import { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

function FlowchartPanel({ mermaidCode, loading }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let active = true;

    async function renderChart() {
      if (!mermaidCode) {
        setSvg("");
        return;
      }

      try {
        const id = `mermaid-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(id, mermaidCode);
        if (active) {
          setSvg(renderedSvg);
        }
      } catch (error) {
        if (active) {
          setSvg("<p style='color:#fca5a5'>Unable to render Mermaid flowchart for this code.</p>");
        }
      }
    }

    renderChart();
    return () => {
      active = false;
    };
  }, [mermaidCode]);

  return (
    <section className="glass-panel overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-4">
        <h2 className="font-display text-xl font-semibold text-white">Program Flowchart</h2>
        <p className="mt-1 text-sm text-slate-400">A Mermaid diagram generated from the code's logical steps.</p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          {loading && <div className="text-sm text-slate-400">Rendering flowchart...</div>}
          {!loading && !svg && <div className="text-sm text-slate-400">Generate an explanation to see the flowchart.</div>}
          {!loading && svg && <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} />}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="font-display text-lg font-semibold text-white">Mermaid Source</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-emerald-200">
            <code>{mermaidCode || "flowchart TD\n    Start --> ExplainAI"}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

export default FlowchartPanel;
