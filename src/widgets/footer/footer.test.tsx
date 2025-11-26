import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './footer';
import VkIcon from '@/shared/assets/images/main/footer/vk.svg';
import TgIcon from '@/shared/assets/images/main/footer/tg.svg';

describe('Footer', () => {
  it('рендерит основные заголовки', () => {
    render(<Footer />);
    expect(screen.getByText('Служба психологической помощи')).toBeInTheDocument();
    expect(screen.getByText('Будем рады Вам помочь!')).toBeInTheDocument();
  });

  it('рендерит все адреса', () => {
    render(<Footer />);
    const addresses = [
      'ул. Большая Семёновская, 38, ауд. В-509',
      'ул. Прянишникова, 2а, ауд. 1401',
      'ул. Павла Корчагина, 22, ауд. 239',
      'ул. Автозаводская, 16, ауд. 1109',
    ];
    addresses.forEach((address) => {
      expect(screen.getByText(address)).toBeInTheDocument();
    });
  });

  it('рендерит телефон и социальные иконки', () => {
    render(<Footer />);
    expect(screen.getByText('Тел: +7(495) 223-05-41')).toBeInTheDocument();
    // Проверка изображений
    const vkImg = screen.getByAltText('Vk') as HTMLImageElement;
    const tgImg = screen.getByAltText('Tg') as HTMLImageElement;

    expect(vkImg.src).toContain(VkIcon);
    expect(tgImg.src).toContain(TgIcon);
  });

  it('рендерит e-mail ссылку', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /psycholog@mospolytech.ru/i }) as HTMLAnchorElement;
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.href).toBe('mailto:psycholog@mospolytech.ru');
  });

  it('рендерит текущий год', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((content) => content.includes(year))).toBeInTheDocument();
  });
});
