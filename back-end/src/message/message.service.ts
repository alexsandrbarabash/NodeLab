import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../common/entities/room.entity';
import { Profile } from '../common/entities/profile.entity';
import { Message } from './entities/message.entity';
import { Server } from 'socket.io';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(server: Server, createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create({ ...createMessageDto });
    await this.messageRepository.save(message);

    server
      .to(createMessageDto.roomId)
      .emit('MESSAGE:SAVE', createMessageDto.message);
  }
}
