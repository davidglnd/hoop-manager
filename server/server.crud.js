// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
import { create } from './crud/create.js';
import { read } from './crud/read.js';
import { update } from './crud/update.js';
import { deleteById } from './crud/delete.js';
import { filter } from './crud/filter.js';

export const crud = {
  create: (file, data, callback) => create(file, data, callback),
  // read: (file, callback) => read(file, callback),
  read: read,
  update: (file, id, data, callback) => update(file, id, data, callback),
  delete: (file, id, callback) => deleteById(file, id, callback),
  filter: (file, filterParams, callback) => filter(file, filterParams, callback),
}