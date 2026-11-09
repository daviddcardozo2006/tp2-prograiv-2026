import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - updateNote (Ejercicio 4)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('si el patch solo trae title, content no cambia', () => {
    const creada = service.createNote({ title: 'Viejo', content: 'Texto' });

    const actualizada = service.updateNote(creada.id, { title: 'Nuevo' });

    expect(actualizada?.title).toBe('Nuevo');
    expect(actualizada?.content).toBe('Texto');
  });

  it('si el patch solo trae content, title no cambia', () => {
    const creada = service.createNote({ title: 'Titulo', content: 'Viejo' });

    const actualizada = service.updateNote(creada.id, { content: 'Nuevo' });

    expect(actualizada?.title).toBe('Titulo');
    expect(actualizada?.content).toBe('Nuevo');
  });

  it('puede cambiar pinned', () => {
    const creada = service.createNote({ title: 'A', content: 'B' });

    const actualizada = service.updateNote(creada.id, { pinned: true });

    expect(actualizada?.pinned).toBe(true);
  });

  it('el cambio queda guardado', () => {
    const creada = service.createNote({ title: 'A', content: 'B' });

    const actualizada = service.updateNote(creada.id, { content: 'C' });

    expect(service.getNote(creada.id)).toEqual(actualizada);
  });

  it('actualiza updatedAt y conserva id y createdAt', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'));
    const creada = service.createNote({ title: 'A', content: 'B' });

    vi.setSystemTime(new Date('2026-01-01T11:00:00.000Z'));
    const actualizada = service.updateNote(creada.id, { title: 'Z' });

    expect(actualizada?.id).toBe(creada.id);
    expect(actualizada?.createdAt).toBe('2026-01-01T10:00:00.000Z');
    expect(actualizada?.updatedAt).toBe('2026-01-01T11:00:00.000Z');
  });

  it('devuelve undefined si el id no existe', () => {
    service.createNote({ title: 'A', content: 'B' });

    expect(service.updateNote(999, { title: 'X' })).toBeUndefined();
  });
});
