import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ApiKeyStatus } from "../../entities/api-key";

export class CreateApiKeysTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "api_keys",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "key",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "userId",
                        type: "int"
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: [ApiKeyStatus.ACTIVE, ApiKeyStatus.EXPIRED, ApiKeyStatus.REVOKED],
                        default: ApiKeyStatus.ACTIVE
                    },
                    {
                        name: "expiresAt",
                        type: "timestamp"
                    },
                    {
                        name: "permissions",
                        type: "json"
                    },
                    {
                        name: "usageCount",
                        type: "int",
                        default: 0
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("api_keys");
    }
} 