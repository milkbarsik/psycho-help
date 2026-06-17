import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styles from './Button.module.scss';
import clsx from 'clsx';

/* Универсальная кнопка. Сама выбирает, чем отрендериться:
 *
 *  - без `to`  → обычная <button> (для действий: onClick, submit, disabled и т.д.)
 *      <Button onClick={save}>Сохранить</Button>
 *
 *  - с `to`    → ссылка <Link> из react-router (для перехода на другую страницу)
 *      <Button to="/therapists">Смотреть всех</Button>
 *
 * Правило простое:
 * если по клику происходит ПЕРЕХОД на маршрут - используй `to`,
 * если ДЕЙСТВИЕ на той же странице - используй `onClick`.
 * Внешний вид (variant, color, icon и пр.) одинаковый в обоих случаях.
 */

// Общие пропсы внешнего вида - работают и для кнопки, и для ссылки.
type TButtonStyleProps = {
  variant?: 'primary' | 'secondary';
  color?: 'brand' | 'neutral';
  size?: 'medium';
  fontSize?: 'large' | 'medium';
  fontWeight?: 'bold' | 'regular';
  iconPosition?: 'left' | 'right';
  icon?: ReactNode;
  children?: ReactNode;
};

// Вариант «кнопка»: без `to`, поддерживает пропсы обычной <button>.
type TButtonAsButton = TButtonStyleProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };

// Вариант «ссылка»: с `to`, поддерживает пропсы <Link> (рендерится как <a>).
type TButtonAsLink = TButtonStyleProps & LinkProps & { to: LinkProps['to'] };

export type TButtonProps = TButtonAsButton | TButtonAsLink;

export const Button = ({
  variant = 'primary',
  color = 'brand',
  size = 'medium',
  fontSize = 'large',
  fontWeight = 'bold',
  children,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: TButtonProps) => {
  const content = icon ? (
    <>
      {iconPosition === 'left' && <div className={styles.icon}>{icon}</div>}
      {children}
      {iconPosition === 'right' && <div className={styles.icon}>{icon}</div>}
    </>
  ) : (
    children
  );

  const classNames = clsx(
    styles.button,
    styles[variant],
    styles[color],
    styles[size],
    styles[fontWeight],
    {
      [styles.fontLarge]: fontSize === 'large',
      [styles.fontMedium]: fontSize === 'medium',
      [styles.hasIcon]: !!icon,
    },
    className,
  );

  // Передали `to` → это ссылка.
  if (props.to !== undefined) {
    return (
      <Link {...(props as LinkProps)} className={classNames}>
        {content}
      </Link>
    );
  }

  // Иначе → обычная кнопка.
  return (
    <button {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} className={classNames}>
      {content}
    </button>
  );
};
