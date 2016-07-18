import { combineReducers } from 'redux';

const modules = {
  currentUser: require('./modules/currentUser'),
  navigation: require('./modules/navigation'),
  feed: require('./modules/feed'),
  photos: require('./modules/photos'),
  products: require('./modules/products'),
  userPurchases: require('./modules/userPurchases')
}

// const currentUser = require('./reducers/currentUser')
// const navigation = require('./reducers/navigation')
// const feed = require('./reducers/feed')

export let actions = {
  // currentUser: currentUser.actions,
  // navigation: navigation.actions,
  // feed: feed.actions
}

export let reducers = {
  'server': (state) => state || null, // filled in later
  'authManager': (state) => state || null,
  // currentUser: currentUser.reducer,
  // navigation: navigation.reducer,
  // feed: feed.reducer
}
export let initialState = {
  // currentUser: currentUser.initialState,
  // navigation: navigation.initialState,
  // feed: feed.initialState
};

Object.keys(modules).forEach(key => {
  const container = modules[key];
  initialState[key] = container.initialState || {};
  actions[key] = container.actions;
  reducers[key] = container.reducer;
});

export const rootReducer = combineReducers(reducers);
