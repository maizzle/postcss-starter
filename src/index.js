/**
 * PostCSS Plugin Starter
 */

// Plugin name - should match your package.json name
const PLUGIN_NAME = 'postcss-starter';

/**
 * Main plugin function
 * @param {Object} opts - Plugin options
 * @returns {Object} PostCSS plugin object
 */
export default (opts = {}) => {

  opts = opts || {};

  return {
    postcssPlugin: PLUGIN_NAME,

    // Plugin metadata
    Once(root) {
      // Runs once per CSS file
      // Use this for global transformations or setup

      // Example: Add a comment at the beginning
      if (opts.addComment) {
        root.prepend(`/* Processed by ${PLUGIN_NAME} */`);
      }
    },

    Root(_root) {
      // Runs once per CSS file, after Once
      // Use this for transformations that need the complete AST
    },

    AtRule: {
      // Handle specific at-rules
      media(atRule) {
        // Handle @media rules
        // Example: Log media queries
        if (opts.logMediaQueries) {
          console.log(`Found @media: ${atRule.params}`);
        }
      },

      // Handle custom at-rules
      'custom-rule'(atRule) {
        // Handle @custom-rule
        // Example: Replace with standard CSS
        atRule.remove();
      }
    },

    Rule(rule) {
      // Handle CSS rules (selectors)
      // Example: Transform selectors
      if (opts.transformSelectors) {
        rule.selector = rule.selector.replace(/\.old-/g, '.new-');
      }
    },

    Declaration(decl) {
      // Handle CSS declarations (properties)
      // Example: Transform custom properties
      if (decl.prop.startsWith('--custom-')) {
        decl.prop = decl.prop.replace('--custom-', '--my-');
      }

      // Example: Transform values
      if (opts.transformValues && decl.value.includes('custom(')) {

        decl.value = decl.value.replace(/custom\(([^)]+)\)/g, 'var(--$1)');
      }
    },

    Comment(comment) {
      // Handle comments
      // Example: Remove specific comments
      if (opts.removeComments && comment.text.includes('TODO')) {
        comment.remove();
      }
    },

    OnceExit(root) {
      // Runs once at the end, after all transformations
      // Use this for cleanup or final transformations

      // Example: Add a final comment
      if (opts.addFinalComment) {
        root.append(`/* Processed successfully */`);
      }
    }
  };
};

// Plugin metadata (required for PostCSS 8+)
export { PLUGIN_NAME as pluginName };

export const postcss = true;
