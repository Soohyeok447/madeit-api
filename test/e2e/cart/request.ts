import * as request from 'supertest';

export async function addRecommendedRoutineToCart(
  httpServer: any,
  accessToken: string,
  addRoutineToCartParams,
) {
  return await request(httpServer)
    .post('/v1/carts')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineToCartParams);
}

export async function getcarts(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get('/v1/carts')
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function deleteRecommendedRoutineFromCart(
  httpServer: any,
  accessToken: string,
  recommendedRoutineId,
) {
  return await request(httpServer)
    .delete(`/v1/carts/${recommendedRoutineId}`)
    .set('Authorization', `Bearer ${accessToken}`);
}
