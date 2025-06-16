import { DataSource, QueryRunner } from 'typeorm';

export async function runInTransaction<T>(
  dataSource: DataSource,
  callback: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner);
    // Don't commit
    return result;
  } finally {
    // Always rollback after test
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  }
}