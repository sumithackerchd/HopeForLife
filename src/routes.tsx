import { lazy } from 'react';
import { PublicLayout } from './components/layouts/PublicLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Hospital = lazy(() => import('./pages/public/Hospital'));
const Legal = lazy(() => import('./pages/public/Legal'));
const Story = lazy(() => import('./pages/public/Story'));
const Timeline = lazy(() => import('./pages/public/Timeline'));
const Reports = lazy(() => import('./pages/public/Reports'));
const Donate = lazy(() => import('./pages/public/Donate'));
const DonationSuccess = lazy(() => import('./pages/public/DonationSuccess'));
const Updates = lazy(() => import('./pages/public/Updates'));
const Blog = lazy(() => import('./pages/public/Blog'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const UserProfile = lazy(() => import('./pages/dashboard/UserProfile'));
const UserSettings = lazy(() => import('./pages/dashboard/UserSettings'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

export interface ExtendedRouteConfig {
  path?: string;
  index?: boolean;
  element: React.ReactNode;
}

export const publicRoutes: ExtendedRouteConfig[] = [
  { index: true, element: <Home /> },
  { path: 'about', element: <About /> },
  { path: 'hospital', element: <Hospital /> },
  { path: 'privacy', element: <Legal /> },
  { path: 'terms', element: <Legal /> },
  { path: 'refund', element: <Legal /> },
  { path: 'story', element: <Story /> },
  { path: 'timeline', element: <Timeline /> },
  { path: 'reports', element: <Reports /> },
  { path: 'donate', element: <Donate /> },
  { path: 'donation/success', element: <DonationSuccess /> },
  { path: 'updates', element: <Updates /> },
  { path: 'blog', element: <Blog /> },
];

export interface RouteConfig {
  name: string;
  path: string;
  element: React.ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <PublicLayout />,
    public: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    public: true,
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
    public: true,
  },
  {
    name: 'Forgot Password',
    path: '/forgot-password',
    element: <ForgotPassword />,
    public: true,
  },
  {
    name: 'Reset Password',
    path: '/reset-password',
    element: <ResetPassword />,
    public: true,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardLayout />,
    public: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminLayout />,
    public: false,
  }
];
