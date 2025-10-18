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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

interface Document {
  _id: string;
  documentId: string;
  documentName: string;
  documentType: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  clientId: {
    name: string;
  };
  dealId: {
    projectName: string;
  };
  uploadedBy: {
    name: string;
  };
  uploadDate: string;
  accessLevel: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data.documents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocument(null);
  };

  const handleDownload = () => {
    if (selectedDocument) {
      window.open(selectedDocument.fileUrl, '_blank');
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await api.delete(`/documents/${selectedDocument._id}`);
      await fetchDocuments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete document');
    } finally {
      handleMenuClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Questionnaire': return 'primary';
      case 'Portfolio': return 'secondary';
      case 'Estimate Sheet': return 'success';
      case 'Costing Document': return 'info';
      case 'Contract': return 'warning';
      case '3D Design': return 'error';
      default: return 'default';
    }
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      document.documentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.dealId?.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || document.documentType === typeFilter;
    
    return matchesSearch && matchesType;
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
        <Typography variant="h4">Documents</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Navigate to upload document */}}
        >
          Upload Document
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="Questionnaire">Questionnaire</MenuItem>
          <MenuItem value="Portfolio">Portfolio</MenuItem>
          <MenuItem value="Estimate Sheet">Estimate Sheet</MenuItem>
          <MenuItem value="Costing Document">Costing Document</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
          <MenuItem value="3D Design">3D Design</MenuItem>
          <MenuItem value="Technical Drawing">Technical Drawing</MenuItem>
          <MenuItem value="Handover Pack">Handover Pack</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Access</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document._id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {document.documentName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={document.documentType}
                    color={getTypeColor(document.documentType)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{document.clientId?.name || 'N/A'}</TableCell>
                <TableCell>{document.dealId?.projectName || 'N/A'}</TableCell>
                <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                <TableCell>{document.uploadedBy?.name || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(document.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={document.accessLevel}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, document)}
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

      {filteredDocuments.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || typeFilter !== 'all' 
              ? 'Try adjusting your search terms or filters' 
              : 'No documents have been uploaded yet'
            }
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Documents;
