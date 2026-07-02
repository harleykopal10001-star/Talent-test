import { config } from 'dotenv';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { submissionSchema, MAX_FILE_SIZE_BYTES, ACCEPTED_FILE_TYPES } from '../../shared/submissionSchema.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.join(dirname, '../../.env') });
const { BACKEND_PORT } = process.env;

const uploadsDir = path.join(dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

class FileValidationError extends Error {}

const sanitizeFilename = (originalName) => path.basename(originalName).replace(/[^a-zA-Z0-9.\-_]/g, '_');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}-${sanitizeFilename(file.originalname)}`),
  }),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.mimetype)) {
      cb(new FileValidationError(`Unsupported file type: ${file.mimetype}`));
      return;
    }
    cb(null, true);
  },
});

const app = express();

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.post('/api/submit', upload.single('file'), (req, res) => {
  const parseResult = submissionSchema.safeParse(req.body);

  if (!parseResult.success) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    return;
  }

  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  res.status(200).json({ ...parseResult.data, filePath });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ errors: { file: ['File must be smaller than 5MB'] } });
    return;
  }
  if (err instanceof FileValidationError) {
    res.status(400).json({ errors: { file: [err.message] } });
    return;
  }
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ errors: { server: ['Unexpected server error'] } });
});

/* istanbul ignore next */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // eslint-disable-next-line no-console
  app.listen(BACKEND_PORT, () => console.log(`Server running on port ${BACKEND_PORT}`));
}

export default app;
