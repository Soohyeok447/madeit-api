import { ReferenceType } from '../common/enums/ReferenceType';

export class Image {
  public constructor(
    private _id: string,
    private _referenceId: string,
    private _referenceType: ReferenceType,
    private _prefix: string,
    private _filenames: string[],
    private _cloudKeys: string[], //TODO 나중에 수정
  ) {
    this._id = _id;
    this._referenceId = _referenceId;
    this._referenceType = _referenceType;
    this._prefix = _prefix;
    this._filenames = _filenames;
    this._cloudKeys = _cloudKeys;
  }

  public get id(): string {
    return this._id;
  }

  public get referenceId(): string {
    return this._referenceId;
  }

  public get referenceType(): ReferenceType {
    return this._referenceType;
  }

  public get prefix(): string {
    return this._prefix;
  }

  public get filenames(): string[] {
    return this._filenames;
  }

  //TODO 나중에 수정
  public get cloudKeys(): string[] {
    return this._cloudKeys;
  }
}
