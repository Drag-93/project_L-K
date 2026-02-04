import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ShopNowonPage = lazy(() => import("../page/shop/ShopNowonPage"));
const ShopjongroPage = lazy(() => import("../page/shop/ShopjongroPage"));
const ShopgangnamPage = lazy(() => import("../page/shop/ShopgangnamPage"));
const ShopbanghakPage = lazy(() => import("../page/shop/ShopbanghakPage"));
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
          <ShopjongroPage />
        </Suspense>
      ),
    },
    {
      path: "gangnam",
      element: (
        <Suspense fallback={Loading}>
          <ShopgangnamPage />
        </Suspense>
      ),
    },
    {
      path: "banghak",
      element: (
        <Suspense fallback={Loading}>
          <ShopbanghakPage />
        </Suspense>
      ),
    },
  ];
};

export default toShopRouter;
