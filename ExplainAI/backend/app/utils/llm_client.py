import json
from typing import Any

import httpx

from app.core.config import settings


class LLMClient:
    async def generate_explanation(
        self,
        prompt: str,
        language: str,
        code: str,
        analysis: dict[str, Any],
    ) -> dict[str, Any]:
        if not settings.openai_api_key:
            return self._heuristic_response(language, code, analysis)

        payload = {
            "model": settings.openai_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You explain code to students and always return valid JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"},
        }

        headers = {
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                f"{settings.openai_base_url.rstrip('/')}/chat/completions",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            parsed["provider"] = "openai-compatible"
            return parsed

    def _heuristic_response(self, language: str, code: str, analysis: dict[str, Any]) -> dict[str, Any]:
        explanation = []
        for idx, line in enumerate(code.splitlines(), start=1):
            stripped = line.strip()
            explanation.append(
                {
                    "line": idx,
                    "code": line,
                    "explanation": self._line_hint(stripped, language),
                }
            )

        return {
            "explanation": explanation,
            "algorithm_summary": analysis["summary"],
            "complexity": analysis["complexity"],
            "suggestions": [
                {
                    "title": "Add comments for key steps",
                    "detail": "Short comments around tricky logic can make the code much easier for students to follow.",
                },
                {
                    "title": "Separate concerns",
                    "detail": "Consider splitting input handling, core logic, and output formatting into smaller functions.",
                },
            ],
            "detected_errors": analysis["errors"],
            "test_cases": [
                {
                    "input": "Typical input",
                    "output": "Correct output for the main scenario",
                    "reason": "Verifies the expected happy path.",
                },
                {
                    "input": "Boundary input",
                    "output": "Correct output at minimum or maximum boundaries",
                    "reason": "Checks edge-case robustness.",
                },
            ],
            "provider": "heuristic-fallback",
        }

    def _line_hint(self, stripped: str, language: str) -> str:
        if not stripped:
            return "This line is empty and only affects formatting."
        if stripped.startswith(("def ", "function ", "class ")):
            return "This line declares a named block so the program can reuse or organize logic."
        if stripped.startswith(("for ", "while ")):
            return "This line starts a loop, so the following block repeats."
        if stripped.startswith("if "):
            return "This line checks a condition and decides which path to follow."
        if stripped.startswith(("print", "console.log")):
            return "This line displays information to the user."
        if "input" in stripped or "scanf" in stripped:
            return "This line reads data that the program will process."
        if stripped.startswith("return"):
            return "This line sends the computed result back to the caller."
        return f"This line performs part of the {language} program's main work."
