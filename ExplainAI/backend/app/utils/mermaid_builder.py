def build_mermaid_flowchart(steps: list[str]) -> str:
    lines = ["flowchart TD"]
    for index, step in enumerate(steps):
        node_id = f"N{index}"
        lines.append(f'    {node_id}["{step}"]')
        if index > 0:
            previous_id = f"N{index - 1}"
            lines.append(f"    {previous_id} --> {node_id}")
    return "\n".join(lines)
