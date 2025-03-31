import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';
import { MyApp } from './my-app';

//Dependecias Globlales
import 'bootstrap/dist/css/bootstrap.min.css';
import './views/welcome/welcome.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/random.css';
import './css/global.css';
import './css/solicitudes-cliente.css';
import './css/andres.css';

Aurelia
  //.register(RouterConfiguration)
  // To use HTML5 pushState routes, replace previous line with the following
  // customized router config.
  .register(RouterConfiguration.customize({ 
    useUrlFragmentHash: false,
    title: '${componentTitles} ${appTitleSeparator} PrestaLider',
  }))
  .app(MyApp)
  .start();
