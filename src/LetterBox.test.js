import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LetterBox from './LetterBox';

describe('LetterBox Component', () => {
  test('renders LetterBox component without crashing', () => {
    render(<LetterBox letter="A" isVisible={true} />);
  });

  test('displays letter when isVisible is true', () => {
    const { container } = render(<LetterBox letter="A" isVisible={true} />);
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span.textContent).toBe('A');
    expect(span).toHaveStyle('visibility: visible');
  });

  test('hides letter when isVisible is false', () => {
    const { container } = render(<LetterBox letter="B" isVisible={false} />);
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span.textContent).toBe('B');
    expect(span).toHaveStyle('visibility: hidden');
  });

  test('applies custom boxStyle prop correctly', () => {
    const customBoxStyle = {
      backgroundColor: 'red',
      border: '2px solid blue',
      width: '100px',
      height: '100px'
    };

    const { container } = render(
      <LetterBox
        letter="C"
        isVisible={true}
        boxStyle={customBoxStyle}
      />
    );

    const div = container.querySelector('div > div');
    expect(div).toHaveStyle('background-color: red');
    expect(div).toHaveStyle('border: 2px solid blue');
    expect(div).toHaveStyle('width: 100px');
    expect(div).toHaveStyle('height: 100px');
  });

  test('applies custom letterStyle prop correctly', () => {
    const customLetterStyle = {
      color: 'green',
      fontSize: '50px',
      fontWeight: '900'
    };

    const { container } = render(
      <LetterBox
        letter="D"
        isVisible={true}
        letterStyle={customLetterStyle}
      />
    );

    const span = container.querySelector('span');
    expect(span).toHaveStyle('color: green');
    expect(span).toHaveStyle('font-size: 50px');
    expect(span).toHaveStyle('font-weight: 900');
  });

  test('displays lowercase letter correctly', () => {
    const { container } = render(<LetterBox letter="e" isVisible={true} />);
    const span = container.querySelector('span');

    expect(span.textContent).toBe('e');
  });

  test('displays uppercase letter correctly', () => {
    const { container } = render(<LetterBox letter="F" isVisible={true} />);
    const span = container.querySelector('span');

    expect(span.textContent).toBe('F');
  });

  test('combines default and custom styles correctly', () => {
    const customBoxStyle = { backgroundColor: 'yellow' };
    const customLetterStyle = { fontSize: '40px' };

    const { container } = render(
      <LetterBox
        letter="G"
        isVisible={true}
        boxStyle={customBoxStyle}
        letterStyle={customLetterStyle}
      />
    );

    const div = container.querySelector('div > div');
    const span = container.querySelector('span');

    // Custom styles should be applied
    expect(div).toHaveStyle('background-color: yellow');
    expect(span).toHaveStyle('font-size: 40px');

    // Default styles should still be present where not overridden
    expect(div).toHaveStyle('border: 1px solid black');
    expect(span).toHaveStyle('visibility: visible');
  });

  test('handles special characters', () => {
    const { container } = render(<LetterBox letter="!" isVisible={true} />);
    const span = container.querySelector('span');

    expect(span.textContent).toBe('!');
  });

  test('handles number characters', () => {
    const { container } = render(<LetterBox letter="5" isVisible={true} />);
    const span = container.querySelector('span');

    expect(span.textContent).toBe('5');
  });

  test('applies different visibility states', () => {
    // Test hidden state
    const { container: hiddenContainer } = render(
      <LetterBox letter="H" isVisible={false} />
    );
    const hiddenSpan = hiddenContainer.querySelector('span');
    expect(hiddenSpan).toHaveStyle('visibility: hidden');

    // Test visible state
    const { container: visibleContainer } = render(
      <LetterBox letter="I" isVisible={true} />
    );
    const visibleSpan = visibleContainer.querySelector('span');
    expect(visibleSpan).toHaveStyle('visibility: visible');
  });

  test('renders with multiple different prop combinations', () => {
    const propCombinations = [
      {
        letter: 'J',
        isVisible: true,
        boxStyle: { backgroundColor: 'lightblue' },
        letterStyle: { color: 'black', fontSize: '30px' }
      },
      {
        letter: 'K',
        isVisible: false,
        boxStyle: { backgroundColor: 'pink' },
        letterStyle: { color: 'purple', fontSize: '20px' }
      },
      {
        letter: 'L',
        isVisible: true,
        boxStyle: { backgroundColor: 'orange', width: '60px' },
        letterStyle: { color: 'white', fontSize: '35px', fontWeight: 'bold' }
      }
    ];

    propCombinations.forEach((props, index) => {
      const { container } = render(<LetterBox {...props} key={index} />);
      const div = container.querySelector('div > div');
      const span = container.querySelector('span');

      expect(span.textContent).toBe(props.letter);
      expect(div).toHaveStyle(`background-color: ${props.boxStyle.backgroundColor}`);
      expect(span).toHaveStyle(`color: ${props.letterStyle.color}`);
      expect(span).toHaveStyle(`font-size: ${props.letterStyle.fontSize}`);
      expect(span).toHaveStyle(props.isVisible ? 'visibility: visible' : 'visibility: hidden');
    });
  });

  test('default box dimensions are correct', () => {
    const { container } = render(<LetterBox letter="M" isVisible={true} />);
    const div = container.querySelector('div > div');

    expect(div).toHaveStyle('width: 50px');
    expect(div).toHaveStyle('height: 50px');
    expect(div).toHaveStyle('display: flex');
    expect(div).toHaveStyle('justify-content: center');
    expect(div).toHaveStyle('align-items: center');
  });

  test('overriding all default styles works correctly', () => {
    const completeCustomBoxStyle = {
      border: '5px dashed red',
      width: '80px',
      height: '80px',
      display: 'block',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      fontSize: '18px',
      fontWeight: 'normal',
      backgroundColor: 'navy'
    };

    const completeCustomLetterStyle = {
      visibility: 'visible',
      color: 'yellow',
      fontSize: '45px',
      fontStyle: 'italic'
    };

    const { container } = render(
      <LetterBox
        letter="N"
        isVisible={true}
        boxStyle={completeCustomBoxStyle}
        letterStyle={completeCustomLetterStyle}
      />
    );

    const div = container.querySelector('div > div');
    const span = container.querySelector('span');

    expect(div).toHaveStyle('border: 5px dashed red');
    expect(div).toHaveStyle('width: 80px');
    expect(div).toHaveStyle('background-color: navy');
    expect(span).toHaveStyle('color: yellow');
    expect(span).toHaveStyle('font-size: 45px');
  });
});
