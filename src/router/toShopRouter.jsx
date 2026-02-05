import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ShopNowonPage = lazy(() => import("../page/shop/ShopNowonPage"));
const ShopJongroPage = lazy(() => import("../page/shop/ShopjongroPage"));
const ShopGangnamPage = lazy(() => import("../page/shop/ShopgangnamPage"));
const ShopSinchonPage = lazy(() => import("../page/shop/ShopSinchonPage"));
const toShopRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"nowon"} />,
    },
    {
      path: "nowon",
      element: (
        <Suspense fallback={Loading}>
          <ShopNowonPage />
        </Suspense>
      ),
    },
    {
      path: "jongro",
      element: (
        <Suspense fallback={Loading}>
          <ShopJongroPage />
        </Suspense>
      ),
    },
    {
      path: "gangnam",
      element: (
        <Suspense fallback={Loading}>
          <ShopGangnamPage />
        </Suspense>
      ),
    },
    {
      path: "sinchon",
      element: (
        <Suspense fallback={Loading}>
          <ShopSinchonPage />
        </Suspense>
      ),
    },
  ];
};

export default toShopRouter;
