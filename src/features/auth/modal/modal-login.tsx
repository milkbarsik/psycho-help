import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import styles from './modal-login.module.css';
import { useAuth } from '@/features/auth/api/useAuth';
import { useFetch } from '@/shared/api/useFetch';

const INITIAL_FORM_VALUE = {
  email: '',
  password: '',
};

/*
Тип пропсов для модального окна входа:
- "setWindow" — функция для переключения окна модалки (вход/регистрация)
- "isOpen" — булевый флаг, открыто ли модальное окно
- "setModalOpen" — функция для закрытия или открытия модального окна

Здесь использовалось "any" для функций, чтобы не писать типы, но это убрано, 
так как сейчас известно, какие значения реально передаются:

- setWindow принимает только 'login' или 'reg'
- setModalOpen принимает только булевое значение

Если в будущем появятся новые состояния модалки (например "forgot"), 
можно расширить тип union или же его вынести в отдельный файл:

type TProps = {
  setWindow: (param: 'login' | 'reg' | 'forgot') => void;
  isOpen: boolean;
  setModalOpen: (param: boolean) => void;
};
*/

type Tprops = {
  setWindow: (param: 'login' | 'reg') => void;
  isOpen: boolean;
  setModalOpen: (param: boolean) => void;
};

const EMAIL_HINT = 'Введите вашу электронную почту в формате primer@gmail.com';

const EMAIL_HINT = 'Введите вашу электронную почту в формате primer@gmail.com';

const ModalLogin: React.FC<Tprops> = ({ setWindow, isOpen, setModalOpen }) => {
  const [formValue, setFormValue] = useState({ ...INITIAL_FORM_VALUE });
  const [errors, setErrors] = useState({ ...INITIAL_FORM_VALUE });
  const [open, setOpen] = useState(isOpen);
  // const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  const { fetching, isLoading, error } = useFetch(async () => {
    const { email, password } = { ...formValue };
    const res = await login(email, password);
  });

  const validateEmail = (email: string) =>
    /^[\w-]+(\.[\w-]+)*@[\w-]+\.[a-z]{2,6}$/i.test(email)
      ? ''
      : 'Некорректный формат электронной почты';

  const validatePassword = (password: string) => (password ? '' : 'Пароль не может быть пустым');

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formValue.email),
      password: validatePassword(formValue.password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleOk = async () => {
    if (!validateForm()) return;
    await fetching();
    if (error == null) {
      setOpen(false);
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevValues) => ({
      ...prevValues,
      [name]: value,
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
        title="Вход"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={isLoading} onClick={handleOk}>
            Войти
          </Button>,
        ]}
      >
        <form className={styles.form}>
          <label>
            <span>Электронная почта</span>
            <Input
              name="email"
              value={formValue.email}
              placeholder="primer@gmail.com"
              onChange={handleInputChange}
              aria-details="Строка для ввода электронной почты"
            />
            {errors.email ? (
              <span className={styles.errorText}>{errors.email}</span>
            ) : (
              <span className={styles.hintText}>
                {'Введите вашу электронную почту в формате primer@gmail.com'}
              </span>
            )}
          </label>
          <label>
            <span>Пароль</span>
            <Input.Password
              name="password"
              value={formValue.password}
              placeholder="Введите пароль"
              onChange={handleInputChange}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </label>
          {/* <Checkbox
            style={{ display: 'flex' }}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Запомнить меня
          </Checkbox> */}
          <p>
            <a href="/forgot-password">Забыли пароль?</a>
          </p>
          <p>У вас еще нет учетной записи?</p>
          <Button type="default" onClick={() => setWindow('reg')} className={styles.registerButton}>
            <span>Регистрация</span>
          </Button>
        </form>
        <p style={{ color: 'red' }}>
          {error.status === 401
            ? 'Неверный логин или пароль'
            : error.message !== '' && error.message}
        </p>
      </Modal>
    </>
  );
};

export default ModalLogin;
