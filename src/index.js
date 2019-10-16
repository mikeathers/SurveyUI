import React from "react";
import ReactDOM from "react-dom";

import configureStore from "store/configureStore";
import { AuthProvider } from "./providers/authProvider";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import AppRouter from "./router/AppRouter";

import "styles/assets/line-awesome/css/line-awesome-font-awesome.min.css";
import "styles/main.scss";

require("dotenv").config();

const store = configureStore();

// const App = (
//   <AuthProvider />
// );

const App = (
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <AppRouter />
    </PersistGate>
  </Provider>
);

console.log(process.env);
// serviceWorker.unregister();
ReactDOM.render(App, document.getElementById("root"));
