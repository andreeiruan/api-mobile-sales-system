import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createdeliveries1608816963756 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'deliveries',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
      },
      {
        name: 'deliveryDate',
        type: 'timestamp',
        isNullable: false
      },
      {
        name: 'deliveried',
        type: 'boolean'
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
      }]
    }))

    await queryRunner.createForeignKey('deliveries', new TableForeignKey({
      columnNames: ['saleId'],
      referencedTableName: 'sales',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('deliveries')
  }
}
