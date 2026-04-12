# Before/After Examples

## Example 1: Ambiguous Requirements

**Request:** "Make the search faster"

### Before (Wrong Assumptions)
```python
# Adds caching, database indexes, and async processing
# without asking which "faster" matters
@lru_cache(maxsize=1000)
async def search(query: str) -> List[Result]:
    # ... 200 lines of optimization code
```

### After (Surface Interpretations)
```
"Make the search faster" could mean:

1. **Faster response time** (< 100ms instead of 500ms)
   - Add database indexes
   - Cache frequent queries
   - Estimated effort: 2 hours

2. **Handle more concurrent searches** (throughput)
   - Add async/await
   - Connection pooling
   - Estimated effort: 4 hours

3. **Faster perceived speed** (UX)
   - Show partial results immediately
   - Progressive loading
   - Estimated effort: 3 hours

Current search takes ~500ms for typical queries. 
Which aspect matters most for your use case?
```

---

## Example 2: Speculative Features

**Request:** "Save user preferences to database"

### Before (Unnecessary Features)
```python
class PreferenceManager:
    def __init__(self, db, cache=None, validator=None):
        self.db = db
        self.cache = cache or InMemoryCache()
        self.validator = validator or DefaultValidator()
    
    def save(self, user_id: int, prefs: dict, 
             merge: bool = True, 
             validate: bool = True,
             notify: bool = False) -> bool:
        """Save preferences with optional merging, validation, and notifications."""
        
        if validate:
            errors = self.validator.validate(prefs)
            if errors:
                raise ValidationError(errors)
        
        existing = self.get(user_id) if merge else {}
        
        if merge:
            existing.update(prefs)
            prefs = existing
        
        self.db.execute(
            "UPDATE users SET preferences = ? WHERE id = ?",
            (json.dumps(prefs), user_id)
        )
        
        if self.cache:
            self.cache.set(f"prefs:{user_id}", prefs)
        
        if notify:
            self._notify_preferences_changed(user_id)
        
        return True
```

### After (Minimal)
```python
def save_preferences(user_id: int, prefs: dict) -> None:
    """Save user preferences to database."""
    db.execute(
        "UPDATE users SET preferences = ? WHERE id = ?",
        (json.dumps(prefs), user_id)
    )
```

**Added features only when requested:**
- Caching? Add when performance becomes an issue.
- Validation? Add when invalid data becomes a problem.
- Notifications? Add when other components need to react.

---

## Example 3: Surgical Editing

**Request:** "Add error handling to the parse_config function"

### Before (Drive-by Changes)
```python
# User asked to add error handling to parse_config
# But model also "cleans up" the entire file

def parse_config(path: str) -> dict:
    """Parse configuration file."""
    # Model reformatted entire docstring
    # Model changed import style
    # Model renamed variables for "clarity"
    # ... 50 lines of refactoring ...
    
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}  # The actual requested change
```

### After (Surgical)
```python
def parse_config(path: str) -> dict:
    """Parse configuration file."""
    # ... existing code completely unchanged ...
    
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid JSON in {path}: {e}")
```

---

## Example 4: Goal-Driven Refactoring

**Request:** "Refactor the auth module"

### Before (Vague)
```
"Refactor the auth module"

Model proceeds with unclear goals, changes everything.
```

### After (Criteria-Driven)
```
Refactoring goal: Extract token validation from auth module for reuse.

Success criteria:
1. Token validation logic moved to separate module
2. All existing auth tests pass without modification
3. New token module has 100% test coverage
4. API remains unchanged (backward compatible)
5. Performance is same or better

Plan:
1. Extract token functions → verify: new module passes tests
2. Update auth module to import from new module → verify: existing tests pass
3. Add comprehensive tests for token module → verify: coverage 100%
4. Benchmark before/after → verify: no performance regression
```

---

## Summary Table

| Problem | Wrong Approach | Right Approach |
|---------|---------------|----------------|
| Ambiguous requirements | Pick silently | Surface interpretations, ask |
| Simple task | Overengineer | Minimal solution |
| Editing existing code | "Improve" everything | Surgical, targeted changes |
| Complex task | Vague instructions | Verifiable success criteria |
| Unsure | Hide confusion | Stop and ask |
