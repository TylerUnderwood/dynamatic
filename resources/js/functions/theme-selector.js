document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById('theme');
  const onTheme = 'light-theme';
  const offTheme = 'dark-theme';
  
  // switch the themes
  const switchTheme = ( trigger, onTheme, offTheme ) => {
    const bodyClasses = document.body.classList;

    if ( trigger ) {
      bodyClasses.add(onTheme);
      bodyClasses.remove(offTheme);
    } else {
      bodyClasses.add(offTheme);
      bodyClasses.remove(onTheme);
    }
  }

  // add class when page loads
  // offTheme is the default
  switchTheme( themeSwitch.checked, onTheme, offTheme );

  // add class when switch clicked
  themeSwitch.addEventListener( 'click', (event) => {
    switchTheme( event.target.checked, onTheme, offTheme );
  }, false);
});
