import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ProdListPage = lazy(() => import("../components/product/ProdList"));
const ProdDetailPage = lazy(() => import("../components/product/ProdDetail"));


const toProductRouter = () => {
  return [
    {
      path: "",
      children: [
        {
          index: true,
          element: (
            <Navigate replace to={'list/hydro'} />            
          )
        },
        {
          path: "list/:category",
          element: (
            <Suspense fallback={Loading}><ProdListPage /></Suspense>            
          )
        },
        {
          path: "detail/:category/:id",
          element: (
            <Suspense fallback={Loading}><ProdDetailPage /></Suspense>
          )
        }  
     ]
    }
  ]
}

export default toProductRouter;
