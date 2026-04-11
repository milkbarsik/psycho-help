import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, DatePicker, Empty, Input, Pagination, Select, Tag } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import clsx from 'clsx';
import {
  applicationQueries,
  applicationQueryKey,
  acceptApplication,
} from '@/entities/application/api';
import type { Application, ApplicationStatus } from '@/entities/application/types';
import { appointmentQueries } from '@/entities/appointment/api';
import type { Appointment, AppointmentStatus } from '@/entities/appointment/types';
import { useAuth } from '@/features/auth/api/useAuth';
import { useApplicationsView } from '@/features/personal-cabinet/model/PsychologistAppointmentsView';
import type { SortField } from '@/features/personal-cabinet/model/PsychologistAppointmentsView';
import Loader from '@/shared/ui/loader/loader';
import styles from './PsychologistAppointments.module.scss';

const ITEMS_PER_PAGE = 6;

/* ── Application constants ── */

const CLOSED_STATUSES: ApplicationStatus[] = ['rejected', 'cancelled', 'expired'];

const APP_STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новые' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'awaiting_user_confirmation', label: 'Ожидает подтверждения' },
  { value: 'completed', label: 'Завершено' },
  { value: 'closed', label: 'Закрыто' },
];

const APP_STATUS_TAG: Record<ApplicationStatus, { text: string; color: string }> = {
  new: { text: 'Новая', color: 'blue' },
  in_progress: { text: 'В работе', color: 'orange' },
  awaiting_user_confirmation: { text: 'Ожидает подтверждения', color: 'cyan' },
  completed: { text: 'Завершено', color: 'green' },
  rejected: { text: 'Закрыто', color: 'default' },
  cancelled: { text: 'Закрыто', color: 'default' },
  expired: { text: 'Закрыто', color: 'default' },
};

/* ── Appointment constants ── */

const APT_STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'Approved', label: 'Ожидается' },
  { value: 'Accepted', label: 'Подтверждено' },
  { value: 'Cancelled', label: 'Отменено' },
  { value: 'Done', label: 'Завершено' },
];

const APT_STATUS_TAG: Record<AppointmentStatus, { text: string; color: string }> = {
  Approved: { text: 'Ожидается', color: 'green' },
  Accepted: { text: 'Подтверждено', color: 'blue' },
  Cancelled: { text: 'Отменено', color: 'red' },
  Done: { text: 'Завершено', color: 'default' },
};

/* ── Sort options ── */

const SORT_FIELD_OPTIONS = [
  { value: 'date' as const, label: 'По дате' },
  { value: 'name' as const, label: 'По имени' },
];

const getApplicantName = (app: Application) =>
  [app.last_name, app.first_name].filter(Boolean).join(' ');

const getAppDate = (app: Application) => app.scheduled_at || app.created_at;

const getClosedReason = (app: Application): string | null => {
  if (app.status === 'rejected') return app.reject_reason;
  if (app.status === 'cancelled') return app.cancel_reason;
  if (app.status === 'expired') return 'Срок заявки истёк';
  return null;
};

const getTimeRange = (time: string) => {
  const start = dayjs(time);
  return `${start.format('HH:mm')} – ${start.add(1, 'hour').format('HH:mm')}`;
};

const getVenueDisplay = (apt: Appointment) => {
  if (apt.type === 'Online') return 'Онлайн';
  return apt.venue ? `${apt.venue} (очно)` : 'Очно';
};

const groupByDate = <T,>(
  items: T[],
  getDateStr: (item: T) => string,
): { date: string; items: T[] }[] => {
  const groups: { date: string; items: T[] }[] = [];
  let currentDate = '';
  for (const item of items) {
    const date = getDateStr(item);
    if (date !== currentDate) {
      currentDate = date;
      groups.push({ date, items: [item] });
    } else {
      groups[groups.length - 1].items.push(item);
    }
  }
  return groups;
};

