import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';
import { TypeRoom } from '../../room/room.service';
import { ProfileRoom } from './room-profile.entity';
import { Message } from './message.entity';
import { Post } from '../../feed/entities/post.entity';

@Entity()
export class Room {
  @Column('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  typeRoom: TypeRoom.COMMENT | TypeRoom.CHAT;

  @OneToMany(() => ProfileRoom, (profileRoom) => profileRoom.roomId)
  profilesRooms: ProfileRoom;

  @ManyToOne(() => Profile, (profile) => profile.id, { cascade: true })
  @JoinColumn()
  owner: Profile;

  @OneToMany(() => Message, (message) => message.id)
  messagesRoom: Message;

  @OneToOne(() => Post, (post) => post.id)
  comments: Post;
}