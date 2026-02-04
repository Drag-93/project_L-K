import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const CommunityNoticePage = lazy(() => import("../page/Community/CommunityNoticePage"));
const CommunityNoticeWritePage = lazy(() => import("../page/Community/CommunityNoticeWritePage"));
const CommunityNoticeDetailPage = lazy(() => import("../page/Community/CommunityNoticeDetailPage"));
const CommunityMapsPage = lazy(() => import("../page/Community/CommunityMapsPage"));

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
    {
      path: "write",
      element: (
        <Suspense fallback={Loading}>
          <CommunityNoticeWritePage/>
        </Suspense>
      ),
    },
  {
  path: "notice/:id",
  element: (
  <Suspense fallback={Loading}>
    <CommunityNoticeDetailPage />
    </Suspense>
    ),
  },
    {
  path: "maps",
  element: (
  <Suspense fallback={Loading}>
    <CommunityMapsPage />
    </Suspense>
  ),
  },
  ];
};

export default toCommunityRouter;
