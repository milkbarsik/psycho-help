//Здесь будут какие-либо действие перед кампиляцией тестов
import '@testing-library/jest-dom';
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Мок для SVG импортируемых как ?react компоненты
vi.mock('@/shared/assets/images/footer/logo.svg?react', () => ({
  default: () => null,
}))
