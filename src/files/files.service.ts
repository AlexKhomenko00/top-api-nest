import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileElementResponse } from './dto/file-element.response.dto';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];
    for (const file of files) {
      const fileName = file.originalname;
      await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
      res.push({ name: fileName, url: `${dateFolder}/${fileName}` });
    }

    return res;
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
