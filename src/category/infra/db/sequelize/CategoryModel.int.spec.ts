import { randomUUID } from 'crypto';
import { DataType } from 'sequelize-typescript';
import { setupSequelize } from '../../../../@shared/infra/testing/helpers';
import { CategoryModel } from './CategoryModel';

describe('[CategoryModel] Integration Test', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should map properties', () => {
    const map = CategoryModel.getAttributes();
    const attrs = Object.keys(map);

    expect(attrs).toStrictEqual([
      'id',
      'name',
      'description',
      'active',
      'createdAt',
    ]);

    expect(map.id).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(map.name).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(map.description).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });

    expect(map.active).toMatchObject({
      field: 'active',
      fieldName: 'active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    expect(map.createdAt).toMatchObject({
      field: 'createdAt',
      fieldName: 'createdAt',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  it('should create a record', async () => {
    const arrange = {
      id: randomUUID(),
      name: 'Movies',
      active: true,
      createdAt: new Date(),
    };
    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
