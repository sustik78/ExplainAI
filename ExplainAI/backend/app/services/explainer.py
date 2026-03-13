import json

from app.models.schemas import (
    ExplainRequest,
    ExplainResponse,
    IssueSuggestion,
    LineExplanation,
    TestCase,
)
from app.utils.code_analyzer import analyze_code_structure
from app.utils.llm_client import LLMClient
from app.utils.prompt_builder import build_explainer_prompt


class ExplainerService:
    def __init__(self) -> None:
        self.llm_client = LLMClient()

    async def explain_code(self, payload: ExplainRequest) -> ExplainResponse:
        if not payload.code.strip():
            raise ValueError("Code input cannot be empty.")

        prompt = build_explainer_prompt(payload.language, payload.code)
        analysis = analyze_code_structure(payload.language, payload.code)
        llm_result = await self.llm_client.generate_explanation(prompt, payload.language, payload.code, analysis)

        explanation = [
            LineExplanation(**item)
            for item in llm_result.get("explanation", self._fallback_line_explanations(payload.code))
        ]
        suggestions = [IssueSuggestion(**item) for item in llm_result.get("suggestions", [])]
        detected_errors = [IssueSuggestion(**item) for item in llm_result.get("detected_errors", [])]
        test_cases = [TestCase(**item) for item in llm_result.get("test_cases", self._fallback_test_cases())]

        return ExplainResponse(
            explanation=explanation,
            algorithm_summary=llm_result.get("algorithm_summary", analysis["summary"]),
            complexity=llm_result.get("complexity", analysis["complexity"]),
            suggestions=suggestions or self._fallback_suggestions(analysis),
            detected_errors=detected_errors or analysis["errors"],
            test_cases=test_cases,
            prompt_used=prompt,
            provider=llm_result.get("provider", "heuristic-fallback"),
        )

    def _fallback_line_explanations(self, code: str) -> list[dict[str, object]]:
        items: list[dict[str, object]] = []
        for index, line in enumerate(code.splitlines(), start=1):
            stripped = line.strip()
            detail = "Blank or formatting line."
            if stripped.startswith(("def ", "function ", "class ")):
                detail = "Defines a reusable block of logic."
            elif stripped.startswith(("for ", "while ")):
                detail = "Runs a loop over repeated work."
            elif stripped.startswith("if "):
                detail = "Introduces a conditional branch."
            elif stripped.startswith("return"):
                detail = "Returns a value from the current function."
            elif stripped:
                detail = "Performs a concrete operation in the program."
            items.append({"line": index, "code": line, "explanation": detail})
        return items

    def _fallback_suggestions(self, analysis: dict[str, object]) -> list[IssueSuggestion]:
        suggestions = [
            IssueSuggestion(
                title="Add descriptive names",
                detail="Use variable and function names that describe purpose clearly for beginners.",
            )
        ]
        if analysis.get("has_nested_loops"):
            suggestions.append(
                IssueSuggestion(
                    title="Review loop nesting",
                    detail="Nested loops may increase runtime quickly; consider whether any repeated work can be reduced.",
                )
            )
        return suggestions

    def _fallback_test_cases(self) -> list[dict[str, str]]:
        return [
            {
                "input": "Simple valid input",
                "output": "Expected normal output based on the main path",
                "reason": "Checks the most common successful execution path.",
            },
            {
                "input": "Edge-case input",
                "output": "Graceful handling or correct boundary result",
                "reason": "Confirms the code handles edge cases safely.",
            },
        ]
