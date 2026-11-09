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

describe('PATCH /notes/:id (Ejercicio 4)', () => {
  it('200 y cambia solo los campos enviados', async () => {
    const { body: creada } = await request(app)
      .post('/notes')
      .send({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    const res = await request(app).patch(`/notes/${creada.id}`).send({ content: 'Antes de las 21hs' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Comprar pan');
    expect(res.body.content).toBe('Antes de las 21hs');
  });

  it('el cambio se ve en un GET posterior', async () => {
    const { body: creada } = await request(app).post('/notes').send({ title: 'A', content: 'B' });

    const { body: actualizada } = await request(app).patch(`/notes/${creada.id}`).send({ pinned: true });
    const res = await request(app).get(`/notes/${creada.id}`);

    expect(res.body).toEqual(actualizada);
  });

  it('404 si el id no existe', async () => {
    await request(app).post('/notes').send({ title: 'A', content: 'B' });

    const res = await request(app).patch('/notes/999').send({ title: 'X' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  it('400 si el body es inválido', async () => {
    const { body: creada } = await request(app).post('/notes').send({ title: 'A', content: 'B' });

    const res = await request(app).patch(`/notes/${creada.id}`).send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });
});
