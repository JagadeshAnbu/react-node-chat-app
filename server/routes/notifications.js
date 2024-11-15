import express from 'express';
import admin from '../config/firebase-admin.js';
const router = express.Router();

// Store FCM tokens in a simple in-memory map (you can save this to a database in production)
const tokens = new Map();

// Route to register FCM token
router.post('/register', async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ error: 'Missing userId or FCM token' });
  }

  try {
    // Store the FCM token in memory (you could save this to a database)
    tokens.set(userId, token);
    console.log('FCM token registered for user:', userId);
    res.status(200).json({ message: 'FCM token registered successfully' });
    console.log(tokens); // Add this after registering the token

  } catch (error) {
    console.error('Failed to register token:', error);
    res.status(500).json({ error: 'Failed to register token' });
  }
});

// Example to send a notification (for testing)
router.post('/send', async (req, res) => {
  const { userId, title, body } = req.body;

  if (!userId || !title || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const token = tokens.get(userId); // Retrieve the FCM token
  if (!token) {
    return res.status(404).json({ error: 'User FCM token not found' });
  }
  const message = {
    token,
    notification: {
      title,
      body,
    },
    webpush: {
      headers: {
        Urgency: 'high'
      },
      notification: {
        icon: '/firebase-logo.png',
        requireInteraction: true,
      },
    },
  };

  try {
    // Send the notification using Firebase Admin SDK
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;
