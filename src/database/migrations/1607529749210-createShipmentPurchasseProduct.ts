import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createShipmentPurchasseProduct1607529749210 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'shipmentsProducts',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'shipmentId',
          type: 'uuid',
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
          name: 'unitaryValue',
          type: 'float',
          isNullable: false
        },
        {
          name: 'amount',
          type: 'int',
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

    await queryRunner.createForeignKey('shipmentsProducts', new TableForeignKey({
      columnNames: ['shipmentId'],
      referencedTableName: 'shipments',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))

    await queryRunner.createForeignKey('shipmentsProducts', new TableForeignKey({
      columnNames: ['userId'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))

    await queryRunner.createForeignKey('shipmentsProducts', new TableForeignKey({
      columnNames: ['productId'],
      referencedTableName: 'products',
      referencedColumnNames: ['id'],
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shipmentsProducts')
  }
}
