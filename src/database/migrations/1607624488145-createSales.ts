import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createSales1607624488145 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'sales',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'payDate',
          type: 'timestamp',
          isNullable: false
        },
        {
          name: 'saleTotal',
          type: 'float',
          isNullable: false
        },
        {
          name: 'discount',
          type: 'float'
        },
        {
          name: 'confirmPay',
          type: 'boolean'
        },
        {
          name: 'partialPayment',
          type: 'boolean',
          isNullable: false
        },
        {
          name: 'amountPaid',
          type: 'float',
          isNullable: true
        },
        {
          name: 'remainingAmount',
          type: 'float',
          isNullable: true
        },
        {
          name: 'nameCliente',
          type: 'varchar'
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

    await queryRunner.createForeignKey('sales', new TableForeignKey({
      columnNames: ['userId'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales')
  }
}
