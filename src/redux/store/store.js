//  @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { compact } from 'lodash';

import { composeWithDevTools } from 'remote-redux-devtools';
import createSagaMiddleware from 'redux-saga';
import { AsyncStorage } from 'react-native';
import reducers from './reducers';
import sagas from './sagas';
import { createLogger } from 'redux-logger';

const api = 'api.v2';

// change context types in ReduxWrapper.js
export default function initializeStore() {
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = compact([
        thunk.withExtraArgument(api),
        sagaMiddleware,
        // __DEV__ ? createLogger() : null
    ]);

    let debuggWrapper = (data) => data;

    const store = createStore(
        reducers,
        undefined,
        debuggWrapper(compose(applyMiddleware(...middlewares), autoRehydrate()))
    );

    persistStore(
        store,
        {
            storage: AsyncStorage,
            whitelist: []
        }
    );

    sagaMiddleware.run(sagas);

    return store;
}