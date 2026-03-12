export const MOCK_CREDENTIALS = {
  email: 'test@test.com',
  password: '123456',
}

export const PROJECTS = [
  {
    id: 'proj-001',
    name: 'Skyline Tower — Phase 2',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-06-30',
    location: 'Downtown, Chicago, IL',
    manager: 'Marcus Reid',
    progress: 64,
    budget: '$12.4M',
    description: 'High-rise residential tower construction, floors 15–32. Includes structural steel, curtain wall, and MEP rough-in.',
  },
  {
    id: 'proj-002',
    name: 'Westside Industrial Park',
    status: 'active',
    startDate: '2024-06-15',
    endDate: '2025-02-28',
    location: 'West Loop, Chicago, IL',
    manager: 'Priya Nair',
    progress: 38,
    budget: '$7.8M',
    description: 'Three-building warehouse complex with loading docks, office fitout, and site utilities.',
  },
  {
    id: 'proj-003',
    name: 'Harbor Bridge Rehabilitation',
    status: 'delayed',
    startDate: '2023-11-01',
    endDate: '2024-12-31',
    location: 'Navy Pier, Chicago, IL',
    manager: 'Tom Guzman',
    progress: 51,
    budget: '$3.2M',
    description: 'Structural rehabilitation of pedestrian bridge including deck replacement and bearing upgrade.',
  },
  {
    id: 'proj-004',
    name: 'Lakeview Mixed-Use Development',
    status: 'planning',
    startDate: '2025-01-15',
    endDate: '2026-08-31',
    location: 'Lakeview, Chicago, IL',
    manager: 'Sarah Chen',
    progress: 8,
    budget: '$22.1M',
    description: 'Mixed-use 12-story building with ground-floor retail, residential units above, and underground parking.',
  },
  {
    id: 'proj-005',
    name: 'Midway Logistics Hub',
    status: 'completed',
    startDate: '2023-04-01',
    endDate: '2024-02-28',
    location: 'Midway, Chicago, IL',
    manager: 'James Park',
    progress: 100,
    budget: '$5.6M',
    description: 'Single-story logistics facility with dock levelers, ESFR sprinkler system, and 40-foot clear heights.',
  },
]

export const STATUS_LABELS = {
  active: 'Active',
  planning: 'Planning',
  delayed: 'Delayed',
  completed: 'Completed',
  'on-hold': 'On Hold',
}

export const WEATHER_OPTIONS = [
  { value: '', label: 'Select weather condition' },
  { value: 'sunny', label: '☀️  Sunny' },
  { value: 'partly-cloudy', label: '⛅  Partly Cloudy' },
  { value: 'cloudy', label: '☁️  Cloudy' },
  { value: 'rainy', label: '🌧️  Rainy' },
  { value: 'stormy', label: '⛈️  Stormy' },
  { value: 'foggy', label: '🌫️  Foggy' },
  { value: 'snowy', label: '❄️  Snowy' },
]

export const STATUS_FILTERS = ['all', 'active', 'planning', 'delayed', 'completed', 'on-hold']
