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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

interface WarrantyItem {
  _id: string;
  warrantyId: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  warrantyType: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  notes: string;
  createdAt: string;
  isActive: boolean;
}

interface AnniversaryItem {
  _id: string;
  anniversaryId: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  anniversaryType: string;
  anniversaryDate: string;
  status: string;
  message: string;
  sentDate?: string;
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
      id={`warranty-tabpanel-${index}`}
      aria-labelledby={`warranty-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Warranty: React.FC = () => {
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [anniversaries, setAnniversaries] = useState<AnniversaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<WarrantyItem | AnniversaryItem | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newWarranty, setNewWarranty] = useState({
    clientId: '',
    projectId: '',
    warrantyType: 'Standard',
    startDate: '',
    endDate: '',
    description: '',
    notes: ''
  });

  const warrantyTypes = [
    'Standard',
    'Extended',
    'Premium',
    'Custom'
  ];

  const anniversaryTypes = [
    'Project Completion',
    '1 Year Anniversary',
    '2 Year Anniversary',
    '5 Year Anniversary',
    'Custom'
  ];

  const statuses = [
    'Active',
    'Expired',
    'Claimed',
    'Pending',
    'Completed'
  ];

  useEffect(() => {
    fetchWarranties();
    fetchAnniversaries();
  }, []);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/warranties');
      setWarranties(response.data.warranties || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch warranties');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnniversaries = async () => {
    try {
      const response = await api.get('/anniversaries');
      setAnniversaries(response.data.anniversaries || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch anniversaries');
    }
  };

  const handleCreateWarranty = async () => {
    try {
      const response = await api.post('/warranties', {
        ...newWarranty,
        status: 'Active',
        startDate: new Date(newWarranty.startDate),
        endDate: new Date(newWarranty.endDate)
      });
      setWarranties([...warranties, response.data.warranty]);
      setOpenCreateDialog(false);
      setNewWarranty({
        clientId: '',
        projectId: '',
        warrantyType: 'Standard',
        startDate: '',
        endDate: '',
        description: '',
        notes: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create warranty');
    }
  };

  const handleUpdateWarranty = async () => {
    if (!selectedItem) return;
    try {
      const response = await api.put(`/warranties/${selectedItem._id}`, selectedItem);
      setWarranties(warranties.map(w => w._id === selectedItem._id ? response.data.warranty : w));
      setOpenEditDialog(false);
      setSelectedItem(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update warranty');
    }
  };

  const handleDeleteWarranty = async (warrantyId: string) => {
    try {
      await api.delete(`/warranties/${warrantyId}`);
      setWarranties(warranties.filter(w => w._id !== warrantyId));
      setAnchorEl(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete warranty');
    }
  };

  const handleSendAnniversaryMessage = async (anniversaryId: string) => {
    try {
      await api.post(`/anniversaries/${anniversaryId}/send`);
      setAnniversaries(anniversaries.map(a => 
        a._id === anniversaryId 
          ? { ...a, status: 'Sent', sentDate: new Date().toISOString() }
          : a
      ));
      setAnchorEl(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send anniversary message');
    }
  };

  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = warranty.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warranty.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warranty.warrantyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || warranty.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredAnniversaries = anniversaries.filter(anniversary => {
    const matchesSearch = anniversary.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anniversary.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || anniversary.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'error';
      case 'Claimed': return 'warning';
      case 'Pending': return 'info';
      case 'Completed': return 'default';
      default: return 'default';
    }
  };

  const getWarrantyStatus = (warranty: WarrantyItem) => {
    const now = new Date();
    const endDate = new Date(warranty.endDate);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'error' };
    if (daysUntilExpiry <= 30) return { status: 'Expiring Soon', color: 'warning' };
    return { status: 'Active', color: 'success' };
  };

  const getAnniversaryStatus = (anniversary: AnniversaryItem) => {
    const now = new Date();
    const anniversaryDate = new Date(anniversary.anniversaryDate);
    const daysUntilAnniversary = Math.ceil((anniversaryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilAnniversary < 0) return { status: 'Overdue', color: 'error' };
    if (daysUntilAnniversary <= 7) return { status: 'Due Soon', color: 'warning' };
    return { status: 'Scheduled', color: 'info' };
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
          Warranty & Anniversary Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add Warranty
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
          placeholder="Search warranties/anniversaries..."
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
            {statuses.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Warranties" />
          <Tab label="Anniversaries" />
          <Tab label="Upcoming Reminders" />
          <Tab label="Overdue Items" />
        </Tabs>
      </Box>

      {/* Warranties Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 2 }}>
          {filteredWarranties.map((warranty) => {
            const warrantyStatus = getWarrantyStatus(warranty);
            return (
              <Card key={warranty._id} sx={{ position: 'relative' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {warranty.warrantyId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {warranty.clientName} - {warranty.projectName}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedItem(warranty);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Start: {new Date(warranty.startDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        End: {new Date(warranty.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={warranty.warrantyType}
                      color="primary"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={warrantyStatus.status}
                      color={warrantyStatus.color as any}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={warranty.status}
                      color={getStatusColor(warranty.status) as any}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  {warranty.description && (
                    <Typography variant="body2" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {warranty.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </TabPanel>

      {/* Anniversaries Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Anniversary Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAnniversaries.map((anniversary) => {
                const anniversaryStatus = getAnniversaryStatus(anniversary);
                return (
                  <TableRow key={anniversary._id}>
                    <TableCell>{anniversary.clientName}</TableCell>
                    <TableCell>{anniversary.projectName}</TableCell>
                    <TableCell>{anniversary.anniversaryType}</TableCell>
                    <TableCell>{new Date(anniversary.anniversaryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={anniversaryStatus.status}
                        color={anniversaryStatus.color as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleSendAnniversaryMessage(anniversary._id)}
                        disabled={anniversary.status === 'Sent'}
                      >
                        {anniversary.status === 'Sent' ? 'Sent' : 'Send Message'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Upcoming Reminders Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 2 }}>
          {[...filteredWarranties, ...filteredAnniversaries]
            .filter(item => {
              const now = new Date();
              const itemDate = new Date('endDate' in item ? item.endDate : item.anniversaryDate);
              const daysUntil = Math.ceil((itemDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return daysUntil <= 30 && daysUntil >= 0;
            })
            .sort((a, b) => {
              const dateA = new Date('endDate' in a ? a.endDate : a.anniversaryDate);
              const dateB = new Date('endDate' in b ? b.endDate : b.anniversaryDate);
              return dateA.getTime() - dateB.getTime();
            })
            .map((item) => (
              <Card key={item._id}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ScheduleIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="h6">
                      {'endDate' in item ? 'Warranty Expiry' : 'Anniversary'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {'endDate' in item ? item.clientName : item.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {'endDate' in item ? item.projectName : item.projectName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date('endDate' in item ? item.endDate : item.anniversaryDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </TabPanel>

      {/* Overdue Items Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 2 }}>
          {[...filteredWarranties, ...filteredAnniversaries]
            .filter(item => {
              const now = new Date();
              const itemDate = new Date('endDate' in item ? item.endDate : item.anniversaryDate);
              const daysSince = Math.ceil((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
              return daysSince > 0;
            })
            .sort((a, b) => {
              const dateA = new Date('endDate' in a ? a.endDate : a.anniversaryDate);
              const dateB = new Date('endDate' in b ? b.endDate : b.anniversaryDate);
              return dateB.getTime() - dateA.getTime();
            })
            .map((item) => (
              <Card key={item._id}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6">
                      {'endDate' in item ? 'Warranty Expired' : 'Anniversary Overdue'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {'endDate' in item ? item.clientName : item.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {'endDate' in item ? item.projectName : item.projectName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date('endDate' in item ? item.endDate : item.anniversaryDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </TabPanel>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setOpenEditDialog(true); setAnchorEl(null); }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedItem && handleDeleteWarranty(selectedItem._id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Warranty Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Warranty</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    value={newWarranty.clientId}
                    onChange={(e) => setNewWarranty({...newWarranty, clientId: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Project ID"
                    value={newWarranty.projectId}
                    onChange={(e) => setNewWarranty({...newWarranty, projectId: e.target.value})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Warranty Type</InputLabel>
                    <Select
                      value={newWarranty.warrantyType}
                      onChange={(e) => setNewWarranty({...newWarranty, warrantyType: e.target.value})}
                    >
                      {warrantyTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={newWarranty.startDate}
                    onChange={(e) => setNewWarranty({...newWarranty, startDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={newWarranty.endDate}
                    onChange={(e) => setNewWarranty({...newWarranty, endDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newWarranty.description}
                onChange={(e) => setNewWarranty({...newWarranty, description: e.target.value})}
                placeholder="Describe the warranty coverage..."
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newWarranty.notes}
                onChange={(e) => setNewWarranty({...newWarranty, notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateWarranty} variant="contained">
            Add Warranty
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Edit functionality would be implemented here based on the selected item type.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateWarranty} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Warranty;
