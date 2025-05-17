export const AppointmentStatus = {
  BOOKED: 1,
  CHECK_IN: 2,
  CHECK_OUT: 3,
  CANCELLED: 4,
} as const;

export type AppointmentStatusType =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
