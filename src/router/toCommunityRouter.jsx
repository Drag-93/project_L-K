import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const CommunityNoticePage = lazy(() => import("../page/Community/CommunityNoticePage"));
const CommunityNoticeWritePage = lazy(() => import("../page/Community/CommunityNoticeWritePage"));
const CommunityNoticeDetailPage = lazy(() => import("../page/Community/CommunityNoticeDetailPage"));
const CommunityMapsPage = lazy(() => import("../page/Community/CommunityMapsPage"));
const CommunityFaqPage = lazy(() => import("../page/Community/CommunityFaqPage"));

const CommunityQnAPage = lazy(
  () => import("../page/community/CommunityQnAPage"),
);
const CommunityQnADetailPage = lazy(
  () => import("../page/community/CommunityQnADetailPage"),
);
const CommunityQnAWritePage = lazy(
  () => import("../page/community/CommunityQnAWritePage"),
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
    {
      path: "notice/:id",
      element: (
        <Suspense fallback={Loading}>
          <CommunityNoticeDetailPage />
        </Suspense>
      ),
    },
    {
    path: "faq",
    element: (
    <Suspense fallback={Loading}>
      <CommunityFaqPage />
      </Suspense>
    ),
    },
    {path: "qna",
      element: (
        <Suspense fallback={Loading}>
          <CommunityQnAPage />
        </Suspense>
      ),
    },
    {
      path: "qna/:id",
      element: (
        <Suspense fallback={Loading}>
          <CommunityQnADetailPage />
        </Suspense>
      ),
    },
    {
      path: "qna/write",
      element: (
        <Suspense fallback={Loading}>
          <CommunityQnAWritePage />
        </Suspense>
      ),
    },
  ];
};

export default toCommunityRouter;
