import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PointHistory } from '../../domain/entities/PointHistory';
import { PointHistoryRepository } from '../../domain/repositories/point-history/PointHistoryRepository';
import { PointHistorySchemaModel } from '../schemas/models/PointHistorySchemaModel';
import { PointHistoryMapper } from './mappers/PointHistoryMapper';

@Injectable()
export class PointHistoryRepositoryImpl implements PointHistoryRepository {
  public constructor(
    @InjectModel('Point-Hisotry')
    private readonly pointHistoryModel: Model<PointHistorySchemaModel>,
  ) {}

  public async save(
    userId: string,
    message: string,
    point: number,
  ): Promise<PointHistory> {
    const mappedDto: {
      user_id: string;
      message: string;
      point: number;
    } = PointHistoryMapper.mapCreateDtoToSchema({
      userId,
      message,
      point,
    });

    const newModel: any = await this.pointHistoryModel.create(mappedDto);

    const newSchemaModel: any = await newModel.save();

    return PointHistoryMapper.mapSchemaToEntity(newSchemaModel);
  }

  public async findAllByUserId(userId: string): Promise<PointHistory[]> {
    const documents: PointHistorySchemaModel[] = await this.pointHistoryModel
      .find({ id: userId })
      .lean();

    if (!documents.length) return [];

    const mappedDocuments: PointHistory[] = documents.map((e) => {
      return PointHistoryMapper.mapSchemaToEntity(e);
    });

    return mappedDocuments;
  }

  public async findAll(): Promise<PointHistory[]> {
    const documents: PointHistorySchemaModel[] = await this.pointHistoryModel
      .find()
      .lean();

    if (!documents.length) return [];

    const mappedDocuments: PointHistory[] = documents.map((e) => {
      return PointHistoryMapper.mapSchemaToEntity(e);
    });

    return mappedDocuments;
  }
}
