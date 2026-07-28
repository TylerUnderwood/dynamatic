const testPlugin = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-test-plugin',
    /*
    Root (root, postcss) {
      // Transform CSS AST here
    }
    */

    /*
    Declaration (decl, postcss) {
      // The faster way to find Declaration node
    }
    */

    /*
    Declaration: {
      'color': (decl, postcss) => {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
};

testPlugin.postcss = true;

export default testPlugin;
