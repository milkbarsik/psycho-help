export type TTest = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  imageSrc?: string | null;
  questionsCount?: number | null;
  durationMinutes?: number | null;
};
