import { useState } from "react";
import "./Sidebar.scss";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SIDEBAR_MENU } from "./Menu";
import logo from "../../assets/sidebar-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import Modal from "../Modal/Modal";
import { toast } from 'react-toastify';

export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector(state => state.auth.user);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const openLogoutModal = () => setIsModalOpen(true);
  const closeLogoutModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    closeLogoutModal();
  };

  const renderSidebarItem = (item, index) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSubItemActive = hasSubItems && item.subItems.some((subItem) => subItem.path === location.pathname);
    const isSubMenuOpen = activeMenu === item.name || isSubItemActive;

    return (
      <div key={index} className="list">
        {hasSubItems ? (
          <div
            className={`list-headname ${isSubMenuOpen ? "active" : ""}`}
            onClick={() => !collapsed && toggleMenu(item.name)}
          >
            <div className="item-content-sub">
              <i className={item.icon} title={collapsed ? item.name : ''}></i>
              {!collapsed && <p>{item.name}</p>}
              {!collapsed && <i className={isSubMenuOpen ? "bx bx-chevron-down" : "bx bx-chevron-right"}></i>}
            </div>
          </div>
        ) : (
          <NavLink to={item.path} className="list-headname">
            <div className="item-content">
              <i className={item.icon} title={collapsed ? item.name : ''}></i>
              {!collapsed && <p>{item.name}</p>}
            </div>
          </NavLink>
        )}
        {hasSubItems && !collapsed && (
          <div className={`sub-list ${isSubMenuOpen ? "open" : ""}`}>
            {item.subItems.map((subItem, subIndex) => (
              <NavLink key={subIndex} to={subItem.path}>
                <p>{subItem.name}</p>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {!collapsed && <img className="sidebar__logo" src={logo} alt="FlexiTrip Logo" />}
        <button className="sidebar__toggle" onClick={onToggle}>
          <i className={`bx ${collapsed ? 'bx-chevron-right' : 'bx-chevron-left'}`}></i>
        </button>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__list">{SIDEBAR_MENU.map(renderSidebarItem)}</div>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__footer-content">
          <div className="sidebar__profile-avatar">
            <i className="bx bxs-user-circle"></i>
          </div>
          {!collapsed && (
            <div className="sidebar__profile-info">
              <div className="sidebar__profile-name">{user?.name || 'Admin'}</div>
              <div className="sidebar__profile-subtitle">{user?.email || 'admin@flexitrip.com'}</div>
            </div>
          )}
          {!collapsed && (
            <div className="sidebar__logout-btn" onClick={openLogoutModal}>
              <i className="bx bx-log-out"></i>
            </div>
          )}
          {collapsed && (
            <div className="sidebar__logout-btn" onClick={openLogoutModal} style={{ margin: '0 auto' }}>
              <i className="bx bx-log-out"></i>
            </div>
          )}
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeLogoutModal} title="Logout Confirmation" width="500px">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <i className="bx bx-log-out-circle" style={{ fontSize: '48px', color: '#dc3545', marginBottom: '15px' }}></i>
          <h4 style={{ marginBottom: '15px' }}>Are you sure?</h4>
          <p style={{ marginBottom: '20px', color: '#6c757d' }}>You will be logged out of your current session and redirected to the login page.</p>
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleLogout}>Logout</button>
          <button className="cancel-button" onClick={closeLogoutModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}