import { Injectable, Options } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed, FeedDocument } from './schemas/feed.chema';
import { Model } from 'mongoose';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedService {
    
    constructor(@InjectModel(Feed.name) private feedModel: Model<FeedDocument>) {
    }

    async getAll(): Promise<Feed[]> {
        return this.feedModel.find().exec()
    }

    async getById(id:string): Promise<Feed>{
        return this.feedModel.findById(id)
    }

    async create(feedDto: CreateFeedDto): Promise<Feed> { 
        const newFeed = new this.feedModel(feedDto)
        return newFeed.save()
        }
    
    async remove(id: string): Promise<Feed>{
        return this.feedModel.findByIdAndRemove(id)
    }

    async update(id: string, feedDto: UpdateFeedDto): Promise<Feed>{
        return this.feedModel.findByIdAndUpdate(id, feedDto, {new: true})
    }

}
