import { createRoot } from "react-dom/client";
import "./css/style.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </StrictMode>,
);
