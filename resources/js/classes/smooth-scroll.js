//////////////////////////////
// Smooth Scroll

class SmoothScroll 
{
  constructor() {
    this.hrefButtons = document.querySelectorAll('[href^="#"]');
    this.scrollToButtons = document.querySelectorAll('[scroll]');
  }

  log() {
    
  }

  addScrollToEvent( buttons ) {
    buttons.forEach( (button) => {
      let target = undefined

      if ( button.getAttribute('href') ) {
        target = button.getAttribute('href').substring(1)
      }
      if ( button.getAttribute('scroll') ) {
        target = button.getAttribute('scroll')
      }

      const scrollToElement = document.getElementById( target )
      
      if ( scrollToElement === null ) {
        console.log("There is no element to scroll to, with the id of '" + target + "'")
        
        button.addEventListener( "click", (event) => {
          event.preventDefault();
          console.log("Please add and element with the id of '" + target + "'")
        })
      } else {
        button.addEventListener( "click", (event) => {
          event.preventDefault();

          scrollToElement.scrollIntoView({ 
            behavior: 'smooth'
          });
        })
      }
    })
  }

  init() {
    this.addScrollToEvent( this.hrefButtons )
    this.addScrollToEvent( this.scrollToButtons )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SmoothScroll().init();
});