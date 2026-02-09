import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ShopPage = lazy(() => import("../page/shop/ShopPage"));

const toShopRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to="0"/>,
    },
    {
      path: ":id",
      element:(
        <Suspense fallback={Loading}><ShopPage/></Suspense>
      )
    }
  ];
};

export default toShopRouter;
