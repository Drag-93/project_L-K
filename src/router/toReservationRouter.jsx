import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const ReserveListPage = lazy(() => import("../components/reservation/reservationList"));
const ReserveDetailPage = lazy(() => import("../components/reservation/reservationDetail"));


const toReservationRouter = () => {
  return [
      {
        path: "",
        children: [
          {
            index: true,
            element: (
              <Navigate replace to={'list/lifting'} />            
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
