# Common LLM Coding Mistakes

## 1. Hidden Assumptions

**Problem:** Models make wrong assumptions and run with them without checking.

**Example — "Add a feature to export user data":**

❌ **Wrong (assumes silently):**
```python
def export_users(format='json'):
    """Export all users to a file."""
    users = User.query.all()  # Assumes ALL users
    
    if format == 'json':
        with open('users.json', 'w') as f:  # Assumes file location
            json.dump([u.to_dict() for u in users], f)
    # ...
```

**Problems:**
- Assumed it should export ALL users (privacy implications?)
- Assumed file location without asking
- Assumed which fields to include
- Assumed CSV fieldnames without checking

✅ **Right (surface assumptions):**
```
Before implementing, I need to clarify:

1. **Scope**: Export all users or filtered subset? (privacy implications)
2. **Format**: You mentioned "export" - did you mean:
   - Download file in browser?
   - Background job with email notification?
   - API endpoint returning data?
3. **Fields**: Which user fields? (some might be sensitive)
4. **Volume**: How many users typically? (affects approach)

Simplest approach: Add an API endpoint that returns paginated JSON.
Would need more info for file-based exports.

What's your preference?
```

---

## 2. Overcomplication

**Problem:** Models really like to overcomplicate code and APIs.

**Example — "Add a function to calculate discount":**

❌ **Wrong (overengineered):**
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount: float) -> float: pass

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage: float):
        self.percentage = percentage
    def calculate(self, amount: float) -> float:
        return amount * (self.percentage / 100)

@dataclass
class DiscountConfig:
    strategy: DiscountStrategy
    min_purchase: float = 0.0
    max_discount: float = float('inf')

class DiscountCalculator:
    def __init__(self, config: DiscountConfig):
        self.config = config
    
    def apply_discount(self, amount: float) -> float:
        if amount < self.config.min_purchase:
            return 0
        discount = self.config.strategy.calculate(amount)
        return min(discount, self.config.max_discount)

# Usage requires 30+ lines of setup
```

✅ **Right (simple):**
```python
def calculate_discount(amount: float, percent: float) -> float:
    """Calculate discount amount. percent should be 0-100."""
    return amount * (percent / 100)

# Usage
discount = calculate_discount(100.0, 10.0)  # $10 off
```

**When to add complexity:** Only when you actually need multiple discount types.

---

## 3. Orthogonal Changes

**Problem:** Models change/remove code they don't understand as side effects.

**Example:**

❌ **Wrong ("improves" unrelated code):**
```python
# User asked to add logging to the auth function
def authenticate_user(username, password):
    # ... existing auth logic ...
    
    # Meanwhile, model "cleans up" this nearby code:
    user = User.query.filter_by(username=username).first()
    # Model changes this line "to be more efficient":
    user = User.query.filter(User.username == username).one_or_none()
    # ↑ Breaks existing behavior, unrelated to logging request
```

✅ **Right (surgical):**
```python
def authenticate_user(username, password):
    # ... existing auth logic unchanged ...
    
    # Only change: add the requested logging
    logger.info(f"Authentication attempt for {username}")
    result = _check_credentials(username, password)
    logger.info(f"Authentication result: {result}")
    return result
```

---

## 4. Weak Success Criteria

**Problem:** "Make it work" requires constant clarification.

**Example:**

❌ **Wrong (vague):**
```
"Fix the bug in the payment module"

Implementation happens without clear verification.
```

✅ **Right (goal-driven):**
```
"Fix the bug" transforms to:

1. Write a test that reproduces the bug (payment fails with $0.01 transactions)
2. Identify root cause (floating point comparison issue)
3. Fix the comparison logic
4. Verify test passes
5. Check no regressions in other payment amounts

Success criteria: Test passes, $0.01 transactions work, all other amounts still work.
```

---

## The Core Insight

> "LLMs are exceptionally good at looping until they meet specific goals... Don't tell it what to do, give it success criteria and watch it go." — Andrej Karpathy

Transform imperative instructions into declarative goals with verification loops.
