export class InformationBoard {
  /**
   * id, 제목, 조회수, 카드뉴스, 댓글?
   */
  constructor(
    private _id: string,
    private _title: string,
    private _views: number,
    private _cardnews: string[],
  ) {
    this._id = _id;
    this._title = _title;
    this._views = _views;
    this._cardnews = _cardnews;
  }

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get views() {
    return this._views;
  }
  get cardnews() {
    return this._cardnews;
  }
}
1;
