import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './header';
import { navPages, CABINET_PATH } from '@/app/router/routes';
import { useAuth } from '@/features/auth/api/useAuth';

vi.stubGlobal(
  'ResizeObserver',
  vi.fn(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() })),
);
// Мокаем SVG-компоненты
vi.mock('@/shared/assets/images/logo.svg?react', () => ({
  default: (props: Record<string, unknown>) => <svg data-testid="logo" {...props} />,
}));
vi.mock('@/shared/assets/images/header/profile.svg?react', () => ({
  default: (props: Record<string, unknown>) => <svg data-testid="profile-icon" {...props} />,
}));
vi.mock('@/shared/assets/images/header/auth.svg?react', () => ({
  default: (props: Record<string, unknown>) => <svg data-testid="auth-icon" {...props} />,
}));

// Мокаем модальное окно
vi.mock('@/features/auth/modal/modal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="auth-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Мокаем хук авторизации
vi.mock('@/features/auth/api/useAuth', () => ({
  useAuth: vi.fn(),
}));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe('Header component', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ isAuth: false } as ReturnType<typeof useAuth>);
  });

  it('рендерит логотип и все навигационные пункты', () => {
    renderHeader();

    expect(screen.getByTestId('logo')).toBeInTheDocument();

    navPages.forEach(({ navText }) => {
      expect(screen.getByRole('link', { name: new RegExp(navText, 'i') })).toBeInTheDocument();
    });
  });

  it('навигационные ссылки ведут на правильные страницы', () => {
    renderHeader();

    navPages.forEach(({ path, navText }) => {
      const link = screen.getByRole('link', { name: new RegExp(navText, 'i') });
      expect(link).toHaveAttribute('href', path);
    });
  });

  describe('Авторизация', () => {
    it('показывает кнопку "Войти", если пользователь не авторизован', () => {
      renderHeader();

      const authBtn = screen.getByTestId('auth-button');
      expect(authBtn).toBeInTheDocument();
      expect(authBtn).toHaveAccessibleName();
      expect(authBtn.textContent?.trim().length ?? 0).toBeGreaterThan(0);
      expect(screen.queryByTestId('profile-icon')).not.toBeInTheDocument();
    });

    it('показывает иконку профиля, если пользователь авторизован', () => {
      vi.mocked(useAuth).mockReturnValue({ isAuth: true } as ReturnType<typeof useAuth>);
      renderHeader();

      expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('auth-button')).not.toBeInTheDocument();
    });

    it('ссылка профиля ведёт в личный кабинет', () => {
      vi.mocked(useAuth).mockReturnValue({ isAuth: true } as ReturnType<typeof useAuth>);
      renderHeader();

      const cabinetLink = screen.getByTestId('profile-icon').closest('a');
      expect(cabinetLink).toHaveAttribute('href', CABINET_PATH);
    });
  });

  describe('Модальное окно входа', () => {
    it('клик по кнопке "Войти" открывает модальное окно', async () => {
      renderHeader();

      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();

      await userEvent.click(screen.getByTestId('auth-button'));

      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    });

    it('модальное окно закрывается при вызове onClose', async () => {
      renderHeader();

      await userEvent.click(screen.getByTestId('auth-button'));
      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();

      await userEvent.click(screen.getByTestId('close-modal'));
      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
    });

    it('модальное окно не рендерится для авторизованного пользователя', () => {
      vi.mocked(useAuth).mockReturnValue({ isAuth: true } as ReturnType<typeof useAuth>);
      renderHeader();

      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
    });
  });
});
