/**
 * PostCSS Plugin Tests
 * Using Vitest with @vitest/coverage-v8
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import postcss from 'postcss';
import plugin from './src/index.js';

// Helper function to run plugin with CSS
const run = async (input, opts = {}) => {
  const result = await postcss([plugin(opts)]).process(input, {
    from: undefined
  });
  return result.css;
};

let consoleLogSpy;

beforeEach(() => {
  consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
});

describe('Basic functionality', () => {
  it('Should process CSS without options', async () => {
    const input = '.test { color: red; }';
    const output = await run(input);
    expect(output).toBe('.test { color: red; }');
  });

  it('Should preserve CSS structure', async () => {
    const input = `
      .header { margin: 0; }
      .content { padding: 20px; }
      .footer { background: #333; }
    `;
    const output = await run(input);
    expect(output).toContain('.header');
    expect(output).toContain('.content');
    expect(output).toContain('.footer');
  });
});

describe('Once()', () => {
  it('Should add comment when addComment option is true', async () => {
    const input = '.test { color: blue; }';
    const output = await run(input, { addComment: true });
    expect(output).toContain('/* Processed by postcss-starter */');
    expect(output).toContain('.test { color: blue; }');
  });

  it('Should not add comment when addComment option is false', async () => {
    const input = '.test { color: blue; }';
    const output = await run(input, { addComment: false });
    expect(output).not.toContain('/* Processed by postcss-starter */');
  });
});

describe('AtRule()', () => {
  it('Should log media queries when logMediaQueries is true', async () => {
    const input = `
      @media (max-width: 768px) {
        .mobile { display: block; }
      }
    `;
    await run(input, { logMediaQueries: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('Found @media: (max-width: 768px)');
  });

  it('Should not log media queries when logMediaQueries is false', async () => {
    const input = `
      @media (max-width: 768px) {
        .mobile { display: block; }
      }
    `;
    await run(input, { logMediaQueries: false });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('Should remove custom at-rules', async () => {
    const input = `
      @custom-rule some-params;
      .test { color: red; }
    `;
    const output = await run(input);
    expect(output).not.toContain('@custom-rule');
    expect(output).toContain('.test { color: red; }');
  });
});

describe('Rule()', () => {
  it('Should transform selectors when transformSelectors is true', async () => {
    const input = `
      .old-header { margin: 0; }
      .old-content { padding: 20px; }
      .normal-class { color: blue; }
    `;
    const output = await run(input, { transformSelectors: true });
    expect(output).toContain('.new-header');
    expect(output).toContain('.new-content');
    expect(output).toContain('.normal-class');
    expect(output).not.toContain('.old-header');
    expect(output).not.toContain('.old-content');
  });

  it('Should not transform selectors when transformSelectors is false', async () => {
    const input = '.old-header { margin: 0; }';
    const output = await run(input, { transformSelectors: false });
    expect(output).toContain('.old-header');
    expect(output).not.toContain('.new-header');
  });
});

describe('Declaration()', () => {
  it('Should transform custom properties', async () => {
    const input = `
      .test {
        --custom-color: blue;
        --custom-size: 16px;
        --normal-prop: red;
      }
    `;
    const output = await run(input);
    expect(output).toContain('--my-color: blue');
    expect(output).toContain('--my-size: 16px');
    expect(output).toContain('--normal-prop: red');
    expect(output).not.toContain('--custom-color');
    expect(output).not.toContain('--custom-size');
  });

  it('Should transform custom values when transformValues is true', async () => {
    const input = `
      .test {
        color: custom(primary);
        background: custom(secondary);
        border: 1px solid custom(accent);
      }
    `;
    const output = await run(input, { transformValues: true });

    expect(output).toContain('color: var(--primary)');
    expect(output).toContain('background: var(--secondary)');
    expect(output).toContain('border: 1px solid var(--accent)');
    expect(output).not.toContain('custom(');
  });

  it('Should not transform values when transformValues is false', async () => {
    const input = '.test { color: custom(primary); }';
    const output = await run(input, { transformValues: false });
    expect(output).toContain('custom(primary)');
    expect(output).not.toContain('var(--primary)');
  });
});

describe('Comment()', () => {
  it('Should remove TODO comments when removeComments is true', async () => {
    const input = `
      /* TODO: Fix this later */
      .test { color: red; }
      /* Regular comment */
      .other { margin: 0; }
    `;
    const output = await run(input, { removeComments: true });
    expect(output).not.toContain('TODO: Fix this later');
    expect(output).toContain('/* Regular comment */');
    expect(output).toContain('.test { color: red; }');
  });

  it('Should not remove comments when removeComments is false', async () => {
    const input = `
      /* TODO: Fix this later */
      .test { color: red; }
    `;
    const output = await run(input, { removeComments: false });
    expect(output).toContain('TODO: Fix this later');
  });
});

describe('OnceExit()', () => {
  it('Should add final comment when addFinalComment is true', async () => {
    const input = '.test { color: red; }';
    const output = await run(input, { addFinalComment: true });
    expect(output).toContain('/* Processed successfully */');
    expect(output).toContain('.test { color: red; }');
  });

  it('Should not add final comment when addFinalComment is false', async () => {
    const input = '.test { color: red; }';
    const output = await run(input, { addFinalComment: false });
    expect(output).not.toContain('/* Processed successfully */');
  });
});

describe('Complex scenarios', () => {
  it('Should handle empty CSS', async () => {
    const input = '';
    const output = await run(input);
    expect(output).toBe('');
  });

  it('Should handle CSS with only comments', async () => {
    const input = '/* Just a comment */';
    const output = await run(input);
    expect(output).toBe('/* Just a comment */');
  });
});

describe('Plugin metadata', () => {
  it('Should display correct plugin name', () => {
    const pluginInstance = plugin();
    expect(pluginInstance.postcssPlugin).toBe('postcss-starter');
  });

  it('Should export postcss flag', async () => {
    const { postcss } = await import('./src/index.js');
    expect(postcss).toBe(true);
  });
});

describe('Error handling', () => {
  it('Should handle undefined options', async () => {
    const input = '.test { color: red; }';
    const pluginInstance = plugin();
    const result = await postcss([pluginInstance]).process(input, {
      from: undefined
    });
    expect(result.css).toContain('.test { color: red; }');
  });

  it('Should handle null options', async () => {
    const input = '.test { color: red; }';
    const pluginInstance = plugin(null);
    const result = await postcss([pluginInstance]).process(input, {
      from: undefined
    });
    expect(result.css).toContain('.test { color: red; }');
  });
});
