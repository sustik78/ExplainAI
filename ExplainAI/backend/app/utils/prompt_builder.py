def build_explainer_prompt(language: str, code: str) -> str:
    return f"""
You are ExplainAI, a patient teaching assistant for programming students.

Analyze the following {language} code and return JSON with this exact top-level shape:
{{
  "explanation": [{{"line": 1, "code": "...", "explanation": "..."}}],
  "algorithm_summary": "...",
  "complexity": "...",
  "suggestions": [{{"title": "...", "detail": "..."}}],
  "detected_errors": [{{"title": "...", "detail": "..."}}],
  "test_cases": [{{"input": "...", "output": "...", "reason": "..."}}]
}}

Requirements:
- Explain each non-empty line in beginner-friendly language.
- Summarize the overall algorithm clearly.
- Estimate time and space complexity with brief reasoning.
- Highlight likely mistakes, edge cases, or bad practices.
- Suggest practical improvements.
- Generate 2 or 3 sample test cases.
- Return valid JSON only.

Code:
```{language}
{code}
```
""".strip()
