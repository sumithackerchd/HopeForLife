import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RouteGuard = ({ requireAuth = false, requireAdmin = false, children }: { requireAuth?: boolean, requireAdmin?: boolean, children?: React.ReactNode }) => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
