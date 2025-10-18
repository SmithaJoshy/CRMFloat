import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { api } from '../services/api';

interface Project {
  _id: string;
  dealId: string;
  projectName: string;
  clientName: string;
  currentStage: string;
  totalProjectValue: number;
  projectStatus: string;
  priorityLevel: string;
  projectStartDate: string;
  expectedCompletionDate: string;
  assignedTeam?: {
    assignedDesigner?: string;
    assignedProjectManager?: string;
    assignedSales?: string;
  };
  propertyType?: {
    dealType: string;
    propertyType: string;
  };
  size?: {
    displayText: string;
  };
  location?: {
    city: string;
    state: string;
  };
}

const ProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const workflowStages = [
    'Lead Generation',
    'Initial Engagement',
    'Scheduling Visit',
    'Site Visit & Briefing',
    'Design in Progress',
    'Concept Design',
    'Contract Signed (50% Due)',
    'Detailed Drawings & Vendor Coordination',
    'Production (40% im Due)',
    'Project Closure (Final 10% Payment)',
    'Project Completed',
    'Follow-up & Warranty Service',
    'Beyond Care'
  ];

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/deals/${id}`);
      setProject(response.data);
    } catch (err: any) {
      setError('Failed to fetch project details');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      const response = await api.put(`/deals/${project._id}`, project);
      setProject(response.data.deal);
      setSnackbarMessage('Project updated successfully!');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage('Failed to update project');
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    navigate(`/project/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading project details...</Typography>
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Project not found'}</Alert>
        <Button onClick={() => navigate('/kanban')} sx={{ mt: 2 }}>
          Back to Kanban
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/kanban')}
          sx={{ textDecoration: 'none' }}
        >
          Kanban Board
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/project/${id}`)}
          sx={{ textDecoration: 'none' }}
        >
          Project Details
        </Link>
        <Typography color="text.primary">Edit Project</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit Project: {project.projectName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Edit Form */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={project.projectName}
              onChange={(e) => setProject(prev => prev ? { ...prev, projectName: e.target.value } : null)}
            />
            
            <TextField
              fullWidth
              label="Client Name"
              value={project.clientName}
              onChange={(e) => setProject(prev => prev ? { ...prev, clientName: e.target.value } : null)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Current Stage</InputLabel>
              <Select
                value={project.currentStage}
                onChange={(e) => setProject(prev => prev ? { ...prev, currentStage: e.target.value } : null)}
                label="Current Stage"
              >
                {workflowStages.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Project Value"
              type="number"
              value={project.totalProjectValue}
              onChange={(e) => setProject(prev => prev ? { ...prev, totalProjectValue: parseFloat(e.target.value) || 0 } : null)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Project Status</InputLabel>
              <Select
                value={project.projectStatus}
                onChange={(e) => setProject(prev => prev ? { ...prev, projectStatus: e.target.value } : null)}
                label="Project Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority Level</InputLabel>
              <Select
                value={project.priorityLevel}
                onChange={(e) => setProject(prev => prev ? { ...prev, priorityLevel: e.target.value } : null)}
                label="Priority Level"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Project Start Date"
              type="date"
              value={project.projectStartDate ? project.projectStartDate.split('T')[0] : ''}
              onChange={(e) => setProject(prev => prev ? { ...prev, projectStartDate: e.target.value } : null)}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Expected Completion Date"
              type="date"
              value={project.expectedCompletionDate ? project.expectedCompletionDate.split('T')[0] : ''}
              onChange={(e) => setProject(prev => prev ? { ...prev, expectedCompletionDate: e.target.value } : null)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectEdit;
