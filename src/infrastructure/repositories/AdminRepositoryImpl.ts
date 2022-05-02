import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../domain/entities/Admin';
import { HashProvider } from '../../domain/providers/HashProvider';
import { AdminRepository } from '../../domain/repositories/admin/AdminRepository';
import { AdminSchemaModel } from '../schemas/models/AdminSchemaModel';
import { AdminMapper } from './mappers/AdminMapper';

@Injectable()
export class AdminRepositoryImpl implements AdminRepository {
  public constructor(
    @InjectModel('Admin')
    private readonly adminModel: Model<AdminSchemaModel>,
    private readonly hashProvider: HashProvider,
  ) {}

  public async save(identifier: string, password: string): Promise<Admin> {
    const mappedDto: AdminSchemaModel = AdminMapper.mapCreateDtoToSchema({
      identifier,
      password: await this.hashProvider.hash(password),
    });

    const newAdmin: any = new this.adminModel(mappedDto);

    const adminSchemaModel: any = await newAdmin.save();

    return AdminMapper.mapSchemaToEntity(adminSchemaModel);
  }

  public async modifyPassword(id: string, password: string): Promise<Admin> {
    const mappedDto: AdminSchemaModel = AdminMapper.mapUpdateDtoToSchema({
      password: await this.hashProvider.hash(password),
    });

    const updatedAdmin: AdminSchemaModel = await this.adminModel
      .findByIdAndUpdate(
        id,
        { ...mappedDto },
        { runValidators: true, new: true },
      )
      .lean();

    return AdminMapper.mapSchemaToEntity(updatedAdmin);
  }

  public async findOne(id: string): Promise<Admin | null> {
    const adminSchemaModel: AdminSchemaModel = await this.adminModel
      .findById(id)
      .lean();

    if (!adminSchemaModel) {
      return null;
    }

    return AdminMapper.mapSchemaToEntity(adminSchemaModel);
  }

  public async findOneByIndentifier(identifier: string): Promise<Admin> {
    const adminSchemaModel: AdminSchemaModel = await this.adminModel
      .findOne({ identifier })
      .lean();

    if (!adminSchemaModel) {
      return null;
    }

    return AdminMapper.mapSchemaToEntity(adminSchemaModel);
  }
}
