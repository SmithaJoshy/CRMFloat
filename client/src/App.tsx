import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import Clients from './pages/Clients';
import Leads from './pages/Leads-v2';
import BeyondCare from './pages/BeyondCare';
import Invoices from './pages/Invoices';
import Workflow from './pages/Workflow';
import ProjectDetails from './pages/ProjectDetails';
import ProjectEdit from './pages/ProjectEdit';
import Kanban from './pages/Kanban';
import Payments from './pages/Payments';
import Documents from './pages/Documents';
import Designers from './pages/Designers';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<Clients />} />
              <Route path="warranty" element={<BeyondCare />} />
              <Route path="customer-success" element={<BeyondCare />} />
              <Route path="workflow" element={<Workflow />} />
              <Route path="kanban" element={<Kanban />} />
              <Route path="team" element={<Designers />} />
              <Route path="designers" element={<Designers />} />
              <Route path="project/:id" element={<ProjectDetails />} />
              <Route path="project-edit/:id" element={<ProjectEdit />} />
              <Route path="payments" element={<Payments />} />
              <Route path="documents" element={<Documents />} />
              <Route path="invoices" element={<Invoices />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;