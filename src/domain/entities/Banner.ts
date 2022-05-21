export class Banner {
  public constructor(
    private _id: string,
    private _title: string,
    private _views: number,
    private _bannerImageId: string,
    private _content_video_id: string,
    private _createdAt: string,
  ) {
    this._id = _id;
    this._title = _title;
    this._views = _views;
    this._bannerImageId = _bannerImageId;
    this._content_video_id = _content_video_id;
    this._createdAt = _createdAt;
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

  public get bannerImageId(): string {
    return this._bannerImageId;
  }

  public get contentVideoId(): string {
    return this._content_video_id;
  }

  public get createdAt(): string {
    return this._createdAt;
  }
}
