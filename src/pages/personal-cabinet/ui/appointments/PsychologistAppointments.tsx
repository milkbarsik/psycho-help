import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, DatePicker, Empty, Input, Modal, Pagination, Select } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { Dayjs } from 'dayjs';
import clsx from 'clsx';
import {
  applicationQueries,
  applicationQueryKey,
  acceptApplication,
  rejectApplication,
} from '@/entities/application/api';
import type { Application, ApplicationStatus } from '@/entities/application/types';
import { appointmentQueries } from '@/entities/appointment/api';
import type { Appointment, AppointmentStatus } from '@/entities/appointment/types';
import { useAuth } from '@/features/auth/api/useAuth';
import { useApplicationsView } from '@/features/personal-cabinet/model/PsychologistAppointmentsView';
import Loader from '@/shared/ui/loader/loader';
import styles from './PsychologistAppointments.module.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');

const MOSCOW_TZ = 'Europe/Moscow';
const toMoscow = (date: string) => dayjs(date).tz(MOSCOW_TZ);

const ITEMS_PER_PAGE = 6;

/* ── Application constants ── */
const CLOSED_STATUSES: ApplicationStatus[] = ['rejected', 'cancelled', 'expired'];

const APPLICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'awaiting_user_confirmation', label: 'Ожидает подтверждения' },
  { value: 'completed', label: 'Завершено' },
  { value: 'closed', label: 'Отменено' },
];

const APPLICATION_STATUS_TAG: Record<ApplicationStatus, { text: string; className: string }> = {
  new: { text: 'Новая', className: styles.tagBlue },
  in_progress: { text: 'В работе', className: styles.tagOrange },
  awaiting_user_confirmation: { text: 'Ожидает подтверждения', className: styles.tagGreen },
  completed: { text: 'Завершено', className: styles.tagGray },
  rejected: { text: 'Отменено', className: styles.tagRed },
  cancelled: { text: 'Отменено', className: styles.tagRed },
  expired: { text: 'Отменено', className: styles.tagRed },
};

const APPLICATION_FORMAT_OPTIONS = [
  { value: 'all', label: 'Все форматы' },
  { value: 'offline', label: 'Очно' },
  { value: 'online', label: 'Онлайн' },
  { value: 'unknown', label: 'Не указано' },
];

const APPOINTMENT_FORMAT_OPTIONS = [
  { value: 'all', label: 'Все форматы' },
  { value: 'offline', label: 'Очно' },
  { value: 'online', label: 'Онлайн' },
];

/* ── Appointment constants ── */
const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'Approved', label: 'Ожидается (не должно показываться)' }, // TODO: удалить после правки бэка
  { value: 'Accepted', label: 'Ожидается' },
  { value: 'Done', label: 'Завершено' },
  { value: 'Cancelled', label: 'Отменено' },
];

const APPOINTMENT_STATUS_TAG: Record<AppointmentStatus, { text: string; className: string }> = {
  Approved: { text: 'Ожидается (не должно показываться)', className: styles.tagRed },
  Accepted: { text: 'Ожидается', className: styles.tagGreen },
  Done: { text: 'Завершено', className: styles.tagGray },
  Cancelled: { text: 'Отменено', className: styles.tagRed },
};

/* ── Helpers ── */
const getApplicantName = (application: Application) =>
  [application.last_name, application.first_name].filter(Boolean).join(' ');

const getApplicationDate = (application: Application): string | null =>
  application.scheduled_at || application.created_at;

const getApplicationSortTime = (application: Application): number => {
  const date = getApplicationDate(application);
  return date ? new Date(date).getTime() : 0;
};

const getTimeRange = (time: string) => {
  const start = toMoscow(time);
  return `${start.format('HH:mm')} - ${start.add(1, 'hour').format('HH:mm')}`;
};

