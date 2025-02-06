import React, { useState, useMemo } from 'react';
import { Button, Modal, Input } from 'antd';
import InputMask from 'react-input-mask';
import { ErrorText, Form } from '../../global-styles';

const INITIAL_FORM_VALUE = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type Tprops = {
  setWindow: (param: string) => any;
  isOpen: boolean;
  setModalOpen: (param: boolean) => any;
};

const ModalRegistration: React.FC<Tprops> = ({ setWindow, isOpen, setModalOpen }) => {
  const [formValue, setFormValue] = useState({ ...INITIAL_FORM_VALUE });
  const [errors, setErrors] = useState({ ...INITIAL_FORM_VALUE });

  const resetForm = () => {
    setFormValue({ ...INITIAL_FORM_VALUE });
    setErrors({ ...INITIAL_FORM_VALUE });
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);

  //Функции для валидации полей формы

  const validateFirstName = (name: string) =>
    /^[a-zа-я]+$/i.test(name) ? '' : 'Имя не должно содержать цифр';

  const validateLastName = (name: string) =>
    /^[a-zа-я]+$/i.test(name) ? '' : 'Фамилия не должна содержать цифр';

  const validatePhoneNumber = (phoneNumber: string) => {
    const sanitizedNumber = phoneNumber.replace(/[^0-9+]/g, '');
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

  const validateConfirmPassword = (confirmPassword: string) =>
    confirmPassword === formValue.password ? '' : 'Пароли не совпадают';

  //Применение функций валидаций и возвращение true, если нет ошибок, иначе false

  const validateForm = () => {
    const newErrors = {
      firstName: validateFirstName(formValue.firstName),
      lastName: validateLastName(formValue.lastName),
      phoneNumber: validatePhoneNumber(formValue.phoneNumber),
      email: validateEmail(formValue.email),
      password: validatePassword(formValue.password),
      confirmPassword: validateConfirmPassword(formValue.confirmPassword),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  //Если все правильно, то модалка закрывается

  const handleOk = () => {
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetForm();
      setOpen(false);
    }, 1000);
  };

  //Закрытие модалки
  const handleCancel = () => {
    setOpen(false);
    setModalOpen(false);
  };

  const formComplete = useMemo(() => { //Функция, возвращающая true, если все поля формы заполнены, иначе false (При изменении формы)
    return Object.values(formValue).every((value) => value.trim() !== '');
  }, [formValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { //
    const { name, value } = e.target;
    const filteredValue =
      name === 'firstName' || name === 'lastName' ? value.replace(/[0-9\s]/g, '') : value;
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
            loading={loading}
            onClick={handleOk}
            disabled={!formComplete}
          >
            Зарегистрироваться
          </Button>,
        ]}
      >
        <Form>
          <label>
            <span>Ваше имя</span>
            <Input
              name="firstName"
              value={formValue.firstName}
              placeholder="Введите имя"
              onChange={handleInputChange}
            />
            {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
          </label>
          <label>
            <span>Ваша фамилия</span>
            <Input
              name="lastName"
              value={formValue.lastName}
              placeholder="Введите фамилию"
              onChange={handleInputChange}
            />
            {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
          </label>
          <label>
            <span>Номер телефона</span>
            <InputMask
              name="phoneNumber"
              value={formValue.phoneNumber}
              mask="+79999999999"
              onChange={handleInputChange}
            >
              {<Input type="tel" placeholder="+79999999999" />}
            </InputMask>
            {errors.phoneNumber && <ErrorText>{errors.phoneNumber}</ErrorText>}
          </label>
          <label>
            <span>Электронная почта</span>
            <Input
              name="email"
              value={formValue.email}
              placeholder="primer@gmail.com"
              onChange={handleInputChange}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </label>
          <label>
            <span>Пароль</span>
            <Input.Password
              name="password"
              value={formValue.password}
              placeholder="Введите пароль"
              onChange={handleInputChange}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </label>
          <label>
            <span>Повторите пароль</span>
            <Input.Password
              name="confirmPassword"
              value={formValue.confirmPassword}
              placeholder="Введите пароль ещё раз"
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </label>
          <p>У вас уже есть учётная запись?</p>
          <Button type="default" onClick={() => setWindow('log')}> {/*При нажатии меняется модальное окно*/}
            <span> Войти</span>
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ModalRegistration;
