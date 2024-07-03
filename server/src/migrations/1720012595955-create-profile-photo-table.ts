import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfilePhotoTable1720012595955 implements MigrationInterface {
  name = 'CreateProfilePhotoTable1720012595955';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS profile_photo (
              id                     INT               NOT NULL      AUTO_INCREMENT    PRIMARY KEY                                    COMMENT 'PK',
              user_id                INT               NOT NULL      UNIQUE                                                           COMMENT '1:1 관계 설정된 유저의 ID', 
              profile_photo_url      VARCHAR(255)      NULL                                                                           COMMENT '프로필 사진 URL', 
              created_at             TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6)                                     COMMENT '생성 시간',
              updated_at             TIMESTAMP(6)      NOT NULL      DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)      COMMENT '수정 시간',
              CONSTRAINT fk_profile_photo_user FOREIGN KEY (user_id) REFERENCES \`user\` (id) ON DELETE CASCADE
            ) ENGINE=InnoDB COMMENT = '유저의 프로필 사진을 저장하고 관리하는 테이블';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE profile_photo DROP FOREIGN KEY fk_profile_photo_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS profile_photo;`);
  }
}
