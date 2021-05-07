import {Controller, Get, Param, Query} from '@nestjs/common';
import {ChatService, RoomData} from './chat.service';
import {ProfileRoom} from '../common/entities/room-profile.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get('/rooms/:id')
    getRoom(@Param('id') idProfile: number): Promise<ProfileRoom[]> {
        return this.chatService.getRoom(idProfile);
    }

    @Get('/room/:id')
    getRoomById(@Param('id') roomId: string): Promise<RoomData> {
        return this.chatService.getRoomById(roomId);
    }

    @Get('/messages/:id')
    getMessage(
        @Param('id') roomId: string,
        @Query() {take, skip}: { take: number; skip: number },
    ) {
        return this.chatService.getMessage(roomId, take, skip);
    }
}
