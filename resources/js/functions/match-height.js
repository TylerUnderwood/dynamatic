//////////////////////////////
// Match Height

const matchHeightAttribute = () => {

  document.querySelectorAll( '[match-height]' ).forEach( element => {
    const machableElementId = element.getAttribute('match-height');
    const machableElement = document.getElementById( `${machableElementId}` );

    if ( machableElement !== null ) {
      element.style.minHeight = `${machableElement.offsetHeight}px`;
    } else {
      console.log( `There is no #${machableElementId} to match height.` )
    }
  });

}

window.addEventListener( 'DOMContentLoaded', () => {
  matchHeightAttribute();
});
  
window.addEventListener( 'resize', () => {
  matchHeightAttribute();
});
