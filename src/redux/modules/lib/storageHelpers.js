/**
 * Types for download actions to use in `createConstants()` as custom types
 * @type {Array} strings
 */
export const DOWNLOAD_TYPES = ['started', 'complete', 'error', 'percentage'];

/**
 * Create a download action to be used in actions
 * @param  {string} keyPrefix The string key prefix for action name
 * @return {function}           A function to be set as the action
 */
export const createDownloadAction = (keyPrefix, KEYS, opts={}) => {
  const key = opts.downloadKey || `${keyPrefix}_url`
  return (url, obj={}) => (dispatch, getState) => {
    const {server} = getState();

    if (url) {
      const storage = server.storage;
      storage.ref(url).getDownloadURL()
        .then(url => {
          const product = Object.assign({}, obj, {[key]: url});
          dispatch({
            type: KEYS.complete,
            payload: product
          });
        })
        .catch(err => {
          dispatch(({type: KEYS.error, payload: err}));
        });

      dispatch({type: KEYS.started, payload: obj});
    }
  }
}

const indexOfProductById = (itemId, list) => list.map(i => i.id).indexOf(itemId)

const defaultGet = (state, {payload}) => state.items[payload.id];
const defaultSet = (state, {payload}) => {
  state.items[payload.id] = payload;
  return state.items;
}

export const createDownloadReducers = (keyPrefix, KEYS, options={}) => {
  const get = options.get || defaultGet;
  const set = options.set || defaultSet;

  return {
    [KEYS.started]: (state, {payload}) => {
      let newProduct = Object.assign({}, payload, {
        'pending': true
      })
      return state;
    },
    [KEYS.complete]: (state, {payload}) => {
      let newProduct = Object.assign({}, payload, {
        'pending': false
      })
      const items = set(state, newProduct);
      return {...state, items};
    },
    [KEYS.error]: (state, {payload}) => {
      const errors = [].concat(state.errors, payload);
      return {...state, errors};
    },
    [KEYS.percentage]: (state, {payload}) => {
      return state;
    }
  }
}

export const createDownloadComponents = (keyPrefix, opts={}) => {
  const KEYS = DOWNLOAD_TYPES
    .reduce((sum, key) => ({
      ...sum,
      [key]: `${keyPrefix.toUpperCase()}/${key.toUpperCase()}`
    }), {});

  return {
    initialTypes: [
      {'DOWNLOAD': { types: DOWNLOAD_TYPES }},
    ],
    downloadAction: createDownloadAction(keyPrefix, KEYS, opts),
    reducers: createDownloadReducers(keyPrefix, KEYS, opts)
  }
}
