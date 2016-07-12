import {createConstants, createReducer} from 'redux-module-builder'
import {createApiHandler, createApiAction} from 'redux-module-builder/api'

const PUBLIC_FEED_KEY = 'public_feed'

/*
 * Constants
 *
 * Basic constants can just be a name
 *  i.e. 'GET_ME'
 * and api constants can be an Object
 *  i.e. { 'GET_UPCOMING': { api: true }}
 */
export const types = createConstants('feed')(
  'ITEM_ADDED',
  'LISTENING'
);

/*
 * actions
 *
 * The actions object can be a simple function
 *  i.e. getMe: () => (dispatch, getState) => {
 *  	dispatch({type: types.GET_ME})
 *  }
 *  or using the `createApiAction()` function, we can create an
 *  action that calls out to the api helpers of redux-module-builder
 *  For instance:
 *  getUpcomingEvents: createApiAction(types.GET_UPCOMING)((client, opts) => {
 *    const {count} = opts;
 *    return client.get({
 *    	path: '/events/upcoming',
 *    	params: {count}
 *    }).then(res => res.events)
 *  })
 */
let listenRef;
export const actions = {
  listen: () => (dispatch, getState) => {
    const {server} = getState();
    listenRef = server.database
      .ref(PUBLIC_FEED_KEY)
      .orderByChild('timestamp')
      .on('value', snapshot => {
        if (snapshot.val()) {
          console.log('got a new public feed image');
          dispatch({
            type: types.ITEM_ADDED,
            payload: snapshot.val()
          })
        }
      });
    dispatch({
      type: types.LISTENING
    })
  },
  unlisten: () => (dispatch, getState) => {
    const {server} = getState();
    server.off(listenRef);
  }
}

/*
 * reducers
 *
 * The reducers go here where we can either create a simple reducer
 * using our types object from above
 * i.e. [types.GET_ME]: (state, action) => ({
 * 		...state,
 * 		me: action.payload
 * })
 * or it can be a a complex object, such as using the `createApiHandler`
 * method provided by `redux-module-builder`
 *
 * ...createApiHandler(types.GET_UPCOMING, (apiTypes) => {
 *  	// optional argument to handle apiTypes (i.e. loading and error)
 *    return {
 *    	[apiTypes.LOADING]: (state) => ({...state, loading: true}),
 *    	[apiTypes.ERROR]: (state, {payload}) => {
 *    		return {...state, loading: false, errors: payload};
 *    	}
 *    })((state, {payload}) => {
 *     	return {
 *     		...state,
 *     		loading: false,
 *     		errors: null,
 *     		events: payload
 *     	}
 *    })
 *
 */
export const reducer = createReducer({
  [types.ITEM_ADDED]: (state, {payload}) => {
    return {
      ...state,
      items: [payload].concat(state.items)
    }
  },
  [types.LISTENING]: (state) => {
    return {
      ...state,
      listening: true
    }
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  loading: false,
  errors: null,
  items: []
};
