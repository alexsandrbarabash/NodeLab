import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Room } from '../common/entities/room.entity';
import { Profile } from '../common/entities/profile.entity';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { ProfileRoom } from '../common/entities/room-profile.entity';

export enum TypeRoom {
  CHAT = 'CHAT',
  COMMENT = 'COMMENT',
}

enum ActionRoom {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(ProfileRoom)
    private profileRoomRepository: Repository<ProfileRoom>,
  ) {}

  private addRoomToProfile(profile: Profile, room: Room) {
    const newUserInRoom = this.profileRoomRepository.create({
      profile: profile,
      room: room,
    });

    return this.profileRoomRepository.save(newUserInRoom);
  }

  private async getProfileFromSocket(
    socket: Socket,
  ): Promise<{ profile: Profile; userId: number }> {
    const { user, userId } = await this.websocketIdRepository.findOne(
      {
        websocketId: socket.id,
      },
      { relations: ['user'] },
    );

    const profile = await this.profileRepository.findOne({ user });
    return { profile, userId };
  }

  addRoomToChatList(socket: Socket, roomId: string) {
    socket.join(roomId);
  }

  async createRoom(
    server: Server,
    socket: Socket,
    createRoomDto: CreateRoomDto,
  ) {
    const { profile, userId } = await this.getProfileFromSocket(socket);

    const room = this.roomRepository.create({
      ...createRoomDto,
      owner: profile,
      id: uuidv4(),
    });

    await this.roomRepository.save(room);

    socket.join(room.id.toString());

    server
      .to(userId.toString())
      .emit('UPDATE:LIST', { id: room.id, action: ActionRoom.ADD });

    return this.addRoomToProfile(profile, room);
  }

  async deleteRoom(server: Server, socket: Socket, roomId: string) {
    const { profile, userId } = await this.getProfileFromSocket(socket);
    const room = await this.roomRepository.findOne(
      { id: roomId, owner: profile },
      { relations: ['owner', 'profilesRooms'] },
    );
    socket.leave(roomId);

    if (room.owner.id === profile.id) {
      await this.profileRoomRepository.delete({ roomId });
      await this.roomRepository.delete(room);
    }

    await this.profileRoomRepository.delete({ roomId, profileId: profile.id });
    return server
      .to(userId.toString())
      .emit('UPDATE:LIST', { id: roomId, action: ActionRoom.DELETE });
  }

  async joinRoom(server: Server, socket: Socket, roomId: string) {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (!room) {
      return;
    }

    socket.join(roomId);

    if (room.typeRoom === TypeRoom.COMMENT) {
      return;
    }

    const { profile, userId } = await this.getProfileFromSocket(socket);

    const userNeedAdd = await this.profileRoomRepository.findOne({
      profileId: profile.id,
      roomId,
    });

    if (!userNeedAdd) {
      await this.addRoomToProfile(profile, room);

      server
        .to(userId.toString())
        .emit('UPDATE:LIST', { id: roomId, action: ActionRoom.ADD });
    }
  }
}
