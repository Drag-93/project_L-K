import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ReserveListPage = lazy(() => import("../components/reservation/ReservationList"));
const ReserveDetailPage = lazy(() => import("../components/reservation/ReservationDetail"));


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
              <Suspense fallback={Loading}><ReserveListPage/></Suspense>            
            )
          },
          {
            path: "list/:category",
            element: (
              <Suspense fallback={Loading}><ReserveListPage/></Suspense>            
            )
          },
          {
            path: "detail/:category/:id",
            element: (
              <Suspense fallback={Loading}><ReserveDetailPage/></Suspense>
            )
          }  
       ]
      }
    ];
};

export default toReservationRouter;
