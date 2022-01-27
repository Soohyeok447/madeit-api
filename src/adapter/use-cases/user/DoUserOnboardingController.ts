import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  SwaggerJwtException,
  SwaggerServerException,
} from 'src/adapter/common/SwaggerExceptions';
import { DoUserOnboardingRequestDto } from 'src/adapter/dto/user/DoUserOnboardingRequestDto';

// @ApiOperation({
//   summary: '유저 등록 API',
//   description:
//     '최초 가입 유저의 임시적으로 저장된 db를 완성하는 onboarding API.<br/> JWT토큰이 헤더에 포함돼야합니다. <br/>birth는 XXXX-XX-XX 의 형태로 부탁드림.',
// })
// @ApiBody({
//   description: '유저 등록을 위한 form data',
//   type: DoUserOnboardingRequestDto,
// })
// @ApiResponse({ status: 200, description: 'user onboarding 성공' })
// @ApiResponse({
//   status: 400,
//   description: '유효하지 않은 닉네임',
//   type: SwaggerServerException,
// })
// @ApiUnauthorizedResponse({
//   description: '유효하지 않은 JWT가 헤더에 포함돼있음',
//   type: SwaggerJwtException,
// })
// @ApiConflictResponse({
//   description: '중복된 닉네임입니다.',
//   type: SwaggerServerException,
// })
// @ApiBearerAuth('accessToken | refreshToken')
export const doUserOnboardingController = () => {};
