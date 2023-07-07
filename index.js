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
        let blocklist = ["color", "markup"];

        // Only add categories to prefixes that are not in the blocklist
        if ( blocklist.some(word => category.includes(word)) ) {
            prefix = token;
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
            if (category === "DEFAULT") {
                let newValue = values[key].replace("theme", "light");
                let newKey = key.replace("DEFAULT", "theme");
                variables.push(`--${newKey}: var(${newValue});`);
            } else if (/^--/.test(values[key])) {
                variables.push(`--${key}: var(${values[key]});`);
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

    const tokenList = ( category ) => {
        let tokensStyles = '';
        category.forEach((token, index) => {
            tokensStyles += token + (index < category.length - 1 ? '\n  ' : '');
        });
        return tokensStyles;
    }

    const addCategoryStyles = ( category, categoryName, rule ) => {
        themeCSS += `
/* ${categoryName} */
${rule} {
  ${tokenList( tokens[category] )}
}\n`
    };

    for ( const category in tokens ) {
        if ( category === "theme" ) {
            addCategoryStyles(category, "Theme", ":root");
        } else {
            addCategoryStyles(category, category, ":root");
        }
    };

    return themeCSS;
}

export { tokenCategories, tokensNative, tokenBuilder };
