export const VISIT_TYPE = {
  WALK_IN: '1',
  APPOINTMENT: '3',
  OTC: '4',
  VIDEO_CALL: '2',
} as const;

export const VISIT_STATUS = {
    NEW: 1,
    PENDING_CONSULATION: 2,
    CONSULATION_DONE: 3,
    IN_PROGRESS: 4,
    DISPENSING: 5,
    STATUS_COMPLETED: 6,
} as const;