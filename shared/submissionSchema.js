import { z } from 'zod';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

export const submissionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be at most 1000 characters'),
});
