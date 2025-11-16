import React, { type FC, type KeyboardEvent } from 'react';
import type { TabVariant, TabSize } from '../../index';
import styles from './TabItem.module.scss';
import clsx from 'clsx';

export interface ITabItemProps {
  id: string;
  label: string;
  isActive: boolean;
  disabled?: boolean;
  variant?: TabVariant;
  size?: TabSize;
  onClick: (id: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, id: string) => void;
  tabRef?: (el: HTMLButtonElement | null) => void;
}

export const TabItem: FC<ITabItemProps> = ({
  id,
  label,
  isActive,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  onClick,
  onKeyDown,
  tabRef,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(id);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown(e, id);
  };

  return (
    <button
      ref={tabRef}
      className={clsx(styles.tab, styles[variant], styles[size], {
        [styles.active]: isActive,
        [styles.disabled]: disabled,
      })}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      id={`tab-${id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      <span className={styles.tabLabel}>{label}</span>
    </button>
  );
};
