import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders the form fields', () => {
    render(<App />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation errors and does not call fetch when submitting an empty form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/name must be at least/i)).toBeInTheDocument();
    expect(screen.getByText(/message must be at least/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits valid data and renders the server response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: 'Ada Lovelace', message: 'Hello there, this is a test.', filePath: null }),
    });

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/message/i), 'Hello there, this is a test.');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/api/submit');
    expect(options.body).toBeInstanceOf(FormData);
    expect(options.body.get('name')).toBe('Ada Lovelace');
    expect(options.body.get('message')).toBe('Hello there, this is a test.');

    expect(await screen.findByText(/"filePath": null/)).toBeInTheDocument();
  });

  it('shows the selected file name after choosing a file', async () => {
    const user = userEvent.setup();
    render(<App />);

    const file = new File(['image-bytes'], 'photo.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input');

    await user.upload(input, file);

    expect(await screen.findByText(/photo\.png/)).toBeInTheDocument();
  });
});
