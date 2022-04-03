import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RecommendedRoutineRepository } from '../../domain/repositories/recommended-routine/RecommendedRoutineRepository';
import { CreateRecommendedRoutineDto } from '../../domain/repositories/recommended-routine/dtos/CreateRecommendedRoutineDto';
import { UpdateRecommendedRoutineDto } from '../../domain/repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { Category } from '../../domain/common/enums/Category';
import { RecommendedRoutineSchemaModel } from '../schemas/models/RecommendedRoutineSchemaModel';
import { RecommendedRoutine } from '../../domain/entities/RecommendedRoutine';
import { RecommendedRoutineMapper } from './mappers/RecommendedRoutineMapper';

@Injectable()
export class RecommendedRoutineRepositoryImpl
  implements RecommendedRoutineRepository
{
  public constructor(
    @InjectModel('Recommended-Routine')
    private readonly recommendedRoutineMongoModel: Model<RecommendedRoutineSchemaModel>,
  ) {}
  public async create(
    dto: CreateRecommendedRoutineDto,
  ): Promise<RecommendedRoutine> {
    const mappedDto: RecommendedRoutineSchemaModel =
      RecommendedRoutineMapper.mapCreateDtoToSchema(dto);

    const newRecommendedRoutine: any = new this.recommendedRoutineMongoModel(
      mappedDto,
    );

    const result: any = await newRecommendedRoutine.save();

    return RecommendedRoutineMapper.mapSchemaToEntity(result);
  }

  public async update(
    id: string,
    dto: UpdateRecommendedRoutineDto,
  ): Promise<RecommendedRoutine> {
    const mappedDto: RecommendedRoutineSchemaModel =
      RecommendedRoutineMapper.mapUpdateDtoToSchema(dto);

    const result: RecommendedRoutineSchemaModel =
      await this.recommendedRoutineMongoModel
        .findByIdAndUpdate(
          id,
          {
            ...mappedDto,
          },
          { runValidators: true, new: true },
        )
        .populate('thumbnail_id')
        .populate('cardnews_id')
        .lean();

    return RecommendedRoutineMapper.mapSchemaToEntity(result);
  }

  public async delete(id: string): Promise<void> {
    await this.recommendedRoutineMongoModel.findByIdAndDelete(id);
  }

  public async findAll(
    size: number,
    next?: string,
  ): Promise<RecommendedRoutine[]> {
    let result: any;

    if (next) {
      result = await this.recommendedRoutineMongoModel
        .find({
          _id: { $lt: next },
        })
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .populate('cardnews_id')
        .lean();
    } else {
      result = await this.recommendedRoutineMongoModel
        .find()
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .populate('cardnews_id')
        .lean();
    }

    if (!result) {
      return [];
    }

    const recommendedRoutineEntities: RecommendedRoutine[] = result.map((e) => {
      return RecommendedRoutineMapper.mapSchemaToEntity(e);
    });

    return recommendedRoutineEntities;
  }

  public async findAllByCategory(
    category: Category,
    size: number,
    next?: string,
  ): Promise<RecommendedRoutine[]> {
    let result: any;

    if (next) {
      result = await this.recommendedRoutineMongoModel
        .find({
          _id: { $lt: next },
        })
        .where('category')
        .equals(category)
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .populate('cardnews_id')
        .lean();
    } else {
      result = await this.recommendedRoutineMongoModel
        .find()
        .where('category')
        .equals(category)
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .populate('cardnews_id')
        .lean();
    }

    if (!result) {
      return [];
    }

    const recommendedRoutineEntities: RecommendedRoutine[] = result.map((e) => {
      return RecommendedRoutineMapper.mapSchemaToEntity(e);
    });

    return recommendedRoutineEntities;
  }

  public async findOne(id: string): Promise<RecommendedRoutine | null> {
    const result: RecommendedRoutineSchemaModel =
      await this.recommendedRoutineMongoModel
        .findById(id)
        .populate('thumbnail_id')
        .populate('cardnews_id')
        .lean();

    if (!result) {
      return null;
    }

    return RecommendedRoutineMapper.mapSchemaToEntity(result);
  }

  public async findOneByRoutineName(
    title: string,
  ): Promise<RecommendedRoutine | null> {
    const result: RecommendedRoutineSchemaModel =
      await this.recommendedRoutineMongoModel.findOne({ title }).lean();

    if (!result) return null;

    return RecommendedRoutineMapper.mapSchemaToEntity(result);
  }
}
