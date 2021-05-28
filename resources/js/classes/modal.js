 //////////////////////////////
// Modal

class Modal
{
  constructor( elementId ) {
    this.id = elementId;
    this.modal = document.getElementById(elementId);
    this.toggleButtons = document.querySelectorAll(`[toggle*="${elementId}"]`);
    this.openButtons = document.querySelectorAll(`[open*="${elementId}"]`);
    this.closeButtons = document.querySelectorAll(`[close*="${elementId}"]`);
    this.allButtons = [...this.toggleButtons, ...this.openButtons, ...this.closeButtons];
    this.activatorButton = this.allButtons[0];
    this.duration = this.modal.dataset.duration ? this.modal.dataset.duration : 300;
    this.init();
  }

  focusTrap( event ) {
    const focusableList = 'a, button, textarea, input, select',
          focusableElements = this.querySelectorAll(focusableList),
          firstFocusableElement = focusableElements[0],
          lastFocusableElement = focusableElements[focusableElements.length - 1];

    let isKeyPressed = ( event.key === 'Tab' || event.keyCode === '9' );

    if (!isKeyPressed) {
      return;
    }

    if ( event.shiftKey ) /* shift + tab */ {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        event.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }

  escClose( event ) {
    let isKeyPressed = ( event.key === 'Escape' || event.keyCode === '27' );

    if ( !this.isActive() || !isKeyPressed ) {
      return;
    }

    event.preventDefault();
    this.deactivate();
  }

  isActive() {
    return this.modal.dataset.state === 'active';
  }

  isAnimating() {
    return this.modal.dataset.state === 'enter' || this.modal.dataset.state === 'leave';
  }

  setStateAttribute( state ) {
    this.modal.dataset.state = state;
    this.allButtons.forEach( (button) => {
      button.dataset.state = state;
    })
  }

  setModalActive() {
    document.body.style.overflow = 'hidden';
    document.body.classList.add(this.id + '--active');
    this.modal.removeAttribute('hidden')
    this.modal.addEventListener( 'keydown', this.focusTrap );
    this.modal.focus();
  }

  setModalInactive() {
    document.body.style.overflow = null;
    document.body.classList.remove(this.id + '--active');
    this.modal.setAttribute('hidden', '');
    this.modal.removeEventListener( 'keydown', this.focusTrap );
    if ( this.activatorButton ) {
      this.activatorButton.focus();
    }
  }

  activate( button ) {
    this.activatorButton = button;
    this.setStateAttribute('enter');
    this.setModalActive();

    setTimeout( () => {
      this.setStateAttribute('active');
    }, this.duration);
  }

  deactivate() {
    this.setStateAttribute('leave');

    setTimeout( () => {
      this.setStateAttribute('idle');
      this.setModalInactive();
      this.activatorButton = null;
    }, this.duration);
  }

  activeOnStart() {
    const roughScale = (num) => {
      const parsed = parseInt(num, 10);
      if (isNaN(parsed)) { return 0; }
      return parsed;
    }

    const time = roughScale(this.modal.getAttribute('active'));

    if ( time > 0 ) {
      this.setStateAttribute('idle');

      setTimeout(() => {
        this.activate();
      }, time * 1000 );
    } else {
      this.activate();
    }

    this.modal.removeAttribute('active');
  }

  buttonAction( button, action ) {
    button.addEventListener("click", ( event ) => {
      event.preventDefault();

      if ( this.isAnimating() ) {
        return;
      }

      action();
    });
  }

  init() {
    // give all modals close on esc event
    document.addEventListener( 'keydown', (event) => {
      this.escClose(event)
    });

    // set active states for all modals
    if ( this.modal.hasAttribute('active') ) {
      this.activeOnStart();
    } else {
      this.setModalInactive();
    }

    // set the events for the toggle buttons
    this.toggleButtons.forEach( (button) => {
      this.buttonAction( button, () => {
        !this.isActive() ? this.activate( button ) : this.deactivate();
      })
    });

    // set the events for the open buttons
    this.openButtons.forEach( (button) => {
      this.buttonAction( button, () => {
        !this.isActive() ? this.activate( button ) : null;
      })
    });

    // set the events for the close buttons
    this.closeButtons.forEach( (button) => {
      this.buttonAction( button, () => {
        this.isActive() ? this.deactivate() : null;
      })
    });
  }
}

const initializeModal = () => {
  document.querySelectorAll('.js--modal').forEach( element => {
    if ( !element.id ) {
      console.log("Modal element needs ID to reference");
    } else {
      new Modal( element.id );
    }
  });
};

document.addEventListener('DOMContentLoaded', initializeModal, false);
