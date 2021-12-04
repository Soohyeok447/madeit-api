import { GoogleUserProfile } from "../../../common/types/google_sign_in.type";

export class GoogleOauthOutput {

  /**
   * it will be decided from exist of user.
   * if user exist, result will return true. another case is false
   * if is it false, client should redirect to signUp page 
   * and call create method including signup form 
   */
  isExist: boolean;

  /**
   * it will be return if result state is false.
   * this parameter has helpful user data object for registration
   * this data object's structure should be modify until the format of the registration form is decided
   */
  user?: GoogleUserProfile;


  /**
   * both of them will return if user is exist
   */
  accessToken?: string;

  refreshToken?: string;
}

