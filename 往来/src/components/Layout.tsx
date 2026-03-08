import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hide bottom nav on specific pages like AddFriend and EditFriend
  const hideBottomNav = location.pathname === '/friends/add' || location.pathname.endsWith('/edit');

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar relative">
        <Outlet />
      </div>
      
      {!hideBottomNav && (
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-primary/10 px-4 pb-6 pt-2 z-20">
          <div className="flex justify-around items-end max-w-md mx-auto relative">
            <NavItem 
              to="/home" 
              icon="timer" 
              label="倒数" 
              isActive={location.pathname === '/home'} 
            />
            <NavItem 
              to="/friends" 
              icon="group" 
              label="亲友" 
              isActive={location.pathname === '/friends' || location.pathname.startsWith('/friends/')} 
            />
            <NavItem 
              to="/gifts" 
              icon="featured_seasonal_and_gifts" 
              label="礼物" 
              isActive={location.pathname === '/gifts'} 
            />
            <NavItem 
              to="/records" 
              icon="history" 
              label="记录" 
              isActive={location.pathname === '/records'} 
            />
          </div>
        </nav>
      )}
    </>
  );
}

function NavItem({ to, icon, label, isActive }: { to: string; icon: string; label: string; isActive: boolean }) {
  return (
    <Link 
      to={to} 
      className={clsx(
        "flex flex-col items-center gap-1 flex-1 transition-colors",
        isActive ? "text-primary" : "text-slate-400 hover:text-primary"
      )}
    >
      <span className={clsx("material-symbols-outlined", isActive && "filled-icon")}>
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </Link>
  );
}
