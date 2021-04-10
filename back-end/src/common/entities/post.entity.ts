import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Room } from './room.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  photo: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @Column({ nullable: false })
  profileId: number;

  @ManyToOne(() => Profile, { nullable: false })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Profile, (profile) => profile.id, { cascade: true })
  @JoinTable()
  like: Profile[];

  @Column()
  commentsId: string;

  @OneToOne(() => Room, (room) => room.id)
  @JoinColumn()
  comments: Room;
}
