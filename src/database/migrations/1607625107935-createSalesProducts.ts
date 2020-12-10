import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createSalesProducts1607625107935 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'salesProducts',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'unitaryValue',
          type: 'float',
          isNullable: false
        },
        {
          name: 'discountUnitary',
          type: 'float'
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
          name: 'productId',
          type: 'uuid',
          isNullable: false
        },
        {
          name: 'saleId',
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

    await queryRunner.createForeignKey('salesProducts', new TableForeignKey({
      columnNames: ['userId'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))

    await queryRunner.createForeignKey('salesProducts', new TableForeignKey({
      columnNames: ['productId'],
      referencedTableName: 'products',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))

    await queryRunner.createForeignKey('salesProducts', new TableForeignKey({
      columnNames: ['saleId'],
      referencedTableName: 'sales',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('salesProducts')
  }
}
