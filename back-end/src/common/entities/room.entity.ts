import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Message } from '../../chat/entities/message.entity';

@Entity()
export class Room {
  @Column('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  title: string;

  @ManyToMany(() => Profile, (profile) => profile.id, { cascade: true })
  @JoinTable()
  profilesRooms: Profile[];

  @ManyToOne(() => Profile, (profile) => profile.id)
  @JoinColumn()
  owner: Profile;

  @OneToMany(() => Message, (message) => message.id)
  messages: Message;
}