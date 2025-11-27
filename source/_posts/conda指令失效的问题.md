---
title: conda指令失效的问题
date: 2025-02-25 22:09:59
tags:
categories:
---

问题：
```error
usage: conda-script.py [-h] [-v] [--no-plugins] [-V] COMMAND ...
conda-script.py: error: argument COMMAND: invalid choice: '' (choose from 'clean', 'compare', 'config', 'create', 'info', 'init', 'install', 'list', 'notices', 'package', 'remove', 'uninstall', 'rename', 'run', 'search', 'update', 'upgrade', 'doctor', 'repoquery', 'render', 'skeleton', 'env', 'debug', 'develop', 'server', 'metapackage', 'index', 'verify', 'repo', 'content-trust', 'pack', 'convert', 'inspect', 'token', 'build')
Invoke-Expression: Cannot bind argument to parameter 'Command' because it is an empty string.
```

通过设置环境变量解决

```ps1
$Env:_CE_M = $null
$Env:_CE_CONDA = $null
```