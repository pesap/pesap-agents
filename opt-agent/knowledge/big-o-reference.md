# Big-O Complexity Reference

## Common Complexities

### O(1) - Constant Time
- Array indexing: `arr[i]`
- Hash map operations: `dict[key]`, `set.add(x)`
- Linked list prepend: `list.insert(0, x)` (not Python list!)

### O(log n) - Logarithmic
- Binary search
- Balanced BST operations
- Heap push/pop

### O(n) - Linear
- Array/list iteration
- Linear search
- Finding max/min in unsorted data

### O(n log n) - Linearithmic
- Efficient sorting (quicksort, mergesort, timsort)
- Divide-and-conquer algorithms

### O(n²) - Quadratic
- Naive sorting (bubble, insertion)
- Nested loops over same data
- All pairs algorithms

### O(2^n) - Exponential
- Recursive Fibonacci
- Traveling salesman (brute force)
- Subset enumeration

## Complexity Analysis Quick Guide

### Space vs Time Trade-offs
| Approach | Time | Space | Use When |
|----------|------|-------|----------|
| Memoization | O(n) | O(n) | Recursive with overlapping subproblems |
| Iterative | O(n) | O(1) | Can avoid call stack |
| Two-pointer | O(n) | O(1) | Sorted arrays, palindromes |
| Hash map | O(1) avg | O(n) | Fast lookups needed |
| Sorting | O(n log n) | O(1)-O(n) | Need ordering |

### Python-Specific Notes
- List: O(1) append, O(n) insert at front, O(1) index
- Dict/Set: O(1) avg operations, O(n) worst case
- `in` operator: O(n) for list/tuple, O(1) for set/dict
- String concatenation: O(n²) with `+`, O(n) with `''.join()`

## Red Flags
- Nested loops → O(n²) or worse
- Recursion without memoization → exponential
- Sorting when not needed → O(n log n) overhead
- Full data materialization when streaming works
