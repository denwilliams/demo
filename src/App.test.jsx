import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return user;
}

describe('Orbit playground', () => {
  it('identifies the content as fictional and shows the starting state', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Small clicks.Big possibilities.');
    expect(screen.getByText('100% FICTIONAL')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'A tiny trip to the moon' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Ready when you are.');
    expect(screen.getByRole('button', { name: 'Save idea' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('textbox', { name: 'Make yourself at home' })).toHaveValue('Explorer');
  });

  it('launches with a custom callsign and visible local-only feedback', async () => {
    const user = setup();
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Nova');
    await user.click(screen.getByRole('button', { name: 'Launch demo' }));
    expect(screen.getByRole('status')).toHaveTextContent('Welcome aboard, Nova. Nothing left this page.');
  });

  it('uses the default callsign for blank input and renders input as text', async () => {
    const user = setup();
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '   ');
    await user.click(screen.getByRole('button', { name: 'Launch demo' }));
    expect(screen.getByRole('status')).toHaveTextContent('Welcome aboard, Explorer.');
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '<b>Nova</b>');
    await user.click(screen.getByRole('button', { name: 'Launch demo' }));
    expect(screen.getByRole('status')).toHaveTextContent('<b>Nova</b>');
    expect(screen.getByRole('status').querySelector('b')).toBeNull();
  });

  it('toggles the saved state on and off', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Save idea' }));
    expect(screen.getByRole('button', { name: 'Saved' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Idea saved for this session.');
    await user.click(screen.getByRole('button', { name: 'Saved' }));
    expect(screen.getByRole('button', { name: 'Save idea' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Idea removed');
  });

  it('cycles through all ideas and clears the previous saved state', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Save idea' }));
    const next = screen.getByRole('button', { name: 'Next idea' });
    const titles = ['A garden above the clouds', 'A café at the edge of Mars', 'A tiny trip to the moon'];
    for (const [index, title] of titles.entries()) {
      await user.click(next);
      expect(screen.getByRole('heading', { name: title })).toBeVisible();
      expect(screen.getByText(`${String(((index + 1) % 3) + 1).padStart(2, '0')} / 03`)).toBeVisible();
      expect(screen.getByRole('button', { name: 'Save idea' })).toHaveAttribute('aria-pressed', 'false');
    }
    expect(screen.getByRole('status')).toHaveTextContent('A fresh fictional idea');
  });

  it('counts repeated claps and supports keyboard activation', async () => {
    const user = setup();
    const clap = screen.getByRole('button', { name: 'Clap, 0 claps' });
    clap.focus();
    await user.keyboard('{Enter} ');
    expect(screen.getByRole('button', { name: 'Clap, 2 claps' })).toBeVisible();
  });

  it('keeps the future action disabled', async () => {
    const user = setup();
    const disabled = screen.getByRole('button', { name: 'Coming soon' });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(screen.getByRole('status')).toHaveTextContent('Ready when you are.');
  });

  it('resets every experiment and starts fresh on remount', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(screen.getByRole('button', { name: 'Next idea' }));
    await user.click(screen.getByRole('button', { name: 'Save idea' }));
    await user.click(screen.getByRole('button', { name: 'Clap, 0 claps' }));
    await user.type(screen.getByRole('textbox'), ' Nova');
    await user.click(screen.getByRole('button', { name: 'Reset playground' }));
    expect(screen.getByRole('heading', { name: 'A tiny trip to the moon' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save idea' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Clap, 0 claps' })).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveValue('Explorer');
    expect(screen.getByRole('status')).toHaveTextContent('Playground reset.');
    await user.click(screen.getByRole('button', { name: 'Save idea' }));
    await user.click(screen.getByRole('button', { name: 'Clap, 0 claps' }));
    await user.type(screen.getByRole('textbox'), ' Nova');
    // A new mounted instance, like a reload, must not retain previous state.
    unmount();
    render(<App />);
    expect(screen.getByRole('button', { name: 'Save idea' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Clap, 0 claps' })).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveValue('Explorer');
    expect(screen.getByRole('status')).toHaveTextContent('Ready when you are.');
  });
});
