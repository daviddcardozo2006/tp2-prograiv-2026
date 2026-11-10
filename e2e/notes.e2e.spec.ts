import { test, expect } from '@playwright/test';
import type { Note } from '../src/models/Note';
import { resetAndSeed } from './helpers';

let seed: Note[];

test.beforeEach(async ({ baseURL }) => {
  const { created } = await resetAndSeed(baseURL!);
  seed = created;
});

test('camino optimista: crear, leer, modificar y borrar una nota', async ({ request }) => {
  const listado = await request.get('/notes');
  expect(await listado.json()).toHaveLength(2);

  const creada = await (await request.post('/notes', { data: { title: 'Comprar yerba', content: 'Antes de las 12' } })).json();

  const leida = await request.get(`/notes/${creada.id}`);
  expect(await leida.json()).toEqual(creada);

  const modificada = await request.patch(`/notes/${creada.id}`, { data: { content: 'Antes de las 13' } });
  expect((await modificada.json()).content).toBe('Antes de las 13');

  const borrada = await request.delete(`/notes/${creada.id}`);
  expect(borrada.status()).toBe(204);

  const despues = await request.get(`/notes/${creada.id}`);
  expect(despues.status()).toBe(404);
});

test('error: crear una nota sin title devuelve 400', async ({ request }) => {
  const res = await request.post('/notes', { data: { content: 'Sin título' } });

  expect(res.status()).toBe(400);
  expect((await res.json()).error).toBe('ValidationError');
});

test('fijar una nota con PATCH dispara una notificación', async ({ request }) => {
  const sinFijar = seed.find((nota) => !nota.pinned)!;

  await request.patch(`/notes/${sinFijar.id}`, { data: { pinned: true } });

  const notificaciones: Note[] = await (await request.get('/__test__/notifications')).json();
  expect(notificaciones.map((nota) => nota.id)).toContain(sinFijar.id);
});
