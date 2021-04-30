// ES6 Classes
import "./classes/smooth-scroll";
import "./classes/appear";
import "./classes/modal";
import "./classes/match-height";


// Vue
import Vue                 from 'vue';
import DemoComponent       from './components/DemoComponent';

new Vue({
  el: '#site',
  components: {
    DemoComponent,
  }
});