import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './header';
import { useAuth } from '../../features/auth/api/useAuth';

// Мокаем SVG-компоненты и модальное окно
vi.mock('./Logo.svg?react', () => ({
  default: () => <div data-testid="logo" />,
}));
vi.mock('@/widgets/Burger.svg?react', () => ({
  default: () => <div data-testid="burger" />,
}));
vi.mock('@/shared/assets/images/header/profile.svg?react', () => ({
  default: () => <div data-testid="profile-icon" />,
}));
vi.mock('@/features/auth/modal/modal', () => ({
  default: () => <button data-testid="modal-button">Войти</button>,
}));

// Мокаем хук авторизации
vi.mock('@/features/auth/api/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Header component', () => {
  it('рендерит логотип и все навигационные пункты', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Проверяем наличие логотипа
    expect(screen.getByTestId('logo')).toBeInTheDocument();

    // Проверяем наличие всех пунктов меню
    const navItems = ['Главная', 'Психологи', 'Новости', 'Полезные материалы', 'FAQ'];
    navItems.forEach((text) => {
      expect(screen.getByRole('link', { name: new RegExp(text, 'i') })).toBeInTheDocument();
    });
  });

  it('показывает кнопку "Войти", если пользователь не авторизован', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByTestId('modal-button')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-icon')).not.toBeInTheDocument();
  });

  it('показывает иконку профиля, если пользователь авторизован', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: true } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-button')).not.toBeInTheDocument();

    // Проверяем, что ссылка ведёт в кабинет
    const cabinetLink = screen.getByTestId('profile-icon').closest('a');
    expect(cabinetLink).toHaveAttribute('href', '/cabinet');
  });

  it('ссылка на главную страницу имеет aria-label', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const mainLink = screen.getByRole('link', { name: /Вернуться на главную страницу/i });
    expect(mainLink).toHaveAttribute('aria-label', 'Вернуться на главную страницу');
  });
});
