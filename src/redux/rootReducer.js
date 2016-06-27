import { combineReducers } from 'redux';

const currentUser = require('./reducers/currentUser')
const navigation = require('./reducers/navigation')

export let actions = {
  currentUser: currentUser.actions,
  navigation: navigation.actions
}

export let reducers = {
  'server': (state) => state || null, // filled in later
  'authManager': (state) => state || null,
  currentUser: currentUser.reducer,
  navigation: navigation.reducer
}
export let initialState = {
  currentUser: currentUser.initialState,
  navigation: navigation.initialState
};

export const rootReducer = combineReducers(reducers);
