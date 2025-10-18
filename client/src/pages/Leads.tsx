import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lead-tabpanel-${index}`}
      aria-labelledby={`lead-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    leadSource: 'Website',
    budget: 0,
    projectType: 'Residential',
    requirements: '',
    assignedTo: '',
    priority: 'Medium',
    followUpDate: '',
    notes: ''
  });

  const leadStatuses = [
    'New Lead',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Negotiating',
    'Converted',
    'Lost',
    'Nurturing'
  ];

  const leadSources = [
    'Website',
    'Referral',
    'Social Media',
    'Google Ads',
    'Facebook Ads',
    'LinkedIn',
    'Walk-in',
    'Cold Call',
    'Trade Show',
    'Other'
  ];

  const projectTypes = [
    'Residential',
    'Commercial',
    'Renovation',
    'Luxury',
    'Hospitality',
    'Retail',
    'Office',
    'Restaurant'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async () => {
    try {
      const response = await api.post('/leads', {
        ...newLead,
        leadStatus: 'New Lead',
        budget: parseInt(newLead.budget.toString()) || 0
      });
      setLeads([...leads, response.data.lead]);
      setOpenCreateDialog(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        company: '',
        leadSource: 'Website',
        budget: 0,
        projectType: 'Residential',
        requirements: '',
        assignedTo: '',
        priority: 'Medium',
        followUpDate: '',
        notes: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create lead');
    }
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    try {
      const response = await api.put(`/leads/${selectedLead._id}`, selectedLead);
      setLeads(leads.map(lead => lead._id === selectedLead._id ? response.data.lead : lead));
      setOpenEditDialog(false);
      setSelectedLead(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update lead');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await api.delete(`/leads/${leadId}`);
      setLeads(leads.filter(lead => lead._id !== leadId));
      setAnchorEl(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleConvertToClient = async (lead: Lead) => {
    try {
      // Convert lead to client
      const clientData = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        stylePreferences: [lead.projectType],
        targetBudget: lead.budget,
        leadSource: lead.leadSource,
        notes: lead.notes
      };
      
      const clientResponse = await api.post('/clients', clientData);
      
      // Update lead status to converted
      await api.put(`/leads/${lead._id}`, { leadStatus: 'Converted' });
      
      setLeads(leads.map(l => l._id === lead._id ? { ...l, leadStatus: 'Converted' } : l));
      setAnchorEl(null);
      
      alert(`Lead converted to client! Client ID: ${clientResponse.data.client.clientId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to convert lead');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || lead.leadStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Lead': return 'default';
      case 'Contacted': return 'primary';
      case 'Qualified': return 'info';
      case 'Proposal Sent': return 'warning';
      case 'Negotiating': return 'secondary';
      case 'Converted': return 'success';
      case 'Lost': return 'error';
      case 'Nurturing': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Urgent': return 'error';
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
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Lead Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add New Lead
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="All">All Status</MenuItem>
            {leadStatuses.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Leads" />
          <Tab label="Hot Leads" />
          <Tab label="Follow-up Today" />
          <Tab label="Converted" />
        </Tabs>
      </Box>

      {/* Lead Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 2 }}>
        {filteredLeads.map((lead) => (
          <Card key={lead._id} sx={{ position: 'relative' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h6" component="div">
                    {lead.name}
                  </Typography>
                  {lead.company && (
                    <Typography variant="body2" color="text.secondary">
                      {lead.company}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setSelectedLead(lead);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{lead.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{lead.phone}</Typography>
                </Box>
                {lead.followUpDate && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={lead.leadStatus}
                  color={getStatusColor(lead.leadStatus) as any}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={lead.priority}
                  color={getPriorityColor(lead.priority) as any}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={lead.leadSource}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Project: {lead.projectType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget: ₹{lead.budget.toLocaleString()}
                </Typography>
                {lead.assignedTo && (
                  <Typography variant="body2" color="text.secondary">
                    Assigned to: {lead.assignedTo}
                  </Typography>
                )}
              </Box>

              {lead.requirements && (
                <Typography variant="body2" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {lead.requirements}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {filteredLeads.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No leads found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filterStatus !== 'All' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first lead'
            }
          </Typography>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setOpenEditDialog(true); setAnchorEl(null); }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Lead
        </MenuItem>
        {selectedLead?.leadStatus !== 'Converted' && (
          <MenuItem onClick={() => handleConvertToClient(selectedLead!)}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            Convert to Client
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => selectedLead && handleDeleteLead(selectedLead._id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Lead
        </MenuItem>
      </Menu>

      {/* Create Lead Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Lead Name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Company (Optional)"
                    value={newLead.company}
                    onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Lead Source</InputLabel>
                    <Select
                      value={newLead.leadSource}
                      onChange={(e) => setNewLead({...newLead, leadSource: e.target.value})}
                    >
                      {leadSources.map(source => (
                        <MenuItem key={source} value={source}>{source}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Project Type</InputLabel>
                    <Select
                      value={newLead.projectType}
                      onChange={(e) => setNewLead({...newLead, projectType: e.target.value})}
                    >
                      {projectTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Budget (₹)"
                    type="number"
                    value={newLead.budget}
                    onChange={(e) => setNewLead({...newLead, budget: parseInt(e.target.value) || 0})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newLead.priority}
                      onChange={(e) => setNewLead({...newLead, priority: e.target.value})}
                    >
                      {priorities.map(priority => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Assigned To"
                    value={newLead.assignedTo}
                    onChange={(e) => setNewLead({...newLead, assignedTo: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Follow-up Date"
                    type="date"
                    value={newLead.followUpDate}
                    onChange={(e) => setNewLead({...newLead, followUpDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Requirements"
                multiline
                rows={3}
                value={newLead.requirements}
                onChange={(e) => setNewLead({...newLead, requirements: e.target.value})}
                placeholder="Describe the project requirements..."
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newLead.notes}
                onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateLead} variant="contained">
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Lead Name"
                    value={selectedLead?.name || ''}
                    onChange={(e) => setSelectedLead({...selectedLead!, name: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={selectedLead?.email || ''}
                    onChange={(e) => setSelectedLead({...selectedLead!, email: e.target.value})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={selectedLead?.phone || ''}
                    onChange={(e) => setSelectedLead({...selectedLead!, phone: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedLead?.leadStatus || ''}
                      onChange={(e) => setSelectedLead({...selectedLead!, leadStatus: e.target.value})}
                    >
                      {leadStatuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateLead} variant="contained">
            Update Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;
