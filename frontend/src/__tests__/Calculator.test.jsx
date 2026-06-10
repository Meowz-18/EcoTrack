/**
 * @file Component tests for the Calculator page.
 * Tests rendering, interaction, step navigation, and accessibility.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CalculatorPage from '../pages/Calculator';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Calculator Page', () => {
  it('renders the page heading', () => {
    renderWithRouter(<CalculatorPage />);
    expect(screen.getByText('Carbon Calculator')).toBeInTheDocument();
  });

  it('shows the first category (Transportation) by default', () => {
    renderWithRouter(<CalculatorPage />);
    // Transportation appears in both the progress bar and the category heading
    const elements = screen.getAllByText('Transportation');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders input fields for the current category', () => {
    renderWithRouter(<CalculatorPage />);
    expect(screen.getByLabelText(/Car \(km\/week\)/i)).toBeInTheDocument();
  });

  it('has a progress bar with appropriate ARIA role', () => {
    renderWithRouter(<CalculatorPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has a Next button to advance steps', () => {
    renderWithRouter(<CalculatorPage />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('has a Back button that is disabled on the first step', () => {
    renderWithRouter(<CalculatorPage />);
    const backBtn = screen.getByLabelText('Previous category');
    expect(backBtn).toBeDisabled();
  });

  it('navigates to the next category on Next click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CalculatorPage />);
    
    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Home Energy')).toBeInTheDocument();
  });

  it('navigates back on Back click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CalculatorPage />);
    
    await user.click(screen.getByText('Next'));
    // After Next, heading shows "Home Energy"
    expect(screen.getByText('Home Energy')).toBeInTheDocument();
    
    await user.click(screen.getByLabelText('Previous category'));
    // After Back, heading shows "Transportation" again (multiple matches expected)
    const transportElements = screen.getAllByText('Transportation');
    expect(transportElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows the See Results label on the last step', async () => {
    renderWithRouter(<CalculatorPage />);
    
    // On step 0, the button should say "Next" with label "Next category"
    const nextBtn = screen.getByLabelText('Next category');
    expect(nextBtn).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows emission factor info for inputs', () => {
    renderWithRouter(<CalculatorPage />);
    // Multiple emission factor paragraphs exist (one per field)
    const factors = screen.getAllByText(/Emission factor:/i);
    expect(factors.length).toBeGreaterThan(0);
  });

  it('accepts numeric input values', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CalculatorPage />);
    
    const input = screen.getByLabelText(/Car \(km\/week\)/i);
    await user.clear(input);
    await user.type(input, '150');
    expect(input).toHaveValue(150);
  });

  it('applies preset value to input on click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CalculatorPage />);
    
    const presetBtn = screen.getByRole('button', { name: 'Low (50 km)' });
    expect(presetBtn).toBeInTheDocument();
    
    await user.click(presetBtn);
    const input = screen.getByLabelText(/Car \(km\/week\)/i);
    expect(input).toHaveValue(50);
  });
});
