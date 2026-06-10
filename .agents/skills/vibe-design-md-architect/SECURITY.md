# Security Policy

## Reporting a vulnerability

If you find a security vulnerability in this tool, please **do not** open a public GitHub issue.

Instead, report it by emailing the maintainer directly or by using GitHub's private vulnerability reporting:

→ https://github.com/imMamdouhaboammar/vibe-design-md-architect/security/advisories/new

Include:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact

You will receive a response within 72 hours.

## Scope

This tool is a Node.js CLI and Claude skill. It reads local filesystem files and runs static analysis on source code. It does not make network requests, store data remotely, or handle user credentials.

**In scope:**
- Malicious input in `DESIGN.md` or `PRODUCT.md` that could cause unexpected behavior in scanner scripts
- Path traversal vulnerabilities in CLI arguments
- Vulnerabilities in how the tool handles `src/` directory scanning

**Out of scope:**
- Vulnerabilities in optional dependencies (Playwright) — report those to Playwright's team
- Social engineering attacks against users of this tool

## Supported versions

Only the current `main` branch is actively maintained. Security fixes are applied to the latest version only.

| Version | Supported |
|---------|-----------|
| 1.7.x   | ✅ Yes |
| < 1.7   | ❌ No |
