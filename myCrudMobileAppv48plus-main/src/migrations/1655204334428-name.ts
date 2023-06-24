/**
 * See https://typeorm.io/migrations for howto on migrations
 * See https://www.sqlitetutorial.net/ for how to write sql for sqlite
 */
import { MigrationInterface, QueryRunner } from "typeorm";

export class name1655204334428 implements MigrationInterface {
    name = 'name1655204334428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        //Below commented out are for postgres
        //await queryRunner.query(`CREATE TABLE IF NOT EXISTS "transaction_entry" ("id" SERIAL NOT NULL, "txnDay" integer NOT NULL DEFAULT '14', "txnMonth" integer NOT NULL DEFAULT '5', "txnYear" integer NOT NULL DEFAULT '2022', "description" character varying NOT NULL, "amount" integer NOT NULL, "expense" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_82ce33c01f7571c2a246b06cdb3" PRIMARY KEY ("id"))`);
        //await queryRunner.query(`CREATE TABLE IF NOT EXISTS "asset_entry" ("id" SERIAL NOT NULL, "acquireDay" integer NOT NULL DEFAULT '14', "acquireMonth" integer NOT NULL DEFAULT '5', "acquireYear" integer NOT NULL DEFAULT '2022', "description" character varying NOT NULL, "value" integer NOT NULL, "tangible" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_92ce33c01f7571c2a246b06cdb4" PRIMARY KEY ("id"))`);

        //Below are for sqlite. 
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "transaction_entry" ("id" INTEGER PRIMARY KEY, "txnDay" INTEGER NOT NULL, "txnMonth" INTEGER NOT NULL, "txnYear" INTEGER NOT NULL, "description" TEXT NOT NULL, "amount" INTEGER NOT NULL, "expense" boolean NOT NULL DEFAULT true)`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "asset_entry" ("id" INTEGER PRIMARY KEY, "acquireDay" INTEGER NOT NULL, "acquireMonth" INTEGER NOT NULL, "acquireYear" INTEGER NOT NULL, "description" TEXT NOT NULL, "value" INTEGER NOT NULL, "tangible" boolean NOT NULL DEFAULT true)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction_entry"`);
        await queryRunner.query(`DROP TABLE "asset_entry"`);
    }

}
