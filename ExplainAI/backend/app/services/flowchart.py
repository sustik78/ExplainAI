from app.models.schemas import FlowchartRequest, FlowchartResponse
from app.utils.code_analyzer import summarize_logic_steps
from app.utils.mermaid_builder import build_mermaid_flowchart


class FlowchartService:
    def generate_flowchart(self, payload: FlowchartRequest) -> FlowchartResponse:
        if not payload.code.strip():
            raise ValueError("Code input cannot be empty.")

        steps = summarize_logic_steps(payload.language, payload.code)
        mermaid = build_mermaid_flowchart(steps)
        return FlowchartResponse(mermaid=mermaid)
