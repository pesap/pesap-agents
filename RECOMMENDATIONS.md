# GitAgent Recommendations

## Task: code review and optimization

Recommended agents:
1. code-reviewer (read-only)
   An AI code reviewer that analyzes pull requests and code changes for bugs, security issues, performance problems, and style improvements
   Why: name matches 'code', name matches 'review', safe read-oriented profile
2. performance-freak (semi-auto)
   A performance-obsessed agent that optimizes code for speed and memory efficiency — favors smart algorithms, low allocations, and cache-friendly patterns
   Why: skill matches 'code', description matches 'review', tag matches 'optimization'
3. reviewer-2 (semi-auto)
   The infamous Reviewer 2 - perpetually dissatisfied, ruthlessly critical, and impossibly demanding. Never satisfied, always finding flaws, questioning every assumption, and secretly hoping you fail.
   Why: tag matches 'code', name matches 'review'
4. dslop (semi-auto)
   Run a multi-agent review-readiness pass on nearly finished work, synthesize only high-signal feedback, and apply worthwhile fixes before commit.
   Why: tag matches 'code', tag matches 'review'
5. simplify (semi-auto)
   Reviews changed code for reuse, quality, and efficiency — then fixes issues found
   Why: tag matches 'code', tag matches 'review'

---

## Task: refactoring and simplifying complex code

Recommended agents:
1. performance-freak (semi-auto)
   A performance-obsessed agent that optimizes code for speed and memory efficiency — favors smart algorithms, low allocations, and cache-friendly patterns
   Why: skill matches 'complex', skill matches 'code'
2. simplify (semi-auto)
   Reviews changed code for reuse, quality, and efficiency — then fixes issues found
   Why: tag matches 'refactoring', tag matches 'code'
3. surgical-dev (semi-auto)
   A disciplined coding agent that follows Andrej Karpathy's principles — avoids overcomplication, makes surgical changes, surfaces assumptions, and defines verifiable success criteria
   Why: skill matches 'refactoring', tag matches 'code'
4. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: description matches 'refactoring', skill matches 'code'
5. code-reviewer (read-only)
   An AI code reviewer that analyzes pull requests and code changes for bugs, security issues, performance problems, and style improvements
   Why: name matches 'code'

---

## Task: performance optimization and benchmarking

Recommended agents:
1. performance-freak (semi-auto)
   A performance-obsessed agent that optimizes code for speed and memory efficiency — favors smart algorithms, low allocations, and cache-friendly patterns
   Why: name matches 'performance', tag matches 'optimization'
2. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: skill matches 'performance', skill matches 'benchmarking'
3. optimization-modeler (semi-auto)
   Expert mathematical optimization modeler that simplifies formulations, linearizes without sacrificing resolution, decomposes into testable subproblems, and applies modern reduction techniques
   Why: name matches 'optimization'
4. code-reviewer (read-only)
   An AI code reviewer that analyzes pull requests and code changes for bugs, security issues, performance problems, and style improvements
   Why: skill matches 'performance'
5. github-ci-optimizer (semi-auto)
   Optimizes GitHub Actions CI pipelines for speed, resource efficiency, smart caching, and minimal artifact bloat
   Why: tag matches 'optimization'

---

## Task: writing documentation and README

Recommended agents:
1. readme-maestro (supervised)
   A documentation specialist that crafts compelling, beautiful, and technically precise README files for software projects and turns chaotic notes into docs developers actually want to use.
   Why: tag matches 'writing', tag matches 'documentation', name matches 'readme'
2. surgical-dev (semi-auto)
   A disciplined coding agent that follows Andrej Karpathy's principles — avoids overcomplication, makes surgical changes, surfaces assumptions, and defines verifiable success criteria
   Why: skill matches 'writing'
3. cli-ux-guru (supervised)
   An agent specialized in CLI user experience design - creates intuitive, human-friendly command-line interfaces with clear output, helpful error messages, and accessible interactions for both humans and AI
   Why: description matches 'writing'
4. performance-freak (semi-auto)
   A performance-obsessed agent that optimizes code for speed and memory efficiency — favors smart algorithms, low allocations, and cache-friendly patterns
   Why: description matches 'writing'
5. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: description matches 'writing'

---

## Task: CI/CD and GitHub Actions optimization

Recommended agents:
1. github-ci-optimizer (semi-auto)
   Optimizes GitHub Actions CI pipelines for speed, resource efficiency, smart caching, and minimal artifact bloat
   Why: name matches 'ci', tag matches 'cd', name matches 'github'
2. optimization-modeler (semi-auto)
   Expert mathematical optimization modeler that simplifies formulations, linearizes without sacrificing resolution, decomposes into testable subproblems, and applies modern reduction techniques
   Why: description matches 'ci', name matches 'optimization'
3. performance-freak (semi-auto)
   A performance-obsessed agent that optimizes code for speed and memory efficiency — favors smart algorithms, low allocations, and cache-friendly patterns
   Why: skill matches 'ci', tag matches 'optimization'
4. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: skill matches 'ci', skill matches 'github'
5. readme-maestro (supervised)
   A documentation specialist that crafts compelling, beautiful, and technically precise README files for software projects and turns chaotic notes into docs developers actually want to use.
   Why: skill matches 'ci', skill matches 'github'

---

## Task: data modeling and architecture

Recommended agents:
1. data-modeler (semi-auto)
   Expert data modeler that follows Pydantic best practices, leverages infrasys for infrastructure systems modeling, and performs exhaustive data validation
   Why: name matches 'data', tag matches 'modeling'
