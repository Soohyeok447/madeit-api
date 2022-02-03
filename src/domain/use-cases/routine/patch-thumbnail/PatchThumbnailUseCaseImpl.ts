import { Injectable } from "@nestjs/common";
import { PatchThumbnailResponse } from "../response.index";
import { UserCommonService } from "../../user/service/UserCommonService";
import { PatchThumbnailUseCaseParams } from "./dtos/PatchThumbnailUseCaseParams";
import { PatchThumbnailUseCase } from "./PatchThumbnailUseCase";
import { RoutineModel } from "src/domain/models/RoutineModel";
import { ImageProvider } from "src/domain/providers/ImageProvider";
import { ImageRepository } from "src/domain/repositories/image/ImageRepository";
import { ImageType } from "src/domain/enums/ImageType";
import { PutRoutineThumbnailObjectError } from "./errors/PutRoutineThumbnailObjectError";
import { CreateImageDto } from "src/domain/repositories/image/dtos/CreateImageDto";
import { ReferenceModel } from "src/domain/enums/ReferenceModel";
import { UpdateRoutineDto } from "src/domain/repositories/routine/dtos/UpdateRoutineDto";
import { RoutineRepository } from "src/domain/repositories/routine/RoutineRepository";
import { RoutineNotFoundException } from "./exceptions/RoutineNotFoundException";
import { RoutineCommonService } from "../service/RoutineCommonService";


@Injectable()
export class PatchThumbnailUseCaseImpl implements PatchThumbnailUseCase {
  constructor(
    private readonly _userService: UserCommonService,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _routineRepository: RoutineRepository,
    private readonly _routineService: RoutineCommonService,
  ) { }

  async execute({
    userId,
    routineId,
    thumbnail,
  }: PatchThumbnailUseCaseParams): PatchThumbnailResponse {
    //어드민인지 파악
    await this._userService.validateAdmin(userId);

    //routineId로 루틴 불러오기
    const routine = await this._routineRepository.findOne(routineId);

    //루틴 있나 없나 검사 없으면 exception
    await this._routineService.assertRoutine(routine);

    //origin thumbnail mongoose object
    const originThumbnailMongooseObject = routine['thumbnail_id'] ?? null;

    //만약 루틴 썸네일이 이미 있었으면
    if (originThumbnailMongooseObject) {
      //origin thumbnail model
      const originThumbnailModel = this._imageProvider.mapDocumentToImageModel(
        originThumbnailMongooseObject,
      );

      this._imageRepository.delete(originThumbnailMongooseObject);

      this._imageProvider.deleteImageFromS3(
        originThumbnailModel.key,
        originThumbnailModel.filenames[0],
      );
    }

    let newThumbnailS3Object: any;

    try {
      newThumbnailS3Object = this._imageProvider.putImageToS3(
        thumbnail,
        `routine/${routine.name}/${ImageType.thumbnail}`,
      );
    } catch (err) {
      throw new PutRoutineThumbnailObjectError();
    }

    const thumbnailData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newThumbnailS3Object,
        ImageType.thumbnail,
        ReferenceModel.Routine,
        routineId
      );

    const createdThumbnail = await this._imageRepository.create(thumbnailData);

    const createdThumbnailId = createdThumbnail['_id'];

    const updateRoutineData: UpdateRoutineDto = {
      thumbnail_id: createdThumbnailId,
    };

    const updatedRoutine = await this._routineRepository.update(routineId, updateRoutineData);

    const output: RoutineModel = {
      id: updatedRoutine["_id"],
      name: updatedRoutine["name"],
      category: updatedRoutine["category"],
      type: updatedRoutine["type"],
      thumbnail: updatedRoutine["thumbnail_id"],
      cardnews: updatedRoutine["cardnews_id"],
      introductionScript: updatedRoutine["introduction_script"],
      motivation: updatedRoutine["motivation"],
      price: updatedRoutine["price"],
      relatedProducts: updatedRoutine["related_products"]
    };

    return output;
  }
}