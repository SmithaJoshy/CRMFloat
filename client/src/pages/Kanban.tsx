import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
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
  Snackbar,
  Avatar,
  AvatarGroup
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
  Close as CloseIcon,
  MoreHoriz as MoreIcon,
  AttachMoney as MoneyIcon
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
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';
import { ClientDropdown } from '../components/DataDropdowns';
import DesignerDropdown from '../components/DesignerDropdown';

interface ProjectNote {
  id: string;
  content: string;
  addedBy: string;
  addedAt: string;
  type: string;
}

interface Project {
  _id: string;
  projectName: string;
  clientName: string;
  clientId: string;
  totalProjectValue: number;
  currentStage: string;
  projectStatus: string;
  assignedDesigner?: string;
  assignedProjectManager?: string;
  assignedSales?: string;
  propertyType?: {
    propertyType: string;
    dealType?: string;
  };
  size?: {
    displayText: string;
  };
  location?: {
    city: string;
    state: string;
  };
  progress?: number;
  priorityLevel?: string;
  createdAt: string;
  notes?: string;
  notesHistory?: ProjectNote[];
  updatedAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  projects: Project[];
}

const Kanban: React.FC = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    projectName: '',
    clientId: '',
    totalProjectValue: 0,
    assignedDesigner: '',
    priorityLevel: 'Medium'
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const stages = [
    'Lead',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/deals');
      const projects = response.data.deals || [];
      console.log('📊 Fetched projects:', projects.map((p: any) => ({ id: p._id, name: p.projectName, stage: p.currentStage })));
      setProjects(projects);
      updateColumns(projects);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients || []);
    } catch (err: any) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const updateColumns = (projectsData: Project[]) => {
    console.log('🔧 Updating columns with projects:', projectsData.length);
    console.log('🔧 Available stages:', stages);
    console.log('🔧 Project stages:', projectsData.map(p => ({ id: p._id, name: p.projectName, stage: p.currentStage })));
    
    const columnsData = stages.map(stage => {
      const stageProjects = projectsData.filter(project => project.currentStage === stage);
      console.log(`🔧 Stage "${stage}": ${stageProjects.length} projects`, stageProjects.map(p => p.projectName));
        return {
        id: stage,
        title: stage,
        projects: stageProjects
        };
      });
    console.log('🏗️ Final columns data:', columnsData.map(c => ({ stage: c.id, count: c.projects.length, projects: c.projects.map(p => p.projectName) })));
    setColumns(columnsData);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('🚀 Drag started:', { activeId: active.id, activeData: active.data.current });
    const project = projects.find(p => p._id === active.id);
    setActiveProject(project || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('🏁 Drag ended:', { activeId: active.id, overId: over?.id, overData: over?.data.current });
    setActiveProject(null);
    
    if (!over) {
      console.log('❌ No drop target found');
      return;
    }

    const projectId = active.id as string;
    let newStage = over.id as string;

    console.log('🎯 Drag end:', { projectId, newStage, overId: over.id, overData: over.data.current });

    // Determine the target stage based on drop target type
    if (over.data.current?.type === 'column') {
      // Dropping directly on a column
      newStage = over.data.current.stage;
      console.log('🎯 Dropping on column, stage:', newStage);
    } else if (over.data.current?.type === 'project') {
      // Dropping on another project - use that project's stage
      newStage = over.data.current.project.currentStage;
      console.log('🎯 Dropping on project, using stage:', newStage);
    } else {
      // Fallback: try to use over.id directly
      console.log('🎯 Fallback: using over.id as stage:', over.id);
      newStage = String(over.id);
    }

    // Validate that we have a valid stage
    if (!stages.includes(newStage)) {
      console.error('❌ Invalid stage:', newStage, 'Available stages:', stages);
      setError('Invalid drop target');
      return;
    }

    console.log('✅ Final stage for project:', projectId, '->', newStage);

    try {
      const response = await api.put(`/deals/${projectId}`, { currentStage: newStage });
      console.log('✅ Stage update response:', response.data);
      
      // Update the project locally and refresh columns
      setProjects(prevProjects => {
        const updatedProjects = prevProjects.map(project => 
          project._id === projectId 
            ? { ...project, currentStage: newStage }
            : project
        );
        // Update columns immediately with new project data
        updateColumns(updatedProjects);
        return updatedProjects;
      });
    } catch (err: any) {
      console.error('❌ Failed to update project stage:', err);
      setError('Failed to update project stage');
    }
  };

  const handleCardClick = (project: Project) => {
    console.log('Card clicked:', project.projectName);
    setViewingProject(project);
    setOpenViewDialog(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setOpenEditDialog(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      // Prepare update data
      const updateData: any = {
        currentStage: editingProject.currentStage
      };
      
      // Only add notes if there are new notes
      if (editingProject.notes && editingProject.notes.trim()) {
        updateData.notes = editingProject.notes.trim();
        updateData.addedBy = 'Current User'; // You can get this from auth context
        updateData.noteType = 'general';
      }
      
      await api.put(`/deals/${editingProject._id}`, updateData);
      
      // Update local state immediately instead of refetching
      setProjects(prevProjects => {
        const updatedProjects = prevProjects.map(project => 
          project._id === editingProject._id 
            ? { ...project, currentStage: editingProject.currentStage }
            : project
        );
        // Update columns immediately with new project data
        updateColumns(updatedProjects);
        return updatedProjects;
      });
      
      setSnackbar({ open: true, message: 'Project status and notes updated successfully', severity: 'success' });
      setOpenEditDialog(false);
      setEditingProject(null);
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Failed to update project', severity: 'error' });
      console.error('Error updating project:', err);
    }
  };

  const resetProjectForm = () => {
      setNewProject({
        projectName: '',
      clientId: '',
        totalProjectValue: 0,
      assignedDesigner: '',
      priorityLevel: 'Medium'
    });
    setError('');
  };

  const handleCreateProject = async () => {
    try {
      // Validate required fields
      if (!newProject.projectName.trim()) {
        setError('Project name is required');
        return;
      }
      if (!newProject.clientId) {
        setError('Please select a client');
        return;
      }

      const client = clients.find(c => c._id === newProject.clientId);
      const response = await api.post('/deals', {
        ...newProject,
        projectName: newProject.projectName.trim(),
        currentStage: 'Lead',
        projectStatus: 'Active',
        clientName: client?.name || 'Unknown Client'
      });
      
      console.log('✅ Project created successfully:', response.data.deal);
      
      // Reset form and close dialog
      resetProjectForm();
      setOpenCreateDialog(false);
      
      // Refresh projects
      await fetchProjects();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create project';
      setError(errorMessage);
      console.error('❌ Error creating project:', err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPropertyIcon = (propertyType: string) => {
    switch (propertyType?.toLowerCase()) {
      case 'residential':
      case 'home':
        return <HomeIcon fontSize="small" />;
      case 'commercial':
      case 'office':
        return <BusinessIcon fontSize="small" />;
      case 'restaurant':
      case 'cafe':
        return <RestaurantIcon fontSize="small" />;
      case 'hospital':
      case 'clinic':
        return <HospitalIcon fontSize="small" />;
      default:
        return <BusinessIcon fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading Kanban board...</Typography>
      </Box>
    );
  }

    return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
          Project Pipeline
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Click on project cards to edit • Drag to change status
        </Typography>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onCardClick={handleCardClick}
              onEdit={handleEditProject}
                        />
                  ))}
        </Box>

        <DragOverlay>
          {activeProject ? (
            <ProjectCard project={activeProject} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Create Project Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={false}
        aria-labelledby="create-project-dialog"
      >
        <DialogTitle id="create-project-dialog">Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={newProject.projectName}
              onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
            />
            <ClientDropdown
              value={newProject.clientId}
              onChange={(value) => setNewProject({...newProject, clientId: value})}
              label="Client"
              required
            />
            <TextField
              fullWidth
              label="Project Value (₹)"
              type="number"
              value={newProject.totalProjectValue}
              onChange={(e) => setNewProject({...newProject, totalProjectValue: Number(e.target.value)})}
            />
            <DesignerDropdown
              value={newProject.assignedDesigner}
              onChange={(value) => setNewProject({...newProject, assignedDesigner: value})}
              label="Assigned Designer"
              filterByAvailability="Available"
            />
            <FormControl fullWidth>
              <InputLabel>Priority Level</InputLabel>
              <Select
                value={newProject.priorityLevel}
                onChange={(e) => setNewProject({...newProject, priorityLevel: e.target.value})}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
                </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            resetProjectForm();
            setOpenCreateDialog(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Edit Project Dialog - Status & Notes Only */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={false}
        aria-labelledby="edit-project-dialog"
      >
        <DialogTitle id="edit-project-dialog">
          Quick Edit: {editingProject?.projectName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Project Info (Read-only) */}
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Project Details
                  </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {editingProject?.projectName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                Client: {editingProject?.clientName} • Value: ₹{editingProject?.totalProjectValue?.toLocaleString()}
                  </Typography>
                </Box>

            {/* Status Change */}
            <FormControl fullWidth>
              <InputLabel>Current Stage</InputLabel>
              <Select
                value={editingProject?.currentStage || ''}
                onChange={(e) => setEditingProject(prev => prev ? {...prev, currentStage: e.target.value} : null)}
                label="Current Stage"
              >
                {stages.map(stage => (
                  <MenuItem key={stage} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notes */}
            <TextField
              label="Project Notes"
              value={editingProject?.notes || ''}
              onChange={(e) => setEditingProject(prev => prev ? {...prev, notes: e.target.value} : null)}
              fullWidth
              multiline
              rows={4}
              placeholder="Add notes, comments, or updates about this project..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateProject} variant="contained">
            Update Status & Notes
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Project Details Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="view-project-dialog"
      >
        <DialogTitle id="view-project-dialog">Project Details</DialogTitle>
        <DialogContent>
          {viewingProject && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Project Name"
              value={viewingProject.projectName}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Client"
              value={viewingProject.clientName}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Current Stage"
              value={viewingProject.currentStage}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Project Status"
              value={viewingProject.projectStatus}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Project Value (₹)"
              value={viewingProject.totalProjectValue?.toLocaleString() || '0'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Assigned Designer"
              value={viewingProject.assignedDesigner || 'Not assigned'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Priority Level"
              value={viewingProject.priorityLevel || 'Medium'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Project ID"
              value={viewingProject._id || 'N/A'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
              </Box>
              
              {viewingProject.propertyType && (
                <TextField
                  label="Property Type"
                  value={viewingProject.propertyType.propertyType || 'Not specified'}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              )}
              
              {viewingProject.location && (
                <TextField
                  label="Location"
                  value={`${viewingProject.location.city}, ${viewingProject.location.state}`}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              )}
              
              {/* Notes History Section */}
              {viewingProject.notesHistory && viewingProject.notesHistory.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                    Notes History
                  </Typography>
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    {viewingProject.notesHistory.map((note, index) => (
                      <Box key={note.id} sx={{ mb: 2, pb: 2, borderBottom: index < viewingProject.notesHistory!.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                            {note.addedBy}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {new Date(note.addedAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.5 }}>
                          {note.content}
                        </Typography>
                        <Chip 
                          label={note.type.replace('_', ' ')} 
                          size="small" 
                          sx={{ mt: 1, fontSize: '0.7rem', height: '20px' }}
                          color={note.type === 'status_change' ? 'warning' : note.type === 'design_change' ? 'info' : 'default'}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Kanban Column Component
const KanbanColumn: React.FC<{
  column: KanbanColumn;
  onCardClick: (project: Project) => void;
  onEdit?: (project: Project) => void;
}> = ({ column, onCardClick, onEdit }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      stage: column.id
    }
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minWidth: 300,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        p: 2,
        height: 'fit-content',
        maxHeight: '80vh',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Column Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {column.title}
        </Typography>
        <Chip 
          label={column.projects.length} 
          size="small" 
          sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }}
        />
      </Box>

      {/* Projects */}
      <SortableContext items={column.projects.map(p => p._id)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '70vh', overflowY: 'auto' }}>
          {column.projects.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center', 
              border: '2px dashed #1976d2',
              borderRadius: 2,
              backgroundColor: '#f8f9fa'
            }}>
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                No projects in this stage
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                Drag projects here or create new ones
              </Typography>
            </Box>
          ) : (
            column.projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onCardClick={onCardClick}
                onEdit={onEdit}
              />
            ))
          )}
        </Box>
      </SortableContext>
    </Box>
  );
};

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onCardClick?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  isDragging?: boolean;
}> = ({ project, onCardClick, onEdit, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: project._id,
    data: {
      type: 'project',
      project: project
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
      elevation={isSortableDragging ? 4 : 1}
      sx={{
        cursor: 'grab',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': { 
          transform: 'translateY(-1px)',
          boxShadow: 3,
        },
        '&:active': {
          cursor: 'grabbing',
        },
        borderLeft: `3px solid ${project.projectStatus === 'Active' ? '#4caf50' : '#9e9e9e'}`,
      }}
      {...attributes}
      {...listeners}
      onClick={() => onCardClick?.(project)}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Project Title */}
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600,
          mb: 1,
          fontSize: '0.95rem',
          lineHeight: 1.3,
          color: '#1976d2'
        }}>
          {project.projectName}
        </Typography>
        
        {/* Client Name */}
        <Typography variant="body2" sx={{ 
          mb: 1.5, 
          color: '#333',
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          {project.clientName}
        </Typography>

        {/* Project Value */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <MoneyIcon sx={{ fontSize: '0.9rem', color: '#4caf50' }} />
          <Typography variant="body2" sx={{ 
            color: '#4caf50',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            ₹{project.totalProjectValue.toLocaleString()}
          </Typography>
        </Box>

        {/* Status & Team */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={project.projectStatus} 
            size="small" 
            sx={{ 
              backgroundColor: project.projectStatus === 'Active' ? '#4caf50' : '#757575',
              color: 'white',
              fontSize: '0.7rem',
              height: 20,
              fontWeight: 600
            }} 
          />
          {project.assignedDesigner && (
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
              {project.assignedDesigner.charAt(0)}
            </Avatar>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Project">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit?.(project);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                sx={{ 
                  color: '#1976d2',
                  '&:hover': { backgroundColor: '#e3f2fd' }
                }}
              >
                <EditIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onCardClick?.(project);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                sx={{ 
                  color: '#1976d2',
                  '&:hover': { backgroundColor: '#e3f2fd' }
                }}
              >
                <ViewIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Kanban;