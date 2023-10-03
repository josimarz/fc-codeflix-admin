import { Notification } from './Notification';

export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;

export interface ValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean;
}
