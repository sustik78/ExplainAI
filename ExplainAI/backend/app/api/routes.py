from fastapi import APIRouter, HTTPException

from app.models.schemas import ExplainRequest, ExplainResponse, FlowchartRequest, FlowchartResponse
from app.services.explainer import ExplainerService
from app.services.flowchart import FlowchartService

router = APIRouter()

explainer_service = ExplainerService()
flowchart_service = FlowchartService()


@router.post("/explain", response_model=ExplainResponse)
async def explain_code(payload: ExplainRequest) -> ExplainResponse:
    try:
        return await explainer_service.explain_code(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive API boundary
        raise HTTPException(status_code=500, detail="Failed to generate explanation.") from exc


@router.post("/flowchart", response_model=FlowchartResponse)
async def generate_flowchart(payload: FlowchartRequest) -> FlowchartResponse:
    try:
        return flowchart_service.generate_flowchart(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive API boundary
        raise HTTPException(status_code=500, detail="Failed to generate flowchart.") from exc
