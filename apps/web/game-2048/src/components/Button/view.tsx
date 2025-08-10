import classNames from 'classnames';
import {type ButtonHTMLAttributes} from 'react';

import styles from './styles.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
