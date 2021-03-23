import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import {User} from "./user.entity";

@Entity()
@Unique(['websocketId'])
export class WebsocketId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  websocketId: string

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;
}