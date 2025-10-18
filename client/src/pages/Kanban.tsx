import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Restaurant as RestaurantIcon,
  LocalHospital as HospitalIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '../services/api';

interface Project {
  _id: string;
  dealId: string;
  projectName: string;
  clientName: string;
  currentStage: string;
  projectStatus: string;
  totalProjectValue: number;
  projectStartDate: string;
  expectedCompletionDate: string;
  assignedTeam: {
    assignedDesigner: string;
    assignedPM: string;
    assignedSales: string;
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
    tasks: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      assignedTo: string;
    }>;
  };
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  projects: Project[];
}

interface ProjectHealth {
  projectId: string;
  healthStatus: 'green' | 'yellow' | 'red';
  overdueInvoices: number;
  pendingAmount: number;
  totalOverdue: number;
}

const Kanban: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectHealth, setProjectHealth] = useState<ProjectHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    totalProjectValue: 0,
    propertyType: '',
    size: '',
    location: '',
    currentStage: 'Lead Generation'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const stages = [
    { id: 'Lead Generation', title: 'Lead Generation', color: '#e3f2fd' },
    { id: 'Initial Engagement', title: 'Initial Engagement', color: '#f3e5f5' },
    { id: 'Scheduling Visit', title: 'Scheduling Visit', color: '#fff8e1' },
    { id: 'Consultation & Data Capture', title: 'Consultation & Data Capture', color: '#fff3e0' },
    { id: 'Design in Progress', title: 'Design in Progress', color: '#f1f8e9' },
    { id: 'Design Presentation & Fee Due', title: 'Design Presentation & Fee Due', color: '#e8f5e8' },
    { id: 'Costing Shared', title: 'Costing Shared', color: '#fce4ec' },
    { id: 'Contract Signed (50% Due)', title: 'Contract Signed (50% Due)', color: '#e0f2f1' },
    { id: 'Site Measurement Visit', title: 'Site Measurement Visit', color: '#f3e5f5' },
    { id: 'Detailed Drawings & Vendor Coordination', title: 'Detailed Drawings & Vendor Coordination', color: '#fffde7' },
    { id: 'Production (40% Interim Due)', title: 'Production (40% Interim Due)', color: '#e8eaf6' },
    { id: 'Project Closure (Final 10% Payment)', title: 'Project Closure (Final 10% Payment)', color: '#f1f8e9' },
    { id: 'Project Completed', title: 'Project Completed', color: '#e8f5e8' }
  ];

  // Sortable Project Card Component
  interface SortableProjectCardProps {
    project: Project;
    onCardClick: (project: Project) => void;
    healthData?: ProjectHealth;
  }

  const SortableProjectCard: React.FC<SortableProjectCardProps> = ({ project, onCardClick, healthData }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: project._id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const getPropertyIcon = (propertyType: string) => {
      if (propertyType?.includes('Apartment') || propertyType?.includes('Villa') || propertyType?.includes('House')) {
        return <HomeIcon fontSize="small" />;
      }
      if (propertyType?.includes('Office')) {
        return <BusinessIcon fontSize="small" />;
      }
      if (propertyType?.includes('Restaurant')) {
        return <RestaurantIcon fontSize="small" />;
      }
      if (propertyType?.includes('Healthcare')) {
        return <HospitalIcon fontSize="small" />;
      }
      return <BusinessIcon fontSize="small" />;
    };

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    };

    return (
      <Card
        ref={setNodeRef}
        style={style}
        sx={{
          mb: 2,
          cursor: 'pointer',
          '&:hover': { boxShadow: 3 },
          transition: 'box-shadow 0.2s',
          borderLeft: `5px solid ${project.projectStatus === 'Active' ? '#4caf50' : '#9e9e9e'}`,
        }}
        onClick={() => onCardClick(project)}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {project.projectName}
              </Typography>
              {healthData && (
                <Tooltip title={`Health: ${healthData.healthStatus.toUpperCase()}. ${healthData.overdueInvoices} overdue invoices. ₹${healthData.totalOverdue.toLocaleString()} overdue`}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 
                        healthData.healthStatus === 'green' ? '#4caf50' :
                        healthData.healthStatus === 'yellow' ? '#ff9800' : '#f44336',
                      border: '2px solid white',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            <Tooltip title="Drag to move between stages">
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ 
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' }
                }}
              >
                <DragIcon sx={{ color: 'text.disabled' }} />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Client: {project.clientName}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={0.5}>
            {getPropertyIcon(project.propertyType?.propertyType || '')}
            <Typography variant="body2" color="text.secondary" ml={0.5}>
              {project.propertyType?.propertyType || 'Property type not specified'}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {project.size?.displayText || 'Size not specified'} • {project.location?.city || 'Location TBD'}, {project.location?.state || 'State TBD'}
          </Typography>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" color="primary.main">
              {formatCurrency(project.totalProjectValue || 0)}
            </Typography>
            <Chip
              label={project.projectStatus || 'Unknown'}
              size="small"
              color={project.projectStatus === 'Active' ? 'success' : 'default'}
            />
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {project.assignedTeam?.assignedDesigner || 'Not assigned'}
            </Typography>
          </Box>
          
          {project.designStatus && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                3D Design: {project.designStatus.design3DStatus} ({project.designStatus.design3DProgress}%)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={project.designStatus.design3DProgress}
                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
              />
            </Box>
          )}
          
          {project.activities?.tasks && project.activities.tasks.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Tasks: {project.activities.tasks.filter(t => t.status === 'Completed').length}/{project.activities.tasks.length} completed
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deals');
      setProjects(response.data.deals || []);
      await fetchProjectHealth();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectHealth = async () => {
    try {
      const response = await api.get('/invoices');
      const invoices = response.data.invoices || [];
      
      const healthData: ProjectHealth[] = projects.map(project => {
        const projectInvoices = invoices.filter((inv: any) => inv.projectId === project._id);
        const overdueInvoices = projectInvoices.filter((inv: any) => 
          inv.paymentStatus === 'Overdue' || 
          (inv.paymentStatus === 'Sent' && new Date(inv.dueDate) < new Date())
        );
        const pendingAmount = projectInvoices
          .filter((inv: any) => inv.paymentStatus === 'Sent')
          .reduce((sum: number, inv: any) => sum + inv.amount, 0);
        const totalOverdue = overdueInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);

        let healthStatus: 'green' | 'yellow' | 'red' = 'green';
        if (overdueInvoices.length > 0) {
          healthStatus = 'red';
        } else if (pendingAmount > 0) {
          healthStatus = 'yellow';
        }

        return {
          projectId: project._id,
          healthStatus,
          overdueInvoices: overdueInvoices.length,
          pendingAmount,
          totalOverdue
        };
      });

      setProjectHealth(healthData);
    } catch (err: any) {
      console.error('Failed to fetch project health:', err);
    }
  };

  const updateProjectStage = async (projectId: string, newStage: string) => {
    try {
      await api.put(`/deals/${projectId}/stage`, { stage: newStage });
      setSnackbarMessage('Project stage updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to update project stage');
      setSnackbarOpen(true);
      console.error('Error updating project stage:', err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const projectId = active.id as string;
    const newStageId = over.id as string;
    
    // Check if we're dropping on the same stage or a different stage
    const project = projects.find(p => p._id === projectId);
    if (!project) {
      setActiveId(null);
      return;
    }

    // If dropping on the same stage, just cancel
    if (project.currentStage === newStageId) {
      setActiveId(null);
      return;
    }

    // Validate that the new stage exists
    const validStage = stages.find(stage => stage.id === newStageId);
    if (!validStage) {
      setActiveId(null);
      return;
    }

    // Update the project stage locally first for immediate feedback
    const updatedProjects = projects.map(p => 
      p._id === projectId ? { ...p, currentStage: newStageId } : p
    );
    setProjects(updatedProjects);

    // Update the project stage on the server
    updateProjectStage(projectId, newStageId);
    
    setActiveId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCreateNewProject = () => {
    setOpenNewProjectDialog(true);
  };

  const handleSaveNewProject = async () => {
    try {
      // Create a new project with the form data
      const projectData = {
        projectName: newProject.projectName,
        clientName: newProject.clientName,
        clientEmail: newProject.clientEmail,
        clientPhone: newProject.clientPhone,
        totalProjectValue: newProject.totalProjectValue,
        propertyType: {
          dealType: 'Residential',
          propertyType: newProject.propertyType
        },
        size: {
          displayText: newProject.size
        },
        location: {
          city: newProject.location,
          state: 'Karnataka'
        },
        currentStage: newProject.currentStage,
        projectStatus: 'Active',
        projectStartDate: new Date().toISOString().split('T')[0],
        expectedCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      // For now, we'll add it locally since we don't have a create project API
      const newProjectId = (projects.length + 1).toString();
      const createdProject = {
        _id: newProjectId,
        dealId: `DEAL-${String(projects.length + 1).padStart(3, '0')}`,
        ...projectData,
        clientId: newProjectId,
        assignedTeam: {
          assignedDesigner: 'Not assigned',
          assignedPM: 'Not assigned',
          assignedSales: 'Not assigned'
        },
        designStatus: {
          design3DStatus: 'Not Started',
          design3DProgress: 0,
          moodBoardShared: false
        },
        activities: {
          tasks: []
        }
      };

      setProjects([...projects, createdProject]);
      setSnackbarMessage('New project created successfully!');
      setSnackbarOpen(true);
      setOpenNewProjectDialog(false);
      
      // Reset form
      setNewProject({
        projectName: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        totalProjectValue: 0,
        propertyType: '',
        size: '',
        location: '',
        currentStage: 'Lead Generation'
      });
    } catch (err: any) {
      setSnackbarMessage('Failed to create project');
      setSnackbarOpen(true);
    }
  };

  const getProjectsByStage = (stageId: string): Project[] => {
    return projects.filter(project => project.currentStage === stageId);
  };

  const getProjectHealth = (projectId: string): ProjectHealth | undefined => {
    return projectHealth.find(health => health.projectId === projectId);
  };

  const getPropertyIcon = (dealType: string, propertyType: string) => {
    if (dealType === 'Residential') {
      return <HomeIcon color="primary" />;
    } else if (propertyType?.includes('Restaurant')) {
      return <RestaurantIcon color="primary" />;
    } else if (propertyType?.includes('Healthcare')) {
      return <HospitalIcon color="primary" />;
    } else {
      return <BusinessIcon color="primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Hold': return 'warning';
      case 'Completed': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Project Kanban Board</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Project Kanban Board</Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Project Kanban Board</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNewProject}
        >
          New Project
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {stages.map((stage) => {
            const stageProjects = getProjectsByStage(stage.id);
            
            return (
              <Box key={stage.id} sx={{ minWidth: '300px', flex: '0 0 300px' }}>
                <Paper
                  sx={{
                    p: 2,
                    minHeight: '600px',
                    backgroundColor: stage.color,
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {stage.title}
                    </Typography>
                    <Badge badgeContent={stageProjects.length} color="primary">
                      <Typography variant="body2" color="text.secondary">
                        {stageProjects.length} projects
                      </Typography>
                    </Badge>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <SortableContext 
                    id={stage.id} 
                    items={stageProjects.map(p => p._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {stageProjects.map((project) => (
                        <SortableProjectCard
                          key={project._id}
                          project={project}
                          onCardClick={handleProjectClick}
                          healthData={getProjectHealth(project._id)}
                        />
                  ))}
                  
                  {stageProjects.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No projects in this stage
                      </Typography>
                    </Box>
                  )}
                    </Box>
                  </SortableContext>
                </Paper>
            </Box>
          );
        })}
        </Box>

        <DragOverlay>
          {activeId ? (
            <Card sx={{ 
              opacity: 0.8,
              transform: 'rotate(5deg)',
              boxShadow: 3
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {projects.find(p => p._id === activeId)?.projectName}
                </Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Project Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Project Details - {selectedProject?.projectName}
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Typography variant="h6" gutterBottom>Project Information</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Client:</strong> {selectedProject.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Project ID:</strong> {selectedProject.dealId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Property Type:</strong> {selectedProject.propertyType?.propertyType || 'Not specified'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Size:</strong> {selectedProject.size?.displayText || 'Not specified'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {selectedProject.location?.city || 'City TBD'}, {selectedProject.location?.state || 'State TBD'}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Typography variant="h6" gutterBottom>Team & Status</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Designer:</strong> {selectedProject.assignedTeam?.assignedDesigner || 'Not assigned'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Project Manager:</strong> {selectedProject.assignedTeam?.assignedPM || 'Not assigned'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {selectedProject.projectStatus}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Stage:</strong> {selectedProject.currentStage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Value:</strong> {formatCurrency(selectedProject.totalProjectValue)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Edit Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={openNewProjectDialog} onClose={() => setOpenNewProjectDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              value={newProject.projectName}
              onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Client Name"
              value={newProject.clientName}
              onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Client Email"
              value={newProject.clientEmail}
              onChange={(e) => setNewProject({...newProject, clientEmail: e.target.value})}
              fullWidth
              type="email"
            />
            <TextField
              label="Client Phone"
              value={newProject.clientPhone}
              onChange={(e) => setNewProject({...newProject, clientPhone: e.target.value})}
              fullWidth
            />
            <TextField
              label="Project Value (₹)"
              value={newProject.totalProjectValue}
              onChange={(e) => setNewProject({...newProject, totalProjectValue: parseFloat(e.target.value) || 0})}
              fullWidth
              type="number"
            />
            <TextField
              label="Property Type"
              value={newProject.propertyType}
              onChange={(e) => setNewProject({...newProject, propertyType: e.target.value})}
              fullWidth
            />
            <TextField
              label="Size"
              value={newProject.size}
              onChange={(e) => setNewProject({...newProject, size: e.target.value})}
              fullWidth
            />
            <TextField
              label="Location"
              value={newProject.location}
              onChange={(e) => setNewProject({...newProject, location: e.target.value})}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Initial Stage</InputLabel>
              <Select
                value={newProject.currentStage}
                label="Initial Stage"
                onChange={(e) => setNewProject({...newProject, currentStage: e.target.value})}
              >
                {stages.map(stage => (
                  <MenuItem key={stage.id} value={stage.id}>{stage.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewProjectDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNewProject}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Kanban;
