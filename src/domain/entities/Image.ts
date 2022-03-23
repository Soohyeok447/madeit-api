import { ReferenceType } from '../common/enums/ReferenceType';

export class Image {
  constructor(
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

  get id() {
    return this._id;
  }

  get referenceId() {
    return this._referenceId;
  }

  get referenceType() {
    return this._referenceType;
  }

  get prefix() {
    return this._prefix;
  }

  get filenames() {
    return this._filenames;
  }

  //TODO 나중에 수정
  get cloudKeys() {
    return this._cloudKeys;
  }
}
