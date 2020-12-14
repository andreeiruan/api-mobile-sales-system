import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class historyBot1607897518535 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'botHistory',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'userId',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
          isNullable: false
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'now()',
          isNullable: false
        }
      ]
    }))

    await queryRunner.createForeignKey('botHistory', new TableForeignKey({
      columnNames: ['userId'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('botHistory')
  }
}
