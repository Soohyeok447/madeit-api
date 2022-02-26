import * as request from 'supertest';

export async function addRecommendedRoutine(httpServer: any, accessToken: string, addRoutineParam: any) {
  return await request(httpServer)
    .post('/v1/recommended-routines')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineParam);
}

export async function modifyRecommendedRoutine(httpServer: any, accessToken: string, modifyRoutineParam: any, id: string) {
  return await request(httpServer)
    .patch(`/v1/recommended-routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(modifyRoutineParam);
}

export async function deleteRecommendedRoutine(httpServer: any, accessToken: string, id: string) {
  return await request(httpServer)
    .delete(`/v1/recommended-routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)

}

// export async function getAllRoutinesByCateogory(httpServer: any, accessToken: string, size?: number, category?: Category, nextCursor?: string) {
//   let query = {
//     size,
//     next: nextCursor,
//     category
//   };

//   let queryUrl = Object.keys(query).reduce<string>((total, value, idx, arr) => {
//     if (query[value]) {
//       if (idx == arr.length - 1) {
//         return total + `${value}=${query[value]}`;
//       }
//       return total + `${value}=${query[value]}&`;
//     }
//     return total;
//   }, '')

//   let url = '/v1/routines?' + `${queryUrl}`;

//   return await request(httpServer)
//     .get(url)
//     .set('Authorization', `Bearer ${accessToken}`);
// }

// export async function getRoutine(httpServer: any, accessToken: string, id: string) {
//   return await request(httpServer)
//     .get(`/v1/routines/${id}`)
//     .set('Authorization', `Bearer ${accessToken}`);
// }



// export async function toggleActivation(httpServer: any, accessToken: string,id: string) {
//   return await request(httpServer)
//     .patch(`/v1/routines/toggle/${id}`)
//     .set('Authorization', `Bearer ${accessToken}`)
// }

// export async function getRoutines(httpServer: any, accessToken: string) {
//   return await request(httpServer)
//     .get(`/v1/routines`)
//     .set('Authorization', `Bearer ${accessToken}`);
// }

