# NumPy docstring style (required)

Use this style for every new or modified function/method.

## Minimum required content
1. One-line summary in imperative voice.
2. `Parameters` section (omit only if function takes no arguments).
3. `Returns` section (or `Yields` for generators).
4. `Raises` section when exceptions are part of contract.
5. `Examples` section with at least one runnable example.

## Template
```python
def transform_items(raw: str, *, strict: bool = True) -> list[str]:
    """Transform newline-delimited text into cleaned items.

    Parameters
    ----------
    raw : str
        Raw newline-delimited input.
    strict : bool, default=True
        Raise an error when no valid items are found.

    Returns
    -------
    list[str]
        Cleaned non-empty items.

    Raises
    ------
    ValueError
        If `strict=True` and no items are parsed.

    Examples
    --------
    >>> transform_items("a\\n\\n b ")
    ['a', 'b']
    """
    items = [line.strip() for line in raw.splitlines() if line.strip()]
    if strict and not items:
        raise ValueError("input produced no items")
    return items
```

## Rules for examples
- Must be copy/paste runnable.
- Must cover normal behavior (and include edge/error example when relevant).
- Keep short (1-4 lines each).

## Avoid
- Empty docstrings or placeholder `TODO` docstrings.
- Non-NumPy section headers (`Args:`, `Returns:`) unless project explicitly requires Google style.
- Examples that do not match actual return values.
