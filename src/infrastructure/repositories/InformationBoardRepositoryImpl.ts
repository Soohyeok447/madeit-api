import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InformationBoardMapper } from './mappers/InformationBoardMapper';
import { InformationBoardRepository } from '../../domain/repositories/information-board/InformationBoardRepository';
import { InformationBoardSchemaModel } from '../schemas/models/InformationBoardSchemaModel';
import { CreateBoardDto } from '../../domain/repositories/information-board/dtos/CreateBoardDto';
import { InformationBoard } from '../../domain/entities/InformationBoard';
import { UpdateBoardDto } from '../../domain/repositories/information-board/dtos/UpdateBoardDto';

@Injectable()
export class InformationBoardRepositoryImpl
  implements InformationBoardRepository
{
  public constructor(
    @InjectModel('Information-Board')
    private readonly informationBoardMongoModel: Model<InformationBoardSchemaModel>,
  ) {}
  public async create(dto: CreateBoardDto): Promise<InformationBoard> {
    const mappedDto: InformationBoardSchemaModel =
      InformationBoardMapper.mapCreateDtoToSchema(dto);

    const newInformationBoard: any = new this.informationBoardMongoModel(
      mappedDto,
    );

    const result: any = await newInformationBoard.save();

    return InformationBoardMapper.mapSchemaToEntity(result);
  }

  public async modify(
    id: string,
    dto: UpdateBoardDto,
  ): Promise<InformationBoard> {
    const mappedDto: InformationBoardSchemaModel =
      InformationBoardMapper.mapUpdateDtoToSchema(dto);

    const result: InformationBoardSchemaModel =
      await this.informationBoardMongoModel
        .findByIdAndUpdate(
          id,
          {
            ...mappedDto,
          },
          { runValidators: true, new: true },
        )
        .populate('cardnews_id')
        .lean();

    return InformationBoardMapper.mapSchemaToEntity(result);
  }

  public async delete(id: string): Promise<void> {
    await this.informationBoardMongoModel.findByIdAndDelete(id);
  }

  public async findAll(
    size: number,
    next?: string,
  ): Promise<InformationBoard[]> {
    let result: any;

    if (next) {
      result = await this.informationBoardMongoModel
        .find({
          _id: { $lt: next },
        })
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('cardnews_id')
        .lean();
    } else {
      result = await this.informationBoardMongoModel
        .find()
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('cardnews_id')
        .lean();
    }

    if (!result) {
      return [];
    }

    const recommendedRoutineEntities: InformationBoard[] = result.map((e) => {
      return InformationBoardMapper.mapSchemaToEntity(e);
    });

    return recommendedRoutineEntities;
  }

  public async findOne(id: string): Promise<InformationBoard | null> {
    const result: InformationBoardSchemaModel =
      await this.informationBoardMongoModel
        .findById(id)
        .populate('cardnews_id')
        .lean();

    if (!result) {
      return null;
    }

    return InformationBoardMapper.mapSchemaToEntity(result);
  }

  public async findOneByRoutineName(
    title: string,
  ): Promise<InformationBoard | null> {
    const result: InformationBoardSchemaModel =
      await this.informationBoardMongoModel.findOne({ title }).lean();

    if (!result) return null;

    return InformationBoardMapper.mapSchemaToEntity(result);
  }
}
