import React, { Component } from "react";
import AuthService from "../services/authService";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import AppRouter from "../router/AppRouter";
import configureStore from "store/configureStore";

require("dotenv").config();

const store = configureStore();

const AuthContext = React.createContext({
  signinRedirectCallback: () => ({}),
  logout: () => ({}),
  signoutRedirectCallback: () => ({}),
  isAuthenticatedOidc: () => ({}),
  signinRedirect: () => ({}),
  signinSilentCallback: () => ({}),
  createSigninRequest: () => ({})
});

export const AuthConsumer = AuthContext.Consumer;

export class AuthProvider extends Component {
  authService;
  constructor(props) {
    super(props);
    this.authService = new AuthService();
  }
  render() {
    return (
      <AuthContext.Provider value={this.authService}>
        <Provider store={store.store}>
          <PersistGate persistor={store.persistor}>
            <AppRouter />
          </PersistGate>
        </Provider>
      </AuthContext.Provider>
    );
  }
}
