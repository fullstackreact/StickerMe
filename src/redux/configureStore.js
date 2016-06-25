import Firestack from 'react-native-firestack'
import { bindActionCreatorsToStore } from 'redux-module-builder';
import thunkMiddleware from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import { rootReducer, actions, initialState } from './rootReducer';

const server = new Firestack({});

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
        {server}
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
