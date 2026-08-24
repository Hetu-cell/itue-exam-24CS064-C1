import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(() => {
    const savedMember = localStorage.getItem('fitzone_member');
    return savedMember ? JSON.parse(savedMember) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('fitzone_token') || null;
  });

  const role = member ? member.role : null;

  // On mount: Verify token against live database and fetch real user profile
  useEffect(() => {
    const syncProfile = async () => {
      const savedToken = localStorage.getItem('fitzone_token');
      if (!savedToken) return;

      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        const data = await response.json();

        if (response.ok && data.success && data.member) {
          setMember(data.member);
          localStorage.setItem('fitzone_member', JSON.stringify(data.member));
        } else {
          // Token is invalid / user no longer exists in current database
          logout();
        }
      } catch (err) {
        // If network error, keep current state or logout
      }
    };

    syncProfile();
  }, []);

  const login = (memberData, jwtToken) => {
    setMember(memberData);
    setToken(jwtToken);
    localStorage.setItem('fitzone_member', JSON.stringify(memberData));
    localStorage.setItem('fitzone_token', jwtToken);
  };

  const logout = () => {
    setMember(null);
    setToken(null);
    localStorage.removeItem('fitzone_member');
    localStorage.removeItem('fitzone_token');
  };

  const updateMember = (updatedMemberData) => {
    setMember(updatedMemberData);
    localStorage.setItem('fitzone_member', JSON.stringify(updatedMemberData));
  };

  return (
    <AuthContext.Provider value={{ member, token, role, login, logout, updateMember }}>
      {children}
    </AuthContext.Provider>
  );
};
