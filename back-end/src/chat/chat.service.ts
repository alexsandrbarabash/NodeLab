import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Room } from '../common/entities/room.entity';
import { Message } from './entities/message.entity';
import { Profile } from '../common/entities/profile.entity';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  public saveMessage(sendMessageDto: SendMessageDto) {}

  public addRoomToChatList(socket: Socket, roomId: string) {
    socket.join(roomId);
  }

  public async createRoom(
      server: Server,
      socket: Socket,
    createRoomDto: CreateRoomDto,


  ) {
    const { user, userId } = await this.websocketIdRepository.findOne(
      {
        websocketId: socket.id,
      },
      { relations: ['user'] },
    );

    const profile = await this.profileRepository.findOne({ user });

    const room = this.roomRepository.create({
      ...createRoomDto,
      profilesRooms: [profile],
      owner: profile,
      id: uuidv4(),
    });

    await this.roomRepository.save(room);

    socket.join(room.id.toString());
    server.to(`${userId}`).emit('UPDATE:LIST', room.id);
  }

  public async deletRoom(socket: Socket, roomId: string) {}

  public async joinRoom(server: Server, socket: Socket, roomId: string) {
    const { user, userId } = await this.websocketIdRepository.findOne(
      {
        websocketId: socket.id,
      },
      { relations: ['user'] },
    );

    // We use find because need array Profile[] in relation ManyToMany
    const profile = await this.profileRepository.findOne({ user });

    let userNeedAdd = false;

    const room = await this.roomRepository.findOne({id:roomId}, {
      relations: ['profile'],
    });

    room.profilesRooms.forEach((item) => {
      if (profile.id === item.id) {
        userNeedAdd = true;
      }
    });

    if (!userNeedAdd) {
      room.profilesRooms.push(profile);
      await this.roomRepository.save(room);

      server.to(`${userId}`).emit('UPDATE:LIST', room.id);
    }

    socket.join(roomId);
  }
}
