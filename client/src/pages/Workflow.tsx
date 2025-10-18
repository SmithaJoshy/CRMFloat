import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
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
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Cake as CakeIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { api } from '../services/api';

interface WorkflowItem {
  id: string;
  type: 'lead' | 'project' | 'warranty' | 'anniversary';
  title: string;
  client: string;
  status: string;
  priority: string;
  date: string;
  stage?: string;
  value?: number;
  description?: string;
}

const Workflow: React.FC = () => {
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'lead',
    title: '',
    client: '',
    priority: 'Medium',
    description: ''
  });

  const workflowStages = [
    {
      id: 'Lead Generation',
      name: 'Lead Generation',
      description: 'Initial contact and lead capture',
      icon: <PersonIcon />,
      color: '#2196F3'
    },
    {
      id: 'Initial Engagement',
      name: 'Initial Engagement',
      description: 'First contact and qualification',
      icon: <BusinessIcon />,
      color: '#4CAF50'
    },
    {
      id: 'Scheduling Visit',
      name: 'Scheduling Visit',
      description: 'Site visit scheduling and coordination',
      icon: <AssignmentIcon />,
      color: '#FF9800'
    },
    {
      id: 'Consultation & Data Capture',
      name: 'Consultation & Data Capture',
      description: 'Data collection and requirements analysis',
      icon: <AssignmentIcon />,
      color: '#FF5722'
    },
    {
      id: 'Design in Progress',
      name: 'Design in Progress',
      description: 'Design development and creation',
      icon: <AssignmentIcon />,
      color: '#795548'
    },
    {
      id: 'Design Presentation & Fee Due',
      name: 'Design Presentation & Fee Due',
      description: 'Design presentation and fee collection',
      icon: <PaymentIcon />,
      color: '#9C27B0'
    },
    {
      id: 'Costing Shared',
      name: 'Costing Shared',
      description: 'Project costing and quotation',
      icon: <PaymentIcon />,
      color: '#673AB7'
    },
    {
      id: 'Contract Signed (50% Due)',
      name: 'Contract Signed (50% Due)',
      description: 'Contract execution and payment',
      icon: <PaymentIcon />,
      color: '#3F51B5'
    },
    {
      id: 'Site Measurement Visit',
      name: 'Site Measurement Visit',
      description: 'Detailed site measurements',
      icon: <BuildIcon />,
      color: '#2196F3'
    },
    {
      id: 'Detailed Drawings & Vendor Coordination',
      name: 'Detailed Drawings & Vendor Coordination',
      description: 'Final drawings and vendor management',
      icon: <BuildIcon />,
      color: '#00BCD4'
    },
    {
      id: 'Production (40% Interim Due)',
      name: 'Production (40% Interim Due)',
      description: 'Manufacturing and interim payment',
      icon: <BuildIcon />,
      color: '#009688'
    },
    {
      id: 'Project Closure (Final 10% Payment)',
      name: 'Project Closure (Final 10% Payment)',
      description: 'Project completion and final payment',
      icon: <CheckCircleIcon />,
      color: '#4CAF50'
    },
    {
      id: 'Project Completed',
      name: 'Project Completed',
      description: 'Project handover and completion',
      icon: <CheckCircleIcon />,
      color: '#8BC34A'
    }
  ];

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      // Fetch data from all endpoints
      const [leadsRes, dealsRes, warrantiesRes, anniversariesRes] = await Promise.all([
        api.get('/leads'),
        api.get('/deals'),
        api.get('/warranties'),
        api.get('/anniversaries')
      ]);

      const workflowData: WorkflowItem[] = [];

      // Process leads
      leadsRes.data.leads?.forEach((lead: any) => {
        workflowData.push({
          id: lead._id,
          type: 'lead',
          title: lead.name,
          client: lead.company || 'Individual',
          status: lead.leadStatus || 'Unknown',
          priority: lead.priority || 'Medium',
          date: lead.createdAt,
          stage: 'Lead Generation', // Updated to match our workflow stages
          description: lead.requirements
        });
      });

      // Process deals/projects
      dealsRes.data.deals?.forEach((deal: any) => {
        workflowData.push({
          id: deal._id,
          type: 'project',
          title: deal.projectName,
          client: deal.clientName || 'Unknown Client',
          status: deal.projectStatus || 'Unknown',
          priority: deal.priorityLevel || 'Medium',
          date: deal.createdAt,
          stage: deal.currentStage, // This now matches our 13-step workflow
          value: deal.totalProjectValue,
          description: deal.specialRequirements?.requirements || 'No description available'
        });
      });

      // Process warranties
      warrantiesRes.data.warranties?.forEach((warranty: any) => {
        workflowData.push({
          id: warranty._id,
          type: 'warranty',
          title: warranty.warrantyId,
          client: warranty.clientName,
          status: warranty.status || 'Active',
          priority: 'Medium',
          date: warranty.startDate,
          stage: 'warranty',
          description: warranty.description
        });
      });

      // Process anniversaries
      anniversariesRes.data.anniversaries?.forEach((anniversary: any) => {
        workflowData.push({
          id: anniversary._id,
          type: 'anniversary',
          title: anniversary.anniversaryType,
          client: anniversary.clientName,
          status: anniversary.status || 'Pending',
          priority: 'Low',
          date: anniversary.anniversaryDate,
          stage: 'anniversary',
          description: anniversary.message
        });
      });

      setWorkflowItems(workflowData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch workflow data');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const stageConfig = workflowStages.find(s => s.id === stage);
    return stageConfig?.color || '#757575';
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'lead': return <PersonIcon />;
      case 'project': return <AssignmentIcon />;
      case 'warranty': return <SecurityIcon />;
      case 'anniversary': return <CakeIcon />;
      default: return <TimelineIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    if (!priority) return 'default';
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'info';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const filteredItems = selectedStage === 'all' 
    ? workflowItems 
    : workflowItems.filter(item => item.stage === selectedStage);

  const getStageStats = () => {
    const stats: { [key: string]: number } = {};
    workflowStages.forEach(stage => {
      stats[stage.id] = workflowItems.filter(item => item.stage === stage.id).length;
    });
    return stats;
  };

  const handleCreateItem = async () => {
    try {
      // This would create a new item based on the type
      // For now, just close the dialog
      setOpenCreateDialog(false);
      setNewItem({
        type: 'lead',
        title: '',
        client: '',
        priority: 'Medium',
        description: ''
      });
      // Refresh data
      fetchWorkflowData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create item');
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Complete Workflow Pipeline
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add New Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stage Statistics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {workflowStages.map((stage) => {
          const stats = getStageStats();
          const count = stats[stage.id] || 0;
          return (
            <Box key={stage.id} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedStage === stage.id ? `2px solid ${stage.color}` : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => setSelectedStage(selectedStage === stage.id ? 'all' : stage.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: stage.color, mr: 2 }}>
                      {stage.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{count}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stage.name}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Visual Workflow Pipeline */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Complete Workflow Pipeline
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mt: 2,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {workflowStages.map((stage, index) => {
            const stats = getStageStats();
            const count = stats[stage.id] || 0;
            const isActive = selectedStage === stage.id;
            return (
              <Box key={stage.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Card
                  sx={{
                    minWidth: 200,
                    cursor: 'pointer',
                    border: isActive ? `3px solid ${stage.color}` : `2px solid ${stage.color}`,
                    backgroundColor: isActive ? `${stage.color}15` : 'white',
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedStage(isActive ? 'all' : stage.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: stage.color, 
                        mx: 'auto', 
                        mb: 1,
                        width: 48,
                        height: 48
                      }}
                    >
                      {stage.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {stage.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stage.description}
                    </Typography>
                    <Chip
                      label={`${count} items`}
                      color={count > 0 ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </CardContent>
                </Card>
                {index < workflowStages.length - 1 && (
                  <Box
                    sx={{
                      width: 30,
                      height: 2,
                      backgroundColor: stage.color,
                      mx: 1,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: -8,
                        top: -6,
                        width: 0,
                        height: 0,
                        borderLeft: `8px solid ${stage.color}`,
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent'
                      }
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Items List */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {selectedStage === 'all' ? 'All Items' : workflowStages.find(s => s.id === selectedStage)?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredItems.length} items
          </Typography>
        </Box>

        <List>
          {filteredItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getStageColor(item.stage || '') }}>
                    {getItemIcon(item.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.priority}
                        color={getPriorityColor(item.priority) as any}
                        size="small"
                      />
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status) as any}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Client: {item.client}
                      </Typography>
                      {item.value && (
                        <Typography variant="body2" color="text.secondary">
                          Value: ₹{item.value.toLocaleString()}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      {item.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box display="flex" gap={1}>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
              {index < filteredItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {filteredItems.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No items found for this stage
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Create Item Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Workflow Item</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Item Type</InputLabel>
              <Select
                value={newItem.type}
                onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
              >
                <MenuItem value="lead">Lead</MenuItem>
                <MenuItem value="project">Project</MenuItem>
                <MenuItem value="warranty">Warranty</MenuItem>
                <MenuItem value="anniversary">Anniversary</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            />
            <TextField
              fullWidth
              label="Client"
              value={newItem.client}
              onChange={(e) => setNewItem({...newItem, client: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newItem.priority}
                onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
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
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateItem} variant="contained">
            Create Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workflow;
