import {createConstants, createReducer} from 'redux-module-builder'
import {createApiHandler, createApiAction} from 'redux-module-builder/api'

import {baseName} from '../../utils/baseName';
const GLOBAL_LIST_KEY = 'global-photos';
const USER_LIST_KEY = 'user-photos';
const makeUserListKey = (currentUser) => `${USER_LIST_KEY}/${currentUser.user.uid}`
/*
 * Constants
 *
 * Basic constants can just be a name
 *  i.e. 'GET_ME'
 * and api constants can be an Object
 *  i.e. { 'GET_UPCOMING': { api: true }}
 */
export const types = createConstants({
  prefix: 'photos',
  customTypes: {
    'uploader': ['uploading', 'complete', 'error', 'percentage'],
    'recorder': ['loading', 'success', 'error'],
    'firebase': ['added', 'changed', 'removed']
  }
})(
  {'RECORD': { types: ['recorder'] }},
  {'UPLOAD': { types: ['uploader']}},
  {'DOWNLOAD': { types: ['uploader'] }},
  {'ITEM': { types: ['firebase']}},
  'LISTENING'
  // 'UPLOAD_ERROR',
  // 'UPLOAD',
  // 'SAVE_COMPLETE',
  // 'SAVE_ERROR',
  //
  // 'RECORD_LOAD',
  // 'RECORD_SUCCESS',
  // 'RECORD_ERROR'
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
export const actions = {
  listen: () => (dispatch, getState) => {
    const {server, currentUser} = getState();
    listenRef = server.database
      .ref(makeUserListKey(currentUser))
      .orderByChild('timestamp')

    listenRef.on('child_added', snapshot => dispatch({type: types.ITEM_ADDED, payload: snapshot.val()}))
    listenRef.on('child_removed', snapshot => dispatch({type: types.ITEM_REMOVED, payload: snapshot.val()}))
    listenRef.on('child_changed', snapshot => dispatch({type: types.ITEM_CHANGED, payload: snapshot.val()}))

    dispatch({
      type: types.LISTENING
    })
  },
  unlisten: () => (dispatch, getState) => {
    const {server} = getState();
    server.off(listenRef);
  },
  recordPhoto: (obj) => (dispatch, getState) => {
    const {server, currentUser} = getState();
    const {user} = currentUser;
    const newPhoto = Object.assign({}, obj, {timestamp: server.ServerValue.TIMESTAMP});

    const newPhotoKey = server.database
                              .ref(GLOBAL_LIST_KEY)
                              // .child(GLOBAL_LIST_KEY)
                              .push().key;
    const updates = {
      // [`${GLOBAL_LIST_KEY}/${newPhotoKey}`]: obj,
      [`${makeUserListKey(currentUser)}/${newPhotoKey}`]: newPhoto
    }

    console.log('updates ->', updates);

    const promises = Object.keys(updates)
      .map(key => {
        const res =  server.database.ref(key).set(updates[key])
        console.log('res ->', key, res);
        return res;
      })
      Promise.all(promises).then(res => dispatch({
            type: types.RECORD_SUCCESS,
            payload: newPhoto
          }))
          .catch((err) => dispatch({
            type: types.RECORD_ERROR,
            payload: err
          }))
  },
  uploadPhoto: (path, metadata) => (dispatch, getState) => {
    const {server, currentUser} = getState();

    const filename = baseName(path);
    server.uploadFile(`${USER_LIST_KEY}/${currentUser.user.uid}/${filename}`, path, metadata)
    .then((resp) => {
      dispatch({type: types.UPLOAD_COMPLETE, payload: resp});
      dispatch(actions.recordPhoto(resp));
      // dispatch({type: types.RECORD_LOADING, payload: resp});
    }).catch(err => {
      console.error('Error uploading ->', err);
      dispatch({type: types.UPLOAD_ERROR, payload: err});
    })
    dispatch({type: types.UPLOAD});
  },

  downloadPhoto: (photo)  => (dispatch, getState) => {
    const {server} = getState();

    if (photo) {
console.log('photo ->', photo);
      const storage = server.storage;
      storage.ref(photo.fullPath).getDownloadURL()
      .then(url => {
console.log('photo url ------->', url);
        const photoRef = Object.assign({}, photo, { url: url})
        dispatch(({type: types.DOWNLOAD_COMPLETE, payload: photoRef}));
      }).catch(err => {
        console.error('Error downloading photo', err);
        dispatch(({type: types.DOWNLOAD_ERROR, payload: err}));
      })

      dispatch({type: types.DOWNLOAD});
    }
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
export const reducer = createReducer({
  [types.ITEM_ADDED]: (state, {payload}) => {
    return {
      ...state,
      items: [payload].concat(state.items)
    }
  },
  [types.ITEM_REMOVED]: (state, {payload}) => {
    let items = state.items;
    const curr = items.filter(i => i.id == payload.id),
          idx = items.indexOf(curr);

    items.splice(idx, 1);
    return {...state, items}
  },
  [types.LISTENING]: (state) => {
    return {
      ...state,
      listening: true
    }
  },
  [types.DOWNLOAD_COMPLETE]: (state, {payload}) => {
    const currentItem = state.items.filter(i => i.name === payload.name)[0],
          idx = state.items.indexOf(currentItem);
    const items = state.items;

    console.log('payload: ', idx, payload, state);
    items[idx] = payload;
    return {...state, items};
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
