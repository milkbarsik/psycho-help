import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, DatePicker, Empty, Input, Pagination, Select, Tag } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  appointmentQueries,
  appointmentQueryKey,
  confirmAppointment,
} from '@/entities/appointment/api';
import type { Appointment } from '@/entities/appointment/types';
import type { User } from '@/entities/auth';
import { $api } from '@/shared/api/http';
import { useAppointmentsView } from '@/features/personal-cabinet/model/PsychologistAppointmentsView';
import Loader from '@/shared/ui/loader/loader';
import styles from './PsychologistAppointments.module.scss';

const ITEMS_PER_PAGE = 6;

const VENUE_OPTIONS = [
  { value: 'all' as const, label: 'Все форматы' },
  { value: 'offline' as const, label: 'Очно' },
  { value: 'online' as const, label: 'Онлайн' },
];

const STATUS_OPTIONS = [
  { value: 'all' as const, label: 'Все статусы' },
  { value: 'Approved' as const, label: <Tag color="green">Ожидается</Tag> },
  { value: 'Done' as const, label: <Tag color="default">Пройдено</Tag> },
  { value: 'Cancelled' as const, label: <Tag color="red">Отменено</Tag> },
];

const SORT_OPTIONS = [
  { value: 'date' as const, label: 'По дате' },
  { value: 'name' as const, label: 'По имени' },
];

const STATUS_TAG: Record<string, { text: string; color: string }> = {
  Approved: { text: 'Ожидается', color: 'green' },
  Accepted: { text: 'Ожидается', color: 'green' },
  Cancelled: { text: 'Отменено', color: 'red' },
  Done: { text: 'Пройдено', color: 'default' },
};

const getFullName = (user: User) =>
  [user.last_name, user.first_name, user.middle_name].filter(Boolean).join(' ');

