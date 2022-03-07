import * as request from 'supertest';

export async function authorize(httpServer: any, accessToken: string) {
  await request(httpServer)
    .patch('/v1/e2e/user')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json');
}

export async function signUp(
  httpServer: any,
  provider: string,
  signUpRequestDto,
) {
  return await request(httpServer)
    .post(`/v1/e2e/auth/signup?provider=${provider}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(signUpRequestDto);
}

export async function signIn(httpServer: any, provider: string, signInParam) {
  return await request(httpServer)
    .post(`/v1/e2e/auth/signin?provider=${provider}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(signInParam);
}

export async function validate(
  httpServer: any,
  provider: string,
  validateParam,
) {
  return await request(httpServer)
    .post(`/v1/e2e/auth/validate?provider=${provider}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(validateParam);
}

export async function refresh(httpServer: any, refreshToken: string) {
  return await request(httpServer)
    .post('/v1/auth/refresh')
    .set('Authorization', `Bearer ${refreshToken}`);
}

export async function withdraw(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .patch('/v1/auth/withdraw')
    .set('Authorization', `Bearer ${accessToken}`);
}
