// ES6 Functions
import "./functions/match-height";
import "./functions/display-var";
import "./functions/copy-to-clipboard";
import "./functions/theme-selector";

// ES6 Classes
import "./classes/smooth-scroll";
import "./classes/appear";
import "./classes/modal";


// Vue
import Vue                 from 'vue';
import DemoComponent       from './components/DemoComponent';

new Vue({
  el: '#site',
  components: {
    DemoComponent,
  }
});