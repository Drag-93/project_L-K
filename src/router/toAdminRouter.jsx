import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const AdminMembersPage = lazy(() => import("../page/admin/AdminMembersPage"));
const AdminProductPage = lazy(() => import("../page/admin/AdminProductPage"));
const AdminReservationPage = lazy(
  () => import("../page/admin/AdminReservationPage"),
);
const AdminShopPage = lazy(() => import("../page/admin/AdminShopPage"));
const AdminNoticePage = lazy(() => import("../page/admin/AdminNoticePage"));

const AdminReserveOrdersPage = lazy(() => import("../page/admin/AdminReserveOrdersPage"));
const AdminProductOrdersPage = lazy(() => import("../page/admin/AdminProductOrdersPage"));

const AdminQnAPage = lazy(() => import("../page/admin/AdminQnAPage"));

const Loading = (
  <div className="loading">
    <h1>...Loading</h1>
  </div>
);
const toAdminRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"members"} />,
    },
    {
      path: "members",
      element: (
        <Suspense fallback={Loading}>
          <AdminMembersPage />
        </Suspense>
      ),
    },
    {
      path: "product",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductPage />
        </Suspense>
      ),
    },
    {
      path: "reservation",
      element: (
        <Suspense fallback={Loading}>
          <AdminReservationPage />
        </Suspense>
      ),
    },
    {
      path: "proorder",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductOrdersPage/>
        </Suspense>
      ),
    },
    {
      path: "resorder",
      element: (
        <Suspense fallback={Loading}>
          <AdminReserveOrdersPage/>
        </Suspense>
      ),
    },
    {
      path: "shop",
      element: (
        <Suspense fallback={Loading}>
          <AdminShopPage />
        </Suspense>
      ),
    },
    {
      path: "notice",
      element: (
        <Suspense fallback={Loading}>
          <AdminNoticePage />
        </Suspense>
      ),
    },
    {
      path: "qna",
      element: (
        <Suspense fallback={Loading}>
          <AdminQnAPage />
        </Suspense>
      ),
    },
  ];
};

export default toAdminRouter;
