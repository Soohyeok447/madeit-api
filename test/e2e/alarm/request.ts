import * as request from 'supertest';

export async function addAlarm(httpServer: any, accessToken: string, addAlarmParams) {
  return await request(httpServer)
    .post('/v1/alarms')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addAlarmParams);
}

export async function getAllAlarms(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get('/v1/alarms')
    .set('Authorization', `Bearer ${accessToken}`)
}

export async function deleteAlarm(httpServer: any, accessToken: string, id: string) {
  return await request(httpServer)
    .delete(`/v1/alarms/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
}

export async function getAlarm(httpServer: any, accessToken: string, id: string) {
  return await request(httpServer)
    .get(`/v1/alarms/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
}

export async function updateAlarm(httpServer: any, accessToken: string, id: string, updateAlarmParams) {
  return await request(httpServer)
    .put(`/v1/alarms/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(updateAlarmParams);
}