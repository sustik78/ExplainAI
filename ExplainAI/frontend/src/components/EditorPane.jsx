import Editor from "@monaco-editor/react";

const languages = [
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
];

function EditorPane({ code, language, monacoLanguage, loading, onCodeChange, onLanguageChange, onExplain }) {
  return (
    <section className="glass-panel flex min-h-[560px] flex-col overflow-hidden shadow-glow">
      <div className="flex flex-col gap-4 border-b border-slate-800 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-white">Code Workspace</h2>
          <p className="mt-1 text-sm text-slate-400">Paste code and let the explainer break it down step by step.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400"
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onExplain}
            disabled={loading}
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-200"
          >
            {loading ? "Explaining..." : "Explain Code"}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0b1120]">
        <Editor
          height="100%"
          language={monacoLanguage}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontLigatures: true,
            lineNumbersMinChars: 3,
            padding: { top: 18 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </section>
  );
}

export default EditorPane;
