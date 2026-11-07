import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { IconDashboard, IconTransactions, IconCategory, IconReports, IconBudget, IconUser, IconLogout } from './Icons';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',    Icon: IconDashboard    },
  { to: '/transaction', label: 'Transactions',  Icon: IconTransactions },
  { to: '/category',    label: 'Categories',    Icon: IconCategory     },
  { to: '/reports',     label: 'Reports',       Icon: IconReports      },
  { to: '/budgets',     label: 'Budgets',       Icon: IconBudget       },
  { to: '/profile',     label: 'Profile',       Icon: IconUser         },
];

function Sidebar() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' sidebar-item--active' : ''}`
            }
          >
            <span className="sidebar-icon"><Icon size={18} /></span>
            <span className="sidebar-label">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon"><IconLogout size={18} /></span>
          <span className="sidebar-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
