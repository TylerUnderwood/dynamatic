document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('theme').addEventListener( 'click', (event) => {
    if ( event.target.checked ) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, false);
});