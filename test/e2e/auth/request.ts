import * as request from 'supertest';

export async function authorize(httpServer: any, accessToken: string) {
  await request(httpServer)
    .patch('/v1/e2e/user')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json');
}

export async function signIn(httpServer: any, signInParam) {
  return await request(httpServer)
    .post('/v1/e2e/auth/signin?provider=kakao&id=test')
    .set('Accept', 'application/json')
    .type('application/json')
    .send(signInParam);
}

export async function refresh(httpServer: any, refreshToken: string) {
  return await request(httpServer)
    .post('/v1/auth/refresh')
    .set('Authorization', `Bearer ${refreshToken}`);
}