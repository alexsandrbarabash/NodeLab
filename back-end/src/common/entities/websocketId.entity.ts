import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['websocketId'])
export class WebsocketId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  websocketId: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  user: number;
}
