//////////////////////////////
// Match Height

const displayVarAttribute = () => {

  document.querySelectorAll( '[display-var]' ).forEach( element => {
    const cssVar = element.getAttribute('display-var');
    const cssVarValue = getComputedStyle(document.documentElement).getPropertyValue( `${cssVar}` );

    element.innerHTML = cssVarValue;
  });

}

window.addEventListener( 'DOMContentLoaded', () => {
  displayVarAttribute();
});
