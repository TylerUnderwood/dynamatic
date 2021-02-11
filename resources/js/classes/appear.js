//////////////////////////////
// Appear

class Appear 
{
  constructor() {
    this.appearElems         = document.querySelectorAll('[appear]');
    this.delayedAppearElems  = document.querySelectorAll('[appear-delay]');
    this.groupedAppearElems  = document.querySelectorAll('[appear-group]');
    this.groupInterval       = 200; // Time in ms between animations for grouped animation
    this.viewport            = {};
    this.viewport.offset     = 200; // Amount in px to offset the necessary position to fire animations
    this.viewport.top        = window.scrollY; // Current Scroll Position of Window
    this.viewport.bottom     = this.viewport.top + window.innerHeight; // Current viewport range
  }

  log() {
    console.log( 'Window top: ' + this.viewport.top );
    console.log( 'Window bottom: ' + this.viewport.bottom );
  }
  
  setDelayedElements() {
    this.delayedAppearElems.forEach( (element) => {
      let time = element.getAttribute('appear-delay');
      element.style.transitionDelay =  time + 'ms';
    })

    return;
  }

  delayGroupedElements() {
    let groupNameList = []

    // get all group names and add them to the list
    this.groupedAppearElems.forEach( (element) => {
      let groupName = element.getAttribute('appear-group');
      // if the group name isn't already added, add it
      if ( !groupNameList.includes(groupName) ) {
        groupNameList.push(groupName)
      }
    })

    // for each group name, add a transtion delay to each element in that group
    groupNameList.forEach( (groupName) => {
      let elementsGroup = document.querySelectorAll(`[appear-group="${groupName}"]`);
    
      elementsGroup.forEach( (element, index) => {
        element.style.transitionDelay =  this.groupInterval * index + 'ms';
      });
    })

    return;
  }

  checkForWithinFirePosition( element ) {
    let elemPosition         = element.offsetTop;
    let firePosition         = this.viewport.top - this.viewport.offset;
    let elemIsInView         = elemPosition < this.viewport.bottom - this.viewport.offset;
    let elemIsInFirePosition = elemPosition >= firePosition || elemPosition < firePosition;

    return elemIsInView && elemIsInFirePosition;
  }

  runAnimation( element ) {
    if ( this.checkForWithinFirePosition( element ) ) {
      element.dataset.state = 'active';
    }

    return;
  }

  listenForAnimationTrigger() {
    this.viewport.top = window.scrollY;
    this.viewport.bottom = this.viewport.top + window.innerHeight;

    this.appearElems.forEach( (element) => {
      // if it is not already active, run the animation
      if ( element.dataset.state !== 'active' ) {
        this.runAnimation( element );
      }
    });

    return;
  }

  init() {
    this.setDelayedElements();
    this.delayGroupedElements();
    this.listenForAnimationTrigger();

    window.addEventListener( 'scroll', () => {
      this.listenForAnimationTrigger();
    })
    
    window.addEventListener( 'resize', () => {
      this.listenForAnimationTrigger();
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Appear().init();
});