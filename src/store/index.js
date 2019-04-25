import configureStore from "./configureStore";
const storeParent = configureStore();
const store = storeParent.store;
export default store;
