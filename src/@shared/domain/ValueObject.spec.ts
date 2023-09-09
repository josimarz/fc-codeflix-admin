import { ValueObject } from './ValueObject';

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    readonly name: string,
    readonly age: number,
  ) {
    super();
  }
}

describe('[ValueObject] Unit Test', () => {
  describe('equals', () => {
    it('should be equals', () => {
      const stringValue1 = new StringValueObject('string value');
      const stringValue2 = new StringValueObject('string value');
      expect(stringValue1.equals(stringValue2)).toBeTruthy();

      const complexValue1 = new ComplexValueObject('Josimar', 37);
      const complexValue2 = new ComplexValueObject('Josimar', 37);
      expect(complexValue1.equals(complexValue2)).toBeTruthy();
    });

    it('should not be equals', () => {
      const stringValue1 = new StringValueObject('string value');
      const stringValue2 = new StringValueObject('different value');
      expect(stringValue1.equals(stringValue2)).toBeFalsy();

      const complexValue1 = new ComplexValueObject('Josimar', 37);
      const complexValue2 = new ComplexValueObject('Pacheco', 37);
      expect(complexValue1.equals(complexValue2)).toBeFalsy();
    });

    it('should not be equals due given null value object', () => {
      const stringValue1 = new StringValueObject('string value');
      const stringValue2 = null;
      expect(stringValue1.equals(stringValue2)).toBeFalsy();
    });

    it('should not be equals due given undefined value object', () => {
      const stringValue1 = new StringValueObject('string value');
      let stringValue2: StringValueObject;
      expect(stringValue1.equals(stringValue2)).toBeFalsy();
    });
  });
});
