/**
 * @file Integration tests for the App component.
 * Tests routing, navigation, landmarks, and skip-to-content.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('#root') || document.body).toBeDefined();
  });

  it('displays the EcoTrack brand name', () => {
    render(<App />);
    expect(screen.getByText(/Track/)).toBeInTheDocument();
  });

  it('has a skip-to-content link for accessibility', () => {
    render(<App />);
    expect(screen.getByText('Skip to Main Content')).toBeInTheDocument();
  });

  it('skip-to-content link points to #main-content', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to Main Content');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('has a main content area with proper id', () => {
    render(<App />);
    expect(document.getElementById('main-content')).toBeInTheDocument();
  });

  it('has navigation with proper ARIA role', () => {
    render(<App />);
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThan(0);
  });

  it('has a Sign In button', () => {
    render(<App />);
    expect(screen.getByLabelText('Sign In')).toBeInTheDocument();
  });

  it('has a User Profile button', () => {
    render(<App />);
    expect(screen.getByLabelText('User Profile')).toBeInTheDocument();
  });
});
