import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { notify } from '../../src/services/notificationService';

vi.mock('../../src/services/notificationService', () => ({
  notify: vi.fn(),
}));

describe('NoteService, notificación al fijar con updateNote (Ejercicio 7)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    vi.clearAllMocks();
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('llama a notify con la nota actualizada al fijar una nota que no estaba fijada', () => {
    const creada = service.createNote({ title: 'A', content: 'B' });

    const actualizada = service.updateNote(creada.id, { pinned: true });

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(actualizada);
  });

  it('no llama a notify si la nota ya estaba fijada', () => {
    const creada = service.createNote({ title: 'A', content: 'B', pinned: true });
    vi.clearAllMocks(); // createNote ya notificó al crearla

    service.updateNote(creada.id, { pinned: true });

    expect(notify).not.toHaveBeenCalled();
  });

  it('no llama a notify si el patch no fija la nota', () => {
    const creada = service.createNote({ title: 'A', content: 'B' });

    service.updateNote(creada.id, { title: 'C' });
    service.updateNote(creada.id, { pinned: false });

    expect(notify).not.toHaveBeenCalled();
  });

  it('no llama a notify si el id no existe', () => {
    service.updateNote(999, { pinned: true });

    expect(notify).not.toHaveBeenCalled();
  });
});
