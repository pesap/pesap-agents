# Markdown Style Guide for READMEs

## Document Structure

### Standard README Sections (in order)
1. **Hero** - Title + one-line description
2. **Badges** - Build status, version, license
3. **Installation** - Quick install command
4. **Quickstart** - Minimal working example
5. **Features** - Bullet list of key capabilities
6. **API/Usage** - Common use cases
7. **Contributing** - Link to CONTRIBUTING.md
8. **License** - License type and link

### Section Length Guidelines
- Hero: 1 line
- Description: 2-3 sentences
- Installation: 1-3 commands
- Quickstart: 5-15 lines of code
- Features: 3-7 bullets

## Writing Style

### Active Voice
- Good: "The library validates your data"
- Bad: "Data is validated by the library"

### Present Tense
- Good: "This tool compiles your code"
- Bad: "This tool will compile your code"

### Second Person
- Good: "You can configure the output"
- Bad: "Users can configure the output"

## Code Blocks

### Language Hints
```markdown
```python
# Python code here
```

```bash
# Shell commands
```

```javascript
// JavaScript code
```
```

### Copy-Paste Friendly
- Include the `$` only when showing output vs command distinction
- Show full file paths when relevant
- Include expected output when helpful

## Tables

Use for:
- Configuration options
- API methods
- Compatibility matrices
- Comparison data

```markdown
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| host | string | localhost | Server hostname |
| port | number | 8080 | Server port |
```

## Lists

### When to Use Which
- **Bullet list** (unordered): Features, benefits, any order is fine
- **Numbered list** (ordered): Steps, sequences, priorities
- **Task list** (`- [ ]`): Roadmap, todo items, checklists

## Links

### Internal Links
```markdown
[Configuration](#configuration)
```

### External Links
```markdown
[See LICENSE](./LICENSE)
[Read the docs](https://docs.example.com)
```

### Reference Style (for many links)
```markdown
Check out [our website][1] or [documentation][2].

[1]: https://example.com
[2]: https://docs.example.com
```

## Common Mistakes
- Walls of text (>100 chars per line)
- Missing installation instructions
- No working code examples
- Broken internal links
- Inconsistent heading levels
