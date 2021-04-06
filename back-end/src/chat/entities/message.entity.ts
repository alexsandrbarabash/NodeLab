import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../../common/entities/profile.entity';
import { Room } from '../../common/entities/room.entity';

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

  @ManyToOne(() => Profile, (profile) => profile.id)
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => Room, (Room) => Room.id)
  @JoinColumn()
  room: Room;
}
