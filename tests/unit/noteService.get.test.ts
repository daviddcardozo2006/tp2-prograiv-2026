import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { Note } from '../../src/models/Note';

describe('NoteService getNote (EJERCICIO 3)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('Devuelve la nota con ese id ', () => {
    const creada = service.createNote({ title: 'Comprar yerba', content: 'Antes de las 12' });
    const encontrada = service.getNote(creada.id);
    expect(encontrada).toEqual(creada);
  });

  it.each([0, 1, 2])('Devuelve la nota correcta cuando hay muchas', (posicion) => {
    const creadas = Array.from({ length: 3 }, (_, i) =>
      service.createNote({ title: `Nota ${i + 1}`, content: `Contenido ${i + 1}` })
    );
    expect(service.getNote(creadas[posicion].id)).toEqual(creadas[posicion]);
  });

  it('devuelve undefined si el id no existe', () => {
    service.createNote({ title: 'Nota A', content: 'Contenido Nota A' });
    expect(service.getNote(999)).toBeUndefined();
  });
});
