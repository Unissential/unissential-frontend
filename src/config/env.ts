// src/config/env.ts
// Type-safe environment variables with Zod validation

import { z } from 'zod';

const envSchema = z.object({
  // Public variables (exposed to browser)
  NEXT_PUBLIC_APP_NAME: z.string().default('Unissential'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_AWS_REGION: z.string().default('us-east-1'),
  NEXT_PUBLIC_AWS_S3_BUCKET: z.string(),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_MARKETPLACE: z.string().default('true').transform(v => v === 'true'),
  NEXT_PUBLIC_ENABLE_CHAT: z.string().default('true').transform(v => v === 'true'),
  NEXT_PUBLIC_ENABLE_LEASING: z.string().default('true').transform(v => v === 'true'),
});

export const env = envSchema.parse(process.env);

// Re-export for easier usage
export const config = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    url: env.NEXT_PUBLIC_APP_URL,
  },
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
  },
  aws: {
    region: env.NEXT_PUBLIC_AWS_REGION,
    s3Bucket: env.NEXT_PUBLIC_AWS_S3_BUCKET,
  },
  features: {
    marketplace: env.NEXT_PUBLIC_ENABLE_MARKETPLACE,
    chat: env.NEXT_PUBLIC_ENABLE_CHAT,
    leasing: env.NEXT_PUBLIC_ENABLE_LEASING,
  },
} as const;
