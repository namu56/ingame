import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1718647700144 implements MigrationInterface {
  name = 'CreateUserTable1718647700144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user (
        id              INT               NOT NULL      AUTO_INCREMENT    PRIMARY KEY                                    COMMENT 'PK',
        email           VARCHAR(50)       NOT NULL      UNIQUE                                                           COMMENT '유저 이메일', 
        password        VARCHAR(100)      NULL                                                                           COMMENT '유저 비밀번호', 
        provider        VARCHAR(50)       NULL                                                                           COMMENT 'OAuth 제공자',
        provider_id     VARCHAR(100)      NULL                                                                           COMMENT 'OAuth 제공자 id', 
        created_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6)                                     COMMENT '생성 시간',
        updated_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)      COMMENT '수정 시간'
      ) ENGINE=InnoDB;`);

    await queryRunner.query(`ALTER TABLE user COMMENT = '유저의 중요 정보를 관리하는 테이블';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user;`);
  }
}
