# UnJS Skills Generation Guide

## Dynamic Package Data

The UnJS ecosystem consists of multiple packages that are dynamically generated and maintained. Unlike traditional documentation-based skills, UnJS packages information is:

1. **Stored in YAML files**: Each package has a corresponding `.yml` file in `sources/unjs/content/packages/`
2. **Dynamically populated**: Package metadata (stars, downloads, contributors) is fetched from GitHub and npm APIs at runtime
3. **Evolving ecosystem**: New packages are added regularly through automated sync processes

## How to Generate Skills

When generating skills for UnJS:

1. **Read package definitions**: Read all `.yml` files from `sources/unjs/content/packages/` to understand available packages
2. **Fetch package data**: For each package, you may need to:
   - Check the GitHub repository for README and documentation
   - Review npm package information
   - Understand the package's purpose and API from its documentation link
3. **Generate references**: Create reference files based on:
   - Package categories (HTTP servers, utilities, build tools, etc.)
   - Common usage patterns
   - API documentation from each package's repository
4. **Update SKILL.md**: Organize references by category and provide an overview of the UnJS ecosystem

## Package Structure

Each package YAML file contains:
- `title`: Package name
- `description`: Brief description
- `github`: Repository information (owner, repo)
- `npm`: npm package name (if published)
- `documentation`: Link to documentation
- `examples`: Link to examples (if available)

## Important Notes

- Package information is not static - it changes as packages are added/removed
- Some packages may not have npm packages (internal tools)
- Documentation links may point to GitHub READMEs or dedicated documentation sites
- When updating skills, check for new packages added since the last generation

## Package Replacements

### Knitwork → Knitwork-X

**Important**: The original `knitwork` package (https://github.com/unjs/knitwork) is no longer actively maintained. It has been replaced with `knitwork-x` (https://github.com/hairyf/knitwork-x), which is actively maintained.

- **Do NOT** generate or update skills for the original `knitwork` package
- **Use** `knitwork-x` instead when referencing code generation utilities
- The skill file `features-knitwork.md` references `knitwork-x` and should be updated accordingly
- When the UnJS website lists `knitwork`, replace it with `knitwork-x` in skills generation
