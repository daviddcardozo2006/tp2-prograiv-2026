import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { notify } from '../../src/services/notificationService';

// Mockeamos el módulo externo de notificaciones
vi.mock('../../src/services/notificationService', () => ({
  notify: vi.fn(),
}));

describe('NoteService - Notificaciones (Ejercicio 6)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    vi.clearAllMocks();
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('llama a notify si se crea una nota con pinned: true', () => {
    service.createNote({ title: 'Nota importante', content: 'Urgente', pinned: true });

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Nota importante',
        pinned: true,
      })
    );
  });

  it('no llama a notify si se crea una nota con pinned: false u omitido', () => {
    service.createNote({ title: 'Nota normal', content: 'Común', pinned: false });

    expect(notify).not.toHaveBeenCalled();
  });
});