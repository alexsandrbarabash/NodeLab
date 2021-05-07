import { unlink } from 'fs';

export const deletFile = (path) =>
  new Promise<NodeJS.ErrnoException>((resolve, rejects) => {
    unlink(path, (err) => {
      resolve(err);
    });
  });