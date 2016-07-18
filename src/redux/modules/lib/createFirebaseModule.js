import {createConstants, createReducer} from 'redux-module-builder'
import {createApiHandler, createApiAction} from 'redux-module-builder/api'

import {DOWNLOAD_TYPES} from './storageHelpers';

import {baseName} from '../../../utils/baseName';
const GLOBAL_LIST_KEY = 'global-photos';
const USER_LIST_KEY = 'user-photos';
const makeUserListKey = (currentUser) => `${USER_LIST_KEY}/${currentUser.user.uid}`

export default (key, ref, {
  initialTypes = [],
  userInitialState = {}
}) => {

  /*
   * Constants
   *
   * Basic constants can just be a name
   *  i.e. 'GET_ME'
   * and api constants can be an Object
   *  i.e. { 'GET_UPCOMING': { api: true }}
   */
  const types = createConstants({
    prefix: key,
    customTypes: {
      'status': DOWNLOAD_TYPES,
      'firebase': ['added', 'changed', 'removed']
    }
  })(
    ...initialTypes,
    {'UPLOAD': { types: ['status']}},
    {'DOWNLOAD': { types: ['status'] }},

    {'ITEM': { types: ['firebase']}},
    'LISTENING', 'UNLISTENING'
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
  let actions = {
    listen: () => (dispatch, getState) => {
      const {server, currentUser} = getState();
      listenRef = server.database
        .ref(ref)
        .orderByChild('timestamp')

      listenRef.on('child_added',   snapshot => dispatch({type: types.ITEM_ADDED, payload: snapshot.val()}))
      listenRef.on('child_removed', snapshot => dispatch({type: types.ITEM_REMOVED, payload: snapshot.val()}))
      listenRef.on('child_changed', snapshot => dispatch({type: types.ITEM_CHANGED, payload: snapshot.val()}))

      dispatch({
        type: types.LISTENING
      })
    },

    unlisten: () => (dispatch, getState) => {
      const {server} = getState();
      server.off(listenRef);
      dispatch({type: types.UNLISTENING});
    },
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
  const getItemIndexById = (itemId, state) => state.items.map(i => i.id).indexOf(itemId)

  const reducer = {
    [types.ITEM_ADDED]: (state, {payload}) => {
      const items = Object.assign({}, state.items, {
        [payload.id]: payload
      });
      return { ...state, items}
    },
    [types.ITEM_REMOVED]: (state, {payload}) => {
      delete(items[payload.id]);
      return {...state, items}
    },

    [types.LISTENING]: (state) => {
      return {
        ...state,
        listening: true
      }
    },

    [types.UNLISTENING]: (state) => {
      return {...state, listening: false}
    }
  }

  /*
   * The initial state for this part of the component tree
   */
  let initialState = Object.assign({}, {
    loading: false,
    errors: null,
    items: {}
  }, userInitialState);

  return {initialState, reducer, actions, types}
}
