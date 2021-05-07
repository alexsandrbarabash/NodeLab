import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';
import { Profile } from './profile.entity';

@Entity()
export class ProfileRoom {
  @Column()
  @PrimaryColumn()
  roomId: string;

  @ManyToOne(() => Room, { primary: true, cascade: true })
  @JoinColumn()
  room: Room;

  @Column()
  @PrimaryColumn()
  profileId: number;

  @ManyToOne(() => Profile, { primary: true, cascade: true })
  @JoinColumn()
  profile: Profile;
}