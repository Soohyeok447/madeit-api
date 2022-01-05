import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Routine } from 'src/domain/routine/routine.model';
import { RoutineRepository } from 'src/domain/routine/routine.repsotiroy';
import { CreateRoutineDto } from 'src/domain/routine/common/dtos/create.dto';
import { UpdateRoutineDto } from 'src/domain/routine/common/dtos/update.dto';

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

  public async findAll(size:number, next?: string): Promise<Routine[]> {
    let result: Routine[];

    const limit = +size;

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
    
    return result;
  }

  public async findOne(id: string): Promise<Routine> {
    const result = await this.routineModel.findById(id).lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findOneByRoutineName(name: string): Promise<Routine> {
    const result = await this.routineModel.findOne({ name }).lean();

    if (!result) {
      return undefined;
    }

    return result;
  }
}
