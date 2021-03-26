import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';

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
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: number;

  @ManyToMany((type) => Profile, (profile) => profile.id, { cascade: true })
  @JoinTable()
  like: Profile[];
}
