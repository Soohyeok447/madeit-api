import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RecommendedRoutineRepository } from '../../domain/repositories/recommended-routine/RecommendedRoutineRepository';
import { CreateRecommendedRoutineDto } from '../../domain/repositories/recommended-routine/dtos/CreateRecommendedRoutineDto';
import { UpdateRecommendedRoutineDto } from '../../domain/repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { RecommendedRoutineModel } from '../../domain/models/RecommendedRoutineModel';
import { Category } from '../../domain/common/enums/Category';

@Injectable()
export class RecommendedRoutineRepositoryImpl
  implements RecommendedRoutineRepository
{
  constructor(
    @InjectModel('Recommended-Routine')
    private readonly recommendedRoutineModel: Model<RecommendedRoutineModel>,
  ) {}
  public async create(
    data: CreateRecommendedRoutineDto,
  ): Promise<RecommendedRoutineModel> {
    const newRecommendedRoutine = new this.recommendedRoutineModel(data);

    const result = await newRecommendedRoutine.save();

    return result['_doc'];
  }

  public async update(
    id: string,
    data: UpdateRecommendedRoutineDto,
  ): Promise<RecommendedRoutineModel> {
    const result = await this.recommendedRoutineModel
      .findByIdAndUpdate(
        id,
        {
          ...data,
        },
        { runValidators: true, new: true },
      )
      .populate('thumbnail_id')
      .populate('cardnews_id')
      .lean();

    return result;
  }

  public async delete(id: string): Promise<void> {
    await this.recommendedRoutineModel.findByIdAndDelete(id);
  }

  public async findAll(
    size: number,
    next?: string,
  ): Promise<RecommendedRoutineModel[]> {
    let result: RecommendedRoutineModel[];

    if (next) {
      result = await this.recommendedRoutineModel
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
      result = await this.recommendedRoutineModel
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

    return result;
  }

  public async findAllByCategory(
    category: Category,
    size: number,
    next?: string,
  ): Promise<RecommendedRoutineModel[]> {
    let result: RecommendedRoutineModel[];

    if (next) {
      result = await this.recommendedRoutineModel
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
      result = await this.recommendedRoutineModel
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

    return result;
  }

  public async findOne(id: string): Promise<RecommendedRoutineModel | null> {
    const result = await this.recommendedRoutineModel
      .findById(id)
      .populate('thumbnail_id')
      .populate('cardnews_id')
      .lean();

    if (!result) {
      return null;
    }

    return result;
  }

  public async findOneByRoutineName(
    title: string,
  ): Promise<RecommendedRoutineModel | null> {
    const result = await this.recommendedRoutineModel.findOne({ title });

    if (!result) return null;

    return result;
  }
}
