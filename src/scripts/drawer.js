 //////////////////////////////
// Drawer

class Drawer
{
    constructor( id ) {
        this.id = id;
        this.drawer = document.getElementById(id);
        this.buttons = document.querySelectorAll(`[drawer-toggle="${id}"]`);
        this.anchors = document.querySelectorAll(`[href="#${id}"]`);
        this.toggles = [...this.buttons, ...this.anchors];
        this.parts = document.querySelectorAll(`[drawer-part="${id}"]`);
        this.states = ['idle', 'enter', 'active', 'leave'];
        this.duration = this.drawer.dataset.duration ? this.drawer.dataset.duration : 300;
    }

    isActive() {
        return this.drawer.dataset.state === 'active';
    }

    isAnimating() {
        return this.drawer.dataset.state === 'enter'
            || this.drawer.dataset.state === 'leave';
    }

    setState( state ) {
        const parts = [this.drawer, ...this.toggles, ...this.parts];

        parts.forEach((part) => {
            part.dataset.state = state;
        })
    }

    getInnerHeight() {
        const elements = Array.from(this.drawer.children);
        let height = 0;

        const getHeight = (element) => {
            // Get the DOM Node if you pass in a string
            element = (typeof element === 'string') ? document.querySelector(element) : element;

            var styles = window.getComputedStyle(element);
            var margin = parseFloat(styles['marginTop']) +
                         parseFloat(styles['marginBottom']);

            return Math.ceil(element.offsetHeight + margin);
        }

        elements.forEach(element => {
            height += getHeight(element);
        })

        return height;
    }

    open() {
        if (this.drawer.hasAttribute('open')) {
            console.warn(`Drawer #${this.id}: is already open`);
            return;
        };

        this.drawer.setAttribute('open', '');
        this.setState('enter');
        this.drawer.style.height = `${this.getInnerHeight()}px`;

        setTimeout( () => {
            this.setState('active');
            this.drawer.style.height = 'auto';
        }, this.duration);
    }

    setOpened() {
        this.drawer.setAttribute('open', '');
        this.setState('active');
        this.drawer.style.height = 'auto';
    }

    close() {
        if (this.drawer.dataset.state !== 'active') {
            console.warn(`Drawer #${this.id}: is already closed`);
            return;
        };

        this.drawer.style.height = `${this.getInnerHeight()}px`;

        setTimeout( () => {
            this.setState('leave');
            this.drawer.style.height = 0;
        }, 10);

        setTimeout( () => {
            this.setState('idle');
            this.drawer.removeAttribute('open');
        }, this.duration + 10);
    }

    setClosed() {
        this.drawer.style.height = 0;
        this.setState('idle');
        this.drawer.removeAttribute('open');
    }

    toggle() {
        if ( this.isAnimating() ) return;
        this.isActive() ? this.close() : this.open();
    }

    init() {
        if (this.drawer.hasAttribute('open')) {
            this.setOpened();
        } else {
            this.setClosed();
        };

        this.toggles.forEach((button) => {
            button.addEventListener('click', ( event ) => {
                event.preventDefault();
                this.toggle();
            });
        });
    }
}

function initAllDrawers() {
    document.querySelectorAll('[drawer]').forEach( element => {
        if ( !element.id ) {
            console.warn("Drawer needs an ID to reference")
        } else {
            new Drawer( element.id ).init();
        }
    });
}

export default Drawer;
