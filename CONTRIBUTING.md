# Contributing to Quran Lights

Thank you for your interest in contributing to Quran Lights!

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive.

---

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### Suggesting Features

1. Check existing issues and PRs
2. Create an issue with:
   - Clear feature description
   - Use cases
   - Any mockups or examples
   - Why this would be valuable

### Pull Requests

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/quran_lights_web.git

# Add upstream
git remote add upstream https://github.com/Amr1977/quran_lights_web.git

# Create a feature branch
git checkout -b feature/my-feature
```

### Running Locally

```bash
# Install dependencies (if any)
npm install

# Run Firebase local server
firebase serve
```

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Tests |
| `chore` | Maintenance |

Examples:
```
feat: add streak heatmap
fix: resolve toast not dismissing
docs: update README
```

---

## Style Guide

- Use **ES6+** JavaScript features
- Follow existing code patterns in the project
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names

---

## Review Process

1. All submissions require review
2. Address feedback promptly
3. Keep PRs focused and atomic
4. Update documentation if needed

---

## Questions?

- Open an issue for questions
- Email: amr@example.com

Thank you for contributing! 🎉
