import { useMemo, useState } from "react";
import axios from "axios";
import EditorPane from "./components/EditorPane";
import ResultPanel from "./components/ResultPanel";
import FlowchartPanel from "./components/FlowchartPanel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const starterCode = {
  python: `def factorial(n):\n    if n == 0:\n        return 1\n    result = 1\n    for value in range(1, n + 1):\n        result *= value\n    return result\n\nprint(factorial(5))`,
  javascript: `function factorial(n) {\n  if (n === 0) {\n    return 1;\n  }\n  let result = 1;\n  for (let value = 1; value <= n; value += 1) {\n    result *= value;\n  }\n  return result;\n}\n\nconsole.log(factorial(5));`,
  java: `public class Main {\n    static int factorial(int n) {\n        if (n == 0) return 1;\n        int result = 1;\n        for (int value = 1; value <= n; value++) {\n            result *= value;\n        }\n        return result;\n    }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    if (n == 0) return 1;\n    int result = 1;\n    for (int value = 1; value <= n; value++) {\n        result *= value;\n    }\n    return result;\n}\n\nint main() {\n    cout << factorial(5) << endl;\n    return 0;\n}`,
};

function App() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);
  const [result, setResult] = useState(null);
  const [flowchart, setFlowchart] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const monacoLanguage = useMemo(() => {
    if (language === "cpp") return "cpp";
    return language;
  }, [language]);

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCode(starterCode[nextLanguage]);
  };

  const handleExplain = async () => {
    setLoading(true);
    setError("");
    try {
      const [explainResponse, flowchartResponse] = await Promise.all([
        axios.post(`${API_BASE_URL}/explain`, { code, language }),
        axios.post(`${API_BASE_URL}/flowchart`, { code, language }),
      ]);
      setResult(explainResponse.data);
      setFlowchart(flowchartResponse.data.mermaid);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "The backend could not process the request. Make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 md:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            ExplainAI
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            AI code explanations that feel like a patient tutor.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
            Paste unfamiliar code, choose a language, and get line-by-line teaching notes, algorithm summaries,
            test cases, flowcharts, and improvement ideas.
          </p>
        </div>

        <div className="glass-panel shadow-glow flex items-center gap-3 self-start px-4 py-3 text-sm text-slate-200">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulseSlow" />
          Ready for Python, JavaScript, Java, and C++
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <EditorPane
          code={code}
          language={language}
          monacoLanguage={monacoLanguage}
          loading={loading}
          onCodeChange={setCode}
          onLanguageChange={handleLanguageChange}
          onExplain={handleExplain}
        />

        <ResultPanel loading={loading} result={result} error={error} />
      </main>

      <section className="mt-6">
        <FlowchartPanel mermaidCode={flowchart} loading={loading} />
      </section>
    </div>
  );
}

export default App;
