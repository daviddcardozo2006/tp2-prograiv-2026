import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { makeApp } from '../../src/app';

let app: Express;

beforeEach(() => {
  app = makeApp(':memory:');               // la app (routes + controller + service) en una db fresca
});

describe('GET /notes/:id (Ejercicio 3)', () => {
  it('200 con la nota si existe', async () => {
    const { body: creada } = await request(app)
      .post('/notes')
      .send({ title: 'Comprar yerba', content: 'Antes de las 12' });

    const res = await request(app).get(`/notes/${creada.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(creada);
  });

  it('404 si el id no existe', async () => {
    await request(app).post('/notes').send({ title: 'Nota A', content: 'Contenido Nota A' });

    const res = await request(app).get('/notes/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });
});
