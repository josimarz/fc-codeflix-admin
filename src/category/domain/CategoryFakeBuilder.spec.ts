import { Chance } from 'chance';
import { UUID } from '../../@shared/domain/value-object/uuid';
import { CategoryFakeBuilder } from './CategoryFakeBuilder';

describe('[CategoryFakerBuilder] Unit Test', () => {
  describe('id', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should throw error when any with methods has called', () => {
      expect(() => faker.id).toThrowError(
        new Error("Property id does not have a factory, use 'with' methods"),
      );
    });

    it('should be undefined', () => {
      expect(faker['_id']).toBeUndefined();
    });

    it('withUuid', () => {
      const id = new UUID();
      const $this = faker.withUUID(id);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['id']).toBe(id);
      faker.withUUID(() => id);
      //@ts-expect-error _id is a callable
      expect(faker['_id']()).toBe(id);
      expect(faker.id).toBe(id);
    });

    it('should pass index to id factory', () => {
      let mockFactory = jest.fn(() => new UUID());
      faker.withUUID(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      const categoryId = new UUID();
      mockFactory = jest.fn(() => categoryId);
      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withUUID(mockFactory);
      fakerMany.build();
      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].id).toBe(categoryId);
      expect(fakerMany.build()[1].id).toBe(categoryId);
    });
  });

  describe('name', () => {
    const faker = CategoryFakeBuilder.aCategory();
    it('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    it('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    it('withName', () => {
      const $this = faker.withName('it name');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name']).toBe('it name');

      faker.withName(() => 'it name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('it name');

      expect(faker.name).toBe('it name');
    });

    it('should pass index to name factory', () => {
      faker.withName((index) => `it name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`it name 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `it name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`it name 0`);
      expect(categories[1].name).toBe(`it name 1`);
    });

    it('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('description prop', () => {
    const faker = CategoryFakeBuilder.aCategory();
    it('should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    it('should call the paragraph method', () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, 'paragraph');
      faker['chance'] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    it('withDescription', () => {
      const $this = faker.withDescription('it description');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_description']).toBe('it description');

      faker.withDescription(() => 'it description');
      //@ts-expect-error description is callable
      expect(faker['_description']()).toBe('it description');

      expect(faker.description).toBe('it description');
    });

    it('should pass index to description factory', () => {
      faker.withDescription((index) => `it description ${index}`);
      const category = faker.build();
      expect(category.description).toBe(`it description 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withDescription((index) => `it description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe(`it description 0`);
      expect(categories[1].description).toBe(`it description 1`);
    });
  });

  describe('active', () => {
    const faker = CategoryFakeBuilder.aCategory();
    it('should be a function', () => {
      expect(typeof faker['_active']).toBe('function');
    });

    it('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_active']).toBeTruthy();
      expect(faker.active).toBeTruthy();
    });

    it('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_active']).toBe(false);
      expect(faker.active).toBe(false);
    });
  });

  describe('createdAt', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should throw error when any with methods has called', () => {
      const fakerCategory = CategoryFakeBuilder.aCategory();
      expect(() => fakerCategory.createdAt).toThrowError(
        new Error(
          "Property createdAt does not have a factory, use 'with' methods",
        ),
      );
    });

    it('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined();
    });

    it('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_createdAt']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _createdAt is a callable
      expect(faker['_createdAt']()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    it('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  it('should create a category', () => {
    const faker = CategoryFakeBuilder.aCategory();
    let category = faker.build();

    expect(category.id).toBeInstanceOf(UUID);
    expect(typeof category.name === 'string').toBeTruthy();
    expect(typeof category.description === 'string').toBeTruthy();
    expect(category.active).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();
    const id = new UUID();
    category = faker
      .withUUID(id)
      .withName('name it')
      .withDescription('description it')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    expect(category.id.id).toBe(id.id);
    expect(category.name).toBe('name it');
    expect(category.description).toBe('description it');
    expect(category.active).toBe(false);
    expect(category.createdAt).toBe(createdAt);
  });

  it('should create many categories', () => {
    const faker = CategoryFakeBuilder.theCategories(2);
    let categories = faker.build();

    categories.forEach((category) => {
      expect(category.id).toBeInstanceOf(UUID);
      expect(typeof category.name === 'string').toBeTruthy();
      expect(typeof category.description === 'string').toBeTruthy();
      expect(category.active).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    const createdAt = new Date();
    const id = new UUID();
    categories = faker
      .withUUID(id)
      .withName('name it')
      .withDescription('description it')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    categories.forEach((category) => {
      expect(category.id.id).toBe(id.id);
      expect(category.name).toBe('name it');
      expect(category.description).toBe('description it');
      expect(category.active).toBe(false);
      expect(category.createdAt).toBe(createdAt);
    });
  });
});
