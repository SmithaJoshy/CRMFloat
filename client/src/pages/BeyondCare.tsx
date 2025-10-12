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
  Snackbar,
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
  
  // Dialog states for different add operations
  const [openAddTestimonialDialog, setOpenAddTestimonialDialog] = useState(false);
  const [openAddMediaDialog, setOpenAddMediaDialog] = useState(false);
  const [openAddRewardDialog, setOpenAddRewardDialog] = useState(false);
  
  // Form states for add operations
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    rating: 5,
    isPublic: true
  });
  const [newMedia, setNewMedia] = useState<Partial<ProjectMedia>>({
    type: 'photo',
    isPublic: true
  });
  const [newReward, setNewReward] = useState<Partial<Reward>>({
    type: 'loyalty_bonus',
    status: 'pending'
  });
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

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

  const handleAddTestimonial = async () => {
    try {
      if (!selectedCustomer || !newTestimonial.projectName || !newTestimonial.review) {
        setError('Please fill in all required fields');
        return;
      }
      
      await api.post(`/valued-customers/${selectedCustomer._id}/testimonials`, newTestimonial);
      setSnackbar({ open: true, message: 'Testimonial added successfully', severity: 'success' });
      setOpenAddTestimonialDialog(false);
      setNewTestimonial({ rating: 5, isPublic: true });
      fetchValuedCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add testimonial');
    }
  };

  const handleAddMedia = async () => {
    try {
      if (!selectedCustomer || !newMedia.projectName || !newMedia.caption) {
        setError('Please fill in all required fields');
        return;
      }
      
      await api.post(`/valued-customers/${selectedCustomer._id}/media`, newMedia);
      setSnackbar({ open: true, message: 'Media added successfully', severity: 'success' });
      setOpenAddMediaDialog(false);
      setNewMedia({ type: 'photo', isPublic: true });
      fetchValuedCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add media');
    }
  };

  const handleAddReward = async () => {
    try {
      if (!selectedCustomer || !newReward.title || !newReward.description || !newReward.value) {
        setError('Please fill in all required fields');
        return;
      }
      
      await api.post(`/valued-customers/${selectedCustomer._id}/rewards`, newReward);
      setSnackbar({ open: true, message: 'Reward added successfully', severity: 'success' });
      setOpenAddRewardDialog(false);
      setNewReward({ type: 'loyalty_bonus', status: 'pending' });
      fetchValuedCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add reward');
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Select Customer</InputLabel>
              <Select
                value={selectedCustomer?._id || ''}
                label="Select Customer"
                onChange={(e) => {
                  const customer = valuedCustomers.find(c => c._id === e.target.value);
                  setSelectedCustomer(customer || null);
                }}
              >
                {valuedCustomers.map(customer => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.clientName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddTestimonialDialog(true)}
              disabled={!selectedCustomer}
            >
              Add Testimonial
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {valuedCustomers.flatMap(customer => 
                  customer.testimonials.map(testimonial => (
                    <TableRow key={testimonial._id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {customer.clientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{testimonial.projectName}</TableCell>
                      <TableCell>
                        <Rating value={testimonial.rating} size="small" readOnly />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {testimonial.review}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(testimonial.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={testimonial.isPublic ? 'Public' : 'Private'}
                          color={testimonial.isPublic ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Project Media Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showcase project photos, videos, and documents from valued customers
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Select Customer</InputLabel>
              <Select
                value={selectedCustomer?._id || ''}
                label="Select Customer"
                onChange={(e) => {
                  const customer = valuedCustomers.find(c => c._id === e.target.value);
                  setSelectedCustomer(customer || null);
                }}
              >
                {valuedCustomers.map(customer => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.clientName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddMediaDialog(true)}
              disabled={!selectedCustomer}
            >
              Add Media
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Caption</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {valuedCustomers.flatMap(customer => 
                  customer.projectMedia.map(media => (
                    <TableRow key={media._id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {customer.clientName}
                        </Typography>
                      </TableCell>
                      <TableCell>{media.projectName}</TableCell>
                      <TableCell>
                        <Chip
                          icon={media.type === 'photo' ? <PhotoIcon /> : media.type === 'video' ? <VideoIcon /> : <DocumentIcon />}
                          label={media.type}
                          color={media.type === 'photo' ? 'primary' : media.type === 'video' ? 'secondary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {media.caption || 'No caption'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(media.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={media.isPublic ? 'Public' : 'Private'}
                          color={media.isPublic ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Select Customer</InputLabel>
              <Select
                value={selectedCustomer?._id || ''}
                label="Select Customer"
                onChange={(e) => {
                  const customer = valuedCustomers.find(c => c._id === e.target.value);
                  setSelectedCustomer(customer || null);
                }}
              >
                {valuedCustomers.map(customer => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.clientName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddRewardDialog(true)}
              disabled={!selectedCustomer}
            >
              Add Reward
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Reward Type</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {valuedCustomers.flatMap(customer => 
                  customer.rewards.map(reward => (
                    <TableRow key={reward._id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {customer.clientName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reward.type.replace('_', ' ')}
                          color={reward.type === 'loyalty_bonus' ? 'primary' : reward.type === 'referral_bonus' ? 'secondary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {reward.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {reward.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ₹{reward.value.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reward.status}
                          color={reward.status === 'awarded' ? 'success' : reward.status === 'redeemed' ? 'info' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(reward.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
          setDialogType('view');
          setOpenDialog(true);
          setAnchorEl(null);
        }}>
          <PersonIcon sx={{ mr: 1 }} />
          View Client Details
        </MenuItem>
      </Menu>

      {/* Customer Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="customer-dialog"
      >
        <DialogTitle id="customer-dialog">
          {dialogType === 'create' && 'Add Valued Customer'}
          {dialogType === 'edit' && 'Edit Customer'}
          {dialogType === 'view' && 'Customer Details'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedCustomer ? (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Customer Name"
                  value={selectedCustomer.clientName}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={selectedCustomer.email}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={selectedCustomer.phone}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Company"
                  value={selectedCustomer.company || 'N/A'}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Total Projects"
                  value={selectedCustomer.totalProjects}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Total Value"
                  value={`₹${selectedCustomer.totalValue.toLocaleString()}`}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="NPS Score"
                  value={selectedCustomer.npsScore || 'Not rated'}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Referral Count"
                  value={selectedCustomer.referralCount}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>
              
              {selectedCustomer.testimonials && selectedCustomer.testimonials.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                    Testimonials
                  </Typography>
                  {selectedCustomer.testimonials.map((testimonial) => (
                    <Card key={testimonial._id} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={testimonial.rating} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {testimonial.projectName}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        {testimonial.review}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              )}

              {selectedCustomer.rewards && selectedCustomer.rewards.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                    Rewards & Bonuses
                  </Typography>
                  {selectedCustomer.rewards.map((reward) => (
                    <Card key={reward._id} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {reward.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reward.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={`₹${reward.value.toLocaleString()}`}
                          color={reward.status === 'awarded' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Customer Name"
                value={newCustomer.clientName || ''}
                onChange={(e) => setNewCustomer({...newCustomer, clientName: e.target.value})}
                fullWidth
                required
              />
              <TextField
                label="Email"
                value={newCustomer.email || ''}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={newCustomer.phone || ''}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                fullWidth
              />
              <TextField
                label="Company"
                value={newCustomer.company || ''}
                onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCustomer.isValued ? 'Valued' : 'Regular'}
                  onChange={(e) => setNewCustomer({...newCustomer, isValued: e.target.value === 'Valued'})}
                  label="Status"
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Valued">Valued</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Notes"
                value={newCustomer.notes || ''}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType !== 'view' && (
            <Button variant="contained">
              {dialogType === 'create' ? 'Add Customer' : 'Update Customer'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add Testimonial Dialog */}
      <Dialog
        open={openAddTestimonialDialog}
        onClose={() => setOpenAddTestimonialDialog(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-testimonial-dialog"
      >
        <DialogTitle id="add-testimonial-dialog">
          Add Testimonial for {selectedCustomer?.clientName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Name"
              value={newTestimonial.projectName || ''}
              onChange={(e) => setNewTestimonial({...newTestimonial, projectName: e.target.value})}
              fullWidth
              required
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={newTestimonial.rating || 5}
                onChange={(event, newValue) => setNewTestimonial({...newTestimonial, rating: newValue || 5})}
                size="large"
              />
            </Box>
            <TextField
              label="Review"
              value={newTestimonial.review || ''}
              onChange={(e) => setNewTestimonial({...newTestimonial, review: e.target.value})}
              fullWidth
              multiline
              rows={4}
              required
              placeholder="Share your experience with this project..."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newTestimonial.isPublic || false}
                  onChange={(e) => setNewTestimonial({...newTestimonial, isPublic: e.target.checked})}
                />
              }
              label="Make this testimonial public"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddTestimonialDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTestimonial} variant="contained">
            Add Testimonial
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Media Dialog */}
      <Dialog
        open={openAddMediaDialog}
        onClose={() => setOpenAddMediaDialog(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-media-dialog"
      >
        <DialogTitle id="add-media-dialog">
          Add Media for {selectedCustomer?.clientName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Name"
              value={newMedia.projectName || ''}
              onChange={(e) => setNewMedia({...newMedia, projectName: e.target.value})}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Media Type</InputLabel>
              <Select
                value={newMedia.type || 'photo'}
                onChange={(e) => setNewMedia({...newMedia, type: e.target.value as 'photo' | 'video' | 'document'})}
                label="Media Type"
              >
                <MenuItem value="photo">Photo</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="document">Document</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Caption"
              value={newMedia.caption || ''}
              onChange={(e) => setNewMedia({...newMedia, caption: e.target.value})}
              fullWidth
              required
              placeholder="Describe this media item..."
            />
            <TextField
              label="Media URL"
              value={newMedia.url || ''}
              onChange={(e) => setNewMedia({...newMedia, url: e.target.value})}
              fullWidth
              placeholder="https://example.com/image.jpg"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newMedia.isPublic || false}
                  onChange={(e) => setNewMedia({...newMedia, isPublic: e.target.checked})}
                />
              }
              label="Make this media public"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMediaDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMedia} variant="contained">
            Add Media
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Reward Dialog */}
      <Dialog
        open={openAddRewardDialog}
        onClose={() => setOpenAddRewardDialog(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-reward-dialog"
      >
        <DialogTitle id="add-reward-dialog">
          Add Reward for {selectedCustomer?.clientName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Reward Type</InputLabel>
              <Select
                value={newReward.type || 'loyalty_bonus'}
                onChange={(e) => setNewReward({...newReward, type: e.target.value as any})}
                label="Reward Type"
              >
                <MenuItem value="loyalty_bonus">Loyalty Bonus</MenuItem>
                <MenuItem value="referral_bonus">Referral Bonus</MenuItem>
                <MenuItem value="nps_reward">NPS Reward</MenuItem>
                <MenuItem value="special_gift">Special Gift</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Title"
              value={newReward.title || ''}
              onChange={(e) => setNewReward({...newReward, title: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newReward.description || ''}
              onChange={(e) => setNewReward({...newReward, description: e.target.value})}
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Value (₹)"
              type="number"
              value={newReward.value || ''}
              onChange={(e) => setNewReward({...newReward, value: Number(e.target.value)})}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newReward.status || 'pending'}
                onChange={(e) => setNewReward({...newReward, status: e.target.value as any})}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="awarded">Awarded</MenuItem>
                <MenuItem value="redeemed">Redeemed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddRewardDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddReward} variant="contained">
            Add Reward
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BeyondCare;
