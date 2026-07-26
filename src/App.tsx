import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';

import { routes, publicRoutes } from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import UserDashboard from '@/pages/dashboard/UserDashboard';
import UserProfile from '@/pages/dashboard/UserProfile';
import UserSettings from '@/pages/dashboard/UserSettings';
import AdminDashboard from '@/pages/admin/AdminDashboard';
const CampaignList = lazy(() => import('@/pages/admin/campaigns/CampaignList'));
const CampaignForm = lazy(() => import('@/pages/admin/campaigns/CampaignForm'));
const DonationList = lazy(() => import('@/pages/admin/donations/DonationList'));
const UserList = lazy(() => import('@/pages/admin/users/UserList'));
const SettingsForm = lazy(() => import('@/pages/admin/settings/SettingsForm'));

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
                element={route.public ? route.element : <RouteGuard requireAuth requireAdmin={route.path === '/admin'}>{route.element}</RouteGuard>} 
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
              </Route>
            ))}
            
            {/* Explicitly map admin sub-routes to avoid rendering them outside the AdminLayout */}
            <Route path="/admin" element={<RouteGuard requireAuth requireAdmin><AdminLayout /></RouteGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="campaigns" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CampaignList />
                </Suspense>
              } />
              <Route path="campaigns/new" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CampaignForm />
                </Suspense>
              } />
              <Route path="campaigns/edit/:id" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CampaignForm />
                </Suspense>
              } />
              <Route path="donations" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DonationList />
                </Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <UserList />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SettingsForm />
                </Suspense>
              } />
            </Route>

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
