'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, Star, MessageCircle, X, Send } from 'lucide-react';
import { PropertyHost } from '@/types/property';

interface HostProfileCardProps {
  host: PropertyHost;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'host';
  text: string;
  timestamp: string;
}

export const HostProfileCard: React.FC<HostProfileCardProps> = ({ host }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'host',
      text: `Hi! Thanks for your interest in my property. Feel free to ask me any questions!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: inputMessage,
        timestamp: 'Just now'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate host response after 1 second
      setTimeout(() => {
        const responses = [
          "That's a great question! Let me help you with that.",
          'Absolutely! I can arrange that for you.',
          'Yes, we offer that. Would you like more details?',
          'Feel free to reach out if you have more questions!'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const hostReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'host',
          text: randomResponse,
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, hostReply]);
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl border border-neutral-200 bg-white"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Host Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden"
          >
            <Image src={host.avatar} alt={host.name} fill className="object-cover" />
          </motion.div>

          {/* Host Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-neutral-900">{host.name}</h3>
              {host.verified && (
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-neutral-600">{host.joinedDate}</p>
          </div>
        </div>

        {/* Quick Chat Icon Button */}
        <motion.button
          onClick={() => setIsChatOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors flex-shrink-0"
          title="Quick chat with host"
        >
          <MessageCircle size={24} />
        </motion.button>
      </div>

      {/* Bio */}
      <p className="text-neutral-700 text-sm leading-relaxed mb-4">{host.bio}</p>

      {/* Host Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">{host.rating}</p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(host.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300'
                }
              />
            ))}
          </div>
          <p className="text-xs text-neutral-600 mt-1">{host.reviews} reviews</p>
        </div>

        <div className="text-center border-l border-r border-neutral-200">
          <p className="text-lg font-bold text-neutral-900">{host.responseRate}%</p>
          <p className="text-xs text-neutral-600 mt-2">Response Rate</p>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">{host.totalListings}</p>
          <p className="text-xs text-neutral-600 mt-2">Listings</p>
        </div>
      </div>

      {/* Response Time */}
      <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100">
        <p className="text-sm text-green-900">
          <strong>Responds within {host.responseDays} day{host.responseDays !== 1 ? 's' : ''}</strong>
        </p>
      </div>

      {/* Contact Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle size={18} />
        Message Host
      </motion.button>

      {/* Chat Modal */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setIsChatOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl w-full sm:w-96 h-96 sm:h-[500px] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={host.avatar} alt={host.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{host.name}</p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} className="text-neutral-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-neutral-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  disabled={!inputMessage.trim()}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
