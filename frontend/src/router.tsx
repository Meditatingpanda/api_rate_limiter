import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'
import AppShell from './components/app-shell.tsx'
import Dashboard from './pages/dashboard/index.tsx'

const router = createBrowserRouter([
  

  // Main routes
  {
    path: '/',
    // lazy: async () => {
    //   const AppShell = await import('./components/app-shell')
    //   return { Component: AppShell.default }
    // },
    Component: AppShell,
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        // lazy: async () => ({
        //   Component: (await import('./pages/dashboard')).default,
        // }),
        Component: Dashboard,
      },
    
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
