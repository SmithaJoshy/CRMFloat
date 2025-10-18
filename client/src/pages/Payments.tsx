import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

interface Payment {
  _id: string;
  paymentId: string;
  invoiceNumber: string;
  invoiceStage: string;
  amount: number;
  dueDate: string;
  status: string;
  clientId: {
    name: string;
    email: string;
  };
  dealId: {
    projectName: string;
  };
  reminderCount: number;
  daysOverdue: number;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    invoiceNumber: '',
    amount: '',
    paymentMethod: '',
    paymentDate: '',
    notes: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data.payments);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, payment: Payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handleCreatePayment = () => {
    setNewPayment({
      invoiceNumber: '',
      amount: '',
      paymentMethod: '',
      paymentDate: '',
      notes: ''
    });
    setOpenCreateDialog(true);
  };

  const handleSavePayment = async () => {
    try {
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
        paymentDate: new Date(newPayment.paymentDate).toISOString()
      };
      
      await api.post('/payments', paymentData);
      setSnackbarMessage('Payment recorded successfully!');
      setSnackbarOpen(true);
      setOpenCreateDialog(false);
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      setSnackbarMessage('Failed to record payment');
      setSnackbarOpen(true);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedPayment) return;
    
    try {
      await api.post(`/automation/send-reminder/${selectedPayment._id}`);
      await fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reminder');
    } finally {
      handleMenuClose();
    }
  };

  const handleMarkCollected = async () => {
    if (!selectedPayment) return;
    
    try {
      await api.post(`/payments/${selectedPayment._id}/collect`);
      await fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark as collected');
    } finally {
      handleMenuClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Collected': return 'success';
      case 'Overdue': return 'error';
      case 'Sent': return 'info';
      case 'Cancelled': return 'default';
      default: return 'warning';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.dealId?.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePayment}
        >
          Add Payment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Sent">Sent</MenuItem>
          <MenuItem value="Overdue">Overdue</MenuItem>
          <MenuItem value="Collected">Collected</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

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
              <TableCell>Reminders</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{payment.invoiceNumber}</TableCell>
                <TableCell>{payment.clientId.name}</TableCell>
                <TableCell>{payment.dealId.projectName}</TableCell>
                <TableCell>{payment.invoiceStage}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(payment.dueDate).toLocaleDateString()}
                  {payment.daysOverdue > 0 && (
                    <Typography variant="caption" color="error" display="block">
                      {payment.daysOverdue} days overdue
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.reminderCount}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, payment)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredPayments.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No payments found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search terms or filters' 
              : 'No payments have been created yet'
            }
          </Typography>
        </Box>
      )}

      {/* Create Payment Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Invoice Number"
              value={newPayment.invoiceNumber}
              onChange={(e) => setNewPayment({ ...newPayment, invoiceNumber: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={newPayment.paymentMethod}
                onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                label="Payment Method"
              >
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Payment Date"
              type="date"
              value={newPayment.paymentDate}
              onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={newPayment.notes}
              onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePayment} variant="contained">
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSendReminder}>
          <SendIcon sx={{ mr: 1 }} />
          Send Reminder
        </MenuItem>
        {selectedPayment?.status !== 'Collected' && (
          <MenuItem onClick={handleMarkCollected}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            Mark as Collected
          </MenuItem>
        )}
      </Menu>

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

export default Payments;
