/**
 * @file Test suite for the Landing page component.
 * Verifies hero section rendering, navigation links, feature cards,
 * stats display, CTA section, footer, and accessibility attributes.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Stub framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Dynamically import after mocks are set up
const { default: Landing } = await import('../pages/Landing');

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

describe('Landing Page', () => {
  it('renders the hero heading', () => {
    renderLanding();
    expect(screen.getByText(/Track Your/i)).toBeInTheDocument();
    expect(screen.getByText('Carbon')).toBeInTheDocument();
    expect(screen.getByText('Footprint')).toBeInTheDocument();
  });

  it('renders CTA buttons with correct navigation links', () => {
    renderLanding();
    const calcLink = screen.getByRole('link', { name: /Calculate Now/i });
    expect(calcLink).toHaveAttribute('href', '/calculator');
    const assistantLink = screen.getByRole('link', { name: /Ask AI Assistant/i });
    expect(assistantLink).toHaveAttribute('href', '/assistant');
  });

  it('renders all feature cards', () => {
    renderLanding();
    expect(screen.getByText('Carbon Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Smart Calculator')).toBeInTheDocument();
    expect(screen.getByText('Eco Challenges')).toBeInTheDocument();
    expect(screen.getByText('Green Timeline')).toBeInTheDocument();
    expect(screen.getByText('AI Eco Assistant')).toBeInTheDocument();
  });

  it('renders feature cards as links to correct routes', () => {
    renderLanding();
    const dashboardLink = screen.getByRole('link', { name: /Carbon Dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  it('renders statistics section', () => {
    renderLanding();
    expect(screen.getByText('4.5t')).toBeInTheDocument();
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('200+')).toBeInTheDocument();
  });

  it('renders the features heading', () => {
    renderLanding();
    expect(screen.getByText(/Everything You Need to/i)).toBeInTheDocument();
    expect(screen.getByText('Go Green')).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    renderLanding();
    expect(screen.getByText(/Start Your Green Journey Today/i)).toBeInTheDocument();
    const getStartedLink = screen.getByRole('link', { name: /Get Started Free/i });
    expect(getStartedLink).toHaveAttribute('href', '/calculator');
  });

  it('renders the footer with branding', () => {
    renderLanding();
    expect(screen.getByText('EcoTrack')).toBeInTheDocument();
    expect(screen.getByText(/Built with/i)).toBeInTheDocument();
  });

  it('has correct ARIA landmarks', () => {
    renderLanding();
    const heroSection = screen.getByRole('heading', { name: /Track Your/i });
    expect(heroSection).toBeInTheDocument();
    expect(screen.getByLabelText('Platform Statistics')).toBeInTheDocument();
  });

  it('renders the hero image with descriptive alt text', () => {
    renderLanding();
    const img = screen.getByAltText(/EcoTrack Carbon Footprint Concept/i);
    expect(img).toBeInTheDocument();
  });

  it('has the correct displayName for React.memo', () => {
    expect(Landing.displayName).toBe('Landing');
  });

  it('renders the Gemini AI badge', () => {
    renderLanding();
    const badges = screen.getAllByText(/POWERED BY GOOGLE GEMINI AI/i);
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });
});
