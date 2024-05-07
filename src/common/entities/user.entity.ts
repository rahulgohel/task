import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;
  
  @Column({ type: 'varchar', length: 50, default:false })
  is_verified: Boolean=false;
  
  @Column({ type: 'varchar', length: 50})
  otp:string;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'timestamp' })
  utctimestamp: number;
}
