import {createConstants, createReducer} from 'redux-module-builder'
import {createApiHandler, createApiAction} from 'redux-module-builder/api'
import createFirebaseModule from './lib/createFirebaseModule';
import {createStorageComponents} from './lib/storageHelpers'

const FIREBASE_KEY = (state) => `user-photos/${state.currentUser.user.uid}`

let {types, reducer, actions, initialState} = createFirebaseModule('photo', FIREBASE_KEY, {
  initialState: {
    items: {},
  },
  initialTypes: [
    'THUMBNAIL',
    'RECORD'
  ]
});

const indexOfPhotoById = (itemId, list) => list.map(i => i.id).indexOf(itemId)
let components = createStorageComponents(`user-photos`, {
  uploadKey: FIREBASE_KEY,
  downloadKey: 'url'
})

actions.recordPhotoUpload = (obj) => (dispatch, getState) => {
  const {server, currentUser} = getState();
  const {user} = currentUser;
  const newPhoto = Object.assign({}, obj, {timestamp: server.ServerValue.TIMESTAMP});
  const refPrefix = `${FIREBASE_KEY(getState())}`

  const newPhotoKey = server.database
                            .ref(refPrefix)
                            .push().key;
  const updates = {
    [`${refPrefix}/${newPhotoKey}`]: newPhoto
  }

  return Object.keys(updates)
    .map(key => {
      const res =  server.database.ref(key).set(updates[key])
      return res;
    });
}

actions.downloadThumbnail = components.downloadAction
actions.uploadPhoto = (url, metadata) => (dispatch, getState) => {
  components.uploadAction(url, metadata)(dispatch, getState)
    .then((resp) => {
      dispatch(actions.recordPhotoUpload(resp));
    })
}

reducer = createReducer(Object.assign({}, reducer, {
  ...components.reducers
}));

module.exports = {types, reducer, actions, initialState}
