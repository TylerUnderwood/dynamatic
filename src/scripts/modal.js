 //////////////////////////////
// Modal

class Modal
{
    constructor( id ) {
        this.id = id;
        this.modal = document.getElementById(id);
        this.buttons = document.querySelectorAll(`[modal-toggle="${id}"]`);
        this.anchors = document.querySelectorAll(`[href="#${id}"]`);
        this.toggles = [...this.buttons, ...this.anchors];
        this.parts = document.querySelectorAll(`[modal-part="${id}"]`);
        this.states = ['idle', 'enter', 'active', 'leave'];
        this.duration = this.modal.dataset.duration ? this.modal.dataset.duration : 300;
    }

    isActive() {
        return this.modal.dataset.state === 'active';
    }

    isAnimating() {
        return this.modal.dataset.state === 'enter'
            || this.modal.dataset.state === 'leave';
    }

    setState( state ) {
        const parts = [this.modal, ...this.toggles, ...this.parts];

        parts.forEach((part) => {
            part.dataset.state = state;
        })
    }

    setOpened() {
        if(this.modal.hasAttribute('open')) {
            this.modal.removeAttribute('open');
        }

        this.modal.showModal();
        this.setState('active');
        document.documentElement.style.overflow = 'hidden';
        document.body.classList.add(this.id + '--active');
    }

    open() {
        if (this.modal.dataset.state !== 'idle') {
            console.warn(`Modal #${this.id}: is already opened`);
            return;
        };

        this.modal.showModal();
        this.setState('enter');
        document.documentElement.style.overflow = 'hidden';
        document.body.classList.add(this.id + '--active');

        setTimeout( () => {
            this.setState('active');
        }, this.duration);
    }

    setClosed() {
        if(!this.modal.hasAttribute('open')) {
            this.modal.setAttribute('open', '');
        }

        this.setState('idle');
        document.documentElement.style.overflow = null;
        document.body.classList.remove(this.id + '--active');
        this.modal.close();
    }

    close() {
        if (this.modal.dataset.state !== 'active') {
            console.warn(`Modal #${this.id}: is already closed`);
            return;
        };

        this.setState('leave');

        setTimeout( () => {
            this.setState('idle');
            document.documentElement.style.overflow = null;
            document.body.classList.remove(this.id + '--active');
            this.modal.close();
        }, this.duration);
    }

    toggle() {
        if ( this.isAnimating() ) return;
        this.isActive() ? this.close() : this.open();
    }

    escClose( event ) {
        let isKeyPressed = ( event.key === 'Escape' || event.keyCode === '27' );

        if ( !this.isActive() || !isKeyPressed ) { return };

        event.preventDefault();
        this.toggle();
    }

    init() {
        if (this.modal.hasAttribute('open')) {
            this.setOpened();
        } else {
            this.setClosed();
        };

        document.addEventListener('keydown', (event) => this.escClose(event));

        this.toggles.forEach((button) => {
            button.addEventListener('click', ( event ) => {
                event.preventDefault();
                this.toggle();
            });
        });
    }
}

function initAllModals() {
    document.querySelectorAll('[modal]').forEach( element => {
        if ( !element.id ) {
            console.warn("Modal element needs ID to reference");
        } else {
            new Modal( element.id );
        }
    });
}

window.Modal = Modal;

export default Modal;
