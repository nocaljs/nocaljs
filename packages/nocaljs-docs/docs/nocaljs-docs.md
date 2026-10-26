# nocaljs-docs

## Overview
`nocaljs-docs` contains the technical specification and documentation for the NocalJS framework. It is designed to be AI-ready, providing clear and unambiguous documentation that can be used by AI agents to generate code.

## Installation
> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.

This package is primarily for documentation and does not contain runtime code.
```bash
git clone https://github.com/nocaljs/nocaljs.git
cd packages/nocaljs-docs
```

## Core Concepts

### AI-Ready Documentation
The documentation is structured to be easily interpretable by LLMs. This includes:
- **Standardized Templates**: Every package follows a consistent structure.
- **Explicit Examples**: Code snippets demonstrate both basic and advanced usage.
- **Deep Context**: Documentation includes core concepts to explain "why" things work, not just "what" the API is.

---

## API Reference

### Documentation Structure
- [`nocaljs-core.md`](nocaljs-core.md): Core framework documentation.
- [`nocaljs-cad2d.md`](nocaljs-cad2d.md): 2D CAD DSL documentation.
- [`nocaljs-ui.md`](nocaljs-ui.md): UI components documentation.
- [`nocaljs-config.md`](nocaljs-config.md): Configuration panel documentation.
- [`nocaljs-ext.md`](nocaljs-ext.md): Math and formatting utilities documentation.

---

## Examples

### How to use these docs with an AI agent
You can provide any of the `.md` files in this package to an AI agent as a system prompt or context to enable it to write NocalJS code accurately.

**Example Prompt:**
> "Using the attached `nocaljs-core.md` and `nocaljs-config.md`, create a simple NocalJS app that has a slider in a config panel that controls the size of a circle in the main DOM."
