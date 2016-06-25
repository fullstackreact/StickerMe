'use strict';

import React from 'react'
import { AppRegistry, Text, View } from 'react-native';
import App from './containers/App';

import {Provider} from 'react-redux';
import {configureStore} from './redux/configureStore';

const {server, store, actions} = configureStore();

const wrapper = (props) => {
  return (
      <Provider store={store}>
        <App actions={actions} server={server} />
      </Provider>
  )
}

AppRegistry.registerComponent('StickerMe', () => wrapper);
