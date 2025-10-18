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
  Avatar,
  Rating,
  Divider,
  Switch,
  FormControlLabel,
  Badge,
  Tooltip,
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
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Photo as PhotoIcon,
  VideoLibrary as VideoIcon,
  Description as DocumentIcon,
  Cake as CakeIcon,
  CardGiftcard as GiftIcon,
  ThumbUp as ThumbUpIcon,
  Reviews as ReviewsIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface ValuedCustomer {
  _id: string;
  clientId: string;
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  isValued: boolean;
  valuedSince: string;
  totalProjects: number;
  totalValue: number;
  npsScore?: number;
  referralCount: number;
  testimonials: Testimonial[];
  projectMedia: ProjectMedia[];
  anniversaries: Anniversary[];
  rewards: Reward[];
  handoverDates: HandoverDate[];
  lastContactDate: string;
  nextFollowUpDate?: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  _id: string;
  projectId: string;
  projectName: string;
  rating: number;
  review: string;
  isPublic: boolean;
  date: string;
  mediaUrls?: string[];
}

interface ProjectMedia {
  _id: string;
  projectId: string;
  projectName: string;
  type: 'photo' | 'video' | 'document';
  url: string;
  caption?: string;
  date: string;
  isPublic: boolean;
}

interface Anniversary {
  _id: string;
  type: 'project_completion' | 'first_meeting' | 'birthday' | 'business_anniversary';
  date: string;
  title: string;
  message: string;
  sentDate?: string;
  status: 'pending' | 'sent' | 'celebrated';
}

interface Reward {
  _id: string;
  type: 'referral_bonus' | 'nps_reward' | 'loyalty_bonus' | 'special_gift';
  title: string;
  description: string;
  value: number;
  status: 'pending' | 'awarded' | 'redeemed';
  date: string;
}

interface HandoverDate {
  _id: string;
  projectId: string;
  projectName: string;
  handoverDate: string;
  satisfaction: number;
  feedback?: string;
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
      id={`beyond-care-tabpanel-${index}`}
      aria-labelledby={`beyond-care-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BeyondCare: React.FC = () => {
  const navigate = useNavigate();
  const [valuedCustomers, setValuedCustomers] = useState<ValuedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ValuedCustomer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view'>('create');
  const [newCustomer, setNewCustomer] = useState<Partial<ValuedCustomer>>({});

  const tabs = [
    { label: 'Valued Customers', icon: <StarIcon /> },
    { label: 'Testimonials', icon: <ReviewsIcon /> },
    { label: 'Project Media', icon: <PhotoIcon /> },
    { label: 'Anniversaries', icon: <CakeIcon /> },
    { label: 'Rewards & Referrals', icon: <TrophyIcon /> },
    { label: 'Follow-up Schedule', icon: <ScheduleIcon /> },
  ];

  useEffect(() => {
    fetchValuedCustomers();
  }, []);

  const fetchValuedCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/valued-customers');
      setValuedCustomers(response.data.valuedCustomers || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch valued customers');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsValued = async (customerId: string) => {
    try {
      await api.put(`/valued-customers/${customerId}/mark-valued`);
      fetchValuedCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark customer as valued');
    }
  };

  const handleCreateTestimonial = async (customerId: string, testimonial: Partial<Testimonial>) => {
    try {
      await api.post(`/valued-customers/${customerId}/testimonials`, testimonial);
      fetchValuedCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create testimonial');
    }
  };

  const handleScheduleFollowUp = async (customerId: string, followUpDate: string) => {
    try {
      await api.put(`/valued-customers/${customerId}/follow-up`, { nextFollowUpDate: followUpDate });
      fetchValuedCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule follow-up');
    }
  };

  const filteredCustomers = valuedCustomers.filter(customer => {
    const matchesSearch = 
      customer.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Valued' && customer.isValued) ||
      (filterStatus === 'Regular' && !customer.isValued);
    
    return matchesSearch && matchesStatus;
  });

  const getValuedCustomerStats = () => {
    const total = valuedCustomers.length;
    const valued = valuedCustomers.filter(c => c.isValued).length;
    const totalTestimonials = valuedCustomers.reduce((sum, c) => sum + c.testimonials.length, 0);
    const totalReferrals = valuedCustomers.reduce((sum, c) => sum + c.referralCount, 0);
    const avgNPS = valuedCustomers
      .filter(c => c.npsScore)
      .reduce((sum, c) => sum + (c.npsScore || 0), 0) / 
      valuedCustomers.filter(c => c.npsScore).length || 0;

    return { total, valued, totalTestimonials, totalReferrals, avgNPS };
  };

  const stats = getValuedCustomerStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Beyond Care
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Valuing our esteemed customers and building lasting relationships
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogType('create');
            setOpenDialog(true);
          }}
        >
          Add Valued Customer
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Total Customers
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <GroupIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Valued Customers
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.valued}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <StarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Testimonials
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalTestimonials}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ReviewsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Referrals
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalReferrals}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PersonAddIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Avg NPS
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.avgNPS.toFixed(1)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <ThumbUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                id={`beyond-care-tab-${index}`}
                aria-controls={`beyond-care-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Valued">Valued</MenuItem>
              <MenuItem value="Regular">Regular</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={selectedTab} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Projects</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>NPS Score</TableCell>
                  <TableCell>Referrals</TableCell>
                  <TableCell>Last Contact</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {customer.clientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer.email}
                        </Typography>
                        {customer.company && (
                          <Typography variant="body2" color="text.secondary">
                            {customer.company}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={customer.isValued ? <StarIcon /> : <PersonIcon />}
                        label={customer.isValued ? 'Valued' : 'Regular'}
                        color={customer.isValued ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.totalProjects} projects
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{customer.totalValue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {customer.npsScore ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={customer.npsScore / 2} size="small" readOnly />
                          <Typography variant="body2">
                            {customer.npsScore}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not rated
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${customer.referralCount} referrals`}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.lastContactDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedCustomer(customer);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Customer Testimonials & Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Collect and showcase customer testimonials, reviews, and feedback
          </Typography>
          {/* Testimonials content will be implemented */}
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Project Media Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showcase project photos, videos, and documents from valued customers
          </Typography>
          {/* Project media content will be implemented */}
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Anniversary & Celebration Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Track and celebrate project anniversaries, birthdays, and special occasions
          </Typography>
          {/* Anniversaries content will be implemented */}
        </TabPanel>

        <TabPanel value={selectedTab} index={4}>
          <Typography variant="h6" gutterBottom>
            Rewards & Referral Program
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage rewards, referral bonuses, and loyalty programs for valued customers
          </Typography>
          {/* Rewards content will be implemented */}
        </TabPanel>

        <TabPanel value={selectedTab} index={5}>
          <Typography variant="h6" gutterBottom>
            Follow-up & Relationship Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Schedule follow-ups, track relationship milestones, and maintain customer engagement
          </Typography>
          {/* Follow-up content will be implemented */}
        </TabPanel>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          if (selectedCustomer) {
            handleMarkAsValued(selectedCustomer._id);
          }
          setAnchorEl(null);
        }}>
          <StarIcon sx={{ mr: 1 }} />
          {selectedCustomer?.isValued ? 'Remove from Valued' : 'Mark as Valued'}
        </MenuItem>
        <MenuItem onClick={() => {
          setDialogType('edit');
          setOpenDialog(true);
          setAnchorEl(null);
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Customer
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/clients/${selectedCustomer?.clientId}`);
          setAnchorEl(null);
        }}>
          <PersonIcon sx={{ mr: 1 }} />
          View Client Details
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BeyondCare;
