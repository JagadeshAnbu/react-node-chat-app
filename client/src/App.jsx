import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from '@/pages/profile';
import Chat from '@/pages/chat';
import Auth from '@/pages/auth';
import apiClient from '@/lib/api-client';
import { GET_USERINFO_ROUTE } from '@/lib/constants';
import { useAppStore } from '@/store';
import { NotificationButton } from './components/NotificationButton';

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USERINFO_ROUTE, { withCredentials: true });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [setUserInfo, userInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>

        {userInfo && <NotificationButton />}
      </div>
    </Router>
  );
}

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? <Navigate to="/chat" /> : children;
};

export default App;