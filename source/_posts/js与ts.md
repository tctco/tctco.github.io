---
title: js与ts
date: 2025-10-31 19:48:12
tags:
categories:
---

## electron

遇到
```log
(node:24048) UnhandledPromiseRejectionWarning: Error: The module '\\?\path\to\app\node_modules\better-sqlite3\build\Release\better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 137. This version of Node.js requires
NODE_MODULE_VERSION 136. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

解决方案：[How to install native modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules#how-to-install-native-modules)
