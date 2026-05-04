import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './footer';
import VkIcon from '@/shared/assets/images/footer/vk.svg';
import TgIcon from '@/shared/assets/images/footer/tg.svg';

describe('Footer', () => {
  it('рендерит основные заголовки', () => {
    render(<Footer />);
    expect(screen.getByText('московский политех')).toBeInTheDocument();
    expect(screen.getByText(/Служба психологической помощи/i)).toBeInTheDocument();
  });

  it('рендерит все адреса', () => {
    render(<Footer />);
    const streets = [
      'ул. Большая Семёновская, 38',
      'ул. Прянишникова, 2а',
      'ул. Павла Корчагина, 22',
      'ул. Автозаводская, 16',
    ];
    const auditoriums = ['ауд. В-509', 'ауд. 1401', 'ауд. 239', 'ауд. 1109'];
    streets.forEach((street) => {
      expect(screen.getByText(street)).toBeInTheDocument();
    });
    auditoriums.forEach((auditorium) => {
      expect(screen.getByText(auditorium)).toBeInTheDocument();
    });
  });

  it('рендерит телефон и социальные иконки', () => {
    render(<Footer />);
    expect(screen.getByText('Телефон:')).toBeInTheDocument();
    expect(screen.getByText('+7 (495) 223-05-41')).toBeInTheDocument();
    // Проверка изображений
    const vkImg = screen.getByAltText('VK') as HTMLImageElement;
    const tgImg = screen.getByAltText('Telegram') as HTMLImageElement;

    expect(vkImg.src).toContain(VkIcon);
    expect(tgImg.src).toContain(TgIcon);
  });

  it('рендерит e-mail ссылку', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', {
      name: /psycholog@mospolytech.ru/i,
    }) as HTMLAnchorElement;
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.href).toBe('mailto:psycholog@mospolytech.ru');
  });

  it('рендерит текущий год', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((content) => content.includes(year))).toBeInTheDocument();
  });
});
