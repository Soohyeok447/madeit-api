import { Category } from 'src/domain/enums/Category';
import * as request from 'supertest';

export async function addRoutine(
  httpServer: any,
  accessToken: string,
  addRoutineParam: any,
) {
  return await request(httpServer)
    .post('/v1/routines')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineParam);
}

export async function getAllRoutinesByCateogory(
  httpServer: any,
  accessToken: string,
  size?: number,
  category?: Category,
  nextCursor?: string,
) {
  const query = {
    size,
    next: nextCursor,
    category,
  };

  const queryUrl = Object.keys(query).reduce<string>(
    (total, value, idx, arr) => {
      if (query[value]) {
        if (idx == arr.length - 1) {
          return total + `${value}=${query[value]}`;
        }
        return total + `${value}=${query[value]}&`;
      }
      return total;
    },
    '',
  );

  const url = '/v1/routines?' + `${queryUrl}`;

  return await request(httpServer)
    .get(url)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function getRoutine(
  httpServer: any,
  accessToken: string,
  id: string,
) {
  return await request(httpServer)
    .get(`/v1/routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function modifyRoutine(
  httpServer: any,
  accessToken: string,
  modifyRoutineParam: any,
  id: string,
) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(modifyRoutineParam);
}

export async function toggleActivation(
  httpServer: any,
  accessToken: string,
  id: string,
) {
  return await request(httpServer)
    .patch(`/v1/routines/toggle/${id}`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function getRoutines(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get(`/v1/routines`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function deleteRoutine(
  httpServer: any,
  accessToken: string,
  routineId: string,
) {
  return await request(httpServer)
    .delete(`/v1/routines/${routineId}`)
    .set('Authorization', `Bearer ${accessToken}`);
}
