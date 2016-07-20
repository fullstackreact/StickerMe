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
let downloadComponents = createDownloadComponents(FIREBASE_KEY, {
  downloadKey: 'thumbnail_url',
  set: (state, payload) => {
    let packageList = [].concat(state.items);
    const packageListKeys = packageList.map(p => p.id)

    if (payload.productId) {
      const packageIdx = packageListKeys.indexOf(payload.productId);
      const pkg = packageList[packageIdx]

      let products = pkg.products;
      const productsList = products.map(p => p.id);
      const productIdx = productsList.indexOf(payload.id);
      const product = products[productIdx];

      const newProduct = Object.assign({}, product, payload);
      productsList.splice(productIdx, 1, newProduct);

      pkg.products = products;
      packageList.splice(packageIdx, 1, pkg);

console.log('packageList ->', newProduct);
    }

    return packageList;
  }
})

actions.downloadThumbnail = downloadComponents.action
// actions.downloadProduct = (p) => actions.download(p, p.fullPath);

reducer = createReducer(Object.assign({}, reducer, {
  ...downloadComponents.reducers,
}));

module.exports = {types, reducer, actions, initialState}
