import { UUID } from '../../@shared/domain/value-object/uuid';
import { Category } from './Category';

describe('[Category] Unit Test', () => {
  const validateSpy = jest.spyOn(Category, 'validate');
  const id = new UUID('5d2d9277-d765-43cd-9d2e-a589be6277b5');
  const name = 'Soap Opera';
  const description = 'Long-running radio or television serial';
  const createdAt = new Date();

  beforeEach(() => {
    validateSpy.mockReset();
  });

  describe('constructor', () => {
    it('should create a new category with the given name', () => {
      const category = new Category({ name });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBeNull();
      expect(category.active).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a new category with given name and description', () => {
      const category = new Category({ name, description });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.active).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a new inactive category', () => {
      const category = new Category({ name, description, active: false });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.active).toBeFalsy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a new category with given creation date', () => {
      const category = new Category({ name, description, createdAt });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.active).toBeTruthy();
      expect(category.createdAt).toBe(createdAt);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should crate a new category with given id', () => {
      const category = new Category({ id, name });
      expect(category.id).toBe(id);
      expect(category.name).toBe(name);
      expect(category.description).toBeNull();
      expect(category.active).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new category with given name', () => {
      const category = Category.create({ name });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBeNull();
      expect(category.active).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a new category with given name and description', () => {
      const category = Category.create({ name, description });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.active).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a new inactive category', () => {
      const category = Category.create({ name, description, active: false });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.active).toBeFalsy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeName', () => {
    it('should change category name', () => {
      const category = new Category({ name: 'Soap Opera' });
      const name = 'Movie';
      category.changeName(name);
      expect(category.name).toBe(name);
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('changeDescription', () => {
    it('should change category description', () => {
      const category = new Category({ name });
      const description =
        'Visual art that simulates experiences and otherwise communicates ideas, stories, perceptions, feelings, beauty, or atmosphere through the use of moving images';
      category.changeDescription(description);
      expect(category.description).toBe(description);
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('should update name and description', () => {
      const category = new Category({
        name: 'TV show',
        description: 'Any content produced for viewing...',
      });
      category.update(name, description);
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('activate', () => {
    it('should activate category', () => {
      const category = new Category({ name, active: false });
      category.activate();
      expect(category.active).toBeTruthy();
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deactivate', () => {
    it('should deactivate category', () => {
      const category = new Category({ name });
      category.deactivate();
      expect(category.active).toBeFalsy();
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('toJSON', () => {
    it('should return an JSON object with category data', () => {
      const category = new Category({
        id,
        name,
        description,
        createdAt,
      });
      expect(category.toJSON()).toStrictEqual({
        id: id.id,
        name,
        description,
        active: true,
        createdAt,
      });
    });
  });
});
