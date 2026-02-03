import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const AdminMembersPage = lazy(() => import("../page/admin/AdminMembersPage"));
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
  ];
};

export default toAdminRouter;
