---
title: AGENTS
date: 2025-12-04 11:58:10
tags:
categories:
---

# Rules

## Plotting

Python Plotting (matplotlib / seaborn) for publication ready figures.

1. Use English-only text in all figures. Do not use Chinese characters (matplotlib may lack the required CJK fonts).
2. After plotting, remove spines with sns.despine() (apply per-axes or globally, as appropriate).
3. Keep figure size compact for papers (prefer single-column layouts; aim ~2–3.5 inches wide unless a two-column figure is required).
4. No gridlines on backgrounds (disable with plt.grid(False) or ax.grid(False)).
5. Apply the following style preset at the start of your plotting code to unify fonts and export settings:

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

Python projects could be managed by `uv`. Check before you run `pip` or `uv` commands.

## Natural Language

Always write code, docs, and code comments in English, but respond in 中文

## Reading files

Use commands like `head` to decide whether you truly need to load the entire dataset file (e.g., CSV, JSON files).
