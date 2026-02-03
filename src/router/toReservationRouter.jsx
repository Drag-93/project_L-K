import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const ReservLiftingPage = lazy(
  () => import("../page/reservation/ReservLiftingPage"),
);
const toReservationRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"lifting"} />,
    },
    {
      path: "lifting",
      element: (
        <Suspense fallback={Loading}>
          <ReservLiftingPage />
        </Suspense>
      ),
    },
  ];
};

export default toReservationRouter;
