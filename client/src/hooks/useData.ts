import { useState, useEffect } from 'react';
import api from '../services/api';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  targetBudget: number;
  leadSource: string;
}

interface Project {
  _id: string;
  projectName: string;
  clientName: string;
  clientId: string;
  totalProjectValue: number;
  currentStage: string;
  projectStatus: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      setClients(response.data.clients || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch clients');
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, refetch: fetchClients };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deals');
      setProjects(response.data.deals || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};

export const useClientsAndProjects = () => {
  const { clients, loading: clientsLoading, error: clientsError, refetch: refetchClients } = useClients();
  const { projects, loading: projectsLoading, error: projectsError, refetch: refetchProjects } = useProjects();

  const loading = clientsLoading || projectsLoading;
  const error = clientsError || projectsError;

  const refetch = async () => {
    await Promise.all([refetchClients(), refetchProjects()]);
  };

  return { clients, projects, loading, error, refetch };
};


