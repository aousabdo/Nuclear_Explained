import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const BlastPage = lazy(() => import('./pages/BlastPage'))
const ConsequencesPage = lazy(() => import('./pages/ConsequencesPage'))
const ThreatPage = lazy(() => import('./pages/ThreatPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const YourRiskPage = lazy(() => import('./pages/YourRiskPage'))
const ExpertPage = lazy(() => import('./pages/ExpertPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const chapterRoutes = [
  { index: true, Component: HomePage },
  { path: 'blast', Component: BlastPage },
  { path: 'consequences', Component: ConsequencesPage },
  { path: 'threat', Component: ThreatPage },
  { path: 'history', Component: HistoryPage },
  { path: 'your-risk', Component: YourRiskPage },
  { path: 'expert', Component: ExpertPage },
]

// Passthrough layout for /ar/* routes — just renders children
function PassthroughLayout() {
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      // English routes (no prefix)
      ...chapterRoutes,
      // Arabic routes (/ar prefix)
      {
        path: 'ar',
        Component: PassthroughLayout,
        children: chapterRoutes,
      },
      // 404 catch-all
      { path: '*', Component: NotFoundPage },
    ],
  },
])
