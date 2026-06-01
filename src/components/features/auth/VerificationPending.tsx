'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader } from 'lucide-react';

interface VerificationPendingProps {
  email: string;
  fullName: string;
  onResendClick?: () => void;
}

/**
 * Screen shown after successful signup
 * Prompts user to verify their email
 */
export function VerificationPending({ email, fullName, onResendClick }: VerificationPendingProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      });

      const data = await response.json();

      if (data.success) {
        setResendMessage('✓ Email resent! Check your inbox.');
      } else {
        setResendMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResendMessage('Failed to resend email. Try again.');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <motion.div
        className="mb-6 flex justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="bg-blue-100 rounded-full p-6">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>

      {/* Description */}
      <p className="text-gray-600 mb-2">We sent a verification link to:</p>

      <motion.p
        className="text-lg font-semibold text-indigo-600 mb-6 break-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {email}
      </motion.p>

      {/* Steps */}
      <motion.div
        className="bg-blue-50 rounded-lg p-6 mb-8 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">What&apos;s next:</h3>
        <ol className="space-y-3">
          {[
            'Open the verification email',
            'Click the verification link',
            'Your account will be activated',
            'Start exploring student housing!',
          ].map((step, i) => (
            <motion.li
              key={step}
              className="flex gap-3 text-gray-700"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <span>{step}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      {/* Info box */}
      <motion.div
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-yellow-800">
          💡 Check your spam folder if you don&apos;t see the email in a few minutes
        </p>
      </motion.div>

      {/* Resend button */}
      <motion.button
        onClick={handleResendEmail}
        disabled={isResending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isResending ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Resending...
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            Resend Verification Email
          </>
        )}
      </motion.button>

      {/* Resend message */}
      {resendMessage && (
        <motion.p
          className={`text-sm font-medium mb-4 ${
            resendMessage.includes('✓') ? 'text-green-600' : 'text-red-600'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {resendMessage}
        </motion.p>
      )}

      {/* Footer */}
      <motion.p
        className="text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        This link expires in 24 hours. If it expires, you can request a new one above.
      </motion.p>
    </motion.div>
  );
}
