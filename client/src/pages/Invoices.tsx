import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Fab,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { api } from '../services/api';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  projectId: string;
  dealId: string;
  clientId: string;
  clientName: string;
  invoiceStage: string;
  amount: number;
  dueDate: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentDate?: string;
  reminderCount: number;
  lastReminderDate?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface Project {
  _id: string;
  dealId: string;
  projectName: string;
  clientName: string;
  totalProjectValue: number;
  currentStage: string;
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [newInvoice, setNewInvoice] = useState({
    projectId: '',
    clientName: '',
    invoiceStage: '',
    amount: '',
    dueDate: ''
  });

  const invoiceStages = [
    'Design Fee',
    '50% Advance', 
    '40% Interim',
    'Final 10%'
  ];

  const paymentStatuses = [
    'Sent',
    'Overdue',
    'Collected',
    'Cancelled'
  ];

  const paymentMethods = [
    'Bank Transfer',
    'Cheque',
    'Cash',
    'Online',
    'UPI'
  ];

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/deals');
      setProjects(response.data.deals || []);
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setNewInvoice({
      projectId: '',
      clientName: '',
      invoiceStage: '',
      amount: '',
      dueDate: ''
    });
    setOpenDialog(true);
  };


  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setOpenDialog(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenViewDialog(true);
  };

  const handleSendReminder = async (invoiceId: string) => {
    try {
      await api.post(`/invoices/${invoiceId}/reminder`);
      setSnackbarMessage('Payment reminder sent successfully!');
      setSnackbarOpen(true);
      fetchInvoices();
    } catch (err: any) {
      setSnackbarMessage('Failed to send reminder');
      setSnackbarOpen(true);
    }
  };

  const handleMarkPaid = async (invoiceId: string, paymentMethod: string) => {
    try {
      await api.put(`/invoices/${invoiceId}/payment`, {
        paymentMethod,
        paymentDate: new Date().toISOString()
      });
      setSnackbarMessage('Payment marked as collected!');
      setSnackbarOpen(true);
      fetchInvoices();
      setOpenViewDialog(false);
    } catch (err: any) {
      setSnackbarMessage('Failed to update payment');
      setSnackbarOpen(true);
    }
  };

  const handleSaveInvoice = async () => {
    try {
      const invoiceData = {
        ...newInvoice,
        amount: parseFloat(newInvoice.amount),
        dueDate: new Date(newInvoice.dueDate).toISOString()
      };
      
      if (editingInvoice) {
        await api.put(`/invoices/${editingInvoice._id}`, invoiceData);
        setSnackbarMessage('Invoice updated successfully!');
      } else {
        await api.post('/invoices', invoiceData);
        setSnackbarMessage('Invoice created successfully!');
      }
      setSnackbarOpen(true);
      setOpenDialog(false);
      fetchInvoices();
    } catch (err: any) {
      setSnackbarMessage('Failed to save invoice');
      setSnackbarOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Collected': return 'success';
      case 'Overdue': return 'error';
      case 'Sent': return 'warning';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Collected': return <CheckCircleIcon />;
      case 'Overdue': return <WarningIcon />;
      case 'Sent': return <ScheduleIcon />;
      default: return <ReceiptIcon />;
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

  const filteredInvoices = invoices.filter(invoice => {
    const statusMatch = filterStatus === 'all' || invoice.paymentStatus === filterStatus;
    const stageMatch = filterStage === 'all' || invoice.invoiceStage === filterStage;
    return statusMatch && stageMatch;
  });

  const overdueInvoices = invoices.filter(inv => 
    inv.paymentStatus === 'Overdue' || 
    (inv.paymentStatus === 'Sent' && new Date(inv.dueDate) < new Date())
  );

  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.paymentStatus === 'Sent').reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Invoice Management</Typography>
        <Typography>Loading invoices...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Invoice Management</Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Invoice Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Total Invoices
                  </Typography>
                  <Typography variant="h4" component="div">
                    {invoices.length}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Overdue
                  </Typography>
                  <Typography variant="h4" component="div" color="error.main">
                    {overdueInvoices.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(totalOverdue)}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {invoices.filter(inv => inv.paymentStatus === 'Sent').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(totalPending)}
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Collected
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {invoices.filter(inv => inv.paymentStatus === 'Collected').length}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FilterIcon />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Sent">Sent</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Collected">Collected</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Stage</InputLabel>
          <Select
            value={filterStage}
            label="Stage"
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <MenuItem value="all">All Stages</MenuItem>
            {invoiceStages.map(stage => (
              <MenuItem key={stage} value={stage}>{stage}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Invoice Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>
                  {projects.find(p => p._id === invoice.projectId)?.projectName || 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={invoice.invoiceStage} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(invoice.paymentStatus)}
                    label={invoice.paymentStatus}
                    color={getStatusColor(invoice.paymentStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewInvoice(invoice)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Invoice">
                    <IconButton onClick={() => handleEditInvoice(invoice)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {invoice.paymentStatus !== 'Collected' && (
                    <Tooltip title="Send Reminder">
                      <IconButton 
                        onClick={() => handleSendReminder(invoice._id)}
                        color="warning"
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Floating Action Button for Quick Reminders */}
      {overdueInvoices.length > 0 && (
        <Fab
          color="warning"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => {
            overdueInvoices.forEach(inv => handleSendReminder(inv._id));
          }}
        >
          <Badge badgeContent={overdueInvoices.length} color="error">
            <SendIcon />
          </Badge>
        </Fab>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={newInvoice.projectId}
                onChange={(e) => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                label="Project"
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.projectName} - {project.clientName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Client Name"
              value={newInvoice.clientName}
              onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Invoice Stage</InputLabel>
              <Select
                value={newInvoice.invoiceStage}
                onChange={(e) => setNewInvoice({ ...newInvoice, invoiceStage: e.target.value })}
                label="Invoice Stage"
              >
                {invoiceStages.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={newInvoice.dueDate}
              onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveInvoice} variant="contained">
            {editingInvoice ? 'Update' : 'Create'} Invoice
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Invoices;
