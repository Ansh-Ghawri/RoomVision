import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_ENDPOINTS.PROFILE);
      setProfile(res.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(API_ENDPOINTS.PROFILE, profileData);
      setProfile(profileData);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile, saveProfile };
}; 