# dslop

Run a multi-agent review-readiness pass on nearly finished work, synthesize high-signal feedback, and apply only worthwhile fixes before commit.

## Run

```bash
npx @open-gitagent/gitagent run -r https://github.com/pesap/agents
```

## Load

```bash
/gitagent load dslop
/gitagent load gh:pesap/agents/dslop
```

## Structure

```text
dslop/
├── agent.yaml
├── SOUL.md
├── RULES.md
├── README.md
└── skills/
    ├── deslop-pass/
    │   └── SKILL.md
    ├── rules-doc-conformance/
    │   └── SKILL.md
    ├── type-safety-source-of-truth/
    │   └── SKILL.md
    ├── simplification-pass/
    │   └── SKILL.md
    ├── synthesis-and-apply/
    │   └── SKILL.md
    ├── python-dslop/
    │   └── SKILL.md
    └── rust-dslop/
        └── SKILL.md
```

## Skills

- **deslop-pass**: Orchestrate the full 3-vector parallel pass and apply high-value fixes
- **rules-doc-conformance**: Verify AGENTS/doc conformance and ownership boundaries
- **type-safety-source-of-truth**: Catch type drift, widening, duplicate schemas, trust-boundary mistakes
- **simplification-pass**: Remove overengineering and dead complexity
- **synthesis-and-apply**: Merge findings into one balanced plan and execute narrow fixes
- **python-dslop**: Python-specific cleanup and verification using `just`/`uv`, targeted pytest, lint, and type checks
- **rust-dslop**: Rust-specific cleanup and verification using `just` or `cargo fmt` + `cargo clippy` + targeted tests

## Links

- https://github.com/open-gitagent/gitagent
