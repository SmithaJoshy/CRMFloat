import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalanceWallet as PaymentIcon,
  Assignment as ProjectIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Send as SendIcon,
  Assessment as AssessmentIcon,
  PhotoCamera as PhotoIcon,
  Task as TaskIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccountTree as PipelineIcon,
  ViewKanban as KanbanIcon,
  TrendingUp as LeadsIcon,
  Receipt as InvoiceIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface DashboardStats {
  totalPipelineValue: number;
  overduePayments: number;
  activeProjects: number;
  totalClients: number;
}

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  time: string;
  completed: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('founder');
  
  // Business metrics data
  const businessMetrics = {
    revenue: {
      current: 1250000,
      previous: 980000,
      growth: 27.6
    },
    profit: {
      current: 375000,
      previous: 294000,
      growth: 27.6
    },
    clients: {
      current: 45,
      previous: 38,
      growth: 18.4
    },
    leads: {
      current: 127,
      previous: 98,
      growth: 29.6
    },
    projects: {
      current: 23,
      previous: 18,
      growth: 27.8
    }
  };

  // Chart data for different time periods
  const revenueData = [
    { month: 'Jan', revenue: 85000, profit: 25500 },
    { month: 'Feb', revenue: 92000, profit: 27600 },
    { month: 'Mar', revenue: 105000, profit: 31500 },
    { month: 'Apr', revenue: 118000, profit: 35400 },
    { month: 'May', revenue: 132000, profit: 39600 },
    { month: 'Jun', revenue: 145000, profit: 43500 },
    { month: 'Jul', revenue: 158000, profit: 47400 },
    { month: 'Aug', revenue: 142000, profit: 42600 },
    { month: 'Sep', revenue: 168000, profit: 50400 },
    { month: 'Oct', revenue: 185000, profit: 55500 },
    { month: 'Nov', revenue: 198000, profit: 59400 },
    { month: 'Dec', revenue: 210000, profit: 63000 },
  ];

  const leadConversionData = [
    { stage: 'Leads', count: 127, color: '#8884d8' },
    { stage: 'Qualified', count: 89, color: '#82ca9d' },
    { stage: 'Proposals', count: 45, color: '#ffc658' },
    { stage: 'Negotiation', count: 23, color: '#ff7300' },
    { stage: 'Closed Won', count: 18, color: '#00ff00' },
    { stage: 'Closed Lost', count: 5, color: '#ff0000' },
  ];

  const projectStatusData = [
    { status: 'Active', count: 12, color: '#4caf50' },
    { status: 'Planning', count: 8, color: '#ff9800' },
    { status: 'Completed', count: 15, color: '#2196f3' },
    { status: 'On Hold', count: 3, color: '#f44336' },
  ];

  const monthlyGrowthData = [
    { month: 'Jan', growth: 12.5 },
    { month: 'Feb', growth: 15.2 },
    { month: 'Mar', growth: 18.7 },
    { month: 'Apr', growth: 22.1 },
    { month: 'May', growth: 25.8 },
    { month: 'Jun', growth: 28.3 },
    { month: 'Jul', growth: 31.2 },
    { month: 'Aug', growth: 29.8 },
    { month: 'Sep', growth: 33.5 },
    { month: 'Oct', growth: 36.1 },
    { month: 'Nov', growth: 38.7 },
    { month: 'Dec', growth: 42.3 },
  ];
  
  // Form states for different modals
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: ''
  });
  
  const [siteVisit, setSiteVisit] = useState({
    clientName: '',
    projectName: '',
    date: '',
    time: '',
    address: '',
    notes: ''
  });
  
  const [paymentReminder, setPaymentReminder] = useState({
    clientName: '',
    invoiceNumber: '',
    amount: '',
    dueDate: '',
    message: ''
  });
  
  const [quote, setQuote] = useState({
    clientName: '',
    projectName: '',
    services: '',
    amount: '',
    validUntil: ''
  });
  
  const [sitePhotos, setSitePhotos] = useState({
    projectName: '',
    description: '',
    location: '',
    date: ''
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  // Sample tasks data - in a real app, this would come from an API
  const todaysTasks: Task[] = [
    { id: '1', title: 'Follow up with Sharma Family', priority: 'high', time: '2:00 PM', completed: false },
    { id: '2', title: 'Site measurement at Tech Startup', priority: 'medium', time: '4:30 PM', completed: false },
    { id: '3', title: 'Review 3D designs for Agarwal Villa', priority: 'low', time: 'Evening', completed: false },
    { id: '4', title: 'Prepare hotel lobby mood board', priority: 'medium', time: '11:00 AM', completed: false },
    { id: '5', title: 'Source Italian marble samples', priority: 'high', time: '3:00 PM', completed: false },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Add New Lead',
      icon: <AddIcon />,
      action: () => setOpenModal('lead'),
      color: '#2563eb',
    },
    {
      id: '2',
      title: 'Schedule Site Visit',
      icon: <CalendarIcon />,
      action: () => setOpenModal('siteVisit'),
      color: '#059669',
    },
    {
      id: '3',
      title: 'Send Payment Reminder',
      icon: <SendIcon />,
      action: () => setOpenModal('paymentReminder'),
      color: '#dc2626',
    },
    {
      id: '4',
      title: 'Generate Quote',
      icon: <AssessmentIcon />,
      action: () => setOpenModal('quote'),
      color: '#7c3aed',
    },
    {
      id: '5',
      title: 'Upload Site Photos',
      icon: <PhotoIcon />,
      action: () => setOpenModal('sitePhotos'),
      color: '#ea580c',
    },
    {
      id: '6',
      title: 'Create Task',
      icon: <TaskIcon />,
      action: () => setOpenModal('task'),
      color: '#0891b2',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#ea580c';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const handleSaveLead = () => {
    // In a real app, this would save to the backend
    console.log('Saving lead:', newLead);
    setSnackbarMessage('Lead created successfully!');
    setSnackbarOpen(true);
    setOpenModal(null);
    setNewLead({ name: '', email: '', phone: '', company: '', requirements: '' });
  };

  const handleSaveSiteVisit = () => {
    console.log('Scheduling site visit:', siteVisit);
    setSnackbarMessage('Site visit scheduled successfully!');
    setSnackbarOpen(true);
    setOpenModal(null);
    setSiteVisit({ clientName: '', projectName: '', date: '', time: '', address: '', notes: '' });
  };

  const handleSendPaymentReminder = () => {
    console.log('Sending payment reminder:', paymentReminder);
    setSnackbarMessage('Payment reminder sent successfully!');
    setSnackbarOpen(true);
    setOpenModal(null);
    setPaymentReminder({ clientName: '', invoiceNumber: '', amount: '', dueDate: '', message: '' });
  };

  const handleGenerateQuote = () => {
    console.log('Generating quote:', quote);
    setSnackbarMessage('Quote generated successfully!');
    setSnackbarOpen(true);
    setOpenModal(null);
    setQuote({ clientName: '', projectName: '', services: '', amount: '', validUntil: '' });
  };

  const handleUploadSitePhotos = () => {
    console.log('Uploading site photos:', sitePhotos);
    setSnackbarMessage('Site photos uploaded successfully!');
    setSnackbarOpen(true);
    setOpenModal(null);
    setSitePhotos({ projectName: '', description: '', location: '', date: '' });
  };

  const handleCreateTask = () => {
    console.log('Creating task:', newTask);
    setSnackbarMessage('Task created successfully!');
    setSnackbarOpen(true);
    setOpenModal(null);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
  };

  // Role-based dashboard components
  const renderMetricCard = (title: string, value: number | string, previous: number, growth: number, icon: React.ReactNode, color: string) => (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: growth >= 0 ? '#4caf50' : '#f44336',
                  fontWeight: 600
                }}
              >
                {growth >= 0 ? '+' : ''}{growth}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                vs last period
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1.5,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderFounderDashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        📊 Executive Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Total Revenue',
            businessMetrics.revenue.current,
            businessMetrics.revenue.previous,
            businessMetrics.revenue.growth,
            <MoneyIcon />,
            '#4caf50'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Net Profit',
            businessMetrics.profit.current,
            businessMetrics.profit.previous,
            businessMetrics.profit.growth,
            <TrendingUpIcon />,
            '#2196f3'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Active Clients',
            businessMetrics.clients.current,
            businessMetrics.clients.previous,
            businessMetrics.clients.growth,
            <PeopleIcon />,
            '#ff9800'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Active Projects',
            businessMetrics.projects.current,
            businessMetrics.projects.previous,
            businessMetrics.projects.growth,
            <ProjectIcon />,
            '#9c27b0'
          )}
        </Box>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue & Profit Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4caf50" fill="#4caf50" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="profit" stackId="2" stroke="#2196f3" fill="#2196f3" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Growth Chart */}
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Growth Rate
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                <Line type="monotone" dataKey="growth" stroke="#ff9800" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  const renderSalesDashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        🎯 Sales Dashboard
      </Typography>
      
      {/* Sales Metrics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Total Leads',
            businessMetrics.leads.current,
            businessMetrics.leads.previous,
            businessMetrics.leads.growth,
            <LeadsIcon />,
            '#7c3aed'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Active Clients',
            businessMetrics.clients.current,
            businessMetrics.clients.previous,
            businessMetrics.clients.growth,
            <PeopleIcon />,
            '#4caf50'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Pipeline Value',
            businessMetrics.revenue.current,
            businessMetrics.revenue.previous,
            businessMetrics.revenue.growth,
            <PipelineIcon />,
            '#2196f3'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Conversion Rate',
            '14.2%',
            0,
            0,
            <TrendingUpIcon />,
            '#ff9800'
          )}
        </Box>
      </Box>

      {/* Lead Conversion Funnel */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Conversion Funnel
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadConversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(quickActions || []).slice(0, 4).map((action) => (
                  <Button
                    key={action.id}
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={action.action}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: action.color,
                      color: action.color,
                      '&:hover': {
                        backgroundColor: action.color,
                        color: 'white',
                        borderColor: action.color,
                      },
                    }}
                  >
                    {action.title}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const renderInvestorDashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        💼 Investor Dashboard
      </Typography>
      
      {/* Financial Metrics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'ARR (Annual Recurring Revenue)',
            businessMetrics.revenue.current,
            businessMetrics.revenue.previous,
            businessMetrics.revenue.growth,
            <MoneyIcon />,
            '#4caf50'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Gross Margin',
            '30%',
            0,
            0,
            <TrendingUpIcon />,
            '#2196f3'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Customer Acquisition Cost',
            '₹8,500',
            0,
            0,
            <PeopleIcon />,
            '#ff9800'
          )}
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          {renderMetricCard(
            'Customer Lifetime Value',
            '₹125,000',
            0,
            0,
            <BusinessIcon />,
            '#9c27b0'
          )}
        </Box>
      </Box>

      {/* Revenue Growth Chart */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Growth (YoY)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={3} />
                  <Line type="monotone" dataKey="profit" stroke="#2196f3" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Growth Rate</Typography>
                  <Typography variant="h6" color="primary">27.6%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                  <Typography variant="h6" color="primary">30%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Client Retention</Typography>
                  <Typography variant="h6" color="primary">92%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Market Share</Typography>
                  <Typography variant="h6" color="primary">15%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <ErrorIcon sx={{ fontSize: 16 }} />;
      case 'medium': return <WarningIcon sx={{ fontSize: 16 }} />;
      case 'low': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      default: return <ScheduleIcon sx={{ fontSize: 16 }} />;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        
        setStats({
          totalPipelineValue: response.data.totalPipeline || 0,
          overduePayments: response.data.overduePayments || 0,
          activeProjects: response.data.activeProjects || 0,
          totalClients: response.data.totalLeads || 0,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const statCards = [
    {
      title: 'Total Pipeline Value',
      value: `₹${stats?.totalPipelineValue.toLocaleString() || 0}`,
      icon: <TrendingUpIcon />,
      color: '#2563eb',
    },
    {
      title: 'Overdue Payments',
      value: stats?.overduePayments || 0,
      icon: <PaymentIcon />,
      color: '#dc2626',
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: <ProjectIcon />,
      color: '#059669',
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: <PeopleIcon />,
      color: '#7c3aed',
    },
  ];

  return (
    <Box>
      {/* Header with Role Selector */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
              Welcome back! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your design projects today
            </Typography>
          </Box>
          <Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Dashboard View</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Dashboard View"
              >
                <MenuItem value="founder">👑 Founder/CEO</MenuItem>
                <MenuItem value="sales">🎯 Sales Rep</MenuItem>
                <MenuItem value="investor">💼 Investor</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Role-based Dashboard Content */}
      {selectedRole === 'founder' && renderFounderDashboard()}
      {selectedRole === 'sales' && renderSalesDashboard()}
      {selectedRole === 'investor' && renderInvestorDashboard()}

      {/* Modals */}
      {/* Add New Lead Modal */}
      <Dialog open={openModal === 'lead'} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone"
              value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Company"
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
            <TextField
              fullWidth
              label="Requirements"
              multiline
              rows={3}
              value={newLead.requirements}
              onChange={(e) => setNewLead({ ...newLead, requirements: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button onClick={handleSaveLead} variant="contained">Create Lead</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Site Visit Modal */}
      <Dialog open={openModal === 'siteVisit'} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Site Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Client Name"
              value={siteVisit.clientName}
              onChange={(e) => setSiteVisit({ ...siteVisit, clientName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Project Name"
              value={siteVisit.projectName}
              onChange={(e) => setSiteVisit({ ...siteVisit, projectName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={siteVisit.date}
              onChange={(e) => setSiteVisit({ ...siteVisit, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              value={siteVisit.time}
              onChange={(e) => setSiteVisit({ ...siteVisit, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Address"
              value={siteVisit.address}
              onChange={(e) => setSiteVisit({ ...siteVisit, address: e.target.value })}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={siteVisit.notes}
              onChange={(e) => setSiteVisit({ ...siteVisit, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button onClick={handleSaveSiteVisit} variant="contained">Schedule Visit</Button>
        </DialogActions>
      </Dialog>

      {/* Send Payment Reminder Modal */}
      <Dialog open={openModal === 'paymentReminder'} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Payment Reminder</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Client Name"
              value={paymentReminder.clientName}
              onChange={(e) => setPaymentReminder({ ...paymentReminder, clientName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Invoice Number"
              value={paymentReminder.invoiceNumber}
              onChange={(e) => setPaymentReminder({ ...paymentReminder, invoiceNumber: e.target.value })}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={paymentReminder.amount}
              onChange={(e) => setPaymentReminder({ ...paymentReminder, amount: e.target.value })}
            />
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={paymentReminder.dueDate}
              onChange={(e) => setPaymentReminder({ ...paymentReminder, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={3}
              value={paymentReminder.message}
              onChange={(e) => setPaymentReminder({ ...paymentReminder, message: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button onClick={handleSendPaymentReminder} variant="contained">Send Reminder</Button>
        </DialogActions>
      </Dialog>

      {/* Generate Quote Modal */}
      <Dialog open={openModal === 'quote'} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Quote</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Client Name"
              value={quote.clientName}
              onChange={(e) => setQuote({ ...quote, clientName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Project Name"
              value={quote.projectName}
              onChange={(e) => setQuote({ ...quote, projectName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Services"
              multiline
              rows={3}
              value={quote.services}
              onChange={(e) => setQuote({ ...quote, services: e.target.value })}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={quote.amount}
              onChange={(e) => setQuote({ ...quote, amount: e.target.value })}
            />
            <TextField
              fullWidth
              label="Valid Until"
              type="date"
              value={quote.validUntil}
              onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button onClick={handleGenerateQuote} variant="contained">Generate Quote</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Site Photos Modal */}
      <Dialog open={openModal === 'sitePhotos'} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Site Photos</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={sitePhotos.projectName}
              onChange={(e) => setSitePhotos({ ...sitePhotos, projectName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={sitePhotos.description}
              onChange={(e) => setSitePhotos({ ...sitePhotos, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Location"
              value={sitePhotos.location}
              onChange={(e) => setSitePhotos({ ...sitePhotos, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={sitePhotos.date}
              onChange={(e) => setSitePhotos({ ...sitePhotos, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="outlined" startIcon={<PhotoIcon />} sx={{ mt: 2 }}>
              Select Photos
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button onClick={handleUploadSitePhotos} variant="contained">Upload Photos</Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Modal */}
      <Dialog open={openModal === 'task'} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">Create Task</Button>
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

export default Dashboard;
