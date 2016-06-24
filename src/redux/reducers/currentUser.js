import {createConstants, createReducer} from 'redux-module-builder'
import Firestack from 'react-native-firestack'

export const server = new Firestack();
server.configure()

export const types = createConstants('USERS')(
  'SIGNED_IN',
  'SIGNED_OUT'
)

export const actions = {
  init: () => (dispatch, getState) => {
    server.listenForAuth((evt) => {
      if (!evt.authenticated) {
        dispatch(actions.userSignedOut(evt.error));
      } else {
        dispatch(actions.userSignedIn(evt.user))
      }
    })
  },
  userSignedIn: (user) => ({type: types.SIGNED_IN, payload: user}),
  userSignedOut: (err) => ({type: types.SIGNED_OUT, payload: err})
}

export const reducer = createReducer({
  [types.SIGNED_IN]: (state, {payload}) => ({
    ...state,
    user: payload
  }),
  [types.SIGNED_OUT]: (state, {payload}) => ({
    ...state,
    user: null
  })
});

export const initialState = {
  user: null
}