2. infrasys-god (semi-auto)
   The ultimate infrasys expert. Eats Pydantic classes for breakfast and attaches time series at night. Knows every System method, every storage backend, every migration path, and every serialization quirk by heart.
   Why: skill matches 'data', skill matches 'modeling'
3. github-ci-optimizer (semi-auto)
   Optimizes GitHub Actions CI pipelines for speed, resource efficiency, smart caching, and minimal artifact bloat
   Why: skill matches 'data'
4. performance-freak (semi-auto)
   A performance-obsessed agent that optimizes code for speed and memory efficiency — favors smart algorithms, low allocations, and cache-friendly patterns
   Why: skill matches 'data'
5. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: skill matches 'data'

---

## Task: test writing and pytest

Recommended agents:
1. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: name matches 'test', description matches 'writing', name matches 'pytest'
2. dslop (semi-auto)
   Run a multi-agent review-readiness pass on nearly finished work, synthesize only high-signal feedback, and apply worthwhile fixes before commit.
   Why: skill matches 'test', skill matches 'pytest'
3. optimization-modeler (semi-auto)
   Expert mathematical optimization modeler that simplifies formulations, linearizes without sacrificing resolution, decomposes into testable subproblems, and applies modern reduction techniques
   Why: skill matches 'test'
4. readme-maestro (supervised)
   A documentation specialist that crafts compelling, beautiful, and technically precise README files for software projects and turns chaotic notes into docs developers actually want to use.
   Why: tag matches 'writing'
5. surgical-dev (semi-auto)
   A disciplined coding agent that follows Andrej Karpathy's principles — avoids overcomplication, makes surgical changes, surfaces assumptions, and defines verifiable success criteria
   Why: skill matches 'writing'

---

## Task: CLI user experience design

Recommended agents:
1. cli-ux-guru (supervised)
   An agent specialized in CLI user experience design - creates intuitive, human-friendly command-line interfaces with clear output, helpful error messages, and accessible interactions for both humans and AI
   Why: name matches 'cli', skill matches 'user', tag matches 'experience'
2. dslop (semi-auto)
   Run a multi-agent review-readiness pass on nearly finished work, synthesize only high-signal feedback, and apply worthwhile fixes before commit.
   Why: skill matches 'cli', skill matches 'design'
3. data-modeler (semi-auto)
   Expert data modeler that follows Pydantic best practices, leverages infrasys for infrastructure systems modeling, and performs exhaustive data validation
   Why: description matches 'user', skill matches 'design'
4. infrasys-god (semi-auto)
   The ultimate infrasys expert. Eats Pydantic classes for breakfast and attaches time series at night. Knows every System method, every storage backend, every migration path, and every serialization quirk by heart.
   Why: description matches 'user', skill matches 'design'
5. pytest-whisperer (semi-auto)
   A pytest specialist that writes, organizes, and optimizes Python test suites. Prefers plain functions over classes, fixtures over setup methods, and the testing pyramid over chaos.
   Why: description matches 'cli', skill matches 'design'

---

## Task: academic paper review

Recommended agents:
1. code-reviewer (read-only)
   An AI code reviewer that analyzes pull requests and code changes for bugs, security issues, performance problems, and style improvements
   Why: name matches 'review', safe read-oriented profile
2. reviewer-2 (semi-auto)
   The infamous Reviewer 2 - perpetually dissatisfied, ruthlessly critical, and impossibly demanding. Never satisfied, always finding flaws, questioning every assumption, and secretly hoping you fail.
   Why: name matches 'review'
3. cli-ux-guru (supervised)
   An agent specialized in CLI user experience design - creates intuitive, human-friendly command-line interfaces with clear output, helpful error messages, and accessible interactions for both humans and AI
   Why: description matches 'review', safe read-oriented profile
4. dslop (semi-auto)
   Run a multi-agent review-readiness pass on nearly finished work, synthesize only high-signal feedback, and apply worthwhile fixes before commit.
   Why: tag matches 'review'
5. simplify (semi-auto)
   Reviews changed code for reuse, quality, and efficiency — then fixes issues found
   Why: tag matches 'review'

---

## Task: infrastructure and systems design

Recommended agents:
1. data-modeler (semi-auto)
   Expert data modeler that follows Pydantic best practices, leverages infrasys for infrastructure systems modeling, and performs exhaustive data validation
   Why: skill matches 'infrastructure', skill matches 'systems', skill matches 'design'
2. infrasys-god (semi-auto)
   The ultimate infrasys expert. Eats Pydantic classes for breakfast and attaches time series at night. Knows every System method, every storage backend, every migration path, and every serialization quirk by heart.
   Why: tag matches 'systems', skill matches 'design'
3. cli-ux-guru (supervised)
   An agent specialized in CLI user experience design - creates intuitive, human-friendly command-line interfaces with clear output, helpful error messages, and accessible interactions for both humans and AI
   Why: description matches 'systems', tag matches 'design'
4. dslop (semi-auto)
   Run a multi-agent review-readiness pass on nearly finished work, synthesize only high-signal feedback, and apply worthwhile fixes before commit.
   Why: skill matches 'design'
5. github-ci-optimizer (semi-auto)
   Optimizes GitHub Actions CI pipelines for speed, resource efficiency, smart caching, and minimal artifact bloat
   Why: skill matches 'design'
