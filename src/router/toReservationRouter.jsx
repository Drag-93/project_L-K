import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ReservListPage = lazy(() => import("../components/reservation/ReservList"));
const ReservDetailPage = lazy(() => import("../components/reservation/ReservDetail"));


const toReservationRouter = () => {
  return [
      {
        path: "",
        children: [
          {
            index: true,
            element: (
              <Navigate replace to={'list'} />            
            )
          },
          {
            path: "list",
            element: (
              <Suspense fallback={Loading}><ReservListPage/></Suspense>            
            )
          },
          {
            path: "list/:category",
            element: (
              <Suspense fallback={Loading}><ReservListPage/></Suspense>            
            )
          },
          {
            path: "detail/:category/:id",
            element: (
              <Suspense fallback={Loading}><ReservDetailPage/></Suspense>
            )
          }  
       ]
      }
    ];
};

export default toReservationRouter;
