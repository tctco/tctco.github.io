---
title: DataStructure Shortest Path Problem
date: 2019-07-31 01:19:45
tags:
categories:
---

# Shortest Path Problem

Find the minimum weight in all the paths between 2 vertexes. This is called the **Shortest Path**. The start point is called **Source Vertex** the end point is called **Destination Vertex**.

## Problems

- Single-source Shortest Paths
  - (directed) Unweighted graph
  - (directed) Weighted graph
- Multi-Source Shortest Paths

### Single Source Shortest Path Algorithm for Unweighted Graphs

Find the shortest path in Non-decreasing order. It is very similar to **BFS**!

```c
void Unweighted(Vertex S){ 
  Enqueue(S, Q);  
  while(!IsEmpty(Q)) {   
    V = Dequeue(Q);   
    for (each adjacent vertex W of V) {      
      if (dist[W] == -1) {           
        dist[W] = dist[V] + 1;         
        path[W] = V;          
        Enqueue(W, Q);       
      }     
    }  
  }
}// dist[W] = distance from S to W// dist[S] = 0// path[W] = a vertex on the path from S to W
```

### Single Source Shortest Path Algorithm for Weighted Graphs

There is an interesting thing called **negative-cost cycle**. In this loop, the best way is to travel endlessly in this cycle.

#### Dijkstra Algorithm

- S = {source s, vertexes that their shortest paths have already been found}
- For any vertex that is not in S, dist[v] is the shortest path from s to v, but this path only consists the vertexes in S.
- This algorithm requires the Non-decreasing order of generating paths.
  - In this case, the shortest path **must** be only consisted of vertexes in S.
  - Each time choose a vertex that has the least distance.
  - When appending S, this action may affect another vertex (w) dist[w]!
    - In this case, w is connected directly to v and!
    - dist[w] = min{dist[w], dist[v] + weight}

```c
void Dijkstra(Vertex s) {
  while (1) {   
    V = vertex that are not inlcuded and has the minimum dist;   
    if (there is no such V)   
      break;      
    collected[V] = true;    
    for (each adjacent vertex W) {         
      if (collected[W] == false) {     
        if (dist[V] + E<V, W> < dist[W]) {  
          dist[W] = dist[V] + E<V, W>;    
          path[W] = V;      
        }            }  
    }  
  }
}
```

There are several ways of getting V!

- Scan uncollected set, find the one with the minimum distance. This method is very suitable for **Dense Graph** (graph with a lot of edges). $T=O(|V|^2+|E|)$
- Store the distance of v in a MinHeap $T=O(|V|\log |V|+|E|\log|V|=O(|E|\log|V|))$

### Multi-source Shortest Paths Algorithms

- Use the Single-source Shortest Path Algorithm on every vertex. This method is suitable for **Sparse graph**. $T=O(|V|^3+|E|\times |V|)$
- **Floyd Algorithm** $T=O(|V|^3)$

#### Floyd Algorithm

$$
D^k[i][j] = \min({\rm distance}(i, (l\le k)), j)
$$

The final shortest path is given by $D^{|V|-1}[i][j]$

```c
void Floyd(){ 
  for (int i = 0; i < N; i++) {  
    for (int j = 0; j < N; j++) {  
      D[i][j] = G[i][j];
      path[i][j] = -1;    
    }  
  }    
  for (int k = 0; k < N; k++) {  
    for (int i = 0; i < N; i++) { 
      for (int j = 0; j < N; j++) { 
        if (D[i][k] + D[k][j] < D[i][j]) {               
          D[i][j] = D[i][k] + D[k][j];            
          path[i][j] = k;             
        }      
      }      
    }   
  }
}
```
