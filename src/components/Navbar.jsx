import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <button className={styles.logo} onClick={() => navigate('/projects')}>
          <span className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className={styles.logoText}>BUILD<span className={styles.logoAccent}>PRO</span></span>
        </button>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          <button
            className={`${styles.navLink} ${isActive('/projects') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/projects')}
          >
            Projects
          </button>
          <button
            className={`${styles.navLink} ${isActive('/dpr') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/dpr')}
          >
            New DPR
          </button>
        </div>

        {/* Right Controls */}
        <div className={styles.navRight}>
          {/* Theme Toggle */}
          <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* User Info */}
          <div className={styles.userChip}>
            <div className={styles.avatar}>{user?.email?.[0].toUpperCase()}</div>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>

          <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>

          {/* Mobile Menu */}
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.mobileLink} onClick={() => { navigate('/projects'); setMenuOpen(false) }}>
            Projects
          </button>
          <button className={styles.mobileLink} onClick={() => { navigate('/dpr'); setMenuOpen(false) }}>
            New DPR
          </button>
          <div className={styles.mobileDivider} />
          <button className={styles.mobileLink} onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className={`${styles.mobileLink} ${styles.mobileLinkDanger}`} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
