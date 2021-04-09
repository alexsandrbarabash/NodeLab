import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from '../../feed/entities/post.entity';
import { Room } from './room.entity';
import { ProfileRoom } from './room-profile.entity';
import { Message } from '../../message/entities/message.entity';

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

  @ManyToMany(() => Post, (post) => post.id)
  like: Post[];


  @OneToMany(() => ProfileRoom, (profileRoom) => profileRoom.profileId)
  profilesRooms: ProfileRoom;

  @OneToMany(() => Room, (room) => room.id)
  owner: Room;

  @OneToMany(() => Message, (message) => message.id)
  message: Message;
}
