import { Area } from '../../../deps.ts'
import { ImageController } from './image.controller.ts'

@Area({
  baseRoute: '/image',
  controllers: [ImageController]
})
export class ImageArea {}
