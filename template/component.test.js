import React from 'react';
import { render  } from '@testing-library/react';
import __NAME__ from './__NAME__';
import styles from './__NAME__.module.scss';

test('__NAME__ renders some content', () => {
    const { getByText } = render(<__NAME__>Hello</__NAME__>);
    const component = getByText('Hello');
    expect(component).toBeInTheDocument();
});