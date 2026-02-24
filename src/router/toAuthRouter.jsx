import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const AuthLogin = lazy(() => import("../components/auth/AuthLogin"));
const AuthJoin = lazy(() => import("../components/auth/AuthJoin"));
const AuthMypage = lazy(() => import("../components/auth/AuthMypage"));
const AuthMyPayment = lazy(() => import("../components/auth/AuthMyPayment"));
const AuthMyQna = lazy(() => import("../components/auth/AuthMyQna"));
const AuthMyReview = lazy(() => import("../components/auth/AuthMyReview"));

const toAuthRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"login"} />,
    },
    {
      path: "login",
      element: (
        <Suspense fallback={Loading}>
          <AuthLogin />
        </Suspense>
      ),
    },
    {
      path: "join",
      element: (
        <Suspense fallback={Loading}>
          <AuthJoin />
        </Suspense>
      ),
    },
    {
      path: "mypage/:id",
      element: (
        <Suspense fallback={Loading}>
          <AuthMypage />
        </Suspense>
      ),
    },
    {
      path: "mypayment/:id",
      element: (
        <Suspense fallback={Loading}>
          <AuthMyPayment />
        </Suspense>
      ),
    },
    {
      path: "myqna/:id",
      element: (
        <Suspense fallback={Loading}>
          <AuthMyQna />
        </Suspense>
      ),
    },
    {
      path: "myreview/:id",
      element: (
        <Suspense fallback={Loading}>
          <AuthMyReview />
        </Suspense>
      ),
    }
  ];
};

export default toAuthRouter;
