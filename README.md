<div align="center">

![PostCSS Plugin Starter](https://raw.githubusercontent.com/maizzle/postcss-starter/HEAD/.github/cover.jpg)

</div>

# PostCSS Plugin Starter

A starter project for PostCSS plugins.

## Features

- 🎯 **PostCSS 8+ compatible** - Uses the latest plugin API
- 🧪 **Complete test suite** - Vitest with coverage reporting
- 🔧 **Development tooling** - Biome for linting and formatting
- 📚 **Well-documented** - Comprehensive examples and comments
- ✅ **Complete hooks reference** - Includes all hooks PostCSS exposes
- 🚀 **Production ready** - Includes CI/CD scripts and `package.json` boilerplate

## Quick Start

1. Clone or fork this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Start development with watch mode:
   ```bash
   npm run dev
   ```
5. Start developing your plugin in `src/index.js`

## Plugin Structure

This boilerplate demonstrates all major PostCSS plugin hooks:

### Example Hooks

| Hook          | Purpose                                     | Example Use Case                      |
|---------------|---------------------------------------------|---------------------------------------|
| `Once`        | Runs once per CSS file                      | Add header comments, global setup     |
| `Root`        | Process entire CSS AST                      | Global transformations                |
| `AtRule`      | Handle at-rules (`@media`, `@import`, etc.) | Transform or remove specific at-rules |
| `Rule`        | Process CSS rules (selectors)               | Transform selectors                   |
| `Declaration` | Handle CSS properties and values            | Transform properties or values        |
| `Comment`     | Process CSS comments                        | Remove or transform comments          |
| `OnceExit`    | Final processing                            | Add footer comments, cleanup          |

## Configuration Options

The starter includes several example options:

```javascript
import postcss from 'postcss';
import plugin from 'postcss-starter';

postcss({
  plugins: [
    plugin({
      addComment: true,           // Add header comment
      addFinalComment: true,      // Add footer comment
      transformSelectors: true,   // Transform .old- to .new-
      transformValues: true,      // Transform custom() to var()
      removeComments: true,       // Remove TODO comments
      logMediaQueries: true       // Log @media queries to console
    })
  ]
}).process(css, { from: 'input.css', to: 'output.css' })
  .then(result => {
    console.log(result.css);
  });
```

## Example Transformations

### Input CSS
```css
/* TODO: Fix this later */
@media (max-width: 768px) {
  .old-header {
    --custom-color: blue;
    background: custom(primary);
  }
}
```

### Output CSS (with all options enabled)
```css
/* Processed by postcss-starter */
@media (max-width: 768px) {
  .new-header {
    --my-color: blue;
    background: var(--primary);
  }
}
/* Processed successfully */
```

## Development

### Available Scripts

#### Development

Run tests in watch mode with Vitest:

```bash
npm run dev
```

#### Testing

Run tests with coverage and linting:

```bash
npm test
```

#### Linting

Run Biome for linting and formatting:

```bash
npm run lint
```

#### Release

Release new version using `np`:

```bash
npm run release
```

## Customization

### Renaming Your Plugin

1. Update the plugin name in `src/index.js`:
   ```javascript
   const PLUGIN_NAME = 'postcss-your-plugin-name';
   ```

2. Update `package.json`:
   ```json
   {
     "name": "postcss-your-plugin-name",
     "description": "Your plugin description"
   }
   ```

3. Update test descriptions in `test/index.test.js`

### Adding New Transformations

1. **Add new hook or extend existing ones** in `src/index.js`
2. **Add corresponding tests** in `test/index.test.js`
3. **Update README** with new options and examples
4. **Run tests** to ensure everything works (`npm test`)

### Example: Adding a new declaration transformation

```javascript
Declaration(decl) {
  // Your existing transformations...

  // New transformation
  if (opts.transformUnits && decl.value.includes('px')) {
    decl.value = decl.value.replace(/(\d+)px/g, (match, num) => {
      return `${num / 16}rem`;
    });
  }
}
```

## Publishing

### Before Publishing

1. **Update package.json**: version, description, keywords
2. **Run tests**: `npm test` (includes linting and coverage)
3. **Update README**: with actual plugin functionality
4. **Test in real project**: Create a test PostCSS setup

### Publishing Steps

The `npm run release` script uses [np](https://github.com/sindresorhus/np) for automated, interactive releases with proper versioning, changelog generation, and npm publishing.

## PostCSS Plugin Resources

- [PostCSS Plugin Guidelines](https://github.com/postcss/postcss/blob/main/docs/writing-a-plugin.md)
- [PostCSS API Documentation](https://postcss.org/api/)
- [PostCSS Plugin Boilerplate](https://github.com/postcss/postcss-plugin-boilerplate)
