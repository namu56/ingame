import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuestTable1720008215507 implements MigrationInterface {
  name = 'CreateQuestTable1720008215507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS quest (
      id              BIGINT                                         NOT NULL      AUTO_INCREMENT      PRIMARY KEY     COMMENT 'PK',
      user_id         INT                                            NOT NULL                                          COMMENT '1:N 관계 설정된 유저의 ID', 
      title           VARCHAR(50)                                    NOT NULL                                          COMMENT '퀘스트 제목', 
      difficulty      ENUM('default', 'easy', 'normal', 'hard')      NOT NULL      DEFAULT 'default'                   COMMENT '퀘스트 난이도',
      mode            ENUM('main', 'sub')                            NOT NULL                                          COMMENT '퀘스트 모드',
      hidden          ENUM('true', 'false')                          NOT NULL      DEFAULT 'false'                     COMMENT '퀘스트 숨김',
      status          ENUM('completed', 'fail', 'onProgress')        NOT NULL      DEFAULT 'onProgress'                COMMENT '퀘스트 상태',
      start_date      TIMESTAMP(6)                                   NOT NULL                                          COMMENT '퀘스트 시작 날',
      end_date        TIMESTAMP(6)                                   NULL                                              COMMENT '퀘스트 끝나는 날',
      created_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6)                                     COMMENT '생성 시간',
      updated_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)      COMMENT '수정 시간',
      CONSTRAINT fk_quest_user FOREIGN KEY (user_id) REFERENCES \`user\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB COMMENT = '유저의 퀘스트 정보를 저장하고 관리하는 테이블';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE quest DROP FOREIGN KEY fk_quest_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS quest;`);
  }
}
