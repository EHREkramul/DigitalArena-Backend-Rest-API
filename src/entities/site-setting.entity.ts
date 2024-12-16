import { SiteSettingKey } from 'src/auth/enums/site-setting-key.enum';
import { SiteSettingType } from 'src/auth/enums/site-setting-type.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'site_settings' })
export class SiteSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SiteSettingKey, unique: true }) // Unique key for the setting (example- "ContactNo", "ContactEmail").
  key: SiteSettingKey;

  @Column({ type: 'text' }) // Value associated with the setting (e.g., contact email or terms text).
  value: string;

  @Column({ type: 'enum', enum: SiteSettingType, nullable: true }) // Type of setting (e.g., string, text).
  type: SiteSettingType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
