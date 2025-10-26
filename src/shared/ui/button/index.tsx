import type { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary';
  size?: 'medium';
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}: IButtonProps) => {
  const { disabled } = props || {};
  return (
    <button
      {...props}
      className={cn(styles.button, styles[variant], styles[size], { [styles.disabled]: disabled })}
    >
      {children}
    </button>
  );
};
