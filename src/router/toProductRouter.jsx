import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ProdHydroPage = lazy(() => import("../page/product/ProdHydroPage"));
const toProductRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"hydro"} />,
    },
    {
      path: "hydro",
      element: (
        <Suspense fallback={Loading}>
          <ProdHydroPage />
        </Suspense>
      ),
    },
  ];
};

export default toProductRouter;
