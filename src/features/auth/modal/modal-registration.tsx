import React, { useState, useMemo } from 'react';
import { Button, Modal, Input } from 'antd';
import MaskedInput from 'antd-mask-input';
import { useFetch } from '@/shared/api/useFetch';
import { useAuth } from '@/features/auth/api/useAuth';
import type { regData } from '@/shared/api/types';
import styles from './modal-registration.module.css';

const INITIAL_FORM_VALUE = {
  first_name: '',
  middle_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  password: '',
  confirm_password: '',
  role: '',
};

const HINTS = {
  phone_number: 'Введите номер в формате +79999999999',
  email: 'Введите вашу электронную почту в формате primer@gmail.com',
  password: 'Пароль не менее 8 символов, с цифрой, буквой и спецсимволом',
};


// Здесь тоже самое что и с modal-login.tsx 
// Заменяем any на конкретные union типы, т.к известно какие значения реально передаются

type Tprops = {
  setWindow: (param: 'log' | 'reg') => void;
  isOpen: boolean;
  setModalOpen: (param: boolean) => void;
};

const ModalRegistration: React.FC<Tprops> = ({ setWindow, isOpen, setModalOpen }) => {
  const [formValue, setFormValue] = useState({ ...INITIAL_FORM_VALUE });
  const [errors, setErrors] = useState({ ...INITIAL_FORM_VALUE });

  const resetForm = () => {
    setFormValue({ ...INITIAL_FORM_VALUE });
    setErrors({ ...INITIAL_FORM_VALUE });
  };
  const [open, setOpen] = useState(isOpen);

  //импортируем функции регистрации, изменения состояния и мидлвар
  const { registration } = useAuth();

  const { fetching, isLoading, error } = useFetch(async () => {
    const { confirm_password, ...dataForServer } = formValue;
    const res = await registration(dataForServer as regData);
  });

  //Функции для валидации полей формы

  const validateFirst_name = (name: string) =>
    /^[a-zа-я]+$/i.test(name) ? '' : 'Имя не должно содержать цифр';

  const validateMiddle_name = (name: string) =>
    /^[a-zа-я]+$/i.test(name) ? '' : 'Второе имя не должно содержать цифр';

  const validateLast_name = (name: string) =>
    /^[a-zа-я]+$/i.test(name) ? '' : 'Фамилия не должна содержать цифр';

  const validatePhone_number = (phone_number: string) => {
    const sanitizedNumber = phone_number.replace(/[^0-9+]/g, '');
    return sanitizedNumber.length === 12 && sanitizedNumber.startsWith('+7')
      ? ''
      : 'Номер телефона должен быть в формате +79999999999';
  };

  const validateEmail = (email: string) =>
    /^[\w-]+(\.[\w-]+)*@[\w-]+\.[a-z]{2,6}$/i.test(email)
      ? ''
      : 'Некорректный формат электронной почты';

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Пароль должен содержать не менее 8 символов';
    }
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну латинскую букву';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Пароль должен содержать хотя бы один специальный символ';
    }
    if (/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Пароль может содержать только латинские буквы, цифры и специальные символы';
    }
    return '';
  };

  const validateConfirm_password = (confirm_password: string) =>
    confirm_password === formValue.password ? '' : 'Пароли не совпадают';

  const validateRole = (role: string): string => {
    if (!role || role.trim() === '') {
      return 'Выберите роль';
    }

    const allowedRoles = ['Student', 'Therapist', 'Administrator', 'Stuff'];
    if (!allowedRoles.includes(role)) {
      return 'Недопустимая роль';
    }

    return '';
  };

  //Применение функций валидаций и возвращение true, если нет ошибок, иначе false

  const validateForm = () => {
    const newErrors = {
      first_name: validateFirst_name(formValue.first_name),
      middle_name: validateMiddle_name(formValue.middle_name),
      last_name: validateLast_name(formValue.last_name),
      phone_number: validatePhone_number(formValue.phone_number),
      email: validateEmail(formValue.email),
      password: validatePassword(formValue.password),
      confirm_password: validateConfirm_password(formValue.confirm_password),
      role: validateRole(formValue.role),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  //Если все правильно, то модалка закрывается

  const handleOk = async () => {
    if (!validateForm()) return;
    await fetching();
    if (error == null) {
      setOpen(false);
      setModalOpen(false);
      resetForm();
    }
  };

  //Закрытие модалки
  const handleCancel = () => {
    setOpen(false);
    setModalOpen(false);
  };

  //Функция, возвращающая true, если все поля формы заполнены (кроме middle_name),
  //иначе false (При изменении формы)
  const formComplete = useMemo(() => {
    return Object.entries(formValue).every(([key, value]) => {
      if (key === 'middle_name') return true;
      return value.trim() !== '';
    });
  }, [formValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //
    const { name, value } = e.target;
    const filteredValue =
      name === 'first_name' || name === 'last_name' || name === 'middle_name'
        ? value.replace(/[0-9\s]/g, '')
        : value;
    setFormValue((prevValues) => ({
      ...prevValues,
      [name]: filteredValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  return (
    <>
      <Modal
        open={open}
        title="Регистрация"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleOk}
            disabled={!formComplete}
          >
            Зарегистрироваться
          </Button>,
        ]}
      >
        <form className={styles.form}>
          <label>
            <span>Ваше имя</span>
            <Input
              name="first_name"
              value={formValue.first_name}
              placeholder="Введите имя"
              onChange={handleInputChange}
              aria-label="Строка для ввода имени"
            />
            {errors.first_name && <p className={styles.errorText}>{errors.first_name}</p>}
          </label>
          <label>
            <span>Второе имя (при наличии)</span>
            <Input
              name="middle_name"
              value={formValue.middle_name}
              placeholder="Введите второе имя"
              onChange={handleInputChange}
              aria-label="Строка для ввода второго имени при наличии"
            />
            {errors.middle_name && <p className={styles.errorText}>{errors.middle_name}</p>}
          </label>
          <label>
            <span>Ваше фамилия</span>
            <Input
              name="last_name"
              value={formValue.last_name}
              placeholder="Введите фамилию"
              onChange={handleInputChange}
              aria-label="Строка для ввода фамилии"
            />
            {errors.last_name && <p className={styles.errorText}>{errors.last_name}</p>}
          </label>
          <label>
            <span>Номер телефона</span>
            <MaskedInput
              name="phone_number"
              mask="+70000000000"
              onChange={handleInputChange}
              value={formValue.phone_number}
            />
            {errors.phone_number ? (
              <span className={styles.errorText}>{errors.phone_number}</span>
            ) : (
              <span className={styles.errorText}>{HINTS.phone_number}</span>
            )}
          </label>
          <label>
            <span>Электронная почта</span>
            <Input
              name="email"
              value={formValue.email}
              placeholder="primer@gmail.com"
              onChange={handleInputChange}
              aria-label="Строка для ввода электронной почты"
            />
            {errors.email ? (
              <span className={styles.errorText}>{errors.email}</span>
            ) : (
              <span className={styles.errorText}>{HINTS.email}</span>
            )}
          </label>
          <label>
            <span>Роль</span>
            <Input
              name="role"
              value={formValue.role}
              placeholder="Student"
              onChange={handleInputChange}
              aria-label="Строка для ввода роли"
            />
            {errors.role && <p className={styles.errorText}>{errors.role}</p>}
          </label>
          <label>
            <span>Пароль</span>
            <Input.Password
              name="password"
              value={formValue.password}
              placeholder="Введите пароль"
              onChange={handleInputChange}
              aria-label="Строка для ввода пароля"
            />
            {errors.password ? (
              <span className={styles.errorText}>{errors.password}</span>
            ) : (
              <span className={styles.errorText}>{HINTS.password}</span>
            )}
          </label>
          <label>
            <span>Повторите пароль</span>
            <Input.Password
              name="confirm_password"
              value={formValue.confirm_password}
              placeholder="Введите пароль ещё раз"
              onChange={handleInputChange}
              aria-label="Строка для повторного ввода пароля"
            />
            {errors.confirm_password && (
              <p className={styles.errorText}>{errors.confirm_password}</p>
            )}
          </label>
          <p>У вас уже есть учётная запись?</p>
          <Button type="default" onClick={() => setWindow('log')} className={styles.registerButton}>
            <span>Войти</span>
          </Button>
        </form>
        <p style={{ color: 'red' }}>
          {error.status === 422
            ? 'пользователь с таким email уже существует'
            : error.message !== '' && error.message}
        </p>
      </Modal>
    </>
  );
};

export default ModalRegistration;
