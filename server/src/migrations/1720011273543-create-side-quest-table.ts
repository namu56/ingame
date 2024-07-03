import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSideQuestTable1720011273543 implements MigrationInterface {
  name = 'CreateSideQuestTable1720011273543';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS side_quest (
      id              BIGINT                                         NOT NULL      AUTO_INCREMENT      PRIMARY KEY     COMMENT 'PK',
      quest_id        BIGINT                                         NOT NULL                                          COMMENT '1:N 관계 설정된 퀘스트의 ID', 
      content         VARCHAR(50)                                    NOT NULL                                          COMMENT '퀘스트 내용',
      status          ENUM('completed', 'fail', 'onProgress')        NOT NULL      DEFAULT 'onProgress'                COMMENT '퀘스트 상태',
      created_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6)                                     COMMENT '생성 시간',
      updated_at      TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)      COMMENT '수정 시간',
      CONSTRAINT fk_side_quest_quest FOREIGN KEY (quest_id) REFERENCES \`quest\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB COMMENT = '퀘스트의 사이드 퀘스트 정보를 저장하고 관리하는 테이블';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE side_quest DROP FOREIGN KEY fk_side_quest_quest;`);
    await queryRunner.query(`DROP TABLE IF EXISTS side_quest;`);
  }
}
