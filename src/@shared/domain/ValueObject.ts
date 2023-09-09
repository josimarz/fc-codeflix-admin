import { isEqual } from 'lodash';

export abstract class ValueObject {
  equals(valueObject: ValueObject): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }
    if (valueObject.constructor.name !== this.constructor.name) {
      return false;
    }

    return isEqual(this, valueObject);
  }
}
