//////////////////////////////
// Match Height

const toggleClass = () => {

  document.querySelectorAll( '[toggle-class]' ).forEach( element => {
    const toggleToElementID = element.getAttribute('toggle-class');
    const toggleClassToThis = document.getElementById(toggleToElementID);

    const toggleClassIfChecked = () => {
      if (element.checked) {
        toggleClassToThis.classList.add(element.value)
      } else {
        toggleClassToThis.classList.remove(element.value)
      }
    }

    element.addEventListener('change', toggleClassIfChecked, false);

    toggleClassIfChecked();
  });

}

window.addEventListener( 'DOMContentLoaded', () => {
  toggleClass();
});





const uncheck = () => {

  document.querySelectorAll( '[uncheck]' ).forEach( element => {
    const uncheckElementIds = element.getAttribute('uncheck');

    uncheckElementIds.split(' ').forEach( uncheckElementId => {
      // if string is empty or null
      if ( !!!uncheckElementId ) {
        return;
      }

      const uncheckThis = () => {
        const uncheckElement = document.getElementById(uncheckElementId);

        if ( !!!uncheckElement ) {
          console.error('No element with id="' + uncheckElementId + '"');
          return;
        }

        const triggerEventOutside = (element) => {
          var event = document.createEvent("HTMLEvents");
          event.initEvent('change', false, true);
          element.dispatchEvent(event);
        }

        if (element.checked) {
          uncheckElement.checked = false;
          triggerEventOutside( uncheckElement );
        }
      }

      element.addEventListener('change', uncheckThis, false);
    });
  });

}

window.addEventListener( 'DOMContentLoaded', () => {
  uncheck();
});
