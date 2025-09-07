// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Props:
 *  - user: current user object (null if not logged-in)
 *  - children: element(s) to render when allowed
 *  - roles: optional array of allowed roles (e.g. ['admin'])
 *
 * Usage:
 *  <ProtectedRoute user={user}><Dashboard /></ProtectedRoute>
 *  <ProtectedRoute user={user} roles={['admin']}><Admin /></ProtectedRoute>
 */
export default function ProtectedRoute({ user, children, roles = [] }) {
  // Not logged in
  if (!user) return <Navigate to="/" replace />;

  // If roles are provided, check role membership
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // You could render an "Access denied" UI instead — Navigate back to home for simplicity
    return <Navigate to="/" replace />;
  }

  return children;
}
