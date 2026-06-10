import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Assistant from '../pages/Assistant';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Assistant Page', () => {
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    localStorage.clear();
    // Stub scrollIntoView since jsdom doesn't implement it
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders the page heading and subtitle', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText('AI Carbon Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Powered by Google Gemini Pro/i)).toBeInTheDocument();
  });

  it('displays the default welcome message from the bot', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText(/your EcoTrack Carbon Assistant/i)).toBeInTheDocument();
  });

  it('renders the list of quick questions', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText('How can I reduce my carbon footprint?')).toBeInTheDocument();
    expect(screen.getByText('What are carbon offsets?')).toBeInTheDocument();
  });

  it('populates the input area when a quick question is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Assistant />);
    
    const questionBtn = screen.getByText('What are carbon offsets?');
    await user.click(questionBtn);
    
    const input = screen.getByPlaceholderText(/Ask about carbon offsets/i);
    expect(input).toHaveValue('What are carbon offsets?');
  });

  it('allows user to type in the input textarea', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Assistant />);
    
    const input = screen.getByPlaceholderText(/Ask about carbon offsets/i);
    await user.type(input, 'Hello EcoTrack');
    expect(input).toHaveValue('Hello EcoTrack');
  });

  it('sends the query and displays the bot response on send click', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Planted trees absorb carbon.' }),
    });

    const user = userEvent.setup();
    renderWithRouter(<Assistant />);
    
    const input = screen.getByPlaceholderText(/Ask about carbon offsets/i);
    await user.type(input, 'How does offsetting work?');
    
    const sendBtn = screen.getByLabelText('Send message');
    await user.click(sendBtn);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    const botResponse = await screen.findByText('Planted trees absorb carbon.');
    expect(botResponse).toBeInTheDocument();
  });
});
