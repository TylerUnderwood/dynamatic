'use strict'
import theme from './theme.json';

const defaultTheme = theme;

const tokenCategories = ( theme = defaultTheme ) => {
  let categories = {}; // an object of { category: variables }
  let variables = {}; // an object of { token: variable }

  for ( const category in theme ) {
    let tokens = theme[category];

    const addToken = ( name, value ) => {
        if (typeof value === 'object' && value !== null) {
            for ( const item in value ) {
                let nextName = "";
                if ( item !== "DEFAULT" ) {
                    nextName = '-' + item;
                }
                addToken( name + nextName, value[item] );
            }
        } else if ( typeof value === 'string' ) {
            variables[name] = value;
        }
    }

    for ( const token in tokens ) {
        let prefix = '';
        let blocklist = ["color", "import", "other"];

        // Only add categories to prefixes that are not in the blocklist
        if ( blocklist.some(word => category.includes(word)) ) {
            prefix = token;
        } else if ( category === 'DEFAULT' ) {
            prefix = 'theme-' + token;
        } else if ( token === 'DEFAULT' ) {
            prefix = category;
        } else {
            prefix = category + '-' + token;
        }

        addToken( prefix, tokens[token] );
    }

    categories[category] = variables;
    variables = {};
  }

  return categories;
};

const tokensNative = ( theme = defaultTheme ) => {
    let tokens = tokenCategories(theme);
    let categories = {};
    let variables = [];

    for ( const category in tokens ) {
        let values = tokens[category];

        for ( const key in values ) {
            if (category === "import") {
                variables.push(values[key]);
            } else {
                variables.push(`--${key}: ${values[key]};`);
            }
        };

        categories[category] = variables;

        variables = [];
    }

    return categories;
};

const tokenBuilder = ( theme = defaultTheme ) => {
    let tokens = tokensNative(theme);
    let themeCSS = '';
    let schemeColors = [];

    const tokenList = ( category, storeScheme = true ) => {
        let tokensStyles = '';

        category.forEach((token, index) => {
            // store colors that will be dynamic
            if (/var\(--theme/.test(token) && storeScheme) {
                schemeColors.push(token);
            }
            tokensStyles += token + (index < category.length - 1 ? '\n  ' : '');
        });
        return tokensStyles;
    }

    const importList = ( imports ) => {
        let importStyles = '';
        imports.forEach((item, index) => {
           importStyles += `@import url('${item}');\n`;
        });
        return importStyles;
    }

    const addCategoryStyles = ( list, categoryName, rule, storeScheme = true ) => {
        if ( categoryName === 'import' ) {
            themeCSS = importList(list) + themeCSS;
        } else {
            themeCSS += `
/* ${categoryName} */
${rule} {
  ${tokenList( list, storeScheme )}
}\n`
        }
    };

    for ( const category in tokens ) {
        if ( category === "DEFAULT" ) {
            addCategoryStyles(tokens[category], "default", ":root");
        } else {
            addCategoryStyles(tokens[category], category, ":root");
        }
    };

    // add colors stored from earlier
    addCategoryStyles(schemeColors, "scheme", "[data-scheme]", false);

    return themeCSS;
}

export { tokenCategories, tokensNative, tokenBuilder };
