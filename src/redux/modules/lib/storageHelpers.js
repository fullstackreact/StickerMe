/**
 * Get the basename for a path
 * @param  {String} str path
 * @return {string}     the basename for the path
 */
export const baseName = (str) => {
   var base = new String(str).substring(str.lastIndexOf('/') + 1);
    if(base.lastIndexOf(".") != -1) {
      base = base.substring(0, base.lastIndexOf("."));
    }
   return base;
}

/**
 * Types for download actions to use in `createConstants()` as custom types
 * @type {Array} strings
 */
export const STORAGE_TYPES = ['started', 'complete', 'error', 'percentage'];

const getKeyPrefix = (keyPrefixOrFn) => (state) => typeof keyPrefixOrFn === 'function' ? keyPrefixOrFn(state) : keyPrefixOrFn;


/**
 * Create a download action to be used in actions
 * @param  {string} keyPrefix The string key prefix for action name
 * @return {function}           A function to be set as the action
 */
export const createDownloadAction = (keyPrefixOrFn, KEYS, opts={}) => {
  const keyPrefix = getKeyPrefix(keyPrefixOrFn);
  const key = opts.downloadKey || `${keyPrefix}_url`
  return (url, obj={}) => (dispatch, getState) => {
    const {server} = getState();

    const storage = server.storage;
    dispatch({type: KEYS.started, payload: obj});
    return storage.ref(url).getDownloadURL()
      .then(url => {
        const product = Object.assign({}, obj, {[key]: url});
        dispatch({
          type: KEYS.complete,
          payload: product
        });
        return url;
      })
      .catch(err => {
        dispatch(({type: KEYS.error, payload: err}));
        return err;
      });
  }
}

export const createUploadAction = (keyPrefixOrFn, KEYS, opts={}) => {
  return (from, obj={}) => (dispatch, getState) => {
    const {server, currentUser} = getState();

    const keyPrefix = getKeyPrefix(opts.uploadKey || keyPrefixOrFn)(getState());
    const filename = baseName(from);

    dispatch({type: KEYS.started});
    return server.uploadFile(`${keyPrefix}/${filename}`, from, obj)
    .then((resp) => {
      dispatch({type: KEYS.complete, payload: resp});
      return resp;
    }).catch(err => {
      dispatch({type: KEYS.error, payload: err});
      return err;
    })
  }
}

const _createAction = (actionPrefix, keyPrefix, KEYS, opts) => {
  if (actionPrefix === 'download') {
    return createDownloadAction(keyPrefix, KEYS, opts);
  } else if (actionPrefix === 'upload') {
    return createUploadAction(keyPrefix, KEYS, opts);
  } else {
    return (...args) => args
  }
}

const indexOfProductById = (itemId, list) => list.map(i => i.id).indexOf(itemId)

const defaultGet = (state, payload) => state.items[payload.id];
const defaultSet = (state, payload) => {
  const itemKeys = state.items.map(i => i._key);
  const itemIndex = itemKeys.indexOf(payload._key);
  let newItems = state.items;
  newItems.splice(itemIndex, 1, payload);
  return newItems;
}

export const createReducers = (keyPrefix, KEYS, options={}) => {
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

const _createComponents = (actionPrefix, keyPrefix, opts={}) => {
  const sep = opts.separator || '-';
  const KEYS = STORAGE_TYPES
    .reduce((sum, key) => ({
      ...sum,
      [key]: [actionPrefix, keyPrefix, key].map(k => k.toUpperCase()).join(sep)
    }), {});

  return {
    initialTypes: KEYS,
    action: _createAction(actionPrefix, keyPrefix, KEYS, opts),
    reducers: createReducers(keyPrefix, KEYS, opts)
  }
}

export const createDownloadComponents = (keyPrefix, opts={}) => {
  return _createComponents('download', keyPrefix, opts);
}

export const createUploadComponents = (keyPrefix, opts={}) => {
  return _createComponents('upload', keyPrefix, opts);
}

export const createStorageComponents = (keyPrefix, opts={}) => {
  const dl = createDownloadComponents(keyPrefix, opts);
  const ul = createUploadComponents(keyPrefix, opts);

  return {
    initialTypes: {
      download: dl.initialTypes,
      upload: ul.initialTypes
    },
    downloadAction: dl.action,
    uploadAction: ul.action,
    reducers: Object.assign({}, dl.reducers, ul.reducers)
  }
}
