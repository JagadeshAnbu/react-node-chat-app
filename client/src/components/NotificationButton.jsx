import React from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

export const NotificationButton = () => {
  const { notification, isLoading, error, token } = useNotification();

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative">
        <button
          className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          disabled={isLoading}
          title={token ? 'Notifications enabled' : 'Enable notifications'}
        >
          <Bell className={`w-6 h-6 ${token ? 'text-green-600' : 'text-gray-700'}`} />
        </button>
        
        {notification.title && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl p-4">
            <h3 className="font-semibold text-gray-800">{notification.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{notification.body}</p>
          </div>
        )}

        {error && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-red-50 text-red-600 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};