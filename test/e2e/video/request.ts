import * as request from 'supertest';

export async function onboard(httpServer: any, accessToken: string, reqParam) {
  return await request(httpServer)
    .put('/v1/users/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(reqParam);
}

export async function searchVideoByKeyword(
  httpServer: any,
  accessToken: string,
  keyword: string,
  maxResults: number,
) {
  if (!keyword) {
    return await request(httpServer)
      .get(encodeURI(`/v1/videos/?max=${maxResults}`))
      .set('Authorization', `Bearer ${accessToken}`);
  }

  return await request(httpServer)
    .get(encodeURI(`/v1/videos/?max=${maxResults}&keyword=${keyword}`))
    .set('Authorization', `Bearer ${accessToken}`);
}
