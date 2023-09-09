import { UUID } from './uuid';

describe('[UUID] Unit Test', () => {
  const validateSpy = jest.spyOn(UUID.prototype as any, 'validate');

  beforeEach(() => {
    validateSpy.mockReset();
  });

  describe('constructor', () => {
    it('should throws an error due to given invalid value', () => {
      new UUID('invalid');
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a valid uuid', () => {
      const uuid = new UUID();
      expect(uuid).toBeDefined();
      expect(uuid.id).toBeDefined();
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create an UUID with the given value', () => {
      const id = 'f94a5031-1981-4922-8b78-ea613c1f84c0';
      const uuid = new UUID(id);
      expect(uuid).toBeDefined();
      expect(uuid.id).toBe(id);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
