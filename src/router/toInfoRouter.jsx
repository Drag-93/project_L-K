import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const InfoIntroductionPage = lazy(
  () => import("../page/info/InfoIntroductionPage"),
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
  ];
};

export default toInfoRouter;
