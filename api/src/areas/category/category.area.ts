import { Area } from '../../../deps.ts'
import { CategoryController } from './category.controller.ts'

@Area({
  baseRoute: '/category',
  controllers: [CategoryController]
})
export class CategoryArea {}
