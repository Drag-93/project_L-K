import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const InfoIntroductionPage = lazy(
  () => import("../page/info/InfoIntroductionPage"),
);
const InfoHistoryPage = lazy(
  () => import("../page/info/InfoHistoryPage"),
);

const toInfoRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"introduction"} />,
    },
    {
      path: "introduction",
      element: (
        <Suspense fallback={Loading}>
          <InfoIntroductionPage />
        </Suspense>
      ),
    },
    {
      path: "history",
      element: (
        <Suspense fallback={Loading}>
          <InfoHistoryPage />
        </Suspense>
      ),
    }
  ];
};

export default toInfoRouter;
