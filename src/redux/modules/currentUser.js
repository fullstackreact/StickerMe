import {createConstants, createReducer} from 'redux-module-builder'

export const types = createConstants('currentUser')(
  'INITIALIZED',
  'SIGNED_IN',
  'SIGNED_OUT'
)

export const actions = {
  init: (cfg) => (dispatch, getState) => {
    const {server, authManager} = getState();

    const intitialize = () => {
      server.listenForAuth((evt) => {
        if (!evt.authenticated) {
          dispatch(actions.userSignedOut(evt.error));
        } else {
          dispatch(actions.userSignedIn(evt.user))
        }
      })

      authManager.configureProvider("twitter", {
        consumer_key: 'EFSw5Wx703eTjzAKCMwMdp0Vf',
        consumer_secret: 'RPm1CMAjHDrMaYodmr1jP2AYXCCEl4on03bqmQP0Udm809f3Sg'
      })
    }
  // Regardless of the success/failure, initialize the app
    server.configure(cfg)
      .then(intitialize)
      .catch(intitialize)

    server.on('debug', (msg) => console.log('DEBUG:', msg));
  },
  userSignedIn: (user) => ({type: types.SIGNED_IN, payload: user}),
  userSignedOut: (err) => ({type: types.SIGNED_OUT, payload: err}),

  signUpWith: (provider) => (dispatch, getState) => {
    const {server, authManager} = getState();
    const appUrl = `sticker-me://oauth-callback/${provider}`
      authManager.authorizeWithCallbackURL(provider, appUrl)
      .then((creds) => {
        server
          .signInWithProvider(provider,
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
    loggedIn: true,
    user: payload
  }),
  [types.SIGNED_OUT]: (state, {payload}) => ({
    ...state,
    loggedIn: false,
    user: null
  })
});

export const initialState = {
  user: null
}
