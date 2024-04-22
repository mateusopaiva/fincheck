import { Navigate, Outlet } from "react-router-dom";

interface AuthGaurdProps {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }: AuthGaurdProps) {
  const signedIn = false;

  if(!signedIn && isPrivate) {
    return <Navigate to="/login" replace />;
  }
  
  if(signedIn && !isPrivate) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />
}