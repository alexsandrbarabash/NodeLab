import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../common/entities/room.entity';
import { Repository } from 'typeorm';
import { ProfileRoom } from '../common/entities/room-profile.entity';
import { Message } from '../common/entities/message.entity';

export interface RoomData {
  roomData: Room;
  members: ProfileRoom[];
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(ProfileRoom)
    private readonly profileRoomRepository: Repository<ProfileRoom>,
  ) {}

  getRoom(profileId: number) {
    return this.profileRoomRepository.find({
      where: { profileId },
      select: ['roomId'],
      relations: ['room'],
    });
  }

  async getRoomById(roomId: string): Promise<RoomData> {
    const roomData = await this.roomRepository.findOne(roomId, {
      relations: ['owner'],
    });

    const members = await this.profileRoomRepository.find({
      where: { roomId },
      select: ['profileId'],
      relations: ['profile'],
    });
    return { roomData, members };
  }

  async getMessage(messagesRoomId: string, take: number, skip: number) {
    return this.messageRepository.find({
      where: { messagesRoomId },
      order: {
        createAt: 'DESC',
      },
      take,
      skip,
      relations: ['profile'],
      select: ['id', 'message', 'createAt'],
    });
  }
}
