import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Room } from './room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @Column()
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.id)
  @JoinColumn()
  profile: Profile;

  @Column()
  messagesRoomId: string;

  @ManyToOne(() => Room, (Room) => Room.id)
  @JoinColumn()
  messagesRoom: Room;
}
