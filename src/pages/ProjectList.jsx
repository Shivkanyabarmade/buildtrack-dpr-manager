import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { PROJECTS, STATUS_LABELS, STATUS_FILTERS } from '../constants'
import { formatDate } from '../utils'
import styles from './ProjectList.module.css'

function ProjectCard({ project, onClick }) {
  const statusClass = {
    active: 'badge-active',
    planning: 'badge-planning',
    delayed: 'badge-delayed',
    completed: 'badge-completed',
    'on-hold': 'badge-on-hold',
  }[project.status] || 'badge-planning'

  return (
    <button className={styles.card} onClick={onClick} aria-label={`Open DPR for ${project.name}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={`badge ${statusClass}`}>
            <span className={styles.statusDot} />
            {STATUS_LABELS[project.status] || project.status}
          </span>
          <span className={styles.projectId}>{project.id}</span>
        </div>
        <svg className={styles.arrowIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h3 className={styles.cardTitle}>{project.name}</h3>
      <p className={styles.cardDesc}>{project.description}</p>

      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {project.location}
        </div>
        <div className={styles.detail}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {formatDate(project.startDate)}
        </div>
        <div className={styles.detail}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM1 10h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {project.budget}
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Progress</span>
          <span className={styles.progressValue}>{project.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${project.progress}%` }}
            data-status={project.status}
          />
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.manager}>
          <div className={styles.managerAvatar}>{project.manager[0]}</div>
          <span>{project.manager}</span>
        </div>
        <span className={styles.dprLink}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          File DPR
        </span>
      </div>
    </button>
  )
}

export default function ProjectList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.manager.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const counts = useMemo(() => {
    return PROJECTS.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    }, {})
  }, [])

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">

          {/* Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Projects</h1>
              <p className={styles.pageSubtitle}>{PROJECTS.length} active construction projects</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dpr')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New DPR
            </button>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            {[
              { label: 'Active', count: counts.active || 0, color: 'var(--accent-green)' },
              { label: 'Planning', count: counts.planning || 0, color: 'var(--accent-blue)' },
              { label: 'Delayed', count: counts.delayed || 0, color: 'var(--accent-red)' },
              { label: 'Completed', count: counts.completed || 0, color: 'var(--text-muted)' },
            ].map((s) => (
              <div
                key={s.label}
                className={`${styles.statCard} ${statusFilter === s.label.toLowerCase() ? styles.statCardActive : ''}`}
                onClick={() => setStatusFilter(s.label.toLowerCase() === statusFilter ? 'all' : s.label.toLowerCase())}
              >
                <span className={styles.statCount} style={{ color: s.color }}>{s.count}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className={styles.filterBar}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search projects, locations, managers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                aria-label="Search projects"
              />
              {search && (
                <button className={styles.clearSearch} onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            <div className={styles.statusFilters}>
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>No projects found matching your filters.</p>
              <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatusFilter('all') }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  className="animate-fade-in"
                >
                  <ProjectCard
                    project={p}
                    onClick={() => navigate(`/dpr/${p.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
