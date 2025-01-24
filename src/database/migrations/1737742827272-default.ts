import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1737742827272 implements MigrationInterface {
    name = 'Default1737742827272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerId" integer)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "price" decimal(10,2) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerId" integer, "categoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerId" integer, CONSTRAINT "FK_ffcf79002e1738147305ea57664" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_category"("id", "title", "description", "createdAt", "updatedAt", "ownerId") SELECT "id", "title", "description", "createdAt", "updatedAt", "ownerId" FROM "category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "temporary_category" RENAME TO "category"`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "price" decimal(10,2) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerId" integer, "categoryId" integer, CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "title", "description", "price", "createdAt", "updatedAt", "ownerId", "categoryId") SELECT "id", "title", "description", "price", "createdAt", "updatedAt", "ownerId", "categoryId" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "price" decimal(10,2) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerId" integer, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "product"("id", "title", "description", "price", "createdAt", "updatedAt", "ownerId", "categoryId") SELECT "id", "title", "description", "price", "createdAt", "updatedAt", "ownerId", "categoryId" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME TO "temporary_category"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerId" integer)`);
        await queryRunner.query(`INSERT INTO "category"("id", "title", "description", "createdAt", "updatedAt", "ownerId") SELECT "id", "title", "description", "createdAt", "updatedAt", "ownerId" FROM "temporary_category"`);
        await queryRunner.query(`DROP TABLE "temporary_category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
