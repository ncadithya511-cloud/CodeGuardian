# **App Name**: CodeGuardian

## Core Features:

- AST Analysis: Parse source code into an Abstract Syntax Tree to identify code smells like nested loops and high cyclomatic complexity.
- Local LLM Integration: Refactor code blocks for performance and generate semantic documentation using a local LLM (e.g., DeepSeek-Coder or CodeLlama via Ollama). The LLM will act as a tool, explaining mathematical observations made from AST analysis.
- Technical Debt Scoring: Calculate a Technical Debt Score based on code complexity and repetition to provide a quantifiable metric of code quality.
- Git Pre-commit Hook: Integrate a Git pre-commit hook to automatically run the code analysis and reject commits that fall below a defined quality threshold.
- Command Line Interface (CLI): Provide a CLI for running the code analysis and displaying results.
- Report Generation: Generate detailed reports highlighting code quality issues and suggested refactoring steps.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trustworthiness and stability.
- Background color: Light gray (#F5F5F5), a very lightly desaturated blue hue, to provide a clean and neutral backdrop.
- Accent color: Green (#4CAF50), analogous to blue, to highlight improvements and successful code audits.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern and neutral look.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clear and concise icons to represent different code analysis metrics and code smells.
- Subtle animations to highlight code improvements and successful checks during the git pre-commit hook.