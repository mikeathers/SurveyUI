import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import configureStore from "store/configureStore";
import AppRouter from "./router/AppRouter";
import "styles/main.scss";

const store = configureStore();

const App = (
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <AppRouter />
    </PersistGate>
  </Provider>
);

// serviceWorker.unregister();
ReactDOM.render(App, document.getElementById("root"));
