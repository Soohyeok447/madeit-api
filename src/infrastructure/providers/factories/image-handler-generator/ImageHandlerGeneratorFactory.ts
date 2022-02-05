import { ImageHandler } from "./ImageHandler";

export abstract class ImageHandlerGeneratorFactory {
  abstract makeHandler(key: string, type?: string): ImageHandler;
}

