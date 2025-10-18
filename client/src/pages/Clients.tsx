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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

interface Client {
  _id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  stylePreferences: string[];
  targetBudget: number;
  leadSource: string;
  createdAt: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    stylePreferences: [] as string[],
    targetBudget: 0,
    leadSource: 'Website'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, client: Client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };

  const handleCreateClient = async () => {
    try {
      const response = await api.post('/clients', newClient);
      setClients([...clients, response.data.client]);
      setOpenCreateDialog(false);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        stylePreferences: [],
        targetBudget: 0,
        leadSource: 'Website'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create client');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedClient) return;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('clientId', selectedClient._id);
      
      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setOpenUploadDialog(false);
      setSelectedFile(null);
      setError(''); // Clear any previous errors
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      const response = await api.put(`/clients/${selectedClient._id}`, selectedClient);
      setClients(clients.map(c => c._id === selectedClient._id ? response.data.client : c));
      setOpenEditDialog(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update client');
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    
    try {
      await api.delete(`/clients/${selectedClient._id}`);
      await fetchClients();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete client');
    } finally {
      handleMenuClose();
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

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
        <Typography variant="h4">Clients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredClients.map((client) => (
          <Box key={client._id} sx={{ flex: '1 1 350px', minWidth: '350px' }}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {client.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {client.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {client.phone}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, client)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Budget: ₹{client.targetBudget.toLocaleString()}
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Style Preferences:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {client.stylePreferences.map((style, index) => (
                        <Chip
                          key={index}
                          label={style}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Chip
                    label={client.leadSource}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {filteredClients.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No clients found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { setOpenUploadDialog(true); setAnchorEl(null); }}>
          <UploadIcon sx={{ mr: 1 }} />
          Upload File
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Client Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client Name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Target Budget (₹)"
                    type="number"
                    value={newClient.targetBudget}
                    onChange={(e) => setNewClient({...newClient, targetBudget: parseInt(e.target.value) || 0})}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Lead Source</InputLabel>
                    <Select
                      value={newClient.leadSource}
                      onChange={(e) => setNewClient({...newClient, leadSource: e.target.value})}
                    >
                      <MenuItem value="Website">Website</MenuItem>
                      <MenuItem value="Referral">Referral</MenuItem>
                      <MenuItem value="Social Media">Social Media</MenuItem>
                      <MenuItem value="Google Ads">Google Ads</MenuItem>
                      <MenuItem value="Walk-in">Walk-in</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Style Preferences (comma-separated)"
                    placeholder="Modern, Minimalist, Traditional"
                    value={newClient.stylePreferences.join(', ')}
                    onChange={(e) => setNewClient({...newClient, stylePreferences: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateClient} variant="contained">
            Add Client
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedClient?.name || ''}
                  onChange={(e) => setSelectedClient(prev => prev ? {...prev, name: e.target.value} : null)}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedClient?.email || ''}
                  onChange={(e) => setSelectedClient(prev => prev ? {...prev, email: e.target.value} : null)}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedClient?.phone || ''}
                  onChange={(e) => setSelectedClient(prev => prev ? {...prev, phone: e.target.value} : null)}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <TextField
                  fullWidth
                  label="Target Budget"
                  type="number"
                  value={selectedClient?.targetBudget || 0}
                  onChange={(e) => setSelectedClient(prev => prev ? {...prev, targetBudget: Number(e.target.value)} : null)}
                />
              </Box>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Lead Source</InputLabel>
              <Select
                value={selectedClient?.leadSource || ''}
                onChange={(e) => setSelectedClient(prev => prev ? {...prev, leadSource: e.target.value} : null)}
              >
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
                <MenuItem value="Google Ads">Google Ads</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateClient} variant="contained">
            Update Client
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload File for {selectedClient?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ marginBottom: '16px' }}
            />
            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleFileUpload} 
            variant="contained"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clients;
