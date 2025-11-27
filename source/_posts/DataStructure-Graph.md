---
title: DataStructure Graph
date: 2019-04-29 00:56:15
tags:
categories:
---

> Zhejiang University

## Graph

It is used to represent a many-to-many relationship.

It is so powerful because it includes both linear lists(one to one) and trees(one to many).

### Components

- Vertex(V): the set of all vertexes.
- Edge: the set of all sides.
  - (v, w). Double directions.
  - . From v to w (single direction).
  - No multiple edges or multiple loops.

*A Quick Review: Definition of Abstract Data Type*

Name: **Graph**
DataSet: **G(V, E)**. V is **Nonempty** E is limited.

### Operation Set

- Graph Create()
- Graph InsertVertex(Grapg G, Vertex v)
- Graph InsertEdge(Graph G, Edge e)
- void DFS(Graph G, Vertex v)
- void BFS(Graph G, Vertex v)
- void ShortestPath(Graph G, Vertex v, int Dist[])
- void MST(Graph G)
- …

### Terminology

- Undirected Graph
- Directed Graph
- Network(the edges have weight)

### Creating a Graph

#### Adjacency Matrix

G[i][j] = 1, if is an edge in G.
G[i][j] = 0, else.

**The matrix is symmetric**, thus we can use a **1-d array**. The subscript will be:
$$
i\times (i+1) / 2 + j
$$
This can also be applied to network. G[i][j] will be the edge’s weight.

##### Advantages

- Easy to understand
- Easy to find out whether there exists an edge
- Easy to find an arbitrary vertex’s all adjacent vertexes.
- Easy to calculate the degree of an arbitrary vertex.
  - The number of edges flowing out of a vertex is **OutDegree**.
  - The number of edges flowing out of a vertex is **InDegree**.

##### Disadvantages

- Wasting space, especially for **sparse graph**
  - Useful for **complete graph** or **dense graph**.
- Wasting time, especially for sparse graph.

#### Adjacent List

G[N] is a pointer array, representing each row in the matrix(a linked list). It only stores nonempty element.

> This is actually not as efficient as expected. Each node has a tag and a pointer. If it is a network, there will also be a place to store its weight.

##### Properties

- Easy to find out all connected vertexes.
- Save space for a sparse graph.
  - N head pointers
  - 2E nodes(each has 2 domains)
- Number of vertexes of a given vertex
  - Undirected Graph: Easy
  - Directed Graph: Difficult.
    It is only easy to calculate the OutDegree. To sum the InDegree, we need to create a reversed one.
- Difficult to check whether there exists an edge between any given pair of vertexes.
