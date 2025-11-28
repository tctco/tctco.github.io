---
title: 用VSCode写cpp项目
date: 2025-11-28 22:28:21
tags:
categories:
---

1. 用conan管理包感觉必vcpkg靠谱：一些库在conan里有，vcpkg没有
2. vscode/cursor没有cpp的intellisense，可以如下解决：
  1. `CMakeLists.txt`中添加`set(CMAKE_EXPORT_COMPILE_COMMANDS ON)`
  2. `.vscode/settings.json`中添加 `"C_Cpp.default.compileCommands": "${workspaceFolder}/build/compile_commands.json"`
  
即使cmake文件与cpp代码在某个子目录中（如`localizer/src`）也可以呈现正常的高亮。


参考文献
- [linking-conan-include-to-vs-code](https://stackoverflow.com/questions/58077908/linking-conan-include-to-vs-code)
