export abstract class UseCase<Params, Response> {
  public abstract execute(params: Params): Response;
}
