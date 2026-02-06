import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const AuthLogin = lazy(() => import("../components/Auth/AuthLogin"));
const AuthJoin = lazy(() => import("../components/Auth/AuthJoin"));
const AuthDetail = lazy(() => import("../components/Auth/AuthDetail"));
const AuthMypage = lazy(() => import("../components/Auth/AuthMypage"));

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
      path: "detail/:id",
      element: (
        <Suspense fallback={Loading}>
          <AuthDetail />
        </Suspense>
      ),
    },
    {
      path: "Mypage/:id",
      element: (
        <Suspense fallback={Loading}>
          <AuthMypage />
        </Suspense>
      ),
    },
  ];
};

export default toAuthRouter;
