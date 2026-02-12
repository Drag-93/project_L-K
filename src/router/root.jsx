import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import toAuthRouter from "./toAuthRouter";
import toReservationRouter from "./toReservationRouter";
import toProductRouter from "./toProductRouter";
import toAdminRouter from "./toAdminRouter";
import toCommunityRouter from "./toCommunityRouter";
import toShopRouter from "./toShopRouter";
import toInfoRouter from "./toInfoRouter";
import toOrderRouter from "./toOrderRouter";

const Loading = (
  <div className="loading">
    <h1>...Loading</h1>
  </div>
);
const MainPage = lazy(() => import("../page/MainPage"));
const InfoLayout = lazy(() => import("../layout/InfoLayout"));
const CommunityLayout = lazy(() => import("../layout/CommunityLayout"));
const ReservationLayout = lazy(() => import("../layout/ReservationLayout"));
const ProductLayout = lazy(() => import("../layout/ProductLayout"));
const AuthLayout = lazy(() => import("../layout/AuthLayout"));
const AdminLayout = lazy(() => import("../layout/AdminLayout"));
const ShopLayout = lazy(() => import("../layout/ShopLayout"));
const OrderLayout = lazy(() => import("../layout/OrderLayout"));

const SearchPage = lazy(() => import("../page/SearchPage"));

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
    path: "info",
    element: (
      <Suspense fallback={Loading}>
        <InfoLayout />
      </Suspense>
    ),
    children: toInfoRouter(),
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
        <ShopLayout />
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
  {
    path: "order",
    element: (
      <Suspense fallback={Loading}>
        <OrderLayout/>
      </Suspense>
    ),
    children: toOrderRouter(),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={Loading}>
        <SearchPage/>
      </Suspense>
    )
  },
]);

export default root;
