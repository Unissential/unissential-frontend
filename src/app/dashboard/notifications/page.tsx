'use client';

import { motion } from 'framer-motion';
import { Trash2, Archive } from 'lucide-react';

const mockNotifications = [];
import { useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-blue-600 bg-blue-50';
      case 'tour':
        return 'text-purple-600 bg-purple-50';
      case 'listing':
        return 'text-orange-600 bg-orange-50';
      case 'roommate':
        return 'text-pink-600 bg-pink-50';
      case 'product':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Notifications</h1>
        <p className="text-neutral-600">
          {notifications.filter((n) => !n.read).length} unread
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={item} className="flex gap-2">
        {[
          { label: 'All', value: 'all' as const },
          { label: 'Unread', value: 'unread' as const },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === tab.value
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <motion.div variants={container} className="space-y-3">
          {filtered.map((notification) => (
            <motion.div
              key={notification.id}
              variants={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
              className={`p-4 rounded-lg border transition-all ${
                notification.read
                  ? 'bg-white border-neutral-200'
                  : 'bg-primary-50 border-primary-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`text-2xl rounded-lg p-3 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                  {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <h3
                      className={`font-semibold ${
                        notification.read ? 'text-neutral-700' : 'text-neutral-900'
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-neutral-500 mt-2">{notification.timestamp}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleArchive(notification.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <Archive size={18} className="text-neutral-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item} className="text-center py-16">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">All caught up!</h3>
          <p className="text-neutral-600">You have no {filter === 'unread' ? 'unread' : ''} notifications</p>
        </motion.div>
      )}
    </motion.div>
  );
}
