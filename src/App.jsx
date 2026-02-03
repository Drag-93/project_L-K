import Main from "./components/Main";
import { RouterProvider } from "react-router-dom";
import root from "./router/root";

function App() {
  return (
    <>
      <RouterProvider router={root}>
        <Main />
      </RouterProvider>
    </>
  );
}

export default App;
