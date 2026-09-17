import React from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router";

export default function ProtectedRoute() {
  const appContext = useOutletContext();
  const location = useLocation();

  if (appContext.sessionLoading) {
    return <>...Loading</>;
  }

  return appContext.user || appContext.session?.username ? (
    <Outlet context={appContext} />
  ) : (
    <Navigate to={"/login"} replace state={{ from: location }} />
  );
}
