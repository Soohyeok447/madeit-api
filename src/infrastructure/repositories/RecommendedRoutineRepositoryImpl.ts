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
import * as moment from 'moment';
moment.locale('ko');

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
            updated_at: moment().format(),
            ...mappedDto,
          },
          { runValidators: true, new: true },
        )
        .exists('deleted_at', false)
        .lean();

    return RecommendedRoutineMapper.mapSchemaToEntity(result);
  }

  public async delete(id: string): Promise<void> {
    await this.recommendedRoutineMongoModel.findByIdAndUpdate(id, {
      deleted_at: moment().format(),
    });
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
        .exists('deleted_at', false)
        .lean();
    } else {
      result = await this.recommendedRoutineMongoModel
        .find()
        .sort({
          _id: -1,
        })
        .limit(size)
        .exists('deleted_at', false)
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
        .exists('deleted_at', false)
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
        .exists('deleted_at', false)
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
        .exists('deleted_at', false)
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
      await this.recommendedRoutineMongoModel
        .findOne({ title })
        .exists('deleted_at', false)
        .lean();

    if (!result) return null;

    return RecommendedRoutineMapper.mapSchemaToEntity(result);
  }
}
