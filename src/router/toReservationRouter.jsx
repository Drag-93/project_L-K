import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const ReservLiftingPage = lazy(() => import("../page/reservation/ReservLiftingPage"));
const ReservLiftingDetailPage = lazy(() => import("../page/reservation/ReservLiftingDetailPage"));
const ReservFacelinePage = lazy(() => import("../page/reservation/ReservFacelinePage"));
const ReservRegenPage = lazy(() => import("../page/reservation/ReservRegenPage"));
const ReservImmunePage = lazy(() => import("../page/reservation/ReservImmunePage"));


const toReservationRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"lifting"} />,
    },
    {
      path: "lifting",
      element: (
        <Suspense fallback={Loading}><ReservLiftingPage /></Suspense>
      ),
    },
    {
      path: "lifting/detail/:id",
      element: (
        <Suspense fallback={Loading}><ReservLiftingDetailPage /></Suspense>
      ),
    },
    {
      path: "faceline",
      element: (
        <Suspense fallback={Loading}><ReservFacelinePage /></Suspense>
      ),
    },
    {
      path: "regen",
      element: (
        <Suspense fallback={Loading}><ReservRegenPage/></Suspense>
      ),
    },
    {
      path: "immune",
      element: (
        <Suspense fallback={Loading}><ReservImmunePage /></Suspense>
      ),
    },
  ];
};

export default toReservationRouter;
