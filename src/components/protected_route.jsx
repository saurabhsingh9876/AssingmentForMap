import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import ClipLoader from 'react-spinners/ClipLoader';


const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!checking && !user) {
      const timer = setTimeout(() => setShouldRedirect(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [checking, user]);

  const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw', // ✅ Use full viewport width
    backgroundColor: '#f4f6f8',
    color: '#333',
    textAlign: 'center',
    fontSize: '18px',
    padding: '20px', // Optional: ensures breathing space
    boxSizing: 'border-box',
  };

  if (checking) {
    return (
      <div style={centerStyle}>
        <span>🔐 Checking authentication...</span>
      </div>
    );
  }

  if (!user) {
    return shouldRedirect ? (
      <Navigate to="/" replace />
    ) : (
      <div style={centerStyle}>
       <div style={centerStyle}>
  <ClipLoader size={40} color="#333" />
  <small style={{ marginTop: 12 }}>Checking authentication...</small>
</div>

      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
