import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Serial } from '../../domain/entities/Serial';
import { SerialRepository } from '../../domain/repositories/serial/SerialRepository';
import { SerialSchemaModel } from '../schemas/models/SerialSchemaModel';
import { SerialMapper } from './mappers/SerialMapper';

@Injectable()
export class SerialRepositoryImpl implements SerialRepository {
  public constructor(
    @InjectModel('Serial')
    private readonly serialModel: Model<SerialSchemaModel>,
  ) {}

  public async findOneByUserId(userId: string): Promise<Serial | null> {
    const serialSchemaModel: SerialSchemaModel = await this.serialModel
      .findOne({ user_id: userId })
      .lean();

    if (!serialSchemaModel) return null;

    return SerialMapper.mapSchemaToEntity(serialSchemaModel);
  }

  public async save(
    userId: string,
    email: string,
    serial: string,
  ): Promise<Serial> {
    const existModel: SerialSchemaModel = await this.serialModel
      .findOne({ user_id: userId })
      .lean();

    if (existModel) {
      await this.serialModel.deleteOne({ user_id: userId });
    }

    const mappedDto: {
      user_id: string;
      email: string;
      serial: string;
    } = SerialMapper.mapCreateDtoToSchema({
      userId,
      email,
      serial,
    });

    const newSerial: any = new this.serialModel(mappedDto);

    const serialSchemaModel: any = await newSerial.save();

    return SerialMapper.mapSchemaToEntity(serialSchemaModel);
  }

  public async deleteOneByUserId(userId: string): Promise<void> {
    await this.serialModel.deleteOne({ user_id: userId });
  }
}
