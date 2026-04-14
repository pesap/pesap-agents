# Data Structure Selection Guide

## Quick Reference

| Need | Structure | Python | JavaScript |
|------|-----------|--------|------------|
| Fast lookup by key | Hash table | dict | Map/Object |
| Ordered mapping | Tree/BST | N/A (use sortedcontainers) | Map |
| Fast min/max | Heap | heapq | N/A |
| LRU cache | Hash + Linked List | OrderedDict/lru_cache | Map |
| Fast prefix search | Trie | N/A | N/A |
| Range queries | Segment tree / Fenwick | N/A | N/A |
| Union-find | Disjoint Set | N/A | N/A |

## Memory vs Speed Trade-offs

### Array vs Linked List
- **Array**: O(1) index, O(1) append (amortized), cache-friendly
- **Linked List**: O(1) prepend/insert, O(n) index, poor cache locality

### Set vs Bloom Filter
- **Set**: O(1) membership test, stores all keys, 100% accurate
- **Bloom Filter**: O(1) membership test, tiny memory, probabilistic

### List vs Deque
- **List**: O(1) append/pop at end, O(n) at front
- **Deque**: O(1) at both ends, slightly more overhead

## Access Patterns

### Sequential Access
- Use arrays/lists
- Prefetching works well
- Simple iteration is fastest

### Random Access
- Use arrays for O(1) by index
- Use hash maps for O(1) by key
- Trees for O(log n) with ordering

### Spatial Locality (Cache Efficiency)
```python
# Good: Sequential memory access
for i in range(n):
    total += arr[i]

# Bad: Jumping around memory
for i in range(0, n, 16):
    total += arr[i]
```

## Common Mistakes
- Using list for membership testing: `x in list` → O(n)
- Using dict when ordering matters (pre-3.7)
- Not considering memory overhead of hash tables
- Creating unnecessary copies instead of views
