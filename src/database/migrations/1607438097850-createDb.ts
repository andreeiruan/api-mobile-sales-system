import { MigrationInterface, QueryRunner } from 'typeorm'

export class createDb1607692359548 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createDatabase('erpamb', true)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('erpamb')
  }
}
