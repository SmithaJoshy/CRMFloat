import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { useClients, useProjects } from '../hooks/useData';

interface ClientDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const ClientDropdown: React.FC<ClientDropdownProps> = ({
  value,
  onChange,
  label = 'Client',
  required = false,
  fullWidth = true,
  disabled = false
}) => {
  const { clients, loading, error } = useClients();

  if (loading) {
    return (
      <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <CircularProgress size={20} />
          <Typography sx={{ ml: 1 }}>Loading clients...</Typography>
        </Box>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Box sx={{ p: 2 }}>
          <Typography color="error" variant="body2">
            Failed to load clients
          </Typography>
        </Box>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {clients.map((client) => (
          <MenuItem key={client._id} value={client._id}>
            {client.name} ({client.email})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface ProjectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  clientId?: string; // Filter projects by client
}

export const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  value,
  onChange,
  label = 'Project',
  required = false,
  fullWidth = true,
  disabled = false,
  clientId
}) => {
  const { projects, loading, error } = useProjects();

  const filteredProjects = clientId 
    ? projects.filter(project => project.clientId === clientId)
    : projects;

  if (loading) {
    return (
      <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <CircularProgress size={20} />
          <Typography sx={{ ml: 1 }}>Loading projects...</Typography>
        </Box>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Box sx={{ p: 2 }}>
          <Typography color="error" variant="body2">
            Failed to load projects
          </Typography>
        </Box>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {filteredProjects.map((project) => (
          <MenuItem key={project._id} value={project._id}>
            {project.projectName} - {project.clientName} (₹{project.totalProjectValue.toLocaleString()})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};


