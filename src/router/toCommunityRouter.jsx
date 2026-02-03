import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const CommunityNoticePage = lazy(
  () => import("../page/community/CommunityNoticePage"),
);

const toCommunityRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"notice"} />,
    },
    {
      path: "notice",
      element: (
        <Suspense fallback={Loading}>
          <CommunityNoticePage />
        </Suspense>
      ),
    },
  ];
};

export default toCommunityRouter;
