import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { PROJECTS, WEATHER_OPTIONS } from '../constants'
import { validateDPRForm, getTodayString, validateImages, readFileAsDataURL, saveDPRReport } from '../utils'
import styles from './DPRForm.module.css'

const INITIAL_FORM = {
  projectId: '',
  date: getTodayString(),
  weather: '',
  workDescription: '',
  workerCount: '',
}

export default function DPRForm() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ ...INITIAL_FORM, projectId: projectId || '' })
  const [errors, setErrors] = useState({})
  const [photos, setPhotos] = useState([]) // [{file, preview, name, size}]
  const [photoError, setPhotoError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // Selected project details
  const selectedProject = PROJECTS.find((p) => p.id === form.projectId)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePhotoAdd = async (files) => {
    const fileArr = Array.from(files)
    const remaining = 3 - photos.length

    if (remaining <= 0) {
      setPhotoError('Maximum 3 photos allowed. Remove one to add another.')
      return
    }

    const toProcess = fileArr.slice(0, remaining)
    const imgErrors = validateImages(toProcess)

    if (imgErrors.length > 0) {
      setPhotoError(imgErrors[0])
      return
    }

    setPhotoError('')

    const newPhotos = await Promise.all(
      toProcess.map(async (file) => ({
        file,
        preview: await readFileAsDataURL(file),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
      }))
    )

    setPhotos((prev) => [...prev, ...newPhotos])

    if (fileArr.length > remaining) {
      setPhotoError(`Only ${remaining} photo(s) added. Maximum 3 photos allowed.`)
    }
  }

  const handlePhotoDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    handlePhotoAdd(e.dataTransfer.files)
  }

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
    setPhotoError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateDPRForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Scroll to first error
      const firstErrKey = Object.keys(validationErrors)[0]
      document.getElementById(firstErrKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))

    const report = saveDPRReport({
      ...form,
      photoCount: photos.length,
      projectName: selectedProject?.name,
    })

    setSubmitting(false)
    setSubmitted(true)
    setToast({ message: `DPR submitted successfully! Report ID: ${report.id}`, type: 'success' })

    // Reset after 3s
    setTimeout(() => {
      setForm({ ...INITIAL_FORM })
      setPhotos([])
      setErrors({})
      setSubmitted(false)
    }, 3000)
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM, projectId: projectId || '' })
    setPhotos([])
    setErrors({})
    setPhotoError('')
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className={styles.main}>
        <div className="container">

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <button onClick={() => navigate('/projects')} className={styles.breadcrumbLink}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Projects
            </button>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Daily Progress Report</span>
          </div>

          <div className={styles.layout}>
            {/* Form */}
            <div className={styles.formCol}>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Daily Progress Report</h1>
                <p className={styles.formSubtitle}>
                  Document today's site activities, workforce, and conditions
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className={styles.form}>

                {/* Section 1: Project & Date */}
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.sectionNum}>01</span>
                    Report Details
                  </div>

                  {/* Project Select */}
                  <div className="form-group">
                    <label htmlFor="projectId">Project *</label>
                    <select
                      id="projectId"
                      name="projectId"
                      value={form.projectId}
                      onChange={handleChange}
                      className={errors.projectId ? styles.fieldError : ''}
                      aria-invalid={!!errors.projectId}
                      aria-describedby={errors.projectId ? 'projectId-error' : undefined}
                    >
                      <option value="">Select a project</option>
                      {PROJECTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.projectId && (
                      <span className="error-msg" id="projectId-error" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        {errors.projectId}
                      </span>
                    )}
                  </div>

                  <div className={styles.row2}>
                    {/* Date */}
                    <div className="form-group">
                      <label htmlFor="date">Report Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        max={getTodayString()}
                        className={errors.date ? styles.fieldError : ''}
                        aria-invalid={!!errors.date}
                        aria-describedby={errors.date ? 'date-error' : undefined}
                      />
                      {errors.date && (
                        <span className="error-msg" id="date-error" role="alert">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          {errors.date}
                        </span>
                      )}
                    </div>

                    {/* Weather */}
                    <div className="form-group">
                      <label htmlFor="weather">Weather Condition *</label>
                      <select
                        id="weather"
                        name="weather"
                        value={form.weather}
                        onChange={handleChange}
                        className={errors.weather ? styles.fieldError : ''}
                        aria-invalid={!!errors.weather}
                        aria-describedby={errors.weather ? 'weather-error' : undefined}
                      >
                        {WEATHER_OPTIONS.map((w) => (
                          <option key={w.value} value={w.value} disabled={!w.value}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                      {errors.weather && (
                        <span className="error-msg" id="weather-error" role="alert">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          {errors.weather}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Workforce */}
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.sectionNum}>02</span>
                    Workforce
                  </div>

                  <div className="form-group">
                    <label htmlFor="workerCount">Number of Workers on Site *</label>
                    <div className={styles.counterWrap}>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        onClick={() => setForm((p) => ({ ...p, workerCount: Math.max(0, Number(p.workerCount || 0) - 1).toString() }))}
                        aria-label="Decrease worker count"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <input
                        type="number"
                        id="workerCount"
                        name="workerCount"
                        value={form.workerCount}
                        onChange={handleChange}
                        min="0"
                        max="9999"
                        placeholder="0"
                        className={`${styles.counterInput} ${errors.workerCount ? styles.fieldError : ''}`}
                        aria-invalid={!!errors.workerCount}
                        aria-describedby={errors.workerCount ? 'workerCount-error' : undefined}
                      />
                      <button
                        type="button"
                        className={styles.counterBtn}
                        onClick={() => setForm((p) => ({ ...p, workerCount: (Number(p.workerCount || 0) + 1).toString() }))}
                        aria-label="Increase worker count"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                    {errors.workerCount && (
                      <span className="error-msg" id="workerCount-error" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        {errors.workerCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Section 3: Work Description */}
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.sectionNum}>03</span>
                    Work Description
                  </div>

                  <div className="form-group">
                    <label htmlFor="workDescription">
                      Activities & Progress Notes *
                    </label>
                    <textarea
                      id="workDescription"
                      name="workDescription"
                      value={form.workDescription}
                      onChange={handleChange}
                      placeholder="Describe work completed today, milestones reached, areas worked on, materials used, equipment deployed, and any notable observations..."
                      rows={6}
                      className={errors.workDescription ? styles.fieldError : ''}
                      aria-invalid={!!errors.workDescription}
                      aria-describedby={errors.workDescription ? 'workDescription-error' : undefined}
                    />
                    <div className={styles.charCount}>
                      <span className={errors.workDescription ? 'error-msg' : ''}>
                        {errors.workDescription && (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            {errors.workDescription}
                          </>
                        )}
                      </span>
                      <span className={`${styles.charCountNum} ${form.workDescription.length > 1800 ? styles.charCountWarn : ''}`}>
                        {form.workDescription.length}/2000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Photos */}
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.sectionNum}>04</span>
                    Site Photos
                    <span className={styles.optional}>Optional</span>
                  </div>

                  {/* Drop Zone */}
                  {photos.length < 3 && (
                    <div
                      className={styles.dropZone}
                      onDrop={handlePhotoDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload site photos"
                      onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        multiple
                        className={styles.fileInput}
                        onChange={(e) => handlePhotoAdd(e.target.files)}
                        aria-hidden="true"
                      />
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className={styles.dropZoneText}>
                        Drop photos here or <span>click to browse</span>
                      </p>
                      <p className={styles.dropZoneHint}>
                        JPEG, PNG, WebP, GIF · Max 5MB each · Up to {3 - photos.length} more photo{3 - photos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {photoError && (
                    <div className={styles.photoError}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {photoError}
                    </div>
                  )}

                  {/* Previews */}
                  {photos.length > 0 && (
                    <div className={styles.photoGrid}>
                      {photos.map((photo, i) => (
                        <div key={i} className={styles.photoItem}>
                          <img src={photo.preview} alt={`Site photo ${i + 1}`} className={styles.photoPreview} />
                          <div className={styles.photoInfo}>
                            <span className={styles.photoName}>{photo.name}</span>
                            <span className={styles.photoSize}>{photo.size}</span>
                          </div>
                          <button
                            type="button"
                            className={styles.photoRemove}
                            onClick={() => removePhoto(i)}
                            aria-label={`Remove photo ${photo.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={`btn btn-ghost ${styles.resetBtn}`}
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.submitBtn}`}
                    disabled={submitting || submitted}
                  >
                    {submitting ? (
                      <>
                        <span className={styles.spinner} />
                        Submitting...
                      </>
                    ) : submitted ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Report Submitted!
                      </>
                    ) : (
                      <>
                        Submit Daily Report
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              {/* Project Info Card */}
              {selectedProject ? (
                <div className={styles.sideCard}>
                  <div className={styles.sideCardHeader}>
                    <h3>Selected Project</h3>
                  </div>
                  <h4 className={styles.sideProjectName}>{selectedProject.name}</h4>
                  <div className={styles.sideDetails}>
                    <div className={styles.sideStat}>
                      <span>Location</span>
                      <strong>{selectedProject.location}</strong>
                    </div>
                    <div className={styles.sideStat}>
                      <span>Manager</span>
                      <strong>{selectedProject.manager}</strong>
                    </div>
                    <div className={styles.sideStat}>
                      <span>Budget</span>
                      <strong>{selectedProject.budget}</strong>
                    </div>
                    <div className={styles.sideStat}>
                      <span>Progress</span>
                      <strong>{selectedProject.progress}%</strong>
                    </div>
                  </div>
                  <div className={styles.sideProgressBar}>
                    <div
                      className={styles.sideProgressFill}
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.sideCard}>
                  <div className={styles.sideEmpty}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <p>Select a project to see details</p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h3>Report Tips</h3>
                </div>
                <ul className={styles.tipsList}>
                  {[
                    'Include specific areas and zones worked',
                    'Note any safety incidents or near-misses',
                    'Mention equipment and material deliveries',
                    'Record weather impact on work progress',
                    'List any blocked or delayed activities',
                  ].map((tip, i) => (
                    <li key={i} className={styles.tip}>
                      <span className={styles.tipDot} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Back to Projects */}
              <button
                className={`btn btn-ghost ${styles.backBtn}`}
                onClick={() => navigate('/projects')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
