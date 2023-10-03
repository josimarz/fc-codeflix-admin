import { UseCase } from '../../../@shared/application/UseCase';
import { UUID } from '../../../@shared/domain/value-object/uuid';
import { CategoryRepository } from '../../domain/CategoryRepository';

export type DeleteCategoryInput = {
  readonly id: string;
};

export type DeleteCategoryOutput = void;

export class DeleteCategoryUseCase
  implements UseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    await this.repository.delete(new UUID(input.id));
  }
}
