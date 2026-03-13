import ast
from typing import Any


def analyze_code_structure(language: str, code: str) -> dict[str, Any]:
    summary = "The code processes input, performs its main logic, and produces an output."
    complexity = "Estimated time complexity depends on loop depth and data structures used."
    errors: list[dict[str, str]] = []
    has_nested_loops = False

    if language == "python":
        try:
            tree = ast.parse(code)
            function_count = sum(isinstance(node, ast.FunctionDef) for node in ast.walk(tree))
            loop_nodes = [node for node in ast.walk(tree) if isinstance(node, (ast.For, ast.While))]
            has_nested_loops = any(
                any(isinstance(child, (ast.For, ast.While)) for child in ast.walk(node) if child is not node)
                for node in loop_nodes
            )
            if function_count:
                summary = f"The program defines {function_count} function(s) and organizes logic into reusable blocks."
            if has_nested_loops:
                complexity = "Likely at least quadratic in the worst case because nested loops are present."
            elif loop_nodes:
                complexity = "Likely linear with respect to the size of the iterated input."
        except SyntaxError as exc:
            errors.append(
                {
                    "title": "Python syntax issue",
                    "detail": f"Parser could not read the code near line {exc.lineno}: {exc.msg}.",
                }
            )

    lines = [line.strip() for line in code.splitlines() if line.strip()]
    if any("==" in line and "=" in line and "==" not in line.replace("==", "") for line in lines):
        pass

    if not any("return" in line for line in lines) and any(line.startswith(("def ", "function ")) for line in lines):
        errors.append(
            {
                "title": "Missing return path",
                "detail": "A function appears to compute something but may not return a value explicitly.",
            }
        )

    return {
        "summary": summary,
        "complexity": complexity,
        "errors": errors,
        "has_nested_loops": has_nested_loops,
    }


def summarize_logic_steps(language: str, code: str) -> list[str]:
    steps = ["Start", "Read or initialize variables"]
    stripped_lines = [line.strip() for line in code.splitlines() if line.strip()]

    for line in stripped_lines[:8]:
        if line.startswith(("for ", "while ")):
            steps.append("Repeat a block of logic while a condition or sequence lasts")
        elif line.startswith("if "):
            steps.append("Check a condition and branch based on the result")
        elif line.startswith("return"):
            steps.append("Return the final result")
        elif line.startswith(("def ", "function ", "class ")):
            steps.append("Define program structure")
        else:
            steps.append(f"Execute: {line[:48]}")

    if steps[-1] != "Return the final result":
        steps.append("Produce output")
    steps.append("End")
    return _dedupe_steps(steps)


def _dedupe_steps(steps: list[str]) -> list[str]:
    deduped: list[str] = []
    for step in steps:
        if not deduped or deduped[-1] != step:
            deduped.append(step)
    return deduped
