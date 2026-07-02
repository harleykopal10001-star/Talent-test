import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import app from './index.js';
import { MAX_FILE_SIZE_BYTES } from '../../shared/submissionSchema.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(dirname, '../uploads');

const validName = 'Ada Lovelace';
const validMessage = 'This is a perfectly valid test message.';

const cleanupFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(dirname, '..', filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

describe('POST /api/submit', () => {
  let createdFilePath;

  afterEach(() => {
    cleanupFile(createdFilePath);
    createdFilePath = undefined;
  });

  it('accepts a valid submission without a file', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', validName)
      .field('message', validMessage);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: validName, message: validMessage, filePath: null });
  });

  it('rejects a submission missing required fields', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', '')
      .field('message', '');

    expect(res.status).toBe(400);
    expect(res.body.errors.name).toBeDefined();
    expect(res.body.errors.message).toBeDefined();
  });

  it('accepts a submission with a valid attached file and stores it on disk', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', validName)
      .field('message', validMessage)
      .attach('file', Buffer.from('fake-image-content'), { filename: 'test.png', contentType: 'image/png' });

    expect(res.status).toBe(200);
    expect(res.body.filePath).toMatch(/^\/uploads\//);
    createdFilePath = res.body.filePath;
    expect(fs.existsSync(path.join(dirname, '..', createdFilePath))).toBe(true);
  });

  it('rejects a disallowed file type', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', validName)
      .field('message', validMessage)
      .attach('file', Buffer.from('not an image'), { filename: 'test.txt', contentType: 'text/plain' });

    expect(res.status).toBe(400);
    expect(res.body.errors.file).toBeDefined();
    expect(fs.readdirSync(uploadsDir)).not.toContain('test.txt');
  });

  it('rejects a file that is too large', async () => {
    const oversizedBuffer = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1);
    const res = await request(app)
      .post('/api/submit')
      .field('name', validName)
      .field('message', validMessage)
      .attach('file', oversizedBuffer, { filename: 'big.png', contentType: 'image/png' });

    expect(res.status).toBe(400);
    expect(res.body.errors.file).toBeDefined();
  });
});
