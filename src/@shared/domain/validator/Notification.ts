export class Notification {
  private readonly errors: Map<string, string[] | string>;

  constructor() {
    this.errors = new Map();
  }

  addError(error: string, field?: string): void {
    if (!field) {
      this.errors.set(error, error);
      return;
    }
    if (!this.errors.has(field)) {
      this.errors.set(field, [error]);
      return;
    }
    const errors = this.errors.get(field) as string[];
    if (errors.indexOf(error) === -1) {
      errors.push(error);
      this.errors.set(field, errors);
    }
  }

  setError(error: string | string[], field?: string): void {
    if (field) {
      this.errors.set(field, Array.isArray(error) ? error : [error]);
      return;
    }
    if (Array.isArray(error)) {
      error.forEach((value) => this.errors.set(value, value));
      return;
    }
    this.errors.set(error, error);
  }

  hasErrors(): boolean {
    return !!this.errors.size;
  }

  copyErrors(notification: Notification): void {
    notification.errors.forEach((value, field) => this.setError(value, field));
  }

  toJSON(): Array<string | { [key: string]: string[] }> {
    const errors: Array<string | { [key: string]: string[] }> = [];
    this.errors.forEach((value, key) => {
      if (typeof value === 'string') {
        errors.push(value);
        return;
      }
      errors.push({ [key]: value });
    });
    return errors;
  }
}
