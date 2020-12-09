import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createProducts1607521119305 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'brand',
          type: 'varchar'
        },
        {
          name: 'value',
          type: 'float',
          isNullable: false
        },
        {
          name: 'amount',
          type: 'int',
          isNullable: false
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

    await queryRunner.createForeignKey('products', new TableForeignKey({
      columnNames: ['userId'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products')
  }
}
