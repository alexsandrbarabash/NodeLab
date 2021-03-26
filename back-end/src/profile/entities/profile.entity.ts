import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { Post } from '../../feed/entities/post.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  aboutMe: string;

  @Column({ default: 'default.jpg' })
  photo: string;

  @OneToOne(() => User, (User) => User.id)
  @JoinColumn()
  user: number;

  @ManyToMany((type) => Post, (post) => post.id)
  like: Post[];
}
