import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const AdminMembersPage = lazy(() => import("../page/admin/AdminMembersPage"));
const AdminOrderPage = lazy(() => import("../page/admin/AdminOrderPage"));
const AdminProductPage = lazy(() => import("../page/admin/AdminProductPage"));
const AdminReservationPage = lazy(
  () => import("../page/admin/AdminReservationPage"),
);
const AdminShopPage = lazy(() => import("../page/admin/AdminShopPage"));
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
      path: "order",
      element: (
        <Suspense fallback={Loading}>
          <AdminOrderPage />
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
      path: "shop",
      element: (
        <Suspense fallback={Loading}>
          <AdminShopPage />
        </Suspense>
      ),
    },
  ];
};

export default toAdminRouter;
