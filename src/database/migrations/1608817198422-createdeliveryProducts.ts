import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createdeliveryProducts16088117198422 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'deliveryProducts',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
      },
      {
        name: 'amount',
        type: 'int',
        isNullable: false
      },
      {
        name: 'productId',
        type: 'uuid',
        isNullable: false
      },
      {
        name: 'deliveryId',
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

    await queryRunner.createForeignKey('deliveryProducts', new TableForeignKey({
      columnNames: ['deliveryId'],
      referencedTableName: 'deliveries',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
    await queryRunner.createForeignKey('deliveryProducts', new TableForeignKey({
      columnNames: ['productId'],
      referencedTableName: 'products',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('deliveryProducts')
  }
}
