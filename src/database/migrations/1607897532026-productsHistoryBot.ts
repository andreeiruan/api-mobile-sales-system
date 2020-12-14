import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class productsHistoryBot1607897532026 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'productsBotHistory',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'historyId',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'price',
          type: 'float',
          isNullable: false
        },
        {
          name: 'freight',
          type: 'varchar'
        },
        {
          name: 'parceledOut',
          type: 'varchar'
        },
        {
          name: 'link',
          type: 'varchar',
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

    await queryRunner.createForeignKey('productsBotHistory', new TableForeignKey({
      columnNames: ['historyId'],
      referencedTableName: 'botHistory',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('productsBotHistory')
  }
}
