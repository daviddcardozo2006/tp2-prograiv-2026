import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('elimina una nota existente y devuelve true', () => {
    const creada = service.createNote({ title: 'Nota a borrar', content: 'Texto' });

    const resultado = service.deleteNote(creada.id);

    expect(resultado).toBe(true);
    expect(service.listNotes()).toHaveLength(0);
  });

  it('devuelve false al intentar eliminar un id que no existe', () => {
    const resultado = service.deleteNote(999);

    expect(resultado).toBe(false);
  });
});