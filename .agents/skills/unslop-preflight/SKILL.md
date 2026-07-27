```markdown
# unslop-preflight Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `unslop-preflight` TypeScript codebase. It covers file organization, import/export styles, commit message conventions, and testing patterns. By following these guidelines, contributors can maintain consistency and quality across the project.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - Example:  
    ```
    my-component.ts
    utils-helper.test.ts
    ```

### Import Style
- Use **relative imports** for referencing other files.
  - Example:
    ```typescript
    import { myHelper } from './utils-helper';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```typescript
    // utils-helper.ts
    export function myHelper() { ... }
    ```

### Commit Messages
- Follow **conventional commit** format.
- Use prefixes such as `docs`.
- Keep commit messages concise (average 36 characters).
  - Example:
    ```
    docs: update README with usage instructions
    ```

## Workflows

### Conventional Commit Workflow
**Trigger:** When making any commit  
**Command:** `/conventional-commit`

1. Write your commit message using the `<type>: <description>` format.
2. Use the appropriate prefix (e.g., `docs`, `feat`, `fix`).
3. Keep the message concise and descriptive.

### File Creation Workflow
**Trigger:** When adding new files  
**Command:** `/create-file`

1. Name the file using kebab-case.
2. Place the file in the appropriate directory.
3. Use named exports for any exported members.

### Import/Export Workflow
**Trigger:** When importing or exporting modules  
**Command:** `/import-export`

1. Use relative paths for imports.
2. Always use named exports and imports.
3. Avoid default exports.

## Testing Patterns

- Test files use the `*.test.*` naming pattern.
  - Example: `my-component.test.ts`
- The specific testing framework is not detected, but tests should be colocated with the code they test or in a dedicated test directory.
- Example test file:
  ```typescript
  // my-component.test.ts
  import { myComponent } from './my-component';

  describe('myComponent', () => {
    it('should behave as expected', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command                | Purpose                                      |
|------------------------|----------------------------------------------|
| /conventional-commit   | Guide for writing conventional commit messages|
| /create-file           | Steps for creating new files with conventions|
| /import-export         | Guide for importing and exporting modules    |
```
