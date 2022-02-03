export abstract class UserCommonService {
  abstract validateAdmin(userId: string): Promise<void>;
}
