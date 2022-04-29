import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExchangeOrder } from '../../domain/entities/ExchangeOrder';
import { ExchangeOrderRepository } from '../../domain/repositories/exchange-order/ExchangeOrderRepository';
import { ExchangeOrderSchemaModel } from '../schemas/models/ExchangeOrderSchemaModel';
import { ExchangeOrderMapper } from './mappers/ExchangeOrderMapper';

@Injectable()
export class ExchangeOrderRepositoryImpl implements ExchangeOrderRepository {
  public constructor(
    @InjectModel('Exchange-Order')
    private readonly exchangeOrderModel: Model<ExchangeOrderSchemaModel>,
  ) {}

  public async findAll(): Promise<ExchangeOrder[]> {
    const exchangeOrderSchemaModels: ExchangeOrderSchemaModel[] =
      await this.exchangeOrderModel.find().lean();

    if (!exchangeOrderSchemaModels) return [];

    const exchangeOrders: ExchangeOrder[] = exchangeOrderSchemaModels.map(
      (exchangeOrderSchemaModel) => {
        return ExchangeOrderMapper.mapSchemaToEntity(exchangeOrderSchemaModel);
      },
    );

    return exchangeOrders;
  }

  public async findAllByUserId(userId: string): Promise<ExchangeOrder[]> {
    const exchangeOrderSchemaModels: ExchangeOrderSchemaModel[] =
      await this.exchangeOrderModel
        .find({
          user_id: userId,
        })
        .lean();

    if (!exchangeOrderSchemaModels) return [];

    const exchangeOrders: ExchangeOrder[] = exchangeOrderSchemaModels.map(
      (exchangeOrderSchemaModel) => {
        return ExchangeOrderMapper.mapSchemaToEntity(exchangeOrderSchemaModel);
      },
    );

    return exchangeOrders;
  }

  public async save(dto: {
    userId: string;
    amount: number;
    bank: string;
    account: string;
  }): Promise<ExchangeOrder> {
    const mappedDto: {
      user_id: string;
      amount: number;
      bank: string;
      account: string;
    } = ExchangeOrderMapper.mapCreateDtoToSchema(dto);

    const newOrder: any = new this.exchangeOrderModel(mappedDto);

    const exchangeOrderSchemaModel: any = await newOrder.save();

    return ExchangeOrderMapper.mapSchemaToEntity(exchangeOrderSchemaModel);
  }

  public async updateState(
    orderId: string,
    state: string,
  ): Promise<ExchangeOrder> {
    const mappedDto: ExchangeOrderSchemaModel =
      ExchangeOrderMapper.mapUpdateDtoToSchema({ state });

    const exchangeOrderSchemaModel: ExchangeOrderSchemaModel =
      await this.exchangeOrderModel
        .findByIdAndUpdate(
          orderId,
          {
            ...mappedDto,
          },
          { runValidators: true, new: true },
        )
        .lean();

    return ExchangeOrderMapper.mapSchemaToEntity(exchangeOrderSchemaModel);
  }
}
