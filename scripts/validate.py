#!/usr/bin/env python3
"""Validate all agents and skills in the repository."""

import json
import re
import sys
import yaml
from pathlib import Path
from typing import List, Tuple

# Get repo root
REPO_ROOT = Path(__file__).parent.parent.resolve()
SCHEMAS_DIR = REPO_ROOT / "schemas"
AGENTS_DIR = REPO_ROOT


def load_schema(name: str) -> dict:
    """Load a JSON schema."""
    schema_path = SCHEMAS_DIR / name
    if not schema_path.exists():
        return {}
    with open(schema_path) as f:
        return json.load(f)


def validate_yaml_file(path: Path) -> Tuple[bool, List[str]]:
    """Validate that a file is valid YAML."""
    errors = []
    try:
        with open(path) as f:
            yaml.safe_load(f)
        return True, errors
    except yaml.YAMLError as e:
        errors.append(f"Invalid YAML: {e}")
        return False, errors


def validate_agent_yaml(path: Path, schema: dict) -> Tuple[bool, List[str]]:
    """Validate an agent.yaml file against the schema."""
    errors = []
    agent_dir = path.parent
    agent_name = agent_dir.name

    # Load and parse YAML
    try:
        with open(path) as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        errors.append(f"Invalid YAML: {e}")
        return False, errors

    if data is None:
        errors.append("Empty YAML file")
        return False, errors

    # Check required fields
    required = schema.get("required", [])
    for field in required:
        if field not in data:
            errors.append(f"Missing required field: {field}")

    # Check name matches directory
    if "name" in data and data["name"] != agent_name:
        errors.append(f"Name mismatch: agent.yaml says '{data['name']}' but directory is '{agent_name}'")

    # Check version format (semantic versioning)
    if "version" in data:
        version_pattern = r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$"
        if not re.match(version_pattern, str(data["version"])):
            errors.append(f"Invalid semantic version: {data['version']}")

    # Check model constraints
    if "model" in data and "constraints" in data["model"]:
        constraints = data["model"]["constraints"]
        if "temperature" in constraints:
            temp = constraints["temperature"]
            if not 0 <= temp <= 2:
                errors.append(f"Invalid temperature: {temp} (must be 0-2)")
        if "max_tokens" in constraints:
            tokens = constraints["max_tokens"]
            if tokens < 1:
                errors.append(f"Invalid max_tokens: {tokens}")

    # Validate referenced skills exist
    if "skills" in data:
        skills_dir = agent_dir / "skills"
        for skill in data["skills"]:
            skill_path = skills_dir / skill / "SKILL.md"
            if not skill_path.exists():
                errors.append(f"Referenced skill not found: skills/{skill}/SKILL.md")

    # Check required files exist
    required_files = ["SOUL.md", "RULES.md", "README.md"]
    for req_file in required_files:
        if not (agent_dir / req_file).exists():
            errors.append(f"Missing required file: {req_file}")

    # Validate spec_version is standard
    if "spec_version" in data:
        valid_versions = ["0.1.0", "1.0"]
        if data["spec_version"] not in valid_versions:
            errors.append(f"Non-standard spec_version: {data['spec_version']} (use 0.1.0 or 1.0)")

    return len(errors) == 0, errors


def validate_skill_md(path: Path) -> Tuple[bool, List[str]]:
    """Validate a SKILL.md file."""
    errors = []

    try:
        with open(path) as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Cannot read file: {e}")
        return False, errors

    # Check for YAML frontmatter
    frontmatter_pattern = r"^---\n(.*?)\n---"
    match = re.match(frontmatter_pattern, content, re.DOTALL)

    if not match:
        errors.append("Missing YAML frontmatter (---)")
        return False, errors

    # Parse frontmatter
    try:
        frontmatter = yaml.safe_load(match.group(1))
    except yaml.YAMLError as e:
        errors.append(f"Invalid YAML frontmatter: {e}")
        return False, errors

    if frontmatter is None:
        errors.append("Empty frontmatter")
        return False, errors

    # Check required fields
    if "name" not in frontmatter:
        errors.append("Missing 'name' in frontmatter")
    elif not re.match(r"^[a-z0-9-]+$", frontmatter["name"]):
        errors.append(f"Invalid skill name: {frontmatter['name']}")

    if "description" not in frontmatter:
        errors.append("Missing 'description' in frontmatter")

    # Check content has instructions
    body = content[match.end():].strip()
    if len(body) < 100:
        errors.append("Skill body is too short (< 100 chars)")

    required_sections = ["## When to Use", "## Instructions"]
    for section in required_sections:
        if section not in body:
            errors.append(f"Missing section: {section}")

    return len(errors) == 0, errors


def find_agents() -> List[Path]:
    """Find all agent directories."""
    agents = []
    for item in AGENTS_DIR.iterdir():
        if item.is_dir() and item.name not in [".git", "schemas", "scripts", "tests", "extensions"]:
            agent_yaml = item / "agent.yaml"
            if agent_yaml.exists():
                agents.append(item)
    return sorted(agents)


def main() -> int:
    """Run validation on all agents and skills."""
    print("🔍 Validating agents repository...\n")

    agent_schema = load_schema("agent-schema.json")
    skill_schema = load_schema("skill-schema.json")

    agents = find_agents()
    total_errors = 0
    total_warnings = 0

    # Validate agents
    print(f"📦 Found {len(agents)} agents")
    for agent_dir in agents:
        agent_name = agent_dir.name
        agent_yaml = agent_dir / "agent.yaml"

        print(f"\n  Checking {agent_name}...")
        valid, errors = validate_agent_yaml(agent_yaml, agent_schema)

        if valid:
            print(f"    ✅ agent.yaml valid")
        else:
            for error in errors:
                print(f"    ❌ {error}")
                total_errors += 1

        # Validate skills
        skills_dir = agent_dir / "skills"
        if skills_dir.exists():
            skill_dirs = [d for d in skills_dir.iterdir() if d.is_dir()]
            for skill_dir in skill_dirs:
                skill_file = skill_dir / "SKILL.md"
                if skill_file.exists():
                    valid, errors = validate_skill_md(skill_file)
                    if valid:
                        print(f"    ✅ skill/{skill_dir.name} valid")
                    else:
                        for error in errors:
                            print(f"    ❌ skill/{skill_dir.name}: {error}")
                            total_errors += 1
                else:
                    print(f"    ⚠️  skill/{skill_dir.name}: Missing SKILL.md")
                    total_warnings += 1

    print(f"\n{'='*50}")
    if total_errors == 0:
        print(f"✅ All validations passed! ({total_warnings} warnings)")
        return 0
    else:
        print(f"❌ Found {total_errors} errors, {total_warnings} warnings")
        return 1


if __name__ == "__main__":
    sys.exit(main())
