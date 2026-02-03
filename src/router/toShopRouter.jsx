import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ShopNowonPage = lazy(() => import("../page/shop/ShopNowonPage"));
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
  ];
};

export default toShopRouter;
