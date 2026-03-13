function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-slate-300">{children}</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-800" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-800/80" />
          <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-800/80" />
        </div>
      ))}
    </div>
  );
}

function ResultPanel({ loading, result, error }) {
  return (
    <section className="glass-panel scrollbar min-h-[560px] overflow-y-auto p-4 md:p-5">
      <div className="mb-4">
        <h2 className="font-display text-xl font-semibold text-white">Explanation Panel</h2>
        <p className="mt-1 text-sm text-slate-400">Teaching notes, algorithm insights, code issues, and sample tests.</p>
      </div>

      {loading && <LoadingSkeleton />}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
      )}

      {!loading && !error && !result && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-sm leading-6 text-slate-400">
          Your explanation will appear here after you submit code for analysis.
        </div>
      )}

      {!loading && result && (
        <div className="space-y-4">
          <SectionCard title="Algorithm Summary">
            <p>{result.algorithm_summary}</p>
            <p className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-slate-200">
              <span className="font-semibold text-emerald-300">Complexity:</span> {result.complexity}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Provider: {result.provider}</p>
          </SectionCard>

          <SectionCard title="Line-by-Line Explanation">
            <div className="space-y-3">
              {result.explanation.map((item) => (
                <div key={`${item.line}-${item.code}`} className="rounded-xl bg-slate-900/80 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Line {item.line}</p>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-2 text-xs text-sky-200">
                    <code>{item.code || "(blank line)"}</code>
                  </pre>
                  <p className="mt-2 text-sm text-slate-300">{item.explanation}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Suggestions For Improvement">
            <div className="space-y-3">
              {result.suggestions.map((item) => (
                <div key={item.title} className="rounded-xl bg-slate-900/80 p-3">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Detected Errors">
            <div className="space-y-3">
              {result.detected_errors.length === 0 && <p>No obvious issues were detected in the current snippet.</p>}
              {result.detected_errors.map((item) => (
                <div key={item.title} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                  <p className="font-medium text-amber-200">{item.title}</p>
                  <p className="mt-1 text-amber-50/90">{item.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Generated Test Cases">
            <div className="space-y-3">
              {result.test_cases.map((item, index) => (
                <div key={`${item.input}-${index}`} className="rounded-xl bg-slate-900/80 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Case {index + 1}</p>
                  <p className="mt-2"><span className="font-medium text-white">Input:</span> {item.input}</p>
                  <p className="mt-1"><span className="font-medium text-white">Output:</span> {item.output}</p>
                  <p className="mt-1 text-slate-400">{item.reason}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </section>
  );
}

export default ResultPanel;
