import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExchangeToken } from '../../domain/entities/ExchangeToken';
import { ExchangeTokenRepository } from '../../domain/repositories/exchange-token/ExchangeTokenRepository';
import { ExchangeTokenSchemaModel } from '../schemas/models/ExchangeTokenSchemaModel';
import { ExchangeTokenMapper } from './mappers/ExchangeTokenMapper';

@Injectable()
export class ExchangeTokenRepositoryImpl implements ExchangeTokenRepository {
  public constructor(
    @InjectModel('Exchange-Token')
    private readonly exchangeTokenModel: Model<ExchangeTokenSchemaModel>,
  ) {}

  public async save(userId: string, token: string): Promise<ExchangeToken> {
    const existModel: ExchangeTokenSchemaModel = await this.exchangeTokenModel
      .findOne({
        user_id: userId,
      })
      .lean();

    if (existModel) {
      await this.exchangeTokenModel.deleteOne({ user_id: userId });
    }

    const mappedDto: {
      user_id: string;
      token: string;
    } = ExchangeTokenMapper.mapCreateDtoToSchema({
      userId,
      token,
    });

    const newToken: any = new this.exchangeTokenModel(mappedDto);

    const exchangeTokenSchemaModel: any = await newToken.save();

    return ExchangeTokenMapper.mapSchemaToEntity(exchangeTokenSchemaModel);
  }

  public async findOneByUserId(userId: string): Promise<ExchangeToken | null> {
    const exchangeTokenSchemaModel: ExchangeTokenSchemaModel =
      await this.exchangeTokenModel
        .findOne({
          user_id: userId,
        })
        .lean();

    if (!exchangeTokenSchemaModel) return null;

    return ExchangeTokenMapper.mapSchemaToEntity(exchangeTokenSchemaModel);
  }

  public async deleteOneByUserId(userId: string): Promise<void> {
    await this.exchangeTokenModel.deleteOne({ user_id: userId });
  }
}
