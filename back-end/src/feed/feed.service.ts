import { Injectable, Options } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedService {
    

    async getAll(): Promise<string> {
        return 'Ok'
    }

    async getById(id:string): Promise<string>{
        return 'Ok'
    }

    async create(feedDto: CreateFeedDto): Promise<string> { 
        return 'Ok'
        }
    
    async remove(id: string): Promise<string>{
        return 'Ok'
    }

    async update(id: string, feedDto: UpdateFeedDto): Promise<string>{
        return 'Ok'
    }

}
