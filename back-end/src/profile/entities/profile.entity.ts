import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  aboutMe: string;

  @Column()
  photo: string;

  @OneToOne(() => User, (User) => User.id)
  @JoinColumn()
  user: number;
}
