---
title: DataStructure Topological Sorting
date: 2019-08-01 01:26:57
tags:
categories:
---

# Topological Sorting

**AOV(Activity On Vertex) network**

### Topological Order

> a topological sort or topological ordering of a directed graph is a linear ordering of its vertices such that for every directed edge uv from vertex u to vertex v, u comes before v in the ordering.

The process of getting the order is called **topological sorting**.

If AOV has a reasonable topological order, it has to be **DAG(Directed Acyclic Graph)**.

## Algorithm

Find vertexes that has no in-degree, delete them and their out-degree.

```c
void TopSort() {   
  for (cnt = 0; cnt < |V|; vnt++) {  
    v = in-degree is 0 and not printed yet; // do not try to scan the whole thing every time!    
    if (there is no such v) {  
      Error("loop exist");  
      break;    
    }      
    cout << v; // or store the number of v     
    for (each adjacent vertex w of v)         
      Indegree[w]--;  
  }
}
```

$$
T=O(|V|^2)
$$



```c
void TopSort(){ 
  for (each vertex v in the graph) {      
    if (Indegree[v] = 0) 
      Enqueue(v, q);  
  }  
  while (!isEmpty(q)) {  
    v = Dequeue(q);   
    cout << v; // or store the number of v      
    cnt++;      
    for (each adjacent vertex w of v) {        
      if (--Indegree[w] == 0)  
        Enqueue(w, q);   
    } 
  }  
  if (cnt != |v|)    
    Error("loop exist");
}
```

$$
T=O(|V|+|E|)
$$

