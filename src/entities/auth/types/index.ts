export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string;
};

export type RegistrationData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: string;
};

export type LoginData = {
  email: string;
  password: string;
};
