import { Area } from '../../../deps.ts'
import { TagController } from './tag.controller.ts'

@Area({
  baseRoute: '/tag',
  controllers: [TagController]
})
export class TagArea {}
