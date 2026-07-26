import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';

import { routes, publicRoutes } from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import UserDashboard from '@/pages/dashboard/UserDashboard';
import UserProfile from '@/pages/dashboard/UserProfile';
import UserSettings from '@/pages/dashboard/UserSettings';
import AdminDashboard from '@/pages/admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
      <IntersectObserver />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.public ? route.element : <RouteGuard requireAuth>{route.element}</RouteGuard>} 
              >
                {route.path === '/' && publicRoutes.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    index={childRoute.index}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
                {route.path === '/dashboard' && (
                  <>
                    <Route index element={<UserDashboard />} />
                    <Route path="history" element={<div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">No donation history available yet.</div>} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="settings" element={<UserSettings />} />
                  </>
                )}
                {route.path === '/admin' && (
                  <>
                    <Route index element={<AdminDashboard />} />
                    <Route path="donations" element={<div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">Donations Management</div>} />
                    <Route path="users" element={<div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">User Management</div>} />
                    <Route path="reports" element={<div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">Medical Reports Management</div>} />
                    <Route path="updates" element={<div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">Updates Management</div>} />
                    <Route path="settings" element={<div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">System Settings</div>} />
                  </>
                )}
              </Route>
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
