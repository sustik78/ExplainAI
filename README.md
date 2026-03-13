# ExplainAI
## AI Code Explainer for Students

> Paste code. Get clarity. Learn faster. Win more debugging battles.

ExplainAI is a full-stack web app that helps students understand unfamiliar code using an LLM-powered explanation engine. It turns raw code into step-by-step explanations, algorithm summaries, complexity insights, test cases, improvement suggestions, and a visual flowchart.

Built for hackathons, demos, student tools, and learning-first developer experiences.

## 🚀 Why ExplainAI?

Students often see working code without really understanding:

- what each line is doing
- how the algorithm works
- where mistakes might happen
- how to test it properly

ExplainAI solves that by acting like a patient AI teaching assistant.

Users can:

- paste code into a modern editor
- choose a programming language
- generate beginner-friendly explanations
- visualize code flow with Mermaid diagrams
- detect common issues
- receive sample test cases instantly

## ✨ Key Features

### 🧠 AI Explanation Engine

- Line-by-line code explanation
- High-level algorithm summary
- Time and space complexity guidance
- Improvement suggestions for cleaner code

### 🛠 Error Detection

- Detects common code issues heuristically
- Uses Python AST support for Python syntax-aware analysis
- Flags suspicious structure like missing return paths

### 🔬 Test Case Generator

- Produces sample input/output pairs
- Includes normal-path and edge-case coverage

### 🔁 Flowchart Generator

- Converts logic into Mermaid flowchart syntax
- Renders a visual representation of the program flow

### 🎨 Clean Developer UI

- Dark theme
- Monaco editor with syntax highlighting
- Split layout for code and explanations
- Loading state while AI analysis runs

## 🧩 Problem Statement

Programming students often struggle to bridge the gap between:

- reading code
- understanding logic
- applying the same thinking in their own programs

Traditional IDEs tell you whether code runs.
ExplainAI helps you understand why it works.

## 💡 Solution Overview

ExplainAI accepts a code snippet and language selection from the user, sends it to a FastAPI backend, analyzes the logic, and returns:

1. line-by-line explanation
2. algorithm summary
3. complexity explanation
4. detected issues
5. test cases
6. Mermaid flowchart output

The frontend displays everything in a clean, student-friendly dashboard.

## 🏗 Tech Stack

### Frontend

- React
- Tailwind CSS
- Monaco Editor
- Mermaid.js
- Axios
- Vite

### Backend

- FastAPI
- Python
- Pydantic
- httpx

### AI Layer

- OpenAI-compatible LLM API
- Structured prompt engineering
- Heuristic fallback mode when no API key is configured

### Parsing / Analysis

- Python AST
- Lightweight heuristics for JavaScript, Java, and C++

## 🖼 Core Workflow

```text
User pastes code
    -> selects language
    -> clicks "Explain Code"
    -> backend analyzes code
    -> LLM generates explanation
    -> frontend renders:
       - line-by-line explanation
       - summary
       - complexity
       - suggestions
       - errors
       - test cases
       - flowchart
```

## 📁 Project Structure

```text
ExplainAI/
├── frontend/
├── backend/
├── ai_engine/
├── parser/
├── flowchart/
├── tests/
├── requirements.txt
└── README.md
```

## 🧠 Architecture

### Frontend Responsibilities

- collect code input
- allow language selection
- call backend APIs
- render explanation data
- render Mermaid flowchart

### Backend Responsibilities

- expose REST endpoints
- build prompts for the LLM
- run syntax-aware and heuristic analysis
- return structured JSON for the UI

## 🔌 API Endpoints

### `POST /explain`

Input:

```json
{
  "code": "def add(a, b):\n    return a + b",
  "language": "python"
}
```

Output:

```json
{
  "explanation": [
    {
      "line": 1,
      "code": "def add(a, b):",
      "explanation": "This line defines a function named add that accepts two parameters."
    },
    {
      "line": 2,
      "code": "    return a + b",
      "explanation": "This line returns the sum of the two inputs."
    }
  ],
  "algorithm_summary": "The program defines a function that accepts two numbers and returns their sum.",
  "complexity": "Time complexity is O(1) and space complexity is O(1) because it performs a single addition.",
  "suggestions": [
    {
      "title": "Add input validation",
      "detail": "You could check that both inputs are numeric before adding them."
    }
  ],
  "detected_errors": [],
  "test_cases": [
    {
      "input": "a = 2, b = 3",
      "output": "5",
      "reason": "Basic positive-number case."
    }
  ],
  "prompt_used": "You are ExplainAI...",
  "provider": "openai-compatible"
}
```

### `POST /flowchart`

Input:

```json
{
  "code": "def add(a, b):\n    return a + b",
  "language": "python"
}
```

Output:

```json
{
  "mermaid": "flowchart TD\n    N0[\"Start\"]\n    N1[\"Read or initialize variables\"]\n    N0 --> N1"
}
```

## 🧪 Example Prompt Used

The prompt system asks the model to return valid JSON with:

- `explanation`
- `algorithm_summary`
- `complexity`
- `suggestions`
- `detected_errors`
- `test_cases`

Prompt source:
[ai_engine/prompts.md](/c:/Users/USER/Desktop/MISCELLANEOUS/🙄🙄/iitb_hackathon/ExplainAI/ai_engine/prompts.md)

Snippet:

```text
You are ExplainAI, a patient teaching assistant for programming students.
Analyze the code and return valid JSON with line-by-line explanation,
algorithm summary, complexity, suggestions, detected errors, and test cases.
```

## ⚙️ Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+

### 1. Clone / Open Project

```bash
cd ExplainAI
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Optional `.env` configuration:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4.1-mini
```

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

Optional frontend environment file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 🧰 Running Tests

From the project root:

```bash
python -m pytest tests
```

## 🛡 Fallback Behavior

ExplainAI is designed to remain demo-friendly even without a live API key.

- If `OPENAI_API_KEY` is set, the app calls an OpenAI-compatible LLM endpoint.
- If no key is set, the backend falls back to a heuristic explanation mode so the project still runs locally.

This is useful during hackathons where internet access, billing setup, or API reliability may be limited.

## 🎯 Hackathon Highlights

- Strong education-focused use case
- Clear AI integration with structured output
- Immediate visual payoff through flowcharts
- Full-stack architecture with clean separation
- Easy local setup for judges and mentors
- Demo-safe fallback mode

## 📌 Future Scope

- Tree-sitter integration for deeper multi-language parsing
- More accurate complexity estimation
- Better branch-aware flowchart generation
- Export explanations as study notes
- Save user sessions and explanation history
- Quiz mode for students after explanation

## 👥 Team Pitch

ExplainAI is not just a code explainer.
It is a learning companion for students who want to move from "I can run this" to "I truly understand this."

If you are judging this project in a hackathon:

- it solves a real student pain point
- it demonstrates practical AI use beyond chat
- it combines education, visualization, and developer tooling in one product

## 📄 License

This project is intended for educational and hackathon use.