const usePatientNames = (patientIds: string[]) => {
  const { data, isLoading } = useQuery<Record<string, string>>({
    queryKey: ['patientNames', patientIds],
    queryFn: async () => {
      const entries = await Promise.all(
        patientIds.map(async (id) => {
          const res = await $api.get<User>(`/users/user/${id}`);
          return [id, getFullName(res.data)] as const;
        }),
      );
      return Object.fromEntries(entries);
    },
    enabled: patientIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
  return { names: data ?? {}, isLoading: patientIds.length > 0 && isLoading };
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

const fmtTime = (d: Date) => d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const formatTimeRange = (dateStr: string) => {
  const start = new Date(dateStr);
  const end = new Date(start.getTime() + 3_600_000);
  return `${fmtTime(start)}\u2009–\u2009${fmtTime(end)}`;
};

const groupByDate = (items: Appointment[]) => {
  const map = new Map<string, Appointment[]>();
  for (const item of items) {
    const key = new Date(item.scheduled_time ?? '').toISOString().split('T')[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map].map(([date, items]) => ({ date, items }));
};

const PsychologistAppointments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    activeTab,
    tabPage,
    tabSettings,
    setActiveTab,
    setCurrentPage,
    setSortField,
    toggleSortDirection,
    setVenueFilter,
    setStatusFilter,
    setDateRange,
    setSearchQuery,
  } = useAppointmentsView();

  const currentPage = tabPage[activeTab];
  const { sortField, sortDirection, venueFilter, statusFilter, dateRange, searchQuery } =
    tabSettings[activeTab];

  const hasActiveFilters =
    venueFilter !== 'all' || statusFilter !== 'all' || dateRange !== null || searchQuery !== '';

  const resetAllFilters = () => {
    setVenueFilter('all');
    setStatusFilter('all');
    setDateRange(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const { data: appointments = [], isLoading } = useQuery(appointmentQueries.list());

  const patientIds = useMemo(() => {
    const ids = appointments.map((a) => a.patient_id).filter((id): id is string => !!id);
    return [...new Set(ids)].sort();
  }, [appointments]);
  const { names: patientNames, isLoading: isNamesLoading } = usePatientNames(patientIds);

  const searchSuggestions = useMemo(() => {
    const names = new Set(Object.values(patientNames));
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return [...names]
      .filter((name) => name.toLowerCase().includes(q))
      .map((name) => ({ value: name }));
  }, [patientNames, searchQuery]);

  const confirmMutation = useMutation({
    mutationFn: confirmAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] }),
  });

  const filteredAppointments = useMemo(() => {
    let result =
      activeTab === 'new'
        ? appointments.filter((a) => a.status === 'Accepted')
        : appointments.filter((a) => a.status !== 'Accepted');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) =>
        (patientNames[a.patient_id ?? ''] ?? '').toLowerCase().includes(q),
      );
    }

    if (venueFilter !== 'all') {
      const target = venueFilter === 'online' ? 'Online' : 'Offline';
      result = result.filter((a) => a.type === target);
    }

    if (activeTab === 'confirmed' && statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (dateRange) {
      const from = new Date(dateRange.from).getTime();
      const to = new Date(dateRange.to + 'T23:59:59').getTime();
      result = result.filter((a) => {
        const t = new Date(a.scheduled_time ?? '').getTime();
        return t >= from && t <= to;
      });
    }

    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...result].sort((a, b) => {
      if (sortField === 'name') {
        const nameA = patientNames[a.patient_id ?? ''] ?? '';
        const nameB = patientNames[b.patient_id ?? ''] ?? '';
        return dir * nameA.localeCompare(nameB, 'ru');
      }
      return (
        dir *
        (new Date(a.scheduled_time ?? '').getTime() - new Date(b.scheduled_time ?? '').getTime())
      );
    });
  }, [
    appointments,
    activeTab,
    sortField,
    sortDirection,
    venueFilter,
    dateRange,
    searchQuery,
    statusFilter,
    patientNames,
  ]);

  const paginated = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const grouped = useMemo(() => groupByDate(paginated), [paginated]);

  if (isLoading || isNamesLoading) return <Loader />;

  const isNew = activeTab === 'new';

  return (
    <section className={styles.wrapper} aria-label="Управление записями">
      <h3 className={styles.label}>Записи</h3>

      <nav className={styles.tabs} aria-label="Тип записей">
        <button
          className={clsx(styles.tab, isNew && styles.tabActive)}
          onClick={() => setActiveTab('new')}
          aria-current={isNew ? 'page' : undefined}
        >
          Новые
        </button>
        <button
          className={clsx(styles.tab, !isNew && styles.tabActive)}
          onClick={() => setActiveTab('confirmed')}
          aria-current={!isNew ? 'page' : undefined}
        >
          Подтверждённые
        </button>
      </nav>

      <div className={styles.filters} role="search" aria-label="Фильтры записей">
        <AutoComplete
          value={searchQuery}
          options={searchSuggestions}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        >
          <Input.Search placeholder="Поиск по ФИО" allowClear />
        </AutoComplete>
        <Select
          value={venueFilter}
          onChange={(v) => {
            setVenueFilter(v);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
          options={VENUE_OPTIONS}
          aria-label="Формат приёма"
        />
        <DatePicker.RangePicker
          value={dateRange ? [dayjs(dateRange.from), dayjs(dateRange.to)] : null}
          onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
            if (dates?.[0] && dates[1]) {
              setDateRange({
                from: dates[0].format('YYYY-MM-DD'),
                to: dates[1].format('YYYY-MM-DD'),
              });
            } else {
              setDateRange(null);
            }
            setCurrentPage(1);
          }}
          placeholder={['Начало', 'Конец']}
          format="DD.MM.YYYY"
        />
        {!isNew && (
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
            options={STATUS_OPTIONS}
            aria-label="Статус записи"
          />
        )}
        {hasActiveFilters && (
          <Button type="link" className={styles.resetFiltersBtn} onClick={resetAllFilters}>
            Сбросить все фильтры
          </Button>
        )}
      </div>

      <div className={styles.sortControls} aria-label="Сортировка">
        <Select
          value={sortField}
          onChange={(v) => {
            setSortField(v);
            setCurrentPage(1);
          }}
          className={styles.sortSelect}
          options={SORT_OPTIONS}
          aria-label="Поле сортировки"
        />
        <Button
          type="text"
          icon={sortDirection === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
          className={styles.sortDirectionBtn}
          onClick={() => {
            toggleSortDirection();
            setCurrentPage(1);
          }}
          aria-label={
            sortDirection === 'desc' ? 'Сортировка по убыванию' : 'Сортировка по возрастанию'
          }
        >
          {sortDirection === 'desc' ? 'По убыванию' : 'По возрастанию'}
        </Button>
      </div>

      <div className={styles.list} role="list" aria-label="Список записей">
        {grouped.length === 0 && <Empty description="Записей нет" />}

        {grouped.map((group) => (
          <section
            key={group.date}
            className={styles.dateGroup}
            aria-label={formatDate(group.items[0].scheduled_time!)}
          >
            <h4 className={styles.dateHeader}>
              <time dateTime={group.date}>{formatDate(group.items[0].scheduled_time!)}</time>
            </h4>

            {group.items.map((apt) => {
              const statusTag = STATUS_TAG[apt.status ?? ''];
              return (
                <article key={apt.id} className={styles.appointmentRow} role="listitem">
                  <time className={styles.timeCol} dateTime={apt.scheduled_time}>
                    {formatTimeRange(apt.scheduled_time!)}
                  </time>

                  <div className={styles.infoCol}>
                    <span className={styles.patientName}>
                      {patientNames[apt.patient_id ?? ''] ?? '—'}
                    </span>
                    <span className={styles.venue}>{apt.venue}</span>
                  </div>

                  <div className={styles.actionsCol}>
                    {isNew ? (
                      <button
                        className={styles.btnConfirm}
                        onClick={() => confirmMutation.mutate(apt.id!)}
                        disabled={confirmMutation.isPending}
                        aria-busy={confirmMutation.isPending}
                      >
                        Подтвердить
                      </button>
                    ) : (
                      <Tag color={statusTag?.color}>{statusTag?.text ?? apt.status}</Tag>
                    )}

                    <button
                      className={isNew ? styles.btnOpenGreen : styles.btnOpenBlue}
                      onClick={() => navigate(`/cabinet/appointment/${apt.id}`)}
                    >
                      Открыть запись
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        ))}
      </div>

      {filteredAppointments.length > ITEMS_PER_PAGE && (
        <Pagination
          current={currentPage}
          total={filteredAppointments.length}
          pageSize={ITEMS_PER_PAGE}
          onChange={setCurrentPage}
          showSizeChanger={false}
          className={styles.pagination}
        />
      )}
    </section>
  );
};

export default PsychologistAppointments;
