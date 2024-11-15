import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../lib/firebase';
import { useAppStore } from '@/store';  // Import the global store to access userInfo

export const useNotification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useAppStore();  // Access userInfo from the global state

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setIsLoading(true);

        // Request permission for notifications
        const fcmToken = await requestNotificationPermission();
        setToken(fcmToken);  // Save the token locally
        setError(null);

        // Send the FCM token to the backend for registration
        if (fcmToken && userInfo?.id) {
          await registerTokenWithBackend(userInfo.id, fcmToken);
        } else if (!userInfo?.id) {
          throw new Error('User ID not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize notifications');
        console.error('Notification error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, [userInfo]);

  const registerTokenWithBackend = async (userId, fcmToken) => {
    try {
      const response = await fetch('http://localhost:8747/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, token: fcmToken }),  // Send the FCM token for registration
      });

      if (!response.ok) {
        throw new Error('Failed to register FCM token');
      }

      const data = await response.json();
      console.log('FCM Token registered successfully:', data);
    } catch (err) {
      console.error('Error registering token:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!token) return;

    // Listen for incoming messages
    const unsubscribe = onMessageListener().then((payload) => {
      setNotification({
        title: payload?.notification?.title || '',
        body: payload?.notification?.body || ''
      });

      // Show notification even when app is in the foreground
      new Notification(payload?.notification?.title || '', {
        body: payload?.notification?.body || '',
        icon: '/firebase-logo.png'
      });
    });

    return () => {
      unsubscribe;
    };
  }, [token]);

  return { notification, token, isLoading, error };
};
