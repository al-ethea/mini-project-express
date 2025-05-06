import { Router } from "express";
import { getAllArtists } from "../controllers/artist.controller";
// import { jwtDecode } from "../middlewares/jwt.decode";

const artistRouter = Router();

artistRouter.get("/", getAllArtists);

export default artistRouter;
