---
title: Quick Notes on Flask Blog
date: 2019-08-01 01:28:54
tags:
categories: Note
---

> When I tried to synchronize my site.db to github.com, something wrong happened. There is an error on nginx 502 Bad Gateway.

When checking the error log on my server at:
`cat /var/log/flaskblog/flaskblog.err.log`
I found the error.

```
sqlite3.OperationalError: attempt to write a readonly database
```

To change the authority of writing in this database, I used:
`chmod a+rw ./site.db`
to give all users the authority to read and wirte this database file.

This solves the problem.
