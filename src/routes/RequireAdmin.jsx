import { fetchUserRole } from '@api/userAPIS';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function RequireAdmin({ children }) {
  const [userRole, setUserRole] = useState('USER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole().then((response) => {
      if (response?.role === 'ADMIN') {
        setUserRole('ADMIN');
        setLoading(false);
      } else {
        setUserRole('USER');
        setLoading(false);
      }
    });
  }, []);

  if (loading) return null;

  if (userRole !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return children;
}
