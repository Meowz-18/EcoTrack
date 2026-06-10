/**
 * @file Component tests for the Challenges page.
 * Tests rendering, completion tracking, filtering, and accessibility.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Challenges from '../pages/Challenges';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Challenges Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the page heading', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getByText('Eco Challenges')).toBeInTheDocument();
  });

  it('displays challenge cards', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getByText('Meatless Monday')).toBeInTheDocument();
    expect(screen.getByText('Bike Commuter')).toBeInTheDocument();
  });

  it('shows stats row with points, challenges done, and completion rate', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getByText('Points Earned')).toBeInTheDocument();
    expect(screen.getByText('Challenges Done')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('shows filter tabs', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Completed' })).toBeInTheDocument();
  });

  it('starts with 0 points', () => {
    renderWithRouter(<Challenges />);
    const pointsElements = screen.getAllByText('0');
    expect(pointsElements.length).toBeGreaterThan(0);
  });

  it('shows difficulty badges on each challenge', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getAllByText(/Easy|Medium|Hard/).length).toBeGreaterThan(0);
  });

  it('shows CO2 saved for each challenge', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getAllByText(/Saves/i).length).toBeGreaterThan(0);
  });

  it('has checkbox roles for completion tracking', () => {
    renderWithRouter(<Challenges />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('toggles challenge completion on click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Challenges />);
    
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);
    
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'true');
  });

  it('filters to show only completed challenges', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Challenges />);
    
    // Complete a challenge first
    await user.click(screen.getAllByRole('checkbox')[0]);
    
    // Filter to completed
    await user.click(screen.getByRole('tab', { name: 'Completed' }));
    
    // Should show only the completed challenge
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
  });

  it('uses a list role for challenge cards', () => {
    renderWithRouter(<Challenges />);
    expect(screen.getByRole('list', { name: /eco challenges/i })).toBeInTheDocument();
  });
});
