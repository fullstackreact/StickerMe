import {createConstants, createReducer} from 'redux-module-builder'

export const types = createConstants('currentUser')(
  'INITIALIZED',
  'SIGNED_IN',
  'SIGNED_OUT'
)

export const actions = {
  init: () => (dispatch, getState) => {
    const {server, authManager} = getState();
    server.configure()
      .then(() => {
        server.listenForAuth((evt) => {
          if (!evt.authenticated) {
            dispatch(actions.userSignedOut(evt.error));
          } else {
            dispatch(actions.userSignedIn(evt.user))
          }
        })
    })
    .then(() => {
      authManager.configureProvider("twitter", {
        consumer_key: 'EFSw5Wx703eTjzAKCMwMdp0Vf',
        consumer_secret: 'RPm1CMAjHDrMaYodmr1jP2AYXCCEl4on03bqmQP0Udm809f3Sg'
      })
    })
  },
  userSignedIn: (user) => ({type: types.SIGNED_IN, payload: user}),
  userSignedOut: (err) => ({type: types.SIGNED_OUT, payload: err}),

  signUpWith: (provider) => (dispatch, getState) => {
    const {server, authManager} = getState();
    const appUrl = 'sticker-me://oauth-callback/twitter'
    authManager.authorizeWithCallbackURL('twitter', appUrl)
      .then((creds) => {
        server
          .signInWithProvider('twitter',
            creds.oauth_token,
            creds.oauth_token_secret)
          .then((user) => {
            // We're now signed in through Firebase
            dispatch({type: types.SIGNED_IN, payload: user});
          })
          .catch(err => {
            // There was an error
            dispatch({type: types.SIGNED_OUT, payload: err});
          })

      })
      .catch((err) => {
        console.log('error ->', err)
      })
  }
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
