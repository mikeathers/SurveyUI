import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducers from "reducers";

export default function configureStore(history, initialState) {
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";

  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
  ) {
    enhancers.push(
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }

  // const rootReducer = (state, action) => {
  //   if (action.type === "USER_LOGOUT") {
  //     state = undefined;
  //   }
  //   return appReducer(state, action);
  // };

  const middleware = [thunk, routerMiddleware(history)];

  const persistConfig = {
    key: "root",
    storage,
    blacklist: ["shared"]
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  let store = createStore(
    persistedReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  let persistor = persistStore(store);
  return { store, persistor };
}
