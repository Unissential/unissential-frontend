'use client';

import { motion } from 'framer-motion';
import { Send, Phone, Video } from 'lucide-react';
import { mockConversations, mockMessages, mockCurrentUser } from '@/data/mockDashboard';
import { useState } from 'react';

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: 'msg_' + Date.now(),
      senderId: mockCurrentUser.id,
      senderName: mockCurrentUser.name,
      senderAvatar: mockCurrentUser.avatar,
      content: inputValue,
      timestamp: 'just now',
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Messages</h1>
        <p className="text-neutral-600">{mockConversations.length} conversations</p>
      </div>

      {/* Messages Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] lg:h-[700px]">
        {/* Conversations Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-bold text-neutral-900">Conversations</h2>
          </div>

          <div className="overflow-y-auto flex-1">
            {mockConversations.map((conv) => (
              <motion.button
                key={conv.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => setSelectedConv(conv)}
                className={`w-full p-4 border-b border-neutral-100 text-left transition-colors ${
                  selectedConv.id === conv.id ? 'bg-primary-50' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-12 h-12 rounded-full"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 text-sm">{conv.participantName}</p>
                    <p className="text-xs text-neutral-600 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-neutral-500 mt-1">{conv.timestamp}</p>
                  </div>
                  {conv.unread && (
                    <div className="w-2.5 h-2.5 bg-primary-600 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex lg:col-span-2 bg-white rounded-xl border border-neutral-200 flex-col"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedConv.participantAvatar}
                alt={selectedConv.participantName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-bold text-neutral-900">{selectedConv.participantName}</h3>
                <p className="text-xs text-neutral-600">
                  {selectedConv.online ? 'Active now' : 'Away'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Phone size={18} className="text-neutral-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Video size={18} className="text-neutral-700" />
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full"
                />
                <div className={`flex flex-col gap-1 max-w-xs ${msg.isOwn ? 'items-end' : ''}`}>
                  <div
                    className={`px-4 py-2.5 rounded-xl ${
                      msg.isOwn
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-neutral-100 text-neutral-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-neutral-500">{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400 bg-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSend}
                className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
