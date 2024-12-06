import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'site_settings' })
export class SiteSetting {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for the setting entry using UUID.
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true }) // Unique key for the setting.
  key: string;

  @Column({ type: 'text' }) // Value associated with the setting (e.g., contact email or terms text).
  value: string;

  @Column({ type: 'varchar', length: 50, nullable: true }) // Type of setting (e.g., string, text).
  type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) // Auto-set update timestamp.
  updated_at: Date;
}
