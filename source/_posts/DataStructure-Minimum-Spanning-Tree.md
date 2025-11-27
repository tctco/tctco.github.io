---
title: DataStructure Minimum Spanning Tree
date: 2019-08-01 01:25:02
tags:
categories:
---

# Minimum Spanning Tree

## Characteristics

- A tree
  - We can regard a tree as a special graph
    - No loop
    - |V| - 1 edges with |V| vertexes
- Spanning
  - Include all nodes in this tree
  - |V| - 1 edges are in the graph
- Minimum
  - The weighted sum is minimum

If there exists a **minimum spanning tree**, the graph must be connected.

## Greedy Algorithm

- Every step should be the optimal!
- Optimal means that the weight should be as little as possible
- Restrictions
  - Only use the edges in the graph
  - Use |V| - 1 edges
  - No loop

### Prim Algorithm - Grow A Tree!

This algorithm is very similar to **Dijkstra** algorithm. It is suitable for **dense graph**.

```c
void Prim(){  
  MST = {s}; 
  while (1) {  
    v = vertex that is not included and has the list dist to the tree;    
    if (no such v)   
      break;      
    dist[v] = 0; // include v     
    for (each adjacent vertex w of v) { 
      // Update distance to the tree           
      if (w is not included) {        
        if (E(v, w) < dist[w]) {        
          dist[w] = E(v, w);        
          parent[w] = v;        
        }       
      }  
    }   
  }  
  if (number of edges in MST is less than |V|)   
    Error("no MST!");
}
```

$$
T=O(|V|^2)
$$



### Kruskal Algorithm - Combine Trees to A Forest!

```c
void Krustal(){  
  MST = {}; 
  while(MST has less edges than |V| - 1 && still edges in E) {    
    get an edge with the least weight E(v, w); // MinHeap  
    drop E(v, w) from E;    
    if (E(v, w) does not form a loop) // Union-find set    
      include E(v, w) into MST;     
    else        
      ignore E(v, w);  
  }  
  if (number of edges in MST is less than |V|)    
    Error("no MST!");
}
```
