import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
  Fab,
  Divider,
  Paper,
  List,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { api } from '../services/api';

interface Designer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'Unavailable';
  experience: string;
  specializations: string[];
  isActive: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewDesigner {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'Unavailable';
  experience: string;
  specializations: string[];
  smsEnabled: boolean;
  emailEnabled: boolean;
}

const Designers: React.FC = () => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDesigner, setEditingDesigner] = useState<Designer | null>(null);
  const [newDesigner, setNewDesigner] = useState<NewDesigner>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Design',
    skills: [],
    availability: 'Available',
    experience: '',
    specializations: [],
    smsEnabled: true,
    emailEnabled: true
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Communication dialogs
  const [emailDialog, setEmailDialog] = useState(false);
  const [smsDialog, setSmsDialog] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', message: '', projectId: '' });
  const [smsData, setSmsData] = useState({ message: '', projectId: '' });

  const roles = [
    'Senior Interior Designer',
    'Junior Interior Designer',
    'Design Lead',
    'Senior Designer',
    'Design Consultant',
    'Project Designer',
    'Creative Director'
  ];

  const departments = ['Design', 'Project Management', 'Sales', 'Operations'];
  const availabilityOptions = ['Available', 'Busy', 'Unavailable'];

  const skillOptions = [
    'Residential Design',
    'Commercial Spaces',
    '3D Visualization',
    'Space Planning',
    'Material Selection',
    'Client Presentations',
    'Project Management',
    'Team Leadership',
    'Client Relations',
    'AutoCAD',
    'SketchUp',
    'Photoshop',
    'Revit'
  ];

  const specializationOptions = [
    'Modern',
    'Contemporary',
    'Minimalist',
    'Traditional',
    'Eclectic',
    'Luxury Residential',
    'Hospitality Design',
    'Office Spaces',
    'Retail Design',
    'Healthcare Design'
  ];

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/designers');
      setDesigners(response.data.designers);
    } catch (err) {
      setError('Failed to fetch designers');
      console.error('Error fetching designers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDesigner = async () => {
    try {
      await api.post('/designers', newDesigner);
      setSnackbar({ open: true, message: 'Designer created successfully', severity: 'success' });
      setOpenDialog(false);
      setNewDesigner({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: 'Design',
        skills: [],
        availability: 'Available',
        experience: '',
        specializations: [],
        smsEnabled: true,
        emailEnabled: true
      });
      await fetchDesigners();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create designer', severity: 'error' });
      console.error('Error creating designer:', err);
    }
  };

  const handleUpdateDesigner = async () => {
    if (!editingDesigner) return;
    
    try {
      await api.put(`/designers/${editingDesigner.id}`, editingDesigner);
      setSnackbar({ open: true, message: 'Designer updated successfully', severity: 'success' });
      setOpenDialog(false);
      setEditingDesigner(null);
      fetchDesigners();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update designer', severity: 'error' });
      console.error('Error updating designer:', err);
    }
  };

  const handleDeleteDesigner = async (id: string) => {
    try {
      await api.delete(`/designers/${id}`);
      setSnackbar({ open: true, message: 'Designer deleted successfully', severity: 'success' });
      fetchDesigners();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete designer', severity: 'error' });
      console.error('Error deleting designer:', err);
    }
    setAnchorEl(null);
  };

  const handleSendEmail = async () => {
    if (!selectedDesigner) return;
    
    try {
      await api.post(`/designers/${selectedDesigner.id}/send-email`, emailData);
      setSnackbar({ open: true, message: `Email sent to ${selectedDesigner.name}`, severity: 'success' });
      setEmailDialog(false);
      setEmailData({ subject: '', message: '', projectId: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to send email', severity: 'error' });
      console.error('Error sending email:', err);
    }
  };

  const handleSendSms = async () => {
    if (!selectedDesigner) return;
    
    try {
      await api.post(`/designers/${selectedDesigner.id}/send-sms`, smsData);
      setSnackbar({ open: true, message: `SMS sent to ${selectedDesigner.name}`, severity: 'success' });
      setSmsDialog(false);
      setSmsData({ message: '', projectId: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to send SMS', severity: 'error' });
      console.error('Error sending SMS:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, designer: Designer) => {
    setAnchorEl(event.currentTarget);
    setSelectedDesigner(designer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDesigner(null);
  };

  const handleEditDesigner = (designer: Designer) => {
    setEditingDesigner(designer);
    setOpenDialog(true);
    handleMenuClose();
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'success';
      case 'Busy': return 'warning';
      case 'Unavailable': return 'error';
      default: return 'default';
    }
  };

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = !availabilityFilter || designer.availability === availabilityFilter;
    const matchesRole = !roleFilter || designer.role === roleFilter;
    
    return matchesSearch && matchesAvailability && matchesRole;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading designers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Designers Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Designer
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
            <TextField
              fullWidth
              label="Search designers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                label="Availability"
              >
                <MenuItem value="">All</MenuItem>
                {availabilityOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '0 0 auto' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setAvailabilityFilter('');
                setRoleFilter('');
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Designers Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {filteredDesigners.map((designer) => (
          <Box key={designer.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {designer.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {designer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {designer.role}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, designer)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={designer.availability}
                    color={getAvailabilityColor(designer.availability) as any}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {designer.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <WorkIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {designer.experience}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {designer.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {designer.email}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {designer.skills.slice(0, 3).map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                    {designer.skills.length > 3 && (
                      <Chip label={`+${designer.skills.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Specializations:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {designer.specializations.slice(0, 2).map((spec, index) => (
                      <Chip key={index} label={spec} size="small" color="primary" variant="outlined" />
                    ))}
                    {designer.specializations.length > 2 && (
                      <Chip label={`+${designer.specializations.length - 2}`} size="small" color="primary" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Email enabled">
                    <EmailIcon color={designer.emailEnabled ? 'success' : 'disabled'} sx={{ fontSize: 20 }} />
                  </Tooltip>
                  <Tooltip title="SMS enabled">
                    <SmsIcon color={designer.smsEnabled ? 'success' : 'disabled'} sx={{ fontSize: 20 }} />
                  </Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Added {new Date(designer.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>

      {filteredDesigners.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No designers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or add a new designer
          </Typography>
        </Box>
      )}

      {/* Add/Edit Designer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDesigner ? 'Edit Designer' : 'Add New Designer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Name"
                value={editingDesigner?.name || newDesigner.name}
                onChange={(e) => {
                  if (editingDesigner) {
                    setEditingDesigner({ ...editingDesigner, name: e.target.value });
                  } else {
                    setNewDesigner({ ...newDesigner, name: e.target.value });
                  }
                }}
                required
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editingDesigner?.email || newDesigner.email}
                onChange={(e) => {
                  if (editingDesigner) {
                    setEditingDesigner({ ...editingDesigner, email: e.target.value });
                  } else {
                    setNewDesigner({ ...newDesigner, email: e.target.value });
                  }
                }}
                required
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Phone"
                value={editingDesigner?.phone || newDesigner.phone}
                onChange={(e) => {
                  if (editingDesigner) {
                    setEditingDesigner({ ...editingDesigner, phone: e.target.value });
                  } else {
                    setNewDesigner({ ...newDesigner, phone: e.target.value });
                  }
                }}
                required
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editingDesigner?.role || newDesigner.role}
                  onChange={(e) => {
                    if (editingDesigner) {
                      setEditingDesigner({ ...editingDesigner, role: e.target.value });
                    } else {
                      setNewDesigner({ ...newDesigner, role: e.target.value });
                    }
                  }}
                  label="Role"
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={editingDesigner?.department || newDesigner.department}
                  onChange={(e) => {
                    if (editingDesigner) {
                      setEditingDesigner({ ...editingDesigner, department: e.target.value });
                    } else {
                      setNewDesigner({ ...newDesigner, department: e.target.value });
                    }
                  }}
                  label="Department"
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={editingDesigner?.availability || newDesigner.availability}
                  onChange={(e) => {
                    if (editingDesigner) {
                      setEditingDesigner({ ...editingDesigner, availability: e.target.value as any });
                    } else {
                      setNewDesigner({ ...newDesigner, availability: e.target.value as any });
                    }
                  }}
                  label="Availability"
                >
                  {availabilityOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Experience"
                value={editingDesigner?.experience || newDesigner.experience}
                onChange={(e) => {
                  if (editingDesigner) {
                    setEditingDesigner({ ...editingDesigner, experience: e.target.value });
                  } else {
                    setNewDesigner({ ...newDesigner, experience: e.target.value });
                  }
                }}
                placeholder="e.g., 5 years, 3+ years experience"
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  value={editingDesigner?.skills || newDesigner.skills}
                  onChange={(e) => {
                    const value = e.target.value as string[];
                    if (editingDesigner) {
                      setEditingDesigner({ ...editingDesigner, skills: value });
                    } else {
                      setNewDesigner({ ...newDesigner, skills: value });
                    }
                  }}
                  label="Skills"
                >
                  {skillOptions.map(skill => (
                    <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Specializations</InputLabel>
                <Select
                  multiple
                  value={editingDesigner?.specializations || newDesigner.specializations}
                  onChange={(e) => {
                    const value = e.target.value as string[];
                    if (editingDesigner) {
                      setEditingDesigner({ ...editingDesigner, specializations: value });
                    } else {
                      setNewDesigner({ ...newDesigner, specializations: value });
                    }
                  }}
                  label="Specializations"
                >
                  {specializationOptions.map(spec => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingDesigner?.emailEnabled ?? newDesigner.emailEnabled}
                    onChange={(e) => {
                      if (editingDesigner) {
                        setEditingDesigner({ ...editingDesigner, emailEnabled: e.target.checked });
                      } else {
                        setNewDesigner({ ...newDesigner, emailEnabled: e.target.checked });
                      }
                    }}
                  />
                }
                label="Email Notifications"
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingDesigner?.smsEnabled ?? newDesigner.smsEnabled}
                    onChange={(e) => {
                      if (editingDesigner) {
                        setEditingDesigner({ ...editingDesigner, smsEnabled: e.target.checked });
                      } else {
                        setNewDesigner({ ...newDesigner, smsEnabled: e.target.checked });
                      }
                    }}
                  />
                }
                label="SMS Notifications"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={editingDesigner ? handleUpdateDesigner : handleCreateDesigner}
            variant="contained"
            disabled={
              editingDesigner
                ? !editingDesigner.name || !editingDesigner.email || !editingDesigner.phone || !editingDesigner.role
                : !newDesigner.name || !newDesigner.email || !newDesigner.phone || !newDesigner.role
            }
          >
            {editingDesigner ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedDesigner && handleEditDesigner(selectedDesigner)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedDesigner && setEmailDialog(true)}
          disabled={selectedDesigner?.emailEnabled === false}
        >
          <EmailIcon sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem 
          onClick={() => selectedDesigner && setSmsDialog(true)}
          disabled={selectedDesigner?.smsEnabled === false}
        >
          <SmsIcon sx={{ mr: 1 }} />
          Send SMS
        </MenuItem>
        <MenuItem 
          onClick={() => selectedDesigner && handleDeleteDesigner(selectedDesigner.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Email Dialog */}
      <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Email to {selectedDesigner?.name}
          <IconButton
            onClick={() => setEmailDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            fullWidth
            label="Project ID (Optional)"
            value={emailData.projectId}
            onChange={(e) => setEmailData({ ...emailData, projectId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={emailData.message}
            onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!emailData.subject || !emailData.message}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={smsDialog} onClose={() => setSmsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send SMS to {selectedDesigner?.name}
          <IconButton
            onClick={() => setSmsDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Project ID (Optional)"
            value={smsData.projectId}
            onChange={(e) => setSmsData({ ...smsData, projectId: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={smsData.message}
            onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSmsDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendSms}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!smsData.message}
          >
            Send SMS
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Designers;
