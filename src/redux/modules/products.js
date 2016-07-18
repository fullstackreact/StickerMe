import {createConstants, createReducer} from 'redux-module-builder'
import {createApiHandler, createApiAction} from 'redux-module-builder/api'
import createFirebaseModule from './lib/createFirebaseModule';
import {createDownloadComponents} from './lib/storageHelpers'

const FIREBASE_KEY = 'products'

let {types, reducer, actions, initialState} = createFirebaseModule('product', 'products', {
  initialState: {
    items: {}
  },
  initialTypes: ['THUMBNAIL']
});

const indexOfProductById = (itemId, list) => list.map(i => i.id).indexOf(itemId)
let downloadComponents = createDownloadComponents(types.THUMBNAIL, {
  downloadKey: 'thumbnail_url',
  set: (state, payload) => {
    let newItems = Object.assign({}, state.items);
    if (payload.productId) {
      const product = state.items[payload.productId];

      let newProducts = [].concat(product.products);
      const idx = indexOfProductById(payload.id, newProducts);
      newProducts[idx] = payload;
      product.products = newProducts;
      newItems[payload.productId] = product;
    }
    return newItems;
  }
})

actions.downloadThumbnail = downloadComponents.downloadAction
// actions.downloadProduct = (p) => actions.download(p, p.fullPath);

reducer = createReducer(Object.assign({}, reducer, {
  ...downloadComponents.reducers,
}));

module.exports = {types, reducer, actions, initialState}
