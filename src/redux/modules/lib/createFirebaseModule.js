import {createConstants, createReducer} from 'redux-module-builder'
import {createApiHandler, createApiAction} from 'redux-module-builder/api'

import {DOWNLOAD_TYPES} from './storageHelpers';

import {baseName} from '../../../utils/baseName';
const GLOBAL_LIST_KEY = 'global-photos';
const USER_LIST_KEY = 'user-photos';

const defaultToObj = child => ({_key: child.key, ...child.val()})
const defaultFindObject = (child, list) => {
  const itemKeys = list.map(i => i._key);
  const itemIndex = itemKeys.indexOf(payload.key);
  let newItems = [].concat(list);
  newItems.splice(itemIndex, 1);
  return newItems;
}

export default (key, ref, {
  initialTypes = [],
  userInitialState = {},
  toObject = defaultToObj,
  findObject = defaultFindObject
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
      'firebase': ['value', 'added', 'changed', 'removed']
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
      const {server} = getState();
      const listRef = typeof ref === 'string' ? ref : ref(getState());

      listenRef = server.database
        .ref(listRef)
        .orderByChild('timestamp')

      // listenRef.once('value',       snapshot => dispatch({type: types.ITEM_VALUE, payload: snapshot}))
      listenRef.on('child_added',   snapshot => dispatch({type: types.ITEM_ADDED, payload: snapshot}))
      listenRef.on('child_removed', snapshot => dispatch({type: types.ITEM_REMOVED, payload: snapshot}))
      listenRef.on('child_changed', snapshot => dispatch({type: types.ITEM_CHANGED, payload: snapshot}))

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
    [types.ITEM_VALUE]: (state, {payload}) => {
      let list = [];
      payload.forEach(child => list.push(toObject(child, state)))
      list.sort((a, b) => a.timestamp < b.timestamp)
      return {...state, items: list}
    },
    [types.ITEM_ADDED]: (state, {payload}) => {
      const newItem = toObject(payload, state);
      let list = state.items
                  .concat(newItem)
                  .sort((a, b) => a.timestamp < b.timestamp)

      return { ...state, items: list}
    },
    [types.ITEM_REMOVED]: (state, {payload}) => {
      const itemKeys = state.items.map(i => i._key);
      const itemIndex = itemKeys.indexOf(payload.key);
      let newItems = [].concat(state.items);
      newItems.splice(itemIndex, 1);

      let list = newItems
                  .concat(newItem)
                  .sort((a, b) => a.timestamp < b.timestamp)
      return {...state, items: list}
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
    items: []
  }, userInitialState);

  return {initialState, reducer, actions, types}
}
