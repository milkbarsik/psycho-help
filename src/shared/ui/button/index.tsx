import type { ButtonHTMLAttributes } from "react";
import clsx from 'clsx';
import styles from './Button.module.scss'

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | "secondary" | 'tertiary';
}

export const Button = ({variant='primary', children, className, ...props}: IButtonProps) => {
    return (
        <button className={clsx(styles.button, className, styles[variant])} {...props}>
            {children}
        </button>
    );
}