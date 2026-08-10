# dynamatic
> [!IMPORTANT]
> Everthing is still very much in alpha, expect breaking changes.  
> Progress has been steady, so expect that to change soon(TM) with a 1.0.0 release

Dynamatic is a postCSS theme foundation made for tailwind integration, built from configured theme tokens.

Head to the <a href="dynamatic.io" target="_blank">Dynamatic &#129109;</a> website to learn more.

## Install

```
npm i dynamatic
```

## Usage

1. Set up a `<style>` tag at the very top of your head, before all else. Make sure it has a unique id, I like to just use `theme`. It should look like this.
```html
<style id="theme"></style>
```

2. import the build function `tokenBuilder` and use this to build all theme tokens. It will default to the built-in theme, however you will need to pass in your theme tokens as a parameter. Example:
```js
import themeDefault from 'path/to/MyTheme.json';
import { tokenBuilder } from "dynamatic/src/scripts/main.ts";

document.getElementById('theme').innerHTML = tokenBuilder(themeDefault);
```

3. Where ever you are setting up your styles import theme and core, in that order. Then import individual components and utilities as they are used. Imports should look something like this.

```css
@import 'dynamatic/styles/theme.css';
@import 'dynamatic/styles/core.css';
@import 'dynamatic/styles/components/ComponentName.css';
@import 'dynamatic/styles/utilities/UtilName.css'
```
