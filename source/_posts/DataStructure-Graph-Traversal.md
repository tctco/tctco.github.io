---
title: DataStructure Graph Traversal
date: 2019-04-30 00:58:22
tags:
categories:
---

> Zhejiang University

## DFS(Depth First Search)

```c
void DFS(Vertex V){   
  visited[V] = true;   
  for(each adjacent vertex w){  
    if(!visited[w])       
      DFS(w);   
  }
}
```

**Complexity**
Adjacent List: $O(N+E)$
Adjacent Matrix: $O(N^2)$

## BFS(Breadth First Search)

```c
void BFS(Vertex V){ 
  visited[V] = true;  
  Enqueue(V, Q);  
  while(!IsEmpty(Q)){ 
    V = Dequeue(Q);  
    for(each adjacent vertex W of V)            if(!visited[V]){  
      visited[V] = true;  
      Enqueue(W, Q);    
    }   
  }
}
```

**Complexity**
Adjacent List: $O(N+E)$
Adjacent Matrix: $O(N^2)$

### Problem: Disconnected Graph

**Connected Component**: Extreme large subGraph of a undirected graph.

- Extreme large number of vertexes
- Extreme large number of edges

**Strongly Connected**: V and W are connected in both directions.

- Remark: The 2 paths need not be the same!

**Strongly Connected Graph**: Any given pair of vertexes are strongly connected.

**Strongly Connected Component**: Extreme large subGraph of a directed graph.

```c
void ListComponents(Graph G){  
  for (each V in G)  
    if(!visited[V])  
      DFS(V);
}
```
