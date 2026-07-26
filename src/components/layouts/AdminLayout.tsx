import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Heart, FileText, Settings, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Assuming RouteGuard handles actual admin role check
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Campaigns', path: '/admin/campaigns', icon: FileText },
    { name: 'Donations', path: '/admin/donations', icon: Heart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/10">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white border-r border-slate-800 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="text-lg font-bold text-white">HopeForLife Admin</Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link key={item.path} to={item.path}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}>
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-800 absolute bottom-0 w-full md:w-64">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0 bg-background">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};