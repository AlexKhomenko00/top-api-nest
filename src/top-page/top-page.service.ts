import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { TopPageDto } from './dto/top-page.dto';
import { TopLevelCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: TopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({ $text: { $search: text, $caseSensitive: false } })
      .exec();
  }

  async findAll() {
    return this.topPageModel.find({}).exec();
  }

  async updateById(id: string, dto: TopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id);
  }

  async findByCategory(firstLevelCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate()
      .match({
        firstLevelCategory,
      })
      .group({
        _id: { secondLevelCategory: '$secondCategory' },
        pages: {
          $push: {
            alias: '$alias',
            title: '$title',
            _id: '$_id',
            category: '$category',
          },
        },
      })
      .exec();
  }
}
