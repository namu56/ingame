import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserInfoTable1719997447877 implements MigrationInterface {
  name = 'CreateUserInfoTable1719997447877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS user_info (
          id              INT               NOT NULL      AUTO_INCREMENT    PRIMARY KEY                                    COMMENT 'PK',
          user_id         INT               NOT NULL      UNIQUE                                                           COMMENT '1:1 관계 설정된 유저의 ID', 
          nickname        VARCHAR(50)       NOT NULL      UNIQUE                                                           COMMENT '닉네임', 
          intro           VARCHAR(50)       NULL                                                                           COMMENT '자기소개',
          point           INT               NOT NULL      DEFAULT 0                                                        COMMENT '퀘스트 성공을 통해 획득한 포인트', 
          created_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6)                                     COMMENT '생성 시간',
          updated_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)      COMMENT '수정 시간',
          CONSTRAINT fk_user_info_user FOREIGN KEY (user_id) REFERENCES \`user\` (id) ON DELETE CASCADE
        ) ENGINE=InnoDB COMMENT = '유저 테이블과 1:1 관계 설정된 유저 정보 테이블';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_info DROP FOREIGN KEY fk_user_info_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_info;`);
  }
}
