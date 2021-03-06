import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  token: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;
}
