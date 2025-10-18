import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { api } from '../services/api';

interface Deal {
  _id: string;
  dealId: string;
  projectName: string;
  clientName: string;
  currentStage: string;
  totalProjectValue: number;
  projectStatus: string;
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
    tasks: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      assignedTo: string;
    }>;
  };
  createdAt: string;
}

const stages = [
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

const Pipeline: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [newStage, setNewStage] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    clientId: '',
    totalProjectValue: 0,
    assignedDesigner: '',
    priorityLevel: 'Medium'
  });

  useEffect(() => {
    fetchDeals();
    fetchClients();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await api.get('/deals');
      setDeals(response.data.deals);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch deals');
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

  const handleStageChange = (deal: Deal) => {
    setSelectedDeal(deal);
    setNewStage(deal.currentStage);
    setOpenDialog(true);
  };

  const handleUpdateStage = async () => {
    if (!selectedDeal) return;

    try {
      await api.put(`/deals/${selectedDeal._id}`, {
        currentStage: newStage,
      });
      await fetchDeals();
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update stage');
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await api.post('/deals', {
        ...newProject,
        currentStage: 'Lead Qualification',
        projectStatus: 'Active',
        projectStartDate: new Date()
      });
      
      setDeals([...deals, response.data.deal]);
      setOpenCreateDialog(false);
      setNewProject({
        projectName: '',
        clientId: '',
        totalProjectValue: 0,
        assignedDesigner: '',
        priorityLevel: 'Medium'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Pipeline</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          New Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {stages.map((stage, index) => {
          const stageDeals = deals.filter(deal => deal.currentStage === stage);
          
          return (
            <Box key={stage} sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {index + 1}. {stage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {stageDeals.length} project{stageDeals.length !== 1 ? 's' : ''}
                  </Typography>
                  
                  {stageDeals.map((deal) => (
                    <Card
                      key={deal._id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 },
                        transition: 'box-shadow 0.2s'
                      }}
                      onClick={() => navigate(`/project/${deal._id}`)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {deal.projectName}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Client: {deal.clientName || 'Client not specified'}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {deal.propertyType?.propertyType || 'Property type not specified'}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {deal.size?.displayText || 'Size not specified'} • {deal.location?.city || 'Location TBD'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            ₹{(deal.totalProjectValue || 0).toLocaleString()}
                          </Typography>
                          <Chip
                            label={deal.projectStatus || 'Unknown'}
                            size="small"
                            color={deal.projectStatus === 'Active' ? 'success' : 'default'}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Designer: {deal.assignedTeam?.assignedDesigner || 'Not assigned'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Due: {deal.expectedCompletionDate ? new Date(deal.expectedCompletionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'TBD'}
                          </Typography>
                        </Box>
                        
                        {deal.designStatus && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              3D Design: {deal.designStatus.design3DStatus} ({deal.designStatus.design3DProgress}%)
                            </Typography>
                            <Box sx={{ 
                              width: '100%', 
                              height: 4, 
                              backgroundColor: 'grey.200', 
                              borderRadius: 2,
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                width: `${deal.designStatus.design3DProgress}%`, 
                                height: '100%', 
                                backgroundColor: 'primary.main',
                                transition: 'width 0.3s'
                              }} />
                            </Box>
                          </Box>
                        )}
                        
                        {deal.activities?.tasks && deal.activities.tasks.length > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Tasks: {deal.activities.tasks.filter(t => t.status === 'Completed').length}/{deal.activities.tasks.length} completed
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Project Stage</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Project: {selectedDeal?.projectName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Client: {selectedDeal?.clientName}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Current Stage</InputLabel>
            <Select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              label="Current Stage"
            >
              {stages.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stages.indexOf(stage) + 1}. {stage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStage} variant="contained">
            Update Stage
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Project Name"
                value={newProject.projectName}
                onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Client</InputLabel>
                    <Select
                      value={newProject.clientId}
                      onChange={(e) => setNewProject({...newProject, clientId: e.target.value})}
                    >
                      {clients.map((client) => (
                        <MenuItem key={client._id} value={client._id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Project Value (₹)"
                    type="number"
                    value={newProject.totalProjectValue}
                    onChange={(e) => setNewProject({...newProject, totalProjectValue: parseInt(e.target.value) || 0})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Assigned Designer"
                    value={newProject.assignedDesigner}
                    onChange={(e) => setNewProject({...newProject, assignedDesigner: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
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
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pipeline;