const getVenueDisplay = (appointment: Appointment) => {
  if (appointment.type === 'Online') return 'Онлайн';
  return appointment.venue ? `${appointment.venue} (очно)` : 'Очно';
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
    applicationFilters,
    appointmentFilters,
    setActiveTab,
    setCurrentPage,
    setSortDirection,
    setStatusFilter,
    setFormatFilter,
    setSearchQuery,
    setDateRange,
    resetFilters,
  } = useApplicationsView();

  const filters = activeTab === 'applications' ? applicationFilters : appointmentFilters;
  const { currentPage, sortDirection, statusFilter, formatFilter, searchQuery, dateRange } =
    filters;

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    formatFilter !== 'all' ||
    sortDirection !== 'desc' ||
    dateRange !== null;

  /* ── Applications data (Заявки) ── */
  const { data: allApplications = [], isLoading: isLoadingApplications } = useQuery(
    applicationQueries.list(),
  );

  const [rejectModalAppId, setRejectModalAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const acceptMutation = useMutation({
    mutationFn: (applicationId: string) => acceptApplication(applicationId, userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      setRejectModalAppId(null);
      setRejectReason('');
    },
  });

  const relevantApplications = useMemo(() => {
    return allApplications.filter(
      (application) => application.status === 'new' || application.assigned_to === userId,
    );
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

    if (formatFilter === 'unknown') {
      result = result.filter((a) => a.meeting_type === null);
    } else if (formatFilter !== 'all') {
      result = result.filter((a) => a.meeting_type === formatFilter);
    }

    if (dateRange) {
      const [from, to] = dateRange;
      const fromMs = dayjs(from).startOf('day').valueOf();
      const toMs = dayjs(to).endOf('day').valueOf();
      result = result.filter((a) => {
        const date = getApplicationDate(a);
        if (!date) return false;
        const t = dayjs(date).valueOf();
        return t >= fromMs && t <= toMs;
      });
    }

    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...result].sort((a, b) => {
      const tA = getApplicationSortTime(a);
      const tB = getApplicationSortTime(b);
      if (tA === 0 && tB === 0) return 0;
      if (tA === 0) return 1;
      if (tB === 0) return -1;
      return dir * (tA - tB);
    });
  }, [
    activeTab,
    relevantApplications,
    statusFilter,
    formatFilter,
    searchQuery,
    dateRange,
    sortDirection,
  ]);

  /* ── Appointments data (Записи) ── */
  const { data: allAppointments = [], isLoading: isLoadingAppointments } = useQuery(
    appointmentQueries.list(),
  );

  const appointmentPatientMap = useMemo(() => {
    const map = new Map<string, string>();
    allApplications.forEach((application) => {
      if (application.appointment_id) {
        map.set(application.appointment_id, getApplicantName(application));
      }
    });
    return map;
  }, [allApplications]);

  const filteredAppointments = useMemo(() => {
    if (activeTab !== 'appointments') return [];
    let result = allAppointments;

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (formatFilter !== 'all') {
      const appointmentType = formatFilter === 'online' ? 'Online' : 'Offline';
      result = result.filter((a) => a.type === appointmentType);
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
    return [...result].sort(
      (a, b) => dir * (new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()),
    );
  }, [
    activeTab,
    allAppointments,
    appointmentPatientMap,
    statusFilter,
    formatFilter,
    searchQuery,
    dateRange,
    sortDirection,
  ]);

  /* ── Pagination & Suggestions ── */
  const currentItems = activeTab === 'applications' ? filteredApplications : filteredAppointments;
  const paginated = currentItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    if (activeTab === 'applications') {
      const names = new Set(relevantApplications.map(getApplicantName));
      return [...names]
        .filter((name) => name.toLowerCase().includes(q))
        .map((name) => ({ value: name }));
    }
    const appointmentNames = new Set(
      allAppointments.map((a) => appointmentPatientMap.get(a.id)).filter(Boolean),
    );
    return [...appointmentNames]
      .filter((name) => name!.toLowerCase().includes(q))
      .map((name) => ({ value: name! }));
  }, [activeTab, relevantApplications, allAppointments, appointmentPatientMap, searchQuery]);

  const isLoading = activeTab === 'applications' ? isLoadingApplications : isLoadingAppointments;

  if (isLoading) return <Loader />;

  /* ── Render Logic ── */

  // Рендер строки Заявки
  const renderApplicationRow = (application: Application) => {
    const statusUI = APPLICATION_STATUS_TAG[application.status];
    const date = getApplicationDate(application);
    return (
      <article key={application.id} className={styles.appointmentRow} role="listitem">
        <div className={styles.timeCol}>{date ? toMoscow(date).format('HH:mm') : ''}</div>
        <div className={styles.infoCol}>
          <span className={styles.patientName}>{getApplicantName(application)}</span>
          <span className={styles.venue}>
            {application.problem_description.length > 80
              ? application.problem_description.slice(0, 80) + '…'
              : application.problem_description}
          </span>
        </div>
        <div className={styles.actionsCol}>
          <span className={clsx(styles.statusTag, statusUI.className)}>{statusUI.text}</span>
          {application.status === 'new' && (
            <button
              className={styles.btnConfirm}
              onClick={() => acceptMutation.mutate(application.id)}
              disabled={acceptMutation.isPending}
            >
              В работу
            </button>
          )}
          {application.status === 'in_progress' && (
            <button
              className={styles.btnCancel}
              onClick={() => setRejectModalAppId(application.id)}
            >
              Отклонить
            </button>
          )}
          <button
            className={styles.btnOpenOutline}
            onClick={() => navigate(`/cabinet/application/${application.id}`)}
          >
            Открыть
          </button>
        </div>
      </article>
    );
  };

  // Рендер строки Записи
  const renderAppointmentRow = (appointment: Appointment) => {
    const patientName = appointmentPatientMap.get(appointment.id);
    const statusUI = APPOINTMENT_STATUS_TAG[appointment.status];

    return (
      <article key={appointment.id} className={styles.appointmentRow} role="listitem">
        <div className={styles.timeCol}>{getTimeRange(appointment.scheduled_time)}</div>
        <div className={styles.infoCol}>
          {patientName && <span className={styles.patientName}>{patientName}</span>}
          <span className={styles.venue}>{getVenueDisplay(appointment)}</span>
        </div>
        <div className={styles.actionsCol}>
          <span className={clsx(styles.statusTag, statusUI.className)}>{statusUI.text}</span>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate(`/cabinet/appointment/${appointment.id}`)}
          >
            Открыть запись
          </button>
        </div>
      </article>
    );
  };

  return (
    <section className={styles.wrapper}>
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

      {/* ── Filters Container ── */}
      <div className={styles.filtersContainer}>
        <div className={styles.filtersRow} role="search">
          <AutoComplete
            value={searchQuery}
            options={searchSuggestions}
            onChange={(value) => setSearchQuery(value)}
            className={styles.searchInputWrapper}
          >
            <Input
              placeholder="Поиск по ФИО"
              suffix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
              className={styles.inputField}
            />
          </AutoComplete>

          <Select
            value={formatFilter === 'all' ? null : formatFilter}
            onChange={(v) => setFormatFilter(v || 'all')}
            className={styles.filterSelect}
            options={
              activeTab === 'applications' ? APPLICATION_FORMAT_OPTIONS : APPOINTMENT_FORMAT_OPTIONS
            }
            placeholder="Все форматы"
            allowClear
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
          />

          <Select
            value={statusFilter === 'all' ? null : statusFilter}
            onChange={(v) => setStatusFilter(v || 'all')}
            className={styles.filterSelect}
            options={
              activeTab === 'applications' ? APPLICATION_STATUS_OPTIONS : APPOINTMENT_STATUS_OPTIONS
            }
            placeholder="Все статусы"
            allowClear
          />
        </div>
        <div className={styles.sortRow}>
          {/* Сортировка */}
          <button
            className={styles.sortToggleBtn}
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            Сортировка по дате
            {sortDirection === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
          </button>

          {hasActiveFilters && (
            <button className={styles.resetFiltersBtn} onClick={resetFilters}>
              Сбросить фильтры
            </button>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div className={styles.list} role="list">
        {paginated.length === 0 && (
          <Empty description={activeTab === 'applications' ? 'Заявок нет' : 'Записей нет'} />
          // TODO: Может ракрасить получше? Но это нужно дизайнеров просить...
        )}

        {activeTab === 'applications' &&
          groupByDate(paginated as Application[], (application) => {
            const date = getApplicationDate(application);
            return date ? toMoscow(date).format('D MMMM') : 'Время не указано';
          }).map((group) => (
            <div key={group.date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{group.date}</h3>
              {group.items.map(renderApplicationRow)}
            </div>
          ))}

        {activeTab === 'appointments' &&
          groupByDate(paginated as Appointment[], (appointment) =>
            toMoscow(appointment.scheduled_time).format('D MMMM'),
          ).map((group) => (
            <div key={group.date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{group.date}</h3>
              {group.items.map(renderAppointmentRow)}
            </div>
          ))}
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

      <Modal
        title="Отклонение заявки"
        open={rejectModalAppId !== null}
        onCancel={() => {
          setRejectModalAppId(null);
          setRejectReason('');
        }}
        okText="Отклонить"
        cancelText="Отмена"
        okButtonProps={{
          danger: true,
          disabled: rejectReason.trim() === '' || rejectMutation.isPending,
          loading: rejectMutation.isPending,
        }}
        onOk={() => {
          if (rejectModalAppId && rejectReason.trim()) {
            rejectMutation.mutate({ id: rejectModalAppId, reason: rejectReason.trim() });
          }
        }}
      >
        <p>Укажите причину отклонения заявки:</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder="Причина отклонения"
        />
      </Modal>
    </section>
  );
};

export default PsychologistAppointments;
