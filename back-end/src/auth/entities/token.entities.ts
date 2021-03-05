import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: number;
}
