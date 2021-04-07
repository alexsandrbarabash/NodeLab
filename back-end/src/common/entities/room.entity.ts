import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  JoinTable,
} from 'typeorm';
import { Profile } from './profile.entity';
import { TypeRoom } from '../../room/room.service';

@Entity()
export class Room {
  @Column('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  typeRoom: TypeRoom.COMMENT | TypeRoom.CHAT;

  @ManyToMany(() => Profile, (profile) => profile.id, { cascade: true })
  @JoinTable()
  profilesRooms: Profile[];

  @ManyToOne(() => Profile, (profile) => profile.id, { cascade: true })
  @JoinColumn()
  owner: Profile;

  // @OneToMany(() => Message, (message) => message.id)
  // messages: Message;
}