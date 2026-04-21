import { AutoComplete, DatePicker, Input, Select } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { SortDirection } from '@/features/personal-cabinet/model/PsychologistView';
import styles from './PsychologistListFilters.module.scss';

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
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow} role="search">
        <AutoComplete
          value={searchQuery}
          options={searchSuggestions}
          onChange={onSearchQueryChange}
          className={styles.searchInputWrapper}
        >
          <Input
            placeholder={searchPlaceholder}
            suffix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            className={styles.inputField}
          />
        </AutoComplete>

        <Select
          value={formatFilter === 'all' ? null : formatFilter}
          onChange={(value) => onFormatFilterChange(value || 'all')}
          className={styles.filterSelect}
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
          className={styles.dateRangePicker}
        />

        <Select
          value={statusFilter === 'all' ? null : statusFilter}
          onChange={(value) => onStatusFilterChange(value || 'all')}
          className={styles.filterSelect}
          options={statusOptions}
          placeholder={statusPlaceholder}
          allowClear
        />
      </div>

      <div className={styles.sortRow}>
        <button
          className={styles.sortToggleBtn}
          onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          Сортировка по дате
          {sortDirection === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
        </button>

        {hasActiveFilters && (
          <button className={styles.resetFiltersBtn} onClick={onResetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
};

export default PsychologistListFilters;
