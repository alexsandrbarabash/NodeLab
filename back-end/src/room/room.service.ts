import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Room } from '../common/entities/room.entity';
import { Profile } from '../common/entities/profile.entity';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';

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
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  private addRoomToProfile(profile: Profile, room: Room) {
    const myRooms = JSON.parse(profile.myRooms);

    if (myRooms) {
      myRooms.push({ id: room.id });
      profile.myRooms = JSON.stringify(myRooms);
    } else {
      profile.myRooms = JSON.stringify([{ id: room.id }]);
    }
    return this.profileRepository.save(profile);
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

  public addRoomToChatList(socket: Socket, roomId: string) {
    socket.join(roomId);
  }

  public async createRoom(
    server: Server,
    socket: Socket,
    createRoomDto: CreateRoomDto,
  ) {
    const { profile, userId } = await this.getProfileFromSocket(socket);

    const whetherAddOwner =
      createRoomDto.typeRoom === TypeRoom.CHAT ? [profile] : [];

    const room = this.roomRepository.create({
      ...createRoomDto,
      profilesRooms: whetherAddOwner,
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

  public async deleteRoom(socket: Socket, roomId: string) {
    const { profile } = await this.getProfileFromSocket(socket);
    const room = await this.roomRepository.findOne(
      { id: roomId, owner: profile },
      { relations: ['owner', 'profilesRooms'] },
    );

    if (room.owner.id !== profile.id) {
    }
  }

  public async joinRoom(socket: Socket, roomId: string) {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (!room) {
      return;
    }

    socket.join(roomId);
    if (room.typeRoom === TypeRoom.COMMENT) {
      return;
    }

    const { profile, userId } = await this.getProfileFromSocket(socket);

    let userNeedAdd = false;

    room.profilesRooms.forEach((item) => {
      if (profile.id === item.id) {
        userNeedAdd = true;
      }
    });

    if (!userNeedAdd) {
      room.profilesRooms.push(profile);

      await this.roomRepository.save(room);
      await this.addRoomToProfile(profile, room);

      socket
        .to(userId.toString())
        .emit('UPDATE:LIST', { id: roomId, action: ActionRoom.ADD });
    }
  }

  public async leftRoom(socket: Socket, roomId: string) {
    socket.leave(roomId);

    const { userId } = await this.websocketIdRepository.findOne({
      websocketId: socket.id,
    });

    socket
      .to(userId.toString())
      .emit('UPDATE:LIST', { id: roomId, action: ActionRoom.DELETE });
  }
}
