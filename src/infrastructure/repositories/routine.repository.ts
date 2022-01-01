import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Routine } from 'src/domain/models/routine.model';
import { RoutineRepository } from 'src/domain/repositories/routine.repsotiroy';
import { CreateRoutineDto } from 'src/domain/repositories/dto/routine/create.dto';
import { UpdateRoutineDto } from 'src/domain/repositories/dto/routine/update.dto';

@Injectable()
export class RoutineRepositoryImpl implements RoutineRepository {
  constructor(
    @InjectModel('Routine')
    private readonly routineModel: Model<Routine>,
  ) {}

  public async create(data: CreateRoutineDto): Promise<string> {
    const newRoutine = new this.routineModel(data);

    const result = await newRoutine.save();

    return result.id;
  }

  public async update(id: string, data: UpdateRoutineDto): Promise<void> {
    await this.routineModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { runValidators: true },
    );
  }

  public async delete(id: string): Promise<void> {
    await this.routineModel.findByIdAndDelete(id);
  }

  public async findAll(next?: string): Promise<{
    data: Routine[];
    paging: {
      nextCursor: string;
      hasMore: boolean;
    };
  }> {
    let result: Routine[];

    const limit = 7;

    if (next) {
      result = await this.routineModel
        .find({
          _id: { $lt: next },
        })
        .sort({
          _id: -1,
        })
        .limit(limit)
        .lean();
    } else {
      result = await this.routineModel
        .find()
        .sort({
          _id: -1,
        })
        .limit(limit)
        .lean();
    }

    //단 하나의 루틴도 못찾았을 때
    //nextCursor가 마지막 index 였을 때
    if (result.length == 0 || !result) {
      return {
        data: null,
        paging: {
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    const hasMore = result.length < limit ? false : true;

    const nextCursor = hasMore ? result[result.length - 1]['_id'] : null;

    const mappedResult: Routine[] = result.map((routine) => {
      const {
        thumbnail_url: _,
        introduction_script: __,
        introduction_image_url: ___,
        related_products: ____,
        _id: _____,
        ...others
      }: any = routine;

      return {
        id: routine['_id'],
        thumbnailUrl: routine['thumbnail_url'],
        introductionScript: routine['introduction_script'],
        introductionImageUrl: routine['introduction_image_url'],
        relatedProducts: routine['related_products'],
        ...others,
      };
    });

    return {
      data: mappedResult,
      paging: {
        hasMore,
        nextCursor,
      },
    };
  }

  public async findOne(id: string): Promise<Routine> {
    const result = await this.routineModel.findById(id).lean();

    if (!result) {
      return undefined;
    }

    const {
      thumbnail_url: _,
      introduction_script: __,
      introduction_image_url: ___,
      related_products: ____,
      _id: _____,
      ...others
    }: any = result;

    const routine: Routine = {
      id: result['_id'],
      thumbnailUrl: result['thumbnail_url'],
      introductionImageUrl: result['introduction_image_url'],
      introductionScript: result['introduction_script'],
      relatedProducts: result['related_products'],
      ...others,
    };

    return routine;
  }

  public async findOneByRoutineName(name: string): Promise<Routine> {
    const result = await this.routineModel.findOne({ name }).lean();

    if (!result) {
      return undefined;
    }

    const {
      thumbnail_url: _,
      introduction_script: __,
      introduction_image_url: ___,
      related_products: ____,
      _id: _____,
      ...others
    }: any = result;

    const routine: Routine = {
      id: result['_id'],
      thumbnailUrl: result['thumbnail_url'],
      introductionImageUrl: result['introduction_image_url'],
      introductionScript: result['introduction_script'],
      relatedProducts: result['related_products'],
      ...others,
    };

    return routine;
  }
}
