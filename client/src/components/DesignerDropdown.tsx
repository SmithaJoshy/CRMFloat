import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { api } from '../services/api';

interface Designer {
  id: string;
  name: string;
  role: string;
  availability: string;
  specializations: string[];
}

interface DesignerDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  filterBySpecialization?: string;
  filterByAvailability?: string;
  showRole?: boolean;
}

const DesignerDropdown: React.FC<DesignerDropdownProps> = ({
  value,
  onChange,
  label = 'Assigned Designer',
  required = false,
  filterBySpecialization,
  filterByAvailability,
  showRole = true
}) => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/designers');
      let filteredDesigners = response.data.designers;

      // Apply filters if provided
      if (filterBySpecialization) {
        filteredDesigners = filteredDesigners.filter((designer: Designer) =>
          designer.specializations.includes(filterBySpecialization)
        );
      }

      if (filterByAvailability) {
        filteredDesigners = filteredDesigners.filter((designer: Designer) =>
          designer.availability === filterByAvailability
        );
      }

      setDesigners(filteredDesigners);
    } catch (err) {
      setError('Failed to load designers');
      console.error('Error fetching designers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'success';
      case 'Busy': return 'warning';
      case 'Unavailable': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select disabled>
          <MenuItem>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              Loading designers...
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl fullWidth error>
        <InputLabel>{label}</InputLabel>
        <Select disabled>
          <MenuItem>Error loading designers</MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="">
          <em>Select a designer</em>
        </MenuItem>
        {designers.map((designer) => (
          <MenuItem key={designer.id} value={designer.id}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{designer.name}</span>
                  {showRole && (
                    <Chip
                      label={designer.role}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                {designer.specializations.length > 0 && (
                  <Box display="flex" gap={0.5} mt={0.5}>
                    {designer.specializations.slice(0, 2).map((spec, index) => (
                      <Chip
                        key={index}
                        label={spec}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    ))}
                    {designer.specializations.length > 2 && (
                      <Chip
                        label={`+${designer.specializations.length - 2}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )}
                  </Box>
                )}
              </Box>
              <Chip
                label={designer.availability}
                color={getAvailabilityColor(designer.availability) as any}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DesignerDropdown;
