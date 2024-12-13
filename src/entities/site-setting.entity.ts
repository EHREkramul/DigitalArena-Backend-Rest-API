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

  @Column({ type: 'varchar', length: 255, unique: true }) // Unique key for the setting (example- "ContactNo", "ContactEmail").
  key: string;

  @Column({ type: 'text' }) // Value associated with the setting (e.g., contact email or terms text).
  value: string;

  @Column({ type: 'varchar', length: 50, nullable: true }) // Type of setting (e.g., string, text).
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
