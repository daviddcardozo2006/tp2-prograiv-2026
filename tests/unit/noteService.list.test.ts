import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - listNotes (Ejercicio 2)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve una lista vacía si no hay notas', () => {
    expect(service.listNotes()).toEqual([]);
  });

  it('devuelve todas las notas creadas', () => {
    service.createNote({ title: 'A', content: 'B' });
    service.createNote({ title: 'C', content: 'D' });

    const notes = service.listNotes();

    expect(notes).toHaveLength(2);
    expect(notes.map((n) => n.title)).toEqual(expect.arrayContaining(['A', 'C']));
  });
});