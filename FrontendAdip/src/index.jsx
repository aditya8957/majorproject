
import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {store} from "./store/store"  
import { AppRouter } from "./AppRouter";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

