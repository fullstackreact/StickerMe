import {createConstants, createReducer} from 'redux-module-builder'
import * as NavUtils from 'NavigationStateUtils'

import {REHYDRATE} from 'redux-persist/constants'

import routes from '../../routes'

export const types = createConstants('navigation')(
  'INIT',
  'PUSH',
  'POP',
  'JUMP_TO_KEY',
  'JUMP_TO_INDEX',
  'RESET'
)

export const actions = {
  // init: firstRoute => dispatch => dispatch({type: types.INIT, payload: firstRoute}),
  push: (routeKey, routeProps={}) => {
    route = Object.assign({}, {routeProps, key: routeKey}, routes[routeKey])
    return {
      type: types.PUSH,
      route
    }
  },
  pop: () => ({type: types.POP}),
  jumpToKey: (key) => ({type: types.JUMP_TO_KEY, key}),
  jumpToIndex: (index) => ({type: types.JUMP_TO_INDEX, index}),
  reset: (routes, index) => ({type: types.RESET, index, routes})
}

export const reducer = createReducer({
  [REHYDRATE]: (state, {payload}) => {
    const {navigation} = payload;
    const {index} = navigation;
    // return NavUtils.reset(state, [routes['welcome']]);
    const newRoutes = navigation.routes
      .map(route => Object.assign({}, routes[route.key], route))

    return NavUtils.reset(state, newRoutes, index);
  },
  [types.INIT]: (state, {payload}) => ({
    ...state,
    ready: true,
    routes: state.routes.concat(payload)
  }),
  [types.PUSH]: (state, {route}) => {
    const {routes, index} = state;
    if (routes[index].key === (route && route.key)) return state;
    return NavUtils.push(state, route);
  },
  [types.POP]: (state) => {
    if (state.index === 0 || state.routes.length === 1) return state;
    return NavUtils.pop(state);
  },
  [types.JUMP_TO_KEY]: (state, {key}) => {
    return NavUtils.jumpTo(state, key);
  },
  [types.JUMP_TO_INDEX]: (state, {index}) => {
    return NavUtils.jumpToIndex(state, index);
  },
  [types.RESET]: (state, {routes, index}) => {
    return NavUtils.reset(state, routes, index);
  }
});

export const initialState = {
  index: 0,
  routes: [routes['welcome']]
  // routes: [routes['signup']]
}
