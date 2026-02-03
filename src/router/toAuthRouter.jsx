import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const AuthLoginPage = lazy(() => import("../page/auth/AuthLoginPage"));
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
          <AuthLoginPage />
        </Suspense>
      ),
    },
  ];
};

export default toAuthRouter;
