import * as React from 'react';
import { useButton } from './useButton';
import { ButtonProps } from './Button.types';
import { useInlineTokens } from '@fluentui/react-theme-provider';
import { useButtonClasses } from './useButtonClasses';

/**
 * Define a styled Button, using the `useButton` hook.
 * {@docCategory Button}
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const { render, state } = useButton(props, ref);

  useButtonClasses(state);
  useInlineTokens(state, '--button');

  return render(state);
});

Button.displayName = 'Button';
