import { Injectable } from "@nestjs/common";
import { ImageType } from "src/domain/enums/ImageType";
import { ReferenceModel } from "src/domain/enums/ReferenceModel";
import { RoutineModel } from "src/domain/models/RoutineModel";
import { ImageProvider } from "src/domain/providers/ImageProvider";
import { CreateImageDto } from "src/domain/repositories/image/dtos/CreateImageDto";
import { ImageRepository } from "src/domain/repositories/image/ImageRepository";
import { UpdateRoutineDto } from "src/domain/repositories/routine/dtos/UpdateRoutineDto";
import { RoutineRepository } from "src/domain/repositories/routine/RoutineRepository";
import { UserCommonService } from "../../user/service/UserCommonService";
import { PatchCardnewsResponse } from "../response.index";
import { RoutineCommonService } from "../service/RoutineCommonService";
import { PatchCardnewsUseCaseParams } from "./dtos/PatchCardnewsUseCaseParams";
import { PutCardnewsObjectError } from "./errors/PutCardnewsObjectError";
import { PatchCardnewsUseCase } from "./PatchCardnewsUseCase";

@Injectable()
export class PatchCardnewsUseCaseImpl implements PatchCardnewsUseCase {
  constructor(
    private readonly _userService: UserCommonService,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _routineRepository: RoutineRepository,
    private readonly _routineService: RoutineCommonService,
  ) { }


  async execute({ userId, routineId, cardnews }: PatchCardnewsUseCaseParams): PatchCardnewsResponse {
    await this._userService.validateAdmin(userId);

    //routineId로 루틴 불러오기
    const routine = await this._routineRepository.findOne(routineId);

    //루틴 있나 없나 검사 없으면 exception
    await this._routineService.assertRoutine(routine);

    const originCardnewsMongooseObject = routine['cardnews_id'] ?? null;

    if (originCardnewsMongooseObject) {
      const originCardnewsModel =
        this._imageProvider.mapDocumentToImageModel(originCardnewsMongooseObject);

      this._imageRepository.delete(originCardnewsMongooseObject);

      originCardnewsModel.filenames.forEach((filename) => {
        this._imageProvider.deleteImageFromS3(
          `routine/${routine.name}/${ImageType.cardnews}`,
          filename,
        );
      });
    }

    let newCardnewsS3Objects: any;

    try {
      newCardnewsS3Objects = cardnews.map((e) => {
        return this._imageProvider.putImageToS3(
          e,
          `routine/${routine.name}/${ImageType.cardnews}`,
        );
      });
    } catch (err) {
      throw new PutCardnewsObjectError();
    }

    const cardnewsData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newCardnewsS3Objects,
        ImageType.cardnews,
        ReferenceModel.Routine,
        routineId
      );

    const createdCardnews = await this._imageRepository.create(cardnewsData);

    const createdcardnewsId = createdCardnews['_id'];

    const createRoutineData: UpdateRoutineDto = {
      cardnews_id: createdcardnewsId,
    };

    const updatedRoutine = await this._routineRepository.update(
      routineId,
      createRoutineData,
    );

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