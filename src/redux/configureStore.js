import Firestack from 'react-native-firestack'
import OAuthManager from 'react-native-oauth'

import { bindActionCreatorsToStore } from 'redux-module-builder';
import thunkMiddleware from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import { rootReducer, actions, initialState } from './rootReducer';

// TODO: Move this
const server = new Firestack({
  apiKey: "AIzaSyCQauaFT9AoP7cMuA8KC7RwzhylJWy2xkM",
  authDomain: "stickerme-18038.firebaseapp.com",
  databaseURL: "https://stickerme-18038.firebaseio.com",
  storageBucket: "stickerme-18038.appspot.com",
});

server.getCurrentUser()
  .then(u => console.log('getCurrentUser returned', u));
  
const authManager = new OAuthManager();

export const configureStore = () => {
    let middleware = [
      thunkMiddleware,
    ]

    let tools = [];
    if (process.env.NODE_ENV === 'development') {
      const devTools = require('remote-redux-devtools');
      tools.push(devTools());
    }

    let finalCreateStore;
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      ...tools
    )(createStore);

    const finalInitialState = Object.assign({},
        initialState,
        {server, authManager}
      );

    const store = finalCreateStore(
      rootReducer,
      finalInitialState
    );

    if (module.hot) {
      module.hot.accept('./rootReducer', () => {
        const {rootReducer} = require('./rootReducer').default;
        store.replaceReducer(rootReducer);
      });
    }

    const boundActions = bindActionCreatorsToStore(actions, store);
    return {store, actions: boundActions, server}
}

export default configureStore;
