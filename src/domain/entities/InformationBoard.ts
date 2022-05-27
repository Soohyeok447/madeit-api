export class InformationBoard {
  /**
   * id, 제목, 조회수, 카드뉴스, 댓글?
   */
  public constructor(
    private _id: string,
    private _title: string,
    private _views: number,
    private _cardnews: string,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id = _id;
    this._title = _title;
    this._views = _views;
    this._cardnews = _cardnews;
    this._createdAt = _createdAt;
    this._updatedAt = _updatedAt;
    this._deletedAt = _deletedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get views(): number {
    return this._views;
  }

  public get cardnews(): string {
    return this._cardnews;
  }

  public get createdAt(): string {
    return this._createdAt;
  }

  public get updatedAt(): string {
    return this._updatedAt;
  }

  public get deletedAt(): string {
    return this._deletedAt;
  }
}
