import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatAssistant from './ChatAssistant';

describe('ChatAssistant Component', () => {
  it('opens and closes the chat window', () => {
    render(<ChatAssistant />);
    
    // Find toggle button and click
    const toggleBtn = screen.getByLabelText(/Toggle AI Chat Assistant/i);
    fireEvent.click(toggleBtn);
    
    // Verify window is open
    expect(screen.getByText(/ECI Assistant/i)).toBeDefined();
    
    // Find close button and click
    const closeBtn = screen.getByLabelText(/Close Chat/i);
    fireEvent.click(closeBtn);
  });
});
