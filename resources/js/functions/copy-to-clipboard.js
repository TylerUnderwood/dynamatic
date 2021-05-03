//////////////////////////////
// Match Height

const copyToClipboardAttribute = () => {

  const sendThisToClipboard = ( thisText ) => {
    // create and remove a textarea to copy the text from
    var textarea = document.createElement('textarea');
    textarea.textContent = thisText;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy'); 
    document.body.removeChild(textarea);
  }

  document.querySelectorAll( '[copy-this]' ).forEach( element => {
    element.addEventListener( 'click', ( event ) => {
      event.preventDefault();

      const copyText = element.getAttribute('copy-this');

      sendThisToClipboard( copyText )

      alert('Copied the text: ' + copyText);
      
    });
  });

  document.querySelectorAll( '[copy-inner-text]' ).forEach( element => {
    element.addEventListener( 'click', ( event ) => {
      event.preventDefault();

      const copyText = element.innerText;

      sendThisToClipboard( copyText )

      alert('Copied the text: ' + copyText);
      
    });
  });

}

window.addEventListener( 'DOMContentLoaded', () => {
  copyToClipboardAttribute();
});
