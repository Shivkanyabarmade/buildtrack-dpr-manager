// ===== VALIDATION UTILS =====

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!re.test(email)) return 'Please enter a valid email address'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export function validateDPRForm(values) {
  const errors = {}

  if (!values.projectId) errors.projectId = 'Please select a project'
  if (!values.date) {
    errors.date = 'Date is required'
  } else {
    const d = new Date(values.date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (d > today) errors.date = 'Date cannot be in the future'
  }
  if (!values.weather) errors.weather = 'Please select weather condition'
  if (!values.workDescription || values.workDescription.trim().length < 20) {
    errors.workDescription = 'Work description must be at least 20 characters'
  }
  if (values.workDescription && values.workDescription.trim().length > 2000) {
    errors.workDescription = 'Work description cannot exceed 2000 characters'
  }
  if (values.workerCount === '' || values.workerCount === null || values.workerCount === undefined) {
    errors.workerCount = 'Worker count is required'
  } else if (isNaN(Number(values.workerCount)) || Number(values.workerCount) < 0) {
    errors.workerCount = 'Worker count must be a positive number'
  } else if (!Number.isInteger(Number(values.workerCount))) {
    errors.workerCount = 'Worker count must be a whole number'
  } else if (Number(values.workerCount) > 9999) {
    errors.workerCount = 'Worker count seems unusually high — please verify'
  }

  return errors
}

// ===== FORMAT UTILS =====

export function formatDate(dateString) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateInput(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toISOString().split('T')[0]
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

// ===== FILE UTILS =====

export function validateImages(files) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  const errors = []

  Array.from(files).forEach((file) => {
    if (!validTypes.includes(file.type)) {
      errors.push(`"${file.name}" is not a valid image type (JPEG, PNG, WebP, GIF only)`)
    }
    if (file.size > maxSize) {
      errors.push(`"${file.name}" exceeds 5MB limit`)
    }
  })

  return errors
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ===== STORAGE UTILS (mock persistence) =====

export function saveDPRReport(report) {
  const existing = getDPRReports()
  const newReport = { ...report, id: `dpr-${Date.now()}`, submittedAt: new Date().toISOString() }
  localStorage.setItem('dpr_reports', JSON.stringify([...existing, newReport]))
  return newReport
}

export function getDPRReports() {
  try {
    return JSON.parse(localStorage.getItem('dpr_reports') || '[]')
  } catch {
    return []
  }
}
