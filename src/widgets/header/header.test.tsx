import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
vi.mock('@/features/auth/modal/icons/Auth.svg?react', () => ({
  default: () => <svg data-testid="auth-icon" />,
}));
vi.mock('@/features/auth/modal/modal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="auth-modal">Modal</div> : null,
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
      </MemoryRouter>,
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
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /Открыть окно входа/i })).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-icon')).not.toBeInTheDocument();
  });

  it('показывает иконку профиля, если пользователь авторизован', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: true } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Открыть окно входа/i })).not.toBeInTheDocument();

    // Проверяем, что ссылка ведёт в кабинет
    const cabinetLink = screen.getByTestId('profile-icon').closest('a');
    expect(cabinetLink).toHaveAttribute('href', '/cabinet');
  });

  it('клик по кнопке "Войти" открывает модальное окно', async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Открыть окно входа/i }));

    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
  });

  it('ссылка на главную страницу имеет aria-label', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<typeof useAuth>);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const mainLink = screen.getByRole('link', { name: /Вернуться на главную страницу/i });
    expect(mainLink).toHaveAttribute('aria-label', 'Вернуться на главную страницу');
  });
});
