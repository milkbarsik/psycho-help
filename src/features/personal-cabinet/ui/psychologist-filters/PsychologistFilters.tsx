import { AutoComplete, DatePicker, Input, Select } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { SortDirection } from '@/features/personal-cabinet/model/PsychologistView';
import styles from './PsychologistFilters.module.scss';

interface SelectOption {
  value: string;
  label: string;
}

interface SearchSuggestion {
  value: string;
}

interface PsychologistListFiltersProps {
  searchQuery: string;
  searchSuggestions: SearchSuggestion[];
  onSearchQueryChange: (value: string) => void;
  formatFilter: string;
  formatOptions: SelectOption[];
  onFormatFilterChange: (value: string) => void;
  statusFilter: string;
  statusOptions: SelectOption[];
  onStatusFilterChange: (value: string) => void;
  dateRange: [string, string] | null;
  onDateRangeChange: (range: [string, string] | null) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  searchPlaceholder?: string;
  formatPlaceholder?: string;
  statusPlaceholder?: string;
}

const PsychologistListFilters = ({
  searchQuery,
  searchSuggestions,
  onSearchQueryChange,
  formatFilter,
  formatOptions,
  onFormatFilterChange,
  statusFilter,
  statusOptions,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  sortDirection,
  onSortDirectionChange,
  hasActiveFilters,
  onResetFilters,
  searchPlaceholder = 'Поиск по ФИО',
  formatPlaceholder = 'Все форматы',
  statusPlaceholder = 'Все статусы',
}: PsychologistListFiltersProps) => {
  return (
    <div className={styles['filters']}>
      <div className={styles['filters__bar']} role="search">
        <AutoComplete
          value={searchQuery}
          options={searchSuggestions}
          onChange={onSearchQueryChange}
          className={styles['filters__search-autocomplete']}
        >
          <Input
            placeholder={searchPlaceholder}
            suffix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            className={styles['filters__search-input']}
          />
        </AutoComplete>

        <Select
          value={statusFilter === 'all' ? null : statusFilter}
          onChange={(value) => onStatusFilterChange(value || 'all')}
          className={styles['filters__status-select']}
          options={statusOptions}
          placeholder={statusPlaceholder}
          allowClear
        />

        <Select
          value={formatFilter === 'all' ? null : formatFilter}
          onChange={(value) => onFormatFilterChange(value || 'all')}
          className={styles['filters__format-select']}
          options={formatOptions}
          placeholder={formatPlaceholder}
          allowClear
        />

        <DatePicker.RangePicker
          value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
          onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
            if (dates && dates[0] && dates[1]) {
              onDateRangeChange([dates[0].toISOString(), dates[1].toISOString()]);
              return;
            }
            onDateRangeChange(null);
          }}
          format="DD.MM.YYYY"
          placeholder={['От', 'До']}
          allowClear
          className={styles['filters__date-range']}
        />
      </div>

      <div className={styles['filters__bar']}>
        <button
          className={styles['filters__sort-button']}
          onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          Сортировка по дате
          {sortDirection === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
        </button>

        {hasActiveFilters && (
          <button className={styles['filters__reset-button']} onClick={onResetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
};

export default PsychologistListFilters;
