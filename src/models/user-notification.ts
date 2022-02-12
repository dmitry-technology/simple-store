export enum NotificationType {
    INFO = 'info',
    ERROR = 'error',
    SUCCESS = 'success'
}

export type UserNotificationMessage = {
    message: string,
    type: NotificationType
}

export const emptyMessage: UserNotificationMessage = {message: '', type: NotificationType.INFO}

