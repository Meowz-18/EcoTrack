/**
 * @file Component tests for the Dashboard page.
 * Tests rendering, chart display, and data presentation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Dashboard Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the page heading', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Carbon Dashboard')).toBeInTheDocument();
  });

  it('shows Total Emissions stat', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Total Emissions')).toBeInTheDocument();
  });

  it('shows Rating stat', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Rating')).toBeInTheDocument();
  });

  it('shows vs Global Average stat', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('vs Global Average')).toBeInTheDocument();
  });

  it('shows Entries Logged stat', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Entries Logged')).toBeInTheDocument();
  });

  it('shows Emissions Breakdown chart section', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Emissions Breakdown')).toBeInTheDocument();
  });

  it('shows How You Compare chart section', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('How You Compare')).toBeInTheDocument();
  });

  it('shows empty state message when no data', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('No data yet')).toBeInTheDocument();
  });

  it('shows category detail cards', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('transport')).toBeInTheDocument();
    expect(screen.getByText('energy')).toBeInTheDocument();
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('shopping')).toBeInTheDocument();
  });

  it('displays 0 kg for empty categories', () => {
    renderWithRouter(<Dashboard />);
    const zeroKg = screen.getAllByText('0 kg');
    expect(zeroKg.length).toBeGreaterThanOrEqual(4);
  });
});
