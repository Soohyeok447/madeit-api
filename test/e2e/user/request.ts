import * as request from 'supertest';

export async function onboard(httpServer: any, accessToken: string, reqParam) {
  return await request(httpServer)
    .post('/v1/users/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(reqParam);
}

export async function modifyUser(httpServer: any, accessToken: string, reqParam) {
  return await request(httpServer)
    .patch('/v1/users/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(reqParam);
}

export async function findUser(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get('/v1/users/me')
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function patchAvatar(httpServer: any, accessToken: string, avatar: string) {
  if (!avatar) {
    return await request(httpServer)
      .patch('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
  }

  return await request(httpServer)
    .patch('/v1/users/me/avatar')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('avatar', avatar);
}