import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, DatePicker, Empty, Input, Pagination, Select } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { Dayjs } from 'dayjs';
import clsx from 'clsx';

import {
  applicationQueries,
  applicationQueryKey,
  acceptApplication,
} from '@/entities/application/api';
import type { Application, ApplicationStatus } from '@/entities/application/types';
import { appointmentQueries } from '@/entities/appointment/api';
import type { Appointment } from '@/entities/appointment/types';
import { useAuth } from '@/features/auth/api/useAuth';
import { useApplicationsView } from '@/features/personal-cabinet/model/PsychologistAppointmentsView';
import Loader from '@/shared/ui/loader/loader';

import styles from './PsychologistAppointments.module.scss';

dayjs.locale('ru');

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

/* ── Appointment constants ── */
const APT_STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'Approved', label: 'Ожидается' },
  { value: 'Accepted', label: 'Подтверждено' },
  { value: 'Cancelled', label: 'Отменено' },
  { value: 'Done', label: 'Пройдено' },
];

/* ── Helpers ── */
const getApplicantName = (app: Application) =>
  [app.last_name, app.first_name].filter(Boolean).join(' ');

const getAppDate = (app: Application) => app.scheduled_at || app.created_at;

const getTimeRange = (time: string) => {
  const start = dayjs(time);
  return `${start.format('HH:mm')} - ${start.add(1, 'hour').format('HH:mm')}`;
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
    setStatusFilter,
    setSearchQuery,
    setDateRange,
  } = useApplicationsView();

  const filters = activeTab === 'applications' ? appFilters : aptFilters;
  const { currentPage, sortDirection, sortField, statusFilter, searchQuery, dateRange } = filters;

  /* ── Applications data (Заявки) ── */
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
    return [...result].sort(
      (a, b) => dir * (new Date(getAppDate(a)).getTime() - new Date(getAppDate(b)).getTime()),
    );
  }, [activeTab, relevantApplications, statusFilter, searchQuery, dateRange, sortDirection]);

  /* ── Appointments data (Записи) ── */
  const { data: allAppointments = [], isLoading: isLoadingApts } = useQuery(
    appointmentQueries.list(),
  );

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
    let result = allAppointments;

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
    return [...result].sort(
      (a, b) => dir * (new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()),
    );
  }, [activeTab, allAppointments, appointmentPatientMap, statusFilter, searchQuery, dateRange, sortDirection]);

  /* ── Pagination & Suggestions ── */
  const currentItems = activeTab === 'applications' ? filteredApplications : filteredAppointments;
  const paginated = currentItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    if (activeTab === 'applications') {
      const names = new Set(relevantApplications.map(getApplicantName));
      return [...names].filter((name) => name.toLowerCase().includes(q)).map((name) => ({ value: name }));
    }
    const aptNames = new Set(allAppointments.map((a) => appointmentPatientMap.get(a.id)).filter(Boolean));
    return [...aptNames].filter((name) => name!.toLowerCase().includes(q)).map((name) => ({ value: name! }));
  }, [activeTab, relevantApplications, allAppointments, appointmentPatientMap, searchQuery]);

  const isLoading = activeTab === 'applications' ? isLoadingApps : isLoadingApts;

  if (isLoading) return <Loader />;

  /* ── Render Logic ── */

  // Рендер строки Заявки (вкладка Новые)
  const renderApplicationRow = (app: Application) => {
    return (
      <article key={app.id} className={styles.appointmentRow} role="listitem">
        <div className={styles.timeCol}>
          {dayjs(getAppDate(app)).format('HH:mm')}
        </div>
        <div className={styles.infoCol}>
          <span className={styles.patientName}>{getApplicantName(app)}</span>
          <span className={styles.venue}>
            {app.problem_description.length > 80
              ? app.problem_description.slice(0, 80) + '…'
              : app.problem_description}
          </span>
        </div>
        <div className={styles.actionsCol}>
          {app.status === 'new' && (
            <button
              className={styles.btnConfirm}
              onClick={() => acceptMutation.mutate(app.id)}
              disabled={acceptMutation.isPending}
            >
              Подтвердить
            </button>
          )}
          <button
            className={styles.btnOpenOutline}
            onClick={() => navigate(`/cabinet/application/${app.id}`)}
          >
            Открыть запись
          </button>
        </div>
      </article>
    );
  };

  // Рендер строки Записи (вкладка Подтвержденные)
  const renderAppointmentRow = (apt: Appointment) => {
    const patientName = appointmentPatientMap.get(apt.id);

    // Маппинг стилей и текстов бейджей согласно макету
    const getStatusUI = (status: string) => {
      switch (status) {
        case 'Approved':
        case 'Accepted':
          return { text: 'Ожидается', className: styles.tagBlue };
        case 'Cancelled':
          return { text: 'Отменено', className: styles.tagRed };
        case 'Done':
          return { text: 'Пройдено', className: styles.tagGray };
        default:
          return { text: status, className: styles.tagGray };
      }
    };

    const statusUI = getStatusUI(apt.status);

    return (
      <article key={apt.id} className={styles.appointmentRow} role="listitem">
        <div className={styles.timeCol}>
          {getTimeRange(apt.scheduled_time)}
        </div>
        <div className={styles.infoCol}>
          {patientName && <span className={styles.patientName}>{patientName}</span>}
          <span className={styles.venue}>{getVenueDisplay(apt)}</span>
        </div>
        <div className={styles.actionsCol}>
          <span className={clsx(styles.statusTag, statusUI.className)}>
            {statusUI.text}
          </span>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate(`/cabinet/appointment/${apt.id}`)}
          >
            Открыть запись
          </button>
        </div>
      </article>
    );
  };

  return (
    <section className={styles.wrapper} aria-label="Управление записями и заявками">
      <h1 className={styles.pageTitle}>Записи</h1>

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        <button
          className={clsx(styles.tab, activeTab === 'applications' && styles.tabActive)}
          onClick={() => setActiveTab('applications')}
        >
          Новые
        </button>
        <button
          className={clsx(styles.tab, activeTab === 'appointments' && styles.tabActive)}
          onClick={() => setActiveTab('appointments')}
        >
          Подтвержденные
        </button>
      </div>

      {/* ── Filters Container ── */}
      <div className={styles.filtersContainer}>
        <div className={styles.filtersRow} role="search" aria-label="Фильтры">
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
            value={statusFilter === 'all' ? null : statusFilter}
            onChange={(v) => setStatusFilter(v || 'all')}
            className={styles.filterSelect}
            options={activeTab === 'applications' ? APP_STATUS_OPTIONS : APT_STATUS_OPTIONS}
            placeholder="Формат"
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
            placeholder={['Дата', 'Дата']}
            allowClear
            className={styles.dateRangePicker}
          />
        </div>

        {/* Сортировка по макету (кнопка под фильтрами) */}
        <button 
          className={styles.sortToggleBtn}
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          Сортировка по {sortField === 'date' ? 'дате' : 'имени'}
          {sortDirection === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
        </button>
      </div>

      {/* ── List ── */}
      <div className={styles.list} role="list">
        {paginated.length === 0 && (
          <Empty description={activeTab === 'applications' ? 'Заявок нет' : 'Записей нет'} />
        )}

        {activeTab === 'applications' &&
          groupByDate(paginated as Application[], (app) => dayjs(getAppDate(app)).format('D MMMM')).map((group) => (
            <div key={group.date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{group.date}</h3>
              {group.items.map(renderApplicationRow)}
            </div>
          ))
        }

        {activeTab === 'appointments' &&
          groupByDate(paginated as Appointment[], (apt) => dayjs(apt.scheduled_time).format('D MMMM')).map((group) => (
            <div key={group.date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{group.date}</h3>
              {group.items.map(renderAppointmentRow)}
            </div>
          ))
        }
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