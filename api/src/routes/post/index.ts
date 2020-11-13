import {
  addPost,
  getPost,
  updatePost,
  deletePost
} from "../../controllers/posts.ts";
import { Router } from "../../../deps.ts";
export const router = new Router();
router.post("/add", addPost);
router.get("/get", getPost);
router.post("/update", updatePost);
router.delete("/delete", deletePost);
