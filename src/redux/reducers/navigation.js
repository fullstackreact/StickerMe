import {createConstants, createReducer} from 'redux-module-builder'
import * as NavUtils from 'NavigationStateUtils'

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
  init: firstRoute => dispatch => dispatch({type: types.INIT, payload: firstRoute}),
  push: routeKey => {
    route = Object.assign({}, {key: routeKey}, routes[routeKey])
    return {
      type: types.PUSH,
      route
    }
  },
  pop: () => ({type: types.POP}),
  jump_to_key: (key) => ({type: types.JUMP_TO_KEY, key}),
  jump_to_index: (index) => ({type: types.JUMP_TO_INDEX, index}),
  reset: (routes, index) => ({type: types.RESET, index, routes})
}

export const reducer = createReducer({
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
  [types.RESET]: (state, {routes, index}) => ({
    ...state,
    index: index,
    routes: routes
  })
});

export const initialState = {
  index: 0,
  ready: false,
  // routes: [routes['welcome']]
  routes: [routes['signup']]
}
