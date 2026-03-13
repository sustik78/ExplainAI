from backend.app.utils.mermaid_builder import build_mermaid_flowchart


def test_build_mermaid_flowchart_contains_edges() -> None:
    mermaid = build_mermaid_flowchart(["Start", "Do work", "End"])
    assert "flowchart TD" in mermaid
    assert "N0 --> N1" in mermaid
