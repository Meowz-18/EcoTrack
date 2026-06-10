import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Timeline from '../pages/Timeline';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Timeline Page', () => {
  let windowOpenSpy;

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('renders the page heading', () => {
    renderWithRouter(<Timeline />);
    expect(screen.getByText('Green Timeline')).toBeInTheDocument();
  });

  it('displays the list of timeline events', () => {
    renderWithRouter(<Timeline />);
    expect(screen.getByText('World Water Day')).toBeInTheDocument();
    expect(screen.getByText('Earth Day')).toBeInTheDocument();
    expect(screen.getByText('World Environment Day')).toBeInTheDocument();
  });

  it('shows appropriate status badges', () => {
    renderWithRouter(<Timeline />);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ongoing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Upcoming').length).toBeGreaterThan(0);
  });

  it('calls window.open when Add to Calendar is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Timeline />);
    
    // Add to Calendar only appears for non-completed events
    const addBtn = screen.getAllByRole('button', { name: /to Google Calendar/i })[0];
    await user.click(addBtn);

    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    const [url] = windowOpenSpy.mock.calls[0];
    expect(url).toContain('calendar.google.com');
  });

  it('renders Google Calendar sync CTA section', () => {
    renderWithRouter(<Timeline />);
    expect(screen.getByText('Sync Your Green Actions')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Google Calendar/i })).toBeInTheDocument();
  });
});
