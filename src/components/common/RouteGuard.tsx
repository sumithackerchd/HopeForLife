import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RouteGuard = ({ requireAuth = false, requireAdmin = false, children }: { requireAuth?: boolean, requireAdmin?: boolean, children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: implement admin check once roles are fetched from profiles

  return children ? <>{children}</> : <Outlet />;
};
