'use client';

import { motion } from 'framer-motion';
import { Save, ChevronRight, Bell, Lock, User } from 'lucide-react';
import { useState } from 'react';

const mockCurrentUser = { name: 'Your Name', email: 'your@email.com' };

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
    university: mockCurrentUser.university,
    bio: 'CS junior interested in student housing and roommate matching.',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const sections = [
    {
      title: 'Profile Settings',
      icon: <User size={20} />,
      items: [
        {
          label: 'Profile Picture',
          description: 'Update your profile photo',
          action: '→',
        },
        {
          label: 'Name',
          description: profileData.name,
          editable: true,
        },
        {
          label: 'Email',
          description: profileData.email,
          editable: true,
        },
        {
          label: 'University',
          description: profileData.university,
          editable: true,
        },
      ],
    },
    {
      title: 'Notification Preferences',
      icon: <Bell size={20} />,
      items: [
        {
          label: 'Email Notifications',
          description: 'Get updates about new listings and messages',
          toggle: true,
          defaultValue: true,
        },
        {
          label: 'Push Notifications',
          description: 'Receive push notifications on mobile',
          toggle: true,
          defaultValue: true,
        },
        {
          label: 'Marketing Emails',
          description: 'Receive promotional offers and announcements',
          toggle: true,
          defaultValue: false,
        },
      ],
    },
    {
      title: 'Account Settings',
      icon: <Lock size={20} />,
      items: [
        {
          label: 'Change Password',
          description: 'Update your password',
          action: '→',
        },
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          toggle: true,
          defaultValue: false,
        },
        {
          label: 'Delete Account',
          description: 'Permanently delete your account',
          destructive: true,
        },
      ],
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Manage your account and preferences</p>
      </motion.div>

      {/* Settings Sections */}
      {sections.map((section, sectionIdx) => (
        <motion.div key={sectionIdx} variants={item} className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b-2 border-neutral-200">
            <div className="text-neutral-700">{section.icon}</div>
            <h2 className="text-xl font-bold text-neutral-900">{section.title}</h2>
          </div>

          {/* Settings Items */}
          <div className="space-y-3">
            {section.items.map((settingItem, itemIdx) => (
              <motion.div
                key={itemIdx}
                whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
                className={`p-4 rounded-lg border transition-all ${
                  settingItem.destructive
                    ? 'border-red-200 hover:border-red-300'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        settingItem.destructive ? 'text-red-600' : 'text-neutral-900'
                      }`}
                    >
                      {settingItem.label}
                    </h3>
                    {typeof settingItem.description === 'string' && (
                      <p className="text-sm text-neutral-600 mt-1">{settingItem.description}</p>
                    )}
                  </div>

                  {/* Toggle Switch */}
                  {settingItem.toggle && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="relative w-12 h-7 rounded-full bg-neutral-300 transition-colors"
                      style={{
                        backgroundColor: settingItem.defaultValue ? '#3b82f6' : '#d1d5db',
                      }}
                    >
                      <motion.div
                        layout
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                          settingItem.defaultValue ? 'right-1' : 'left-1'
                        }`}
                      />
                    </motion.button>
                  )}

                  {/* Action Arrow */}
                  {settingItem.action && <ChevronRight size={20} className="text-neutral-400" />}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Profile Edit Section */}
      <motion.div
        variants={item}
        className="bg-primary-50 border border-primary-200 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-neutral-900">Edit Profile</h2>

        {isEditing ? (
          <div className="space-y-4">
            {[
              { label: 'Full Name', key: 'name' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'University', key: 'university' },
              { label: 'Bio', key: 'bio', type: 'textarea' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={profileData[field.key as keyof typeof profileData]}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400 resize-none"
                    rows={3}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={profileData[field.key as keyof typeof profileData]}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsEditing(true)}
            className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all"
          >
            Edit Profile
          </motion.button>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={item}
        className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
        <p className="text-sm text-red-700">
          These actions are irreversible. Please proceed with caution.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
        >
          Delete Account
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
