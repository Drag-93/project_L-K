import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import toAuthRouter from "./toAuthRouter";
import toReservationRouter from "./toReservationRouter";
import toProductRouter from "./toProductRouter";
import toAdminRouter from "./toAdminRouter";
import toCommunityRouter from "./toCommunityRouter";
import toShopRouter from "./toShopRouter";

const Loading = (
  <div className="loading">
    <h1>...Loading</h1>
  </div>
);
const MainPage = lazy(() => import("../page/MainPage"));
const MypagePage = lazy(() => import("../page/MypagePage"));
const InfoLayout = lazy(() => import("../layout/InfoLayout"));
const CommunityLayout = lazy(() => import("../layout/CommunityLayout"));
const ReservationLayout = lazy(() => import("../layout/ReservationLayout"));
const ProductLayout = lazy(() => import("../layout/ProductLayout"));
const AuthLayout = lazy(() => import("../layout/AuthLayout"));
const AdminLayout = lazy(() => import("../layout/AdminLayout"));

const root = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <MainPage />
      </Suspense>
    ),
  },
  {
    path: "mypage",
    element: (
      <Suspense fallback={Loading}>
        <MypagePage />
      </Suspense>
    ),
  },
  {
    path: "info",
    element: (
      <Suspense fallback={Loading}>
        <InfoLayout />
      </Suspense>
    ),
    children: toCommunityRouter(),
  },
  {
    path: "reservation",
    element: (
      <Suspense fallback={Loading}>
        <ReservationLayout />
      </Suspense>
    ),
    children: toReservationRouter(),
  },
  {
    path: "product",
    element: (
      <Suspense fallback={Loading}>
        <ProductLayout />
      </Suspense>
    ),
    children: toProductRouter(),
  },
  {
    path: "shop",
    element: (
      <Suspense fallback={Loading}>
        <CommunityLayout />
      </Suspense>
    ),
    children: toShopRouter(),
  },
  {
    path: "community",
    element: (
      <Suspense fallback={Loading}>
        <CommunityLayout />
      </Suspense>
    ),
    children: toCommunityRouter(),
  },
  {
    path: "auth",
    element: (
      <Suspense fallback={Loading}>
        <AuthLayout />
      </Suspense>
    ),
    children: toAuthRouter(),
  },
  {
    path: "admin",
    element: (
      <Suspense fallback={Loading}>
        <AdminLayout />
      </Suspense>
    ),
    children: toAdminRouter(),
  },
]);

export default root;