const PsychologistAppointments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);
  const userId = user?.id;

  const {
    activeTab,
    appFilters,
    aptFilters,
    setActiveTab,
    setCurrentPage,
    setSortDirection,
    setSortField,
    setStatusFilter,
    setSearchQuery,
    setDateRange,
    resetFilters,
  } = useApplicationsView();

  const filters = activeTab === 'applications' ? appFilters : aptFilters;
  const { currentPage, sortDirection, sortField, statusFilter, searchQuery, dateRange } = filters;

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    sortField !== 'date' ||
    sortDirection !== 'desc' ||
    dateRange !== null;

  /* ── Applications data ── */

  const { data: allApplications = [], isLoading: isLoadingApps } = useQuery(
    applicationQueries.list(),
  );

  const acceptMutation = useMutation({
    mutationFn: (applicationId: string) => acceptApplication(applicationId, userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] }),
  });

  const relevantApplications = useMemo(() => {
    return allApplications.filter((app) => app.status === 'new' || app.assigned_to === userId);
  }, [allApplications, userId]);

  const filteredApplications = useMemo(() => {
    if (activeTab !== 'applications') return [];
    let result = relevantApplications;

    if (statusFilter === 'closed') {
      result = result.filter((a) => CLOSED_STATUSES.includes(a.status));
    } else if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => getApplicantName(a).toLowerCase().includes(q));
    }

    if (dateRange) {
      const [from, to] = dateRange;
      const fromMs = dayjs(from).startOf('day').valueOf();
      const toMs = dayjs(to).endOf('day').valueOf();
      result = result.filter((a) => {
        const t = dayjs(getAppDate(a)).valueOf();
        return t >= fromMs && t <= toMs;
      });
    }

    const dir = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'name') {
      return [...result].sort(
        (a, b) => dir * getApplicantName(a).localeCompare(getApplicantName(b), 'ru'),
      );
    }
    return [...result].sort(
      (a, b) => dir * (new Date(getAppDate(a)).getTime() - new Date(getAppDate(b)).getTime()),
    );
  }, [
    activeTab,
    relevantApplications,
    statusFilter,
    searchQuery,
    dateRange,
    sortDirection,
    sortField,
  ]);

  /* ── Appointments data ── */

  const { data: allAppointments = [], isLoading: isLoadingApts } = useQuery(
    appointmentQueries.list(),
  );

  const myAppointments = allAppointments;

  const appointmentPatientMap = useMemo(() => {
    const map = new Map<string, string>();
    allApplications.forEach((app) => {
      if (app.appointment_id) {
        map.set(app.appointment_id, getApplicantName(app));
      }
    });
    return map;
  }, [allApplications]);

  const filteredAppointments = useMemo(() => {
    if (activeTab !== 'appointments') return [];
    let result = myAppointments;

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => {
        const name = appointmentPatientMap.get(a.id) || '';
        return name.toLowerCase().includes(q);
      });
    }

    if (dateRange) {
      const [from, to] = dateRange;
      const fromMs = dayjs(from).startOf('day').valueOf();
      const toMs = dayjs(to).endOf('day').valueOf();
      result = result.filter((a) => {
        const t = dayjs(a.scheduled_time).valueOf();
        return t >= fromMs && t <= toMs;
      });
    }

    const dir = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'name') {
      return [...result].sort((a, b) => {
        const nameA = appointmentPatientMap.get(a.id) || '';
        const nameB = appointmentPatientMap.get(b.id) || '';
        return dir * nameA.localeCompare(nameB, 'ru');
      });
    }
    return [...result].sort(
      (a, b) => dir * (new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()),
    );
  }, [
    activeTab,
    myAppointments,
    appointmentPatientMap,
    statusFilter,
    searchQuery,
    dateRange,
    sortDirection,
    sortField,
  ]);

  /* ── Pagination ── */

  const currentItems = activeTab === 'applications' ? filteredApplications : filteredAppointments;

  const paginated = currentItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* ── Autocomplete suggestions ── */

  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    if (activeTab === 'applications') {
      const names = new Set(relevantApplications.map(getApplicantName));
      return [...names]
        .filter((name) => name.toLowerCase().includes(q))
        .map((name) => ({ value: name }));
    }
    const aptNames = new Set(
      myAppointments.map((a) => appointmentPatientMap.get(a.id)).filter(Boolean),
    );
    return [...aptNames]
      .filter((name) => name!.toLowerCase().includes(q))
      .map((name) => ({ value: name! }));
  }, [activeTab, relevantApplications, myAppointments, appointmentPatientMap, searchQuery]);

  const isLoading = activeTab === 'applications' ? isLoadingApps : isLoadingApts;

  if (isLoading) return <Loader />;

  const renderApplicationRow = (app: Application) => {
    const statusTag = APP_STATUS_TAG[app.status];
    const closedReason = getClosedReason(app);
    return (
      <article key={app.id} className={styles.appointmentRow} role="listitem">
        <div className={styles.timeCol}>
          {sortField === 'date'
            ? dayjs(getAppDate(app)).format('HH:mm')
            : dayjs(getAppDate(app)).format('D MMM, HH:mm')}
        </div>
        <div className={styles.infoCol}>
          <span className={styles.patientName}>{getApplicantName(app)}</span>
          <span className={styles.venue}>
            {app.problem_description.length > 80
              ? app.problem_description.slice(0, 80) + '…'
              : app.problem_description}
          </span>
          {closedReason && <span className={styles.venue}>Причина: {closedReason}</span>}
        </div>
        <div className={styles.actionsCol}>
          <Tag color={statusTag.color}>{statusTag.text}</Tag>
          {app.status === 'new' && (
            <button
              className={styles.btnConfirm}
              onClick={() => acceptMutation.mutate(app.id)}
              disabled={acceptMutation.isPending}
              aria-busy={acceptMutation.isPending}
            >
              Взять в работу
            </button>
          )}
          {app.status === 'new' && (
            <button
              className={styles.btnOpenGreen}
              onClick={() => navigate(`/cabinet/application/${app.id}`)}
            >
              Посмотреть
            </button>
          )}
          {app.status === 'in_progress' && (
            <button
              className={styles.btnOpenBlue}
              onClick={() => navigate(`/cabinet/application/${app.id}`)}
            >
              Открыть заявку
            </button>
          )}
          {app.status === 'awaiting_user_confirmation' && (
            <button
              className={styles.btnOpenGreen}
              onClick={() => navigate(`/cabinet/application/${app.id}`)}
            >
              Посмотреть
            </button>
          )}
          {(app.status === 'completed' || CLOSED_STATUSES.includes(app.status)) && (
            <button
              className={styles.btnOpenGreen}
              onClick={() => navigate(`/cabinet/application/${app.id}`)}
            >
              Посмотреть
            </button>
          )}
        </div>
      </article>
    );
  };

  const renderAppointmentRow = (apt: Appointment) => {
    const statusTag = APT_STATUS_TAG[apt.status];
    const patientName = appointmentPatientMap.get(apt.id);
    return (
      <article key={apt.id} className={styles.appointmentRow} role="listitem">
        <div className={styles.timeCol}>
          {sortField === 'date'
            ? getTimeRange(apt.scheduled_time)
            : dayjs(apt.scheduled_time).format('D MMM, HH:mm')}
        </div>
        <div className={styles.infoCol}>
          {patientName && <span className={styles.patientName}>{patientName}</span>}
          <span className={patientName ? styles.venue : styles.patientName}>
            {getVenueDisplay(apt)}
          </span>
        </div>
        <div className={styles.actionsCol}>
          <Tag color={statusTag.color}>{statusTag.text}</Tag>
          {(apt.status === 'Approved' || apt.status === 'Accepted') && (
            <button
              className={styles.btnOpenBlue}
              onClick={() => navigate(`/cabinet/appointment/${apt.id}`)}
            >
              Открыть
            </button>
          )}
          {(apt.status === 'Done' || apt.status === 'Cancelled') && (
            <button
              className={styles.btnOpenGreen}
              onClick={() => navigate(`/cabinet/appointment/${apt.id}`)}
            >
              Посмотреть
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className={styles.wrapper} aria-label="Управление записями и заявками">
      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        <button
          className={clsx(styles.tab, activeTab === 'applications' && styles.tabActive)}
          onClick={() => setActiveTab('applications')}
        >
          Заявки
        </button>
        <button
          className={clsx(styles.tab, activeTab === 'appointments' && styles.tabActive)}
          onClick={() => setActiveTab('appointments')}
        >
          Записи
        </button>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filters} role="search" aria-label="Фильтры">
        <AutoComplete
          value={searchQuery}
          options={searchSuggestions}
          onChange={(value) => setSearchQuery(value)}
          className={styles.searchInput}
        >
          <Input.Search placeholder="Поиск по ФИО" allowClear />
        </AutoComplete>
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          className={styles.filterSelect}
          options={activeTab === 'applications' ? APP_STATUS_OPTIONS : APT_STATUS_OPTIONS}
          aria-label="Статус"
        />
        <DatePicker.RangePicker
          value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
          onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0].toISOString(), dates[1].toISOString()]);
            } else {
              setDateRange(null);
            }
          }}
          format="DD.MM.YYYY"
          placeholder={['От', 'До']}
          allowClear
          className={styles.dateRangePicker}
          aria-label="Диапазон дат"
        />
        <div className={styles.sortControls}>
          <Select
            value={sortField}
            onChange={(v) => setSortField(v as SortField)}
            className={styles.sortSelect}
            options={SORT_FIELD_OPTIONS}
            aria-label="Сортировка по"
          />
          <Button
            type="text"
            icon={sortDirection === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
            className={styles.sortDirectionBtn}
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            aria-label={
              sortDirection === 'desc' ? 'Сортировка по убыванию' : 'Сортировка по возрастанию'
            }
          >
            {sortDirection === 'desc' ? 'По убыванию' : 'По возрастанию'}
          </Button>
        </div>
        {hasActiveFilters && (
          <button className={styles.resetFiltersBtn} onClick={resetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* ── List ── */}
      <div
        className={styles.list}
        role="list"
        aria-label={activeTab === 'applications' ? 'Список заявок' : 'Список записей'}
      >
        {paginated.length === 0 && (
          <Empty description={activeTab === 'applications' ? 'Заявок нет' : 'Записей нет'} />
        )}

        {activeTab === 'applications' &&
          (sortField === 'date'
            ? groupByDate(paginated as Application[], (app) =>
                dayjs(getAppDate(app)).format('D MMMM YYYY'),
              ).map((group) => (
                <div key={group.date} className={styles.dateGroup}>
                  <h3 className={styles.dateHeader}>{group.date}</h3>
                  {group.items.map(renderApplicationRow)}
                </div>
              ))
            : (paginated as Application[]).map(renderApplicationRow))}

        {activeTab === 'appointments' &&
          (sortField === 'date'
            ? groupByDate(paginated as Appointment[], (apt) =>
                dayjs(apt.scheduled_time).format('D MMMM YYYY'),
              ).map((group) => (
                <div key={group.date} className={styles.dateGroup}>
                  <h3 className={styles.dateHeader}>{group.date}</h3>
                  {group.items.map(renderAppointmentRow)}
                </div>
              ))
            : (paginated as Appointment[]).map(renderAppointmentRow))}
      </div>

      {currentItems.length > ITEMS_PER_PAGE && (
        <Pagination
          current={currentPage}
          total={currentItems.length}
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
