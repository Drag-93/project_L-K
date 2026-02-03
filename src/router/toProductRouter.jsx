import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ProdHydroPage = lazy(() => import("../page/product/ProdHydroPage"));
const ProdTroublePage = lazy(() => import("../page/product/ProdTroublePage"));
const ProdWhitePage = lazy(() => import("../page/product/ProdWhitePage"));
const ProdAntiagePage = lazy(() => import("../page/product/ProdAntiagePage"));
const ProdUvPage = lazy(() => import("../page/product/ProdUvPage"));


const toProductRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"hydro"} />,
    },
    {
      path: "hydro",
      element: (
        <Suspense fallback={Loading}><ProdHydroPage /></Suspense>
      ),
    },
    {
      path: "trouble",
      element: (
        <Suspense fallback={Loading}><ProdTroublePage /></Suspense>
      ),
    },
    {
      path: "white",
      element: (
        <Suspense fallback={Loading}><ProdWhitePage /></Suspense>
      ),
    },
    {
      path: "antiage",
      element: (
        <Suspense fallback={Loading}><ProdAntiagePage /></Suspense>
      ),
    },
    {
      path: "uv",
      element: (
        <Suspense fallback={Loading}><ProdUvPage /></Suspense>
      ),
    }
  ];
};

export default toProductRouter;
