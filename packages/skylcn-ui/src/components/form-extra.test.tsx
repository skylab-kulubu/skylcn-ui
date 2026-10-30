import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Slider } from './form-extra.js';

describe('Slider', () => {
  it('writes words under both ends of the track', () => {
    render(<Slider label="Memnuniyet" defaultValue={5} min={1} max={10} ends={['Hiç', 'Çok']} />);
    expect(screen.getByText('Hiç')).toBeInTheDocument();
    expect(screen.getByText('Çok')).toBeInTheDocument();
  });
});
