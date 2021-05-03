//////////////////////////////
// Copy to Clipboard

const copyToClipboardAttributes = () => {

  const sendThisToClipboard = ( thisText ) => {

    // create and remove a textarea to copy the text from
    const textarea = document.createElement('textarea');
    textarea.textContent = thisText;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy'); 
    document.body.removeChild(textarea);

  }

  const addAttributeClickAction = ( attrName, callBack ) => {

    document.querySelectorAll( `[${attrName}]` ).forEach( element => {
      element.addEventListener( 'click', ( event ) => {
        event.preventDefault();

        callBack( element );

      });
    });

  };

  const copyFromThisAttribute = ( attrName, getFrom ) => {

    addAttributeClickAction( attrName, ( element ) => {

      const copyText = getFrom( element );
      sendThisToClipboard( copyText )
      alert('Copied the text: ' + copyText);

    });

  };

  copyFromThisAttribute( 'copy-this', element => element.getAttribute('copy-this') );

  copyFromThisAttribute( 'copy-inner-text', element => element.innerText );

  copyFromThisAttribute( 'copy-input-value', element => {
    return document.getElementById( `${element.getAttribute('copy-input-value')}` ).value;
  });

};

window.addEventListener( 'DOMContentLoaded', () => {
  copyToClipboardAttributes();
});
