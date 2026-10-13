---
title: AGENTS
date: 2025-12-04 11:58:10
tags:
categories:
---

# Rules

README.md may occasionally include brief project conventions and usage notes.

## Plotting

Python Plotting (matplotlib / seaborn) for publication ready figures.

1. Use English-only text in all figures. Do not use Chinese characters (matplotlib may lack the required CJK fonts).
2. After plotting, remove spines with sns.despine() (apply per-axes or globally, as appropriate).
3. Keep figure size compact for papers (prefer single-column layouts; aim ~2–3.5 inches wide (e.g., plt.figure(figsize=(3, 3))) unless a two-column figure is required).
4. Some figures are relatively tall and narrow or wide and flat; adjust the canvas to the corresponding aspect ratio instead of forcing a square layout.
5. When generating heatmaps, the grid cells should be square.
6. No gridlines on backgrounds (disable with plt.grid(False) or ax.grid(False)).
7. Apply the following style preset at the start of your plotting code to unify fonts and export settings:

```python
plt.rcParams["font.family"] = "Arial" # or use "Liberation Sans" for ubuntu
plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
sns.set_context('paper')
```


Notes
1. Ensure sns.despine() is called after axes are created.
2. When exporting for manuscripts, prefer vector formats (PDF/EPS) with the above font settings to preserve text quality.

## Python Project Management

Python projects could be managed by `uv`. Check before you run `pip` or `uv` commands. If some packages/projects rely on older resources, consider whether they have a dedicated virtual environment; if they are not required in a new project, isolate them instead of forcing downgrades in the new project.

## Natural Language

Always write code, docs, and code comments in English, but respond in 中文

## Reading files

Use commands like `head` to decide whether you truly need to load the entire dataset file (e.g., CSV, JSON files).

## Logging

All long-running scripts must implement logging to track progress. For example, in Python, consider installing and using the loguru library.

## Research Experiment Organization

For a research project, it is recommended to create an exp directory at the project root, with a subdirectory for each sub-experiment; place the corresponding code and figures in each subdirectory, and add a README file documenting the experiment requirements and overall idea for future reference.

## Product Thinking

Think like an experienced product designer, not just a developer. Design around user goals, domain entities, workflows, and real-world operational needs rather than isolated features. Proactively integrate capabilities into the right context, reuse existing information, automate routine work, anticipate edge cases, and minimize unnecessary user effort.

### Generalization Over Examples

Treat provided data, screenshots, and examples as representative cases, not fixed specifications. Infer the underlying domain concepts and business rules, distinguish incidental details from genuine constraints, and design generalized, data-driven solutions that adapt to varying scenarios rather than overfitting or hardcoding the given examples.

### User-Centric UI Design

Design interfaces for end users, not developers. Every visible element must serve a clear user need; proactively eliminate redundant headings, repeated information, unnecessary descriptions, self-explanatory instructions, and implementation details. Prioritize intuitive interactions, concise labels, and high information density without sacrificing usability.

### UX Design Principles

Design for real-world usability, not merely functional correctness. Proactively infer and apply appropriate UI patterns based on user workflows, data characteristics, and expected scale, prioritizing intuitive, efficient, consistent, and scalable interactions without requiring explicit instructions.

### Viewport-Aware Design

Prioritize screen space based on user goals and content importance, especially on constrained viewports. Adapt layouts and interactions rather than merely stacking desktop components; minimize interface chrome, progressively disclose secondary controls, and keep primary content and actions immediately accessible.