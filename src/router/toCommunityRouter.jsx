import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;
const CommunityNoticePage = lazy(
  () => import("../page/Community/CommunityNoticePage"),
);
const CommunityNoticeUpdatePage = lazy(
  () => import("../page/Community/CommunityNoticeUpdatePage"),
);
const CommunityNoticeDetailPage = lazy(
  () => import("../page/Community/CommunityNoticeDetailPage"),
);
const CommunityFaqPage = lazy(
  () => import("../page/Community/CommunityFaqPage"),
);
const CommunityFaqWritePage = lazy(
  () => import("../page/Community/CommunityFaqWritePage"),
);
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
      path: "notice/update/:id",
      element: (
        <Suspense fallback={Loading}>
          <CommunityNoticeUpdatePage />
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
    {
      path: "faq/write",
      element: (
        <Suspense fallback={Loading}>
          <CommunityFaqWritePage />
        </Suspense>
      ),
    },
    {
      path: "qna",
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
