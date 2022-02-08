import { Category } from 'src/domain/enums/Category';
import * as request from 'supertest';

export async function addRoutine(httpServer: any, accessToken: string, addRoutineParam: any) {
  return await request(httpServer)
    .post('/v1/routines')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineParam);
}

export async function getAllRoutinesByCateogory(httpServer: any, accessToken: string, size?: number, category?: Category, nextCursor?: string) {
  let query = {
    size,
    next: nextCursor,
    category
  };

  let queryUrl = Object.keys(query).reduce<string>((total, value, idx, arr) => {
    if (query[value]) {
      if (idx == arr.length - 1) {
        return total + `${value}=${query[value]}`;
      }
      return total + `${value}=${query[value]}&`;
    }
    return total;
  }, '')

  let url = '/v1/routines?' + `${queryUrl}`;

  return await request(httpServer)
    .get(url)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function getRoutineDetail(httpServer: any, accessToken: string, id: string) {
  return await request(httpServer)
    .get(`/v1/routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function modifyRoutine(httpServer: any, accessToken: string, modifyRoutineParam: any, id: string) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(modifyRoutineParam);
}

export async function patchThumbnail(httpServer: any, accessToken: string, thumbnail: string, id: string) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}/thumbnail`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('thumbnail', thumbnail);
}

export async function patchCardnews(httpServer: any, accessToken: string, cardnews: string[], id: string) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}/cardnews`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('cardnews', cardnews[0])
    .attach('cardnews', cardnews[1]);
}