import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const BasketPage = lazy(() => import("../page/order/BasketPage"));
const PaymentListPage = lazy(() => import("../page/order/PaymentListPage"));
const PaymentPage = lazy(() => import("../page/order/PaymentPage"));


const toOrderRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"basket"} />,
    },
    {
      path: "basket",
      element: (
        <Suspense fallback={Loading}>
          <BasketPage/>
        </Suspense>
      ),
    },
    {
      path: "payment",
      element: (
        <Suspense fallback={Loading}>
          <PaymentPage/>
        </Suspense>
      ),
    },
    {
      path: "paymentlist",
      element: (
        <Suspense fallback={Loading}>
          <PaymentListPage/>
        </Suspense>
      ),
    }
  ];
};

export default toOrderRouter;
