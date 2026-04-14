---
name: pytest-plugins
description: Organize fixtures as local pytest plugins using pytest_plugins for clean discovery, zero sys.path hacks, and proper multi-package test isolation
license: MIT
allowed-tools: Read Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: testing
---
# Pytest Plugins for Fixture Organization

## When to Use
When fixture modules need explicit loading (especially with `--import-mode=importlib`), when a monorepo or workspace has multiple packages with shared fixture patterns, or when `conftest.py` files are bloated with `sys.path` hacks and star imports to discover fixture modules.

## Instructions
1. Confirm the task matches this skill and identify the concrete files, outputs, or decisions it should guide.
2. Apply the domain-specific guidance and checklists below, favoring the simplest sound approach.
3. Return concrete findings or edits with rationale, and include file references when applicable.

## The Pattern

Instead of star-importing fixtures or hacking `sys.path`, declare fixture modules as **local pytest plugins** via the `pytest_plugins` variable in the root `conftest.py`.

### How It Works

pytest discovers plugins in this order:
1. Builtin plugins
2. External plugins (installed packages with `pytest11` entry points)
3. `conftest.py` files (auto-discovered per directory)

The `pytest_plugins` variable in a conftest triggers explicit loading of named modules as plugins. Those modules can contain `@pytest.fixture` functions, hooks (`pytest_runtest_setup`, etc.), or both.

### Structure

```
project/
├── pyproject.toml
├── conftest.py                          # Root: declares pytest_plugins
├── tests/
│   ├── conftest.py                      # Test-level hooks if needed
│   ├── fixtures/
│   │   ├── __init__.py                  # Required for importability
│   │   ├── db_fixtures.py              # @pytest.fixture functions
│   │   ├── api_fixtures.py             # @pytest.fixture functions
│   │   └── profiles.py                 # Data constants (no fixtures)
│   ├── test_feature_a.py
│   └── test_feature_b.py
```

Root `conftest.py`:
```python
pytest_plugins = [
    "tests.fixtures.db_fixtures",
    "tests.fixtures.api_fixtures",
]
```

That's it. No `sys.path` manipulation, no star imports, no `from fixtures.xxx import *`.

### Rules

1. **`pytest_plugins` must be in the root conftest.py** (or a top-level conftest). Declaring it in non-root conftest files is deprecated and raises warnings.

2. **Fixture modules must be importable as Python packages.** This means every directory in the path needs `__init__.py`. With `--import-mode=importlib`, the fixture *package* needs `__init__.py` but the test directories themselves should NOT have it (to avoid conftest collision across packages).

3. **Use dotted module paths**, not file paths:
   ```python
   # Good
   pytest_plugins = ["tests.fixtures.db_fixtures"]

   # Bad
   pytest_plugins = ["tests/fixtures/db_fixtures.py"]
   ```

4. **Fixture modules are just regular Python files** with `@pytest.fixture` functions. They don't need any special registration, imports, or decorators beyond the standard pytest ones.

5. **Hook functions work too.** A plugin module can define `pytest_runtest_setup`, `pytest_collection_modifyitems`, etc., alongside fixtures.

6. **Data-only modules don't need to be plugins.** Constants, profiles, and helper functions that aren't fixtures can stay as regular Python modules imported normally by the fixture modules or tests.

## Monorepo / Multi-Package Pattern

For workspaces with multiple packages that each have their own fixtures:

```
workspace/
├── pyproject.toml
├── conftest.py                          # Root: hooks + per-package plugin loading
├── packages/
│   ├── pkg-alpha/
│   │   ├── tests/
│   │   │   ├── conftest.py              # Package-specific hooks (autouse resets, etc.)
│   │   │   ├── fixtures/
│   │   │   │   ├── __init__.py
│   │   │   │   └── alpha_fixtures.py
│   │   │   └── test_alpha.py
│   ├── pkg-beta/
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   ├── fixtures/
│   │   │   │   ├── __init__.py
│   │   │   │   └── beta_fixtures.py
│   │   │   └── test_beta.py
```

Root `conftest.py`:
```python
# Load fixture plugins for each package.
# pytest_plugins must use dotted import paths.
pytest_plugins = [
    "packages.pkg-alpha.tests.fixtures.alpha_fixtures",
    "packages.pkg-beta.tests.fixtures.beta_fixtures",
]
```

If dotted paths don't resolve (common with `--import-mode=importlib` and hyphens in directory names), add the test directories to `pythonpath` in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
pythonpath = ["packages/pkg-alpha/tests", "packages/pkg-beta/tests"]
```

Then use shorter paths:
```python
pytest_plugins = [
    "fixtures.alpha_fixtures",
    "fixtures.beta_fixtures",
]
```

**Watch out for name collisions:** If two packages both have `fixtures/context.py`, pytest will only load one. Prefix fixture module names with the package name to avoid this.

### Per-Package conftest.py

Keep per-package conftest files lightweight. They handle:
- `autouse` fixtures for resetting package-specific global state
- Package-scoped hooks (e.g., `pytest_runtest_setup` for registry cleanup)
- Fixtures that are truly local to that package

Do NOT put `pytest_plugins` in non-root conftest files (deprecated).

## Anti-Patterns This Replaces

| Anti-Pattern | Plugin Alternative |
|---|---|
| `sys.path.insert(0, str(SRC_DIR))` in conftest | Packages installed via `uv sync`, no path hacking needed |
| `from fixtures.xxx import *  # noqa: F403, E402` | `pytest_plugins = ["fixtures.xxx"]` |
| `sys.path.insert(0, TEST_DIR)` before star imports | `pythonpath` in pyproject.toml + `pytest_plugins` |
| Massive root conftest with 200+ lines of fixtures | Split into focused fixture modules, load as plugins |
| Fixtures duplicated across package conftest files | Shared fixture plugin loaded from root conftest |

## Assertion Rewriting

Modules loaded via `pytest_plugins` get assertion rewriting automatically. If you have helper modules with assertions that are imported by fixture plugins (not listed in `pytest_plugins` themselves), register them explicitly:

```python
# In __init__.py of the fixtures package
import pytest
pytest.register_assert_rewrite("tests.fixtures.helpers")
```

## Testing Your Plugins

For complex fixture plugins, use `pytester` to verify they work:

```python
pytest_plugins = ["pytester"]

def test_my_fixture_plugin(pytester):
    pytester.makeconftest('pytest_plugins = ["my_fixtures"]')
    pytester.makepyfile("def test_it(my_fixture): assert my_fixture is not None")
    result = pytester.runpytest()
    result.assert_outcomes(passed=1)
```
