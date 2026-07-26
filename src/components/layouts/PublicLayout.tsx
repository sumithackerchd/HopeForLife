import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 w-full max-w-full overflow-x-hidden flex flex-col min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
