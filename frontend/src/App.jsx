import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import {
  submissionSchema,
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_TYPES,
} from '../../shared/submissionSchema.js';
import styles from './App.module.css';

const formatFileSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

const App = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [response, setResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(submissionSchema) });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_FILE_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setFile(null);
        setFileError(fileRejections[0].errors[0].message);
        return;
      }
      setFile(acceptedFiles[0]);
      setFileError(null);
    },
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    setResponse(null);

    const body = new FormData();
    body.append('name', data.name);
    body.append('message', data.message);
    if (file) body.append('file', file);

    try {
      const res = await fetch('/api/submit', { method: 'POST', body });
      const payload = await res.json();

      if (!res.ok) {
        Object.entries(payload.errors || {}).forEach(([field, messages]) => {
          if (field === 'name' || field === 'message') {
            setError(field, { message: messages[0] });
          } else {
            setSubmitError(messages[0]);
          }
        });
        return;
      }

      setResponse(payload);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className={styles.title}>Form Submission</h1>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Name
            <input
              className={styles.input}
              type="text"
              id="name"
              {...register('name')}
            />
          </label>
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="message">
            Message
            <textarea
              className={styles.textarea}
              id="message"
              rows={4}
              {...register('message')}
            />
          </label>
          {errors.message && <p className={styles.error}>{errors.message.message}</p>}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Attachment</span>
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
          >
            <input {...getInputProps({ 'data-testid': 'file-input' })} />
            {file ? (
              <p>{`${file.name} (${formatFileSize(file.size)})`}</p>
            ) : (
              <p>Drag & drop a file here, or click to select one (PNG, JPEG or PDF, up to 5MB)</p>
            )}
          </div>
          {fileError && <p className={styles.error}>{fileError}</p>}
        </div>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>

      {response && (
        <div className={styles.response}>
          <h2 className={styles.title}>Response</h2>
          <pre className={styles.pre}>{JSON.stringify(response, null, 2)}</pre>
          {response.filePath && (
            <a href={response.filePath} target="_blank" rel="noreferrer">View uploaded file</a>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
