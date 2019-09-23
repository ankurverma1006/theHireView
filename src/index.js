import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import './assets/styles/base.scss';
import 'sweetalert/dist/sweetalert.css';
import Main from './pages/Main';
import reducers from './common/core/redux/reducers';
import { Provider } from 'react-redux';
import SpikeViewRoute from './spikeViewRoute';


const rootElement = document.getElementById('root');
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

const renderApp = Component => {
  ReactDOM.render(
    <BrowserRouter>
      <Provider store={store}>
        <Route component={SpikeViewRoute} />
      </Provider>
    </BrowserRouter>,
    rootElement
  );
};

renderApp(Main);

if (module.hot) {
  module.hot.accept('./pages/Main', () => {
    const NextApp = require('./pages/Main').default
    renderApp(NextApp);
  });
}

registerServiceWorker();
