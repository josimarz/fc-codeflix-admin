import { randomUUID } from 'crypto';
import { ValueObject } from '../ValueObject';

export class UUID extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id ?? randomUUID();
    this.validate();
  }

  private validate(): void {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!regex.test(this.id)) {
      throw new InvalidUUIDError();
    }
  }
}

export class InvalidUUIDError extends Error {
  constructor(message?: string) {
    super(message ?? 'Id must be a valid UUID');
    this.name = this.constructor.name;
  }
}
