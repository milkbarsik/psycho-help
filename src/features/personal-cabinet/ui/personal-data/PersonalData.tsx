import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from 'react';
import type { FC } from 'react';
import { UserOutlined, EyeOutlined, EyeInvisibleOutlined, DownOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { useAuth } from '@/features/auth/api/useAuth';
import AuthApi from '@/features/auth/api/auth-api';
import EditIcon from '@/shared/assets/images/cabinet/edit.svg?react';
import ExitIcon from '@/shared/assets/images/cabinet/exit.svg?react';
import type { User } from '@/shared/api/types';
import styles from './PersonalData.module.scss';

interface PersonalDataProps {
  user: User | null;
}

interface FormData {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  email: string;
  status: 'student' | 'teacher' | 'admin';
  study_group: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  study_group?: string;
  status?: string;
}

interface SelectOption {
  value: 'student' | 'teacher' | 'admin';
  label: string;
}

const statusOptions: SelectOption[] = [
  { value: 'student', label: 'Студент' },
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'admin', label: 'Администратор' },
];

// Кастомный селект компонент
const CustomSelect: FC<{
  value: 'student' | 'teacher' | 'admin';
  onChange: (value: 'student' | 'teacher' | 'admin') => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = statusOptions.find((opt) => opt.value === value);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
    setIsFocused(!isFocused);
  }, [isOpen, isFocused]);

  const handleSelect = useCallback(
    (optionValue: 'student' | 'teacher' | 'admin') => {
      onChange(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    },
    [onChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside as unknown as EventListener);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside as unknown as EventListener);
    };
  }, [isOpen]);

  return (
    <div className={styles.customSelectWrapper} ref={selectRef}>
      <button
        type="button"
        className={`${styles.customSelect} ${isFocused ? styles.focused : ''}`}
        onClick={handleToggle}
        aria-label={label}
      >
        <span className={styles.selectValue}>{selectedOption?.label}</span>
        <DownOutlined className={`${styles.selectArrow} ${isOpen ? styles.open : ''}`} />
      </button>
      {isOpen && (
        <div className={styles.selectDropdown}>
          {statusOptions.map((option) => (
            <div
              key={option.value}
              className={`${styles.selectOption} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PersonalData: FC<PersonalDataProps> = ({ user }) => {
  const { logOut, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [isEditingName, setIsEditingName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar_url || null);

  const [originalData, setOriginalData] = useState<FormData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    middle_name: user?.middle_name || '',
    phone_number: user?.phone_number || '',
    email: user?.email || '',
    status: user?.status || 'student',
    study_group: user?.study_group || '',
  });

  const [formData, setFormData] = useState<FormData>(originalData);

  const [errors, setErrors] = useState<FormErrors>({});

  const [nameErrors, setNameErrors] = useState<{
    first_name?: string;
    last_name?: string;
    middle_name?: string;
  }>({});

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData) || avatar !== user?.avatar_url;
  }, [formData, originalData, avatar, user]);

  useEffect(() => {
    const newOriginalData: FormData = {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      middle_name: user?.middle_name || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      status: user?.status || 'student',
      study_group: user?.study_group || '',
    };
    setOriginalData(newOriginalData);
    setFormData(newOriginalData);
  }, [user]);

  const validateField = useCallback(
    (name: keyof FormData, value: string): string | undefined => {
      switch (name) {
        case 'first_name':
        case 'last_name':
          if (!value.trim()) return 'Обязательное поле';
          if (value.length < 2) return 'Минимум 2 символа';
          if (!/^[а-яА-ЯёЁa-zA-Z-]+$/.test(value)) return 'Только буквы и дефис';
          break;
        case 'email':
          if (!value.trim()) return 'Обязательное поле';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Некорректный email';
          break;
        case 'phone_number':
          if (!value.trim()) return 'Обязательное поле';
          if (!/^\+?[\d\s()-]{10,}$/.test(value)) return 'Некорректный номер телефона';
          break;
        case 'study_group':
          if (formData.status === 'student' && !value.trim())
            return 'Обязательное поле для студентов';
          break;
      }
      return undefined;
    },
    [formData.status],
  );

  const validateNameField = useCallback(
    (name: 'first_name' | 'last_name' | 'middle_name', value: string): string | undefined => {
      switch (name) {
        case 'first_name':
        case 'last_name':
          if (!value.trim()) return 'Обязательное поле';
          if (value.trim() && value.length < 2) return 'Минимум 2 символа';
          if (value.trim() && !/^[а-яА-ЯёЁa-zA-Z-]+$/.test(value)) return 'Только буквы и дефис';
          break;
        case 'middle_name':
          if (value.trim() && !/^[а-яА-ЯёЁa-zA-Z-]+$/.test(value)) return 'Только буквы и дефис';
          break;
      }
      return undefined;
    },
    [],
  );

  const handleNameInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      const error = validateNameField(name as 'first_name' | 'last_name' | 'middle_name', value);
      setNameErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateNameField],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField],
  );

  const handleStatusChange = useCallback((value: 'student' | 'teacher' | 'admin') => {
    setFormData((prev) => ({ ...prev, status: value }));
  }, []);

  const handleNameEdit = useCallback(() => {
    setIsEditingName(!isEditingName);
  }, [isEditingName]);

  const validateNameFields = useCallback((): boolean => {
    const newErrors: { first_name?: string; last_name?: string; middle_name?: string } = {};
    let isValid = true;

    const firstNameError = validateNameField('first_name', formData.first_name);
    if (firstNameError) {
      newErrors.first_name = firstNameError;
      isValid = false;
    }

    const lastNameError = validateNameField('last_name', formData.last_name);
    if (lastNameError) {
      newErrors.last_name = lastNameError;
      isValid = false;
    }

    const middleNameError = validateNameField('middle_name', formData.middle_name);
    if (middleNameError) {
      newErrors.middle_name = middleNameError;
      isValid = false;
    }

    setNameErrors(newErrors);
    return isValid;
  }, [formData, validateNameField]);

  const handleSaveName = useCallback(async () => {
    if (!validateNameFields()) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await AuthApi.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        phone_number: formData.phone_number,
        email: formData.email,
        status: formData.status,
        study_group: formData.study_group,
      });
      setOriginalData(formData);
      setIsEditingName(false);
      setNameErrors({});
      setUser(res.data);
      messageApi.success('ФИО сохранено');
    } catch (error) {
      console.error('Failed to update name:', error);
      messageApi.error('Не удалось сохранить ФИО');
    } finally {
      setIsSaving(false);
    }
  }, [formData, validateNameFields, messageApi, setUser]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== 'middle_name') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!validateForm()) return;

      setIsSaving(true);
      try {
        const res = await AuthApi.updateProfile({
          first_name: formData.first_name,
          last_name: formData.last_name,
          middle_name: formData.middle_name,
          phone_number: formData.phone_number,
          email: formData.email,
          status: formData.status,
          study_group: formData.study_group,
        });
        setOriginalData(formData);
        setIsEditingName(false);
        setUser(res.data);
        messageApi.success('Изменения сохранены');
      } catch (error) {
        console.error('Failed to update profile:', error);
        messageApi.error('Не удалось сохранить изменения');
      } finally {
        setIsSaving(false);
      }
    },
    [formData, validateForm, messageApi, setUser],
  );

  const handleLogout = useCallback(async () => {
    if (hasUnsavedChanges()) {
      Modal.confirm({
        title: 'У вас есть несохранённые изменения',
        content: 'Хотите сохранить изменения перед выходом?',
        okText: 'Сохранить и выйти',
        cancelText: 'Выйти без сохранения',
        onOk: async () => {
          await handleSubmit();
          await logOut();
        },
        onCancel: async () => {
          await logOut();
        },
      });
    } else {
      try {
        await logOut();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }, [logOut, handleSubmit, hasUnsavedChanges]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {contextHolder}
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          {avatar ? (
            <img src={avatar} alt="Аватар пользователя" />
          ) : (
            <UserOutlined className={styles.avatarIcon} />
          )}
        </div>
        <div className={styles.avatarUpload}>
          <EditIcon />
          <label htmlFor="avatar-upload">Изменить фотографию</label>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          id="avatar-upload"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
      </div>

      <div className={styles.profileSection}>
        <div className={styles.header}>
          <div className={styles.nameWrapper}>
            {isEditingName ? (
              <div className={styles.nameEditContainer}>
                <div className={styles.nameFieldsRow}>
                  <div className={styles.nameInputWrapper}>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleNameInputChange}
                      placeholder="Фамилия"
                      aria-label="Фамилия"
                      className={nameErrors.last_name ? styles.inputError : ''}
                    />
                    {nameErrors.last_name && (
                      <span className={styles.nameErrorText}>{nameErrors.last_name}</span>
                    )}
                  </div>
                  <div className={styles.nameInputWrapper}>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleNameInputChange}
                      placeholder="Имя"
                      aria-label="Имя"
                      className={nameErrors.first_name ? styles.inputError : ''}
                    />
                    {nameErrors.first_name && (
                      <span className={styles.nameErrorText}>{nameErrors.first_name}</span>
                    )}
                  </div>
                  <div className={styles.nameInputWrapper}>
                    <input
                      type="text"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleNameInputChange}
                      placeholder="Отчество"
                      aria-label="Отчество"
                      className={nameErrors.middle_name ? styles.inputError : ''}
                    />
                    {nameErrors.middle_name && (
                      <span className={styles.nameErrorText}>{nameErrors.middle_name}</span>
                    )}
                  </div>
                </div>
                <div className={styles.nameActions}>
                  <button
                    type="button"
                    className={styles.saveNameButton}
                    onClick={handleSaveName}
                    aria-label="Сохранить имя"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelNameButton}
                    onClick={() => {
                      setIsEditingName(false);
                      setFormData(originalData);
                      setNameErrors({});
                    }}
                    aria-label="Отмена"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <h2 className={styles.name}>
                {formData.last_name} {formData.first_name} {formData.middle_name}
              </h2>
            )}
            {!isEditingName && (
              <button
                type="button"
                className={styles.editButton}
                onClick={handleNameEdit}
                aria-label={isEditingName ? 'Сохранить имя' : 'Редактировать имя'}
              >
                <EditIcon />
              </button>
            )}
          </div>
        </div>

        <div className={styles.fieldsGrid}>
          <div className={styles.field}>
            <label>Ваш статус</label>
            <CustomSelect
              value={formData.status}
              onChange={handleStatusChange}
              label="Ваш статус"
            />
          </div>

          {formData.status === 'student' && (
            <div className={styles.field}>
              <label htmlFor="study_group">Учебная группа</label>
              <div className={styles.editableField}>
                <input
                  type="text"
                  id="study_group"
                  name="study_group"
                  value={formData.study_group}
                  onChange={handleInputChange}
                  placeholder="Введите номер группы"
                  aria-invalid={!!errors.study_group}
                />
                <button type="button" className={styles.editButton} aria-label="Редактировать">
                  <EditIcon />
                </button>
              </div>
              {errors.study_group && <span className={styles.errorText}>{errors.study_group}</span>}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="phone_number">Номер телефона</label>
            <div className={styles.editableField}>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+7 (999) 123-45-67"
                aria-invalid={!!errors.phone_number}
              />
              <button type="button" className={styles.editButton} aria-label="Редактировать">
                <EditIcon />
              </button>
            </div>
            {errors.phone_number && <span className={styles.errorText}>{errors.phone_number}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Электронная почта</label>
            <div className={styles.editableField}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.ru"
                aria-invalid={!!errors.email}
              />
              <button type="button" className={styles.editButton} aria-label="Редактировать">
                <EditIcon />
              </button>
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Пароль</label>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Введите новый пароль"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {!showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
            <button type="button" className={styles.changePasswordLink}>
              Сменить пароль?
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={isSaving}
          >
            <ExitIcon />
            {isSaving ? 'Сохранение...' : 'Выйти'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalData;
