import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { api } from '../services/api';

interface Project {
  _id: string;
  dealId: string;
  projectName: string;
  currentStage: string;
  totalProjectValue: number;
  projectStatus: string;
  priorityLevel: string;
  clientName: string;
  projectStartDate: string;
  expectedCompletionDate: string;
  assignedTeam: {
    assignedDesigner: string;
    assignedPM: string;
  };
  propertyType: {
    dealType: string;
    propertyType: string;
  };
  size: {
    displayText: string;
  };
  location: {
    city: string;
    state: string;
  };
  designStatus: {
    design3DStatus: string;
    design3DProgress: number;
    moodBoardShared: boolean;
  };
  activities: {
    tasks: any[];
  };
  createdAt: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const workflowStages = [
    'Lead Generation',
    'Initial Engagement',
    'Scheduling Visit',
    'Consultation & Data Capture',
    'Design in Progress',
    'Design Presentation & Fee Due',
    'Costing Shared',
    'Contract Signed (50% Due)',
    'Site Measurement Visit',
    'Detailed Drawings & Vendor Coordination',
    'Production (40% Interim Due)',
    'Project Closure (Final 10% Payment)',
    'Project Completed',
  ];

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/deals/${id}`);
      setProject(response.data.deal);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };


  const getStageIndex = (stage: string) => {
    return workflowStages.indexOf(stage);
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Project not found</Alert>
        <Button onClick={() => navigate('/pipeline')} startIcon={<ArrowBackIcon />}>
          Back to Pipeline
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/pipeline')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" gutterBottom>
            {project.projectName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Project ID: {project.dealId}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/project-edit/${id}`)}
          >
            Edit Project
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Project Overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card sx={{ flex: '1 1 300px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Client:</strong> {project.clientName}
              </Typography>
              <Typography variant="body2">
                <strong>Project ID:</strong> {project.dealId}
              </Typography>
              <Typography variant="body2">
                <strong>Property Type:</strong> {project.propertyType?.propertyType || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Size:</strong> {project.size?.displayText || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Location:</strong> {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 300px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team & Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Designer:</strong> {project.assignedTeam?.assignedDesigner || 'Not assigned'}
              </Typography>
              <Typography variant="body2">
                <strong>Project Manager:</strong> {project.assignedTeam?.assignedPM || 'Not assigned'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> 
                <Chip 
                  label={project.projectStatus} 
                  color={project.projectStatus === 'Active' ? 'success' : 'default'}
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2">
                <strong>Stage:</strong> {project.currentStage}
              </Typography>
              <Typography variant="body2">
                <strong>Value:</strong> ₹{project.totalProjectValue?.toLocaleString() || '0'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Workflow Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon />
            Workflow Progress
          </Typography>
          <Stepper activeStep={getStageIndex(project.currentStage)} alternativeLabel>
            {workflowStages.map((stage) => (
              <Step key={stage}>
                <StepLabel>{stage}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Project Timeline */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon />
            Project Timeline
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Project Start Date"
                secondary={project.projectStartDate ? new Date(project.projectStartDate).toLocaleDateString() : 'Not set'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Expected Completion Date"
                secondary={project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toLocaleDateString() : 'Not set'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Design Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon />
            Design Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                3D Design Status
              </Typography>
              <Typography variant="body1">
                {project.designStatus?.design3DStatus || 'Not Started'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body1">
                {project.designStatus?.design3DProgress || 0}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Mood Board Shared
              </Typography>
              <Typography variant="body1">
                {project.designStatus?.moodBoardShared ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Project Documents */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon />
            Project Documents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                All project-related documents, contracts, and files
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/documents')}
              >
                View All Documents
              </Button>
            </Box>
            
            {/* Sample Documents */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Project Contract - {project.projectName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF • 2.3 MB • Uploaded 2 days ago
                    </Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined">
                  Download
                </Button>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      3D Design Renderings
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ZIP • 15.2 MB • Uploaded 1 week ago
                    </Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined">
                  Download
                </Button>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Material Specifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      DOCX • 1.8 MB • Uploaded 3 days ago
                    </Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined">
                  Download
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Project Invoices */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon />
            Project Invoices & Payments
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                All invoices and payment records for this project
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/invoices')}
              >
                View All Invoices
              </Button>
            </Box>
            
            {/* Sample Invoices */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon sx={{ color: '#4caf50' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Invoice #INV-001 - Initial Payment (40%)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₹{((project.totalProjectValue || 0) * 0.4).toLocaleString()} • Paid • 2 weeks ago
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Paid" size="small" color="success" />
                  <Button size="small" variant="outlined">
                    View
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon sx={{ color: '#ff9800' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Invoice #INV-002 - Design Approval (30%)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₹{((project.totalProjectValue || 0) * 0.3).toLocaleString()} • Pending • Due in 5 days
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Pending" size="small" color="warning" />
                  <Button size="small" variant="outlined">
                    View
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon sx={{ color: '#666' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Invoice #INV-003 - Final Payment (30%)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₹{((project.totalProjectValue || 0) * 0.3).toLocaleString()} • Not Issued • Upon completion
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Not Issued" size="small" color="default" />
                  <Button size="small" variant="outlined" disabled>
                    View
                  </Button>
                </Box>
              </Box>
            </Box>
            
            {/* Payment Summary */}
            <Box sx={{ 
              mt: 2,
              p: 2,
              backgroundColor: '#e8f5e8',
              borderRadius: 1,
              border: '1px solid #c8e6c9'
            }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#2e7d32' }}>
                Payment Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  Total Project Value: ₹{project.totalProjectValue?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Paid: ₹{((project.totalProjectValue || 0) * 0.4).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Outstanding: ₹{((project.totalProjectValue || 0) * 0.6).toLocaleString()}
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  Progress: 40%
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

    </Box>
  );
};

export default ProjectDetails;
