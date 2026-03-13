from typing import Literal

from pydantic import BaseModel, Field


SupportedLanguage = Literal["python", "javascript", "java", "cpp"]


class ExplainRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Source code to explain.")
    language: SupportedLanguage


class LineExplanation(BaseModel):
    line: int
    code: str
    explanation: str


class IssueSuggestion(BaseModel):
    title: str
    detail: str


class TestCase(BaseModel):
    input: str
    output: str
    reason: str


class ExplainResponse(BaseModel):
    explanation: list[LineExplanation]
    algorithm_summary: str
    complexity: str
    suggestions: list[IssueSuggestion]
    detected_errors: list[IssueSuggestion]
    test_cases: list[TestCase]
    prompt_used: str
    provider: str


class FlowchartRequest(BaseModel):
    code: str = Field(..., min_length=1)
    language: SupportedLanguage


class FlowchartResponse(BaseModel):
    mermaid: str
