import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  IconButton,
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
  CircularProgress,
  Tooltip,
  Grid,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ClientDropdown } from '../components/DataDropdowns';
import DesignerDropdown from '../components/DesignerDropdown';

interface Project {
  _id: string;
  dealId: string;
  projectName: string;
  clientName: string;
  clientId: string;
  currentStage: string;
  totalProjectValue: number;
  projectStatus: string;
  assignedDesigner?: string;
  priorityLevel?: string;
  projectStartDate: string;
  expectedCompletionDate?: string;
  description?: string;
  notes?: string;
  isActive: boolean;
}

interface Lead {
  _id: string;
  leadId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  leadSource: string;
  leadStatus: string;
  budget: number;
  projectType: string;
  requirements: string;
  assignedTo: string;
  priority: string;
  followUpDate: string;
  notes: string;
  createdAt: string;
  isActive: boolean;
}

const Workflow: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Project | Lead)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    projectName: '',
    clientId: '',
    totalProjectValue: 0,
    assignedDesigner: '',
    priorityLevel: 'Medium',
    description: ''
  });

  // Generic CRM Workflow (Simple 6-stage pipeline like Zoho/HubSpot)
  const workflowStages = [
    'Lead',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('🔄 useEffect triggered:', { selectedStage, projectsLength: projects.length, leadsLength: leads.length, searchTerm });
    filterItems();
  }, [projects, leads, selectedStage, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, leadsResponse, clientsResponse] = await Promise.all([
        api.get('/deals'),
        api.get('/leads'),
        api.get('/clients')
      ]);
      
      setProjects(projectsResponse.data.deals || []);
      setLeads(leadsResponse.data.leads || []);
      setClients(clientsResponse.data.clients || []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    console.log('🔍 Filtering items:', { selectedStage, searchTerm, projectsCount: projects.length, leadsCount: leads.length });
    
    let allItems: (Project | Lead)[] = [];
    
    // Combine projects and leads
    allItems = [...projects, ...leads];
    console.log('📊 Total items before filtering:', allItems.length);
    console.log('📊 All items details:', allItems.map(item => ({
      type: 'currentStage' in item ? 'project' : 'lead',
      name: 'currentStage' in item ? item.projectName : item.name,
      stage: 'currentStage' in item ? item.currentStage : item.leadStatus
    })));
    
    // Filter by stage
    if (selectedStage !== 'all') {
      console.log('🎯 Filtering by stage:', selectedStage);
      allItems = allItems.filter(item => {
        if ('currentStage' in item) {
          // It's a project
          const matches = item.currentStage === selectedStage;
          if (matches) {
            console.log('   ✅ Project match:', item.projectName, '->', item.currentStage);
          } else {
            console.log('   ❌ Project no match:', item.projectName, '->', item.currentStage, '≠', selectedStage);
          }
          return matches;
        } else {
          // It's a lead - map lead status to workflow stages
          const mappedStage = mapLeadStatusToStage(item.leadStatus);
          const matches = mappedStage === selectedStage;
          if (matches) {
            console.log('   ✅ Lead match:', item.name, '->', item.leadStatus, 'mapped to', mappedStage);
          } else {
            console.log('   ❌ Lead no match:', item.name, '->', item.leadStatus, 'mapped to', mappedStage, '≠', selectedStage);
          }
          return matches;
        }
      });
      console.log('📊 Items after stage filter:', allItems.length);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      allItems = allItems.filter(item => {
        if ('projectName' in item) {
          // It's a project
          return item.projectName.toLowerCase().includes(searchLower) ||
                 item.clientName.toLowerCase().includes(searchLower) ||
                 item.dealId.toLowerCase().includes(searchLower);
        } else {
          // It's a lead
          return item.name.toLowerCase().includes(searchLower) ||
                 item.company?.toLowerCase().includes(searchLower) ||
                 item.leadId.toLowerCase().includes(searchLower);
        }
      });
      console.log('📊 Items after search filter:', allItems.length);
    }

    console.log('🎯 Final filtered items:', allItems.length);
    console.log('🎯 Final filtered items data:', allItems.map(item => ({
      id: item._id,
      name: 'projectName' in item ? item.projectName : item.name,
      stage: 'currentStage' in item ? item.currentStage : 'Lead'
    })));
    setFilteredItems(allItems);
  };

  // Map lead statuses to generic workflow stages
  const mapLeadStatusToStage = (leadStatus: string): string => {
    switch (leadStatus) {
      case 'New Lead':
      case 'Contacted':
      case 'Re-engaged':
      case 'Nurturing':
      case 'On Hold':
        return 'Lead';
      case 'Qualified':
      case 'Hot Lead':
        return 'Qualified';
      case 'Proposal Sent':
        return 'Proposal';
      case 'Negotiating':
      case 'Follow-up Required':
        return 'Negotiation';
      case 'Converted':
        return 'Closed Won';
      case 'Lost':
        return 'Closed Lost';
      default:
        return 'Lead';
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!newProject.projectName.trim() || !newProject.clientId) {
        setError('Project name and client are required');
        return;
      }

      const client = clients.find(c => c._id === newProject.clientId);
      await api.post('/deals', {
        ...newProject,
        projectName: newProject.projectName.trim(),
        currentStage: 'Lead',
        projectStatus: 'Active',
        clientName: client?.name || 'Unknown Client'
      });

      setOpenCreateDialog(false);
      setNewProject({
        projectName: '',
        clientId: '',
        totalProjectValue: 0,
        assignedDesigner: '',
        priorityLevel: 'Medium',
        description: ''
      });
      setError('');
      fetchData();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create project';
      setError(errorMessage);
      console.error('Error creating project:', err);
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
      case 'New Lead': return 'info';
      case 'Contacted': return 'warning';
      case 'Qualified': return 'success';
      case 'Converted': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getItemCount = (stageId: string) => {
    if (stageId === 'all') return projects.length + leads.length;
    
    const projectCount = projects.filter(p => p.currentStage === stageId).length;
    const leadCount = leads.filter(l => mapLeadStatusToStage(l.leadStatus) === stageId).length;
    
    return projectCount + leadCount;
  };

  const renderItem = (item: Project | Lead) => {
    if ('projectName' in item) {
      // It's a project
      return (
        <Card 
          key={item._id}
          sx={{ 
            height: '100%',
            cursor: 'pointer',
            '&:hover': { 
              boxShadow: 3,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out'
            }
          }}
          onClick={() => navigate(`/project/${item._id}`)}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                {item.projectName}
              </Typography>
              <Chip
                label={item.currentStage}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.clientName}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {formatCurrency(item.totalProjectValue)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {item.priorityLevel && (
                  <Chip
                    label={item.priorityLevel}
                    size="small"
                    color={getPriorityColor(item.priorityLevel) as any}
                  />
                )}
                <Chip
                  label={item.projectStatus}
                  size="small"
                  color={getStatusColor(item.projectStatus) as any}
                />
              </Box>
            </Box>

            {item.assignedDesigner && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Designer: {item.assignedDesigner}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {item.dealId}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${item._id}`);
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Project">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project-edit/${item._id}`);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      );
    } else {
      // It's a lead
      return (
        <Card 
          key={item._id}
          sx={{ 
            height: '100%',
            cursor: 'pointer',
            '&:hover': { 
              boxShadow: 3,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out'
            }
          }}
          onClick={() => navigate(`/leads`)}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                {item.name}
              </Typography>
              <Chip
                label="Lead"
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.company || 'No Company'}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {formatCurrency(item.budget)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Chip
                  label={item.priority}
                  size="small"
                  color={getPriorityColor(item.priority) as any}
                />
                <Chip
                  label={item.leadStatus}
                  size="small"
                  color={getStatusColor(item.leadStatus) as any}
                />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.projectType} • {item.leadSource}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {item.leadId}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/leads`);
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Convert to Project">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/leads`);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      );
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
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Dashboard
        </Link>
        <Typography color="text.primary">Workflow Pipeline</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Workflow Pipeline
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage projects and leads through the complete design pipeline
        </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          size="large"
        >
          Add New Project
        </Button>
      </Box>

      {/* Stage Filter - Subtle and Clean */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FilterIcon color="primary" />
          <Typography variant="subtitle1" fontWeight="medium" color="text.primary">
            Filter by Stage:
                      </Typography>
      </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
            label={`All Items (${getItemCount('all')})`}
            color={selectedStage === 'all' ? 'primary' : 'default'}
            variant={selectedStage === 'all' ? 'filled' : 'outlined'}
            onClick={() => {
              console.log('🎯 Clicked All Items filter');
              setSelectedStage('all');
            }}
            sx={{ cursor: 'pointer', fontWeight: selectedStage === 'all' ? 'bold' : 'normal' }}
          />
          {workflowStages.map(stage => (
            <Chip
              key={stage}
              label={`${stage} (${getItemCount(stage)})`}
              color={selectedStage === stage ? 'primary' : 'default'}
              variant={selectedStage === stage ? 'filled' : 'outlined'}
              onClick={() => {
                console.log('🎯 Clicked stage filter:', stage);
                setSelectedStage(stage);
              }}
              sx={{ cursor: 'pointer', fontWeight: selectedStage === stage ? 'bold' : 'normal' }}
            />
          ))}
        </Box>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Search projects and leads by name, company, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
          sx={{ bgcolor: 'white' }}
        />
      </Paper>

      {/* Items Header - Subtle */}
      <Box sx={{ mb: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="text.primary" fontWeight="medium">
            {selectedStage === 'all' 
              ? `All Items (${filteredItems.length})` 
              : `${selectedStage} (${filteredItems.length} items)`
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {projects.filter(p => selectedStage === 'all' || p.currentStage === selectedStage).length} projects • {leads.filter(l => selectedStage === 'all' || mapLeadStatusToStage(l.leadStatus) === selectedStage).length} leads
          </Typography>
        </Box>
        <Divider sx={{ mt: 2 }} />
                    </Box>

      {/* Items Grid */}
      <Box key={`${selectedStage}-${searchTerm}`} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {filteredItems.map((item) => (
          <Box key={item._id}>
            {renderItem(item)}
                    </Box>
        ))}
                </Box>

        {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            {selectedStage === 'all' ? 'No items found' : `No items in "${selectedStage}" stage`}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {selectedStage === 'all' 
              ? 'Get started by adding your first project' 
              : 'Try selecting a different stage or create a new project'
            }
            </Typography>
          {selectedStage === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              size="large"
            >
              Add Your First Project
            </Button>
          )}
          </Box>
        )}

      {/* Create Project Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={newProject.projectName}
              onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
              required
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
                label="Priority Level"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Dialog open={!!error} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Dialog>
    </Box>
  );
};

export default Workflow;