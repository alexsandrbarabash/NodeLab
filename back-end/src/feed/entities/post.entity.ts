import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  title: string;

  @Column()
  photo: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;
}
