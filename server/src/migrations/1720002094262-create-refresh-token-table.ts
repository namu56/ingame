import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokenTable1720002094262 implements MigrationInterface {
  name = 'CreateRefreshTokenTable1720002094262';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS refresh_token (
      id              BIGINT            NOT NULL      AUTO_INCREMENT    PRIMARY KEY                                    COMMENT 'PK',
      user_id         INT               NOT NULL                                                                       COMMENT '1:N 관계 설정된 유저의 ID', 
      token           VARCHAR(500)      NOT NULL      UNIQUE                                                           COMMENT 'refresh_token', 
      created_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6)                                     COMMENT '생성 시간',
      updated_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)      COMMENT '수정 시간',
      CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES \`user\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB COMMENT = '유저 테이블과 1:N 관계 설정된 리프레쉬 토큰을 저장하고 관리하는 테이블';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE refresh_token DROP FOREIGN KEY fk_refresh_token_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS refresh_token;`);
  }
}
