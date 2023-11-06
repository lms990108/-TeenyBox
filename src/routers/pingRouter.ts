import { Router } from "express";

const pingRouter = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     tags: [Ping]
 *     responses:
 *       200:
 *         description: If server is ok, return pong.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               properties:
 *                pong:
 *                 type: string
 *                 description: pong.
 *                 example: pong.
 */
pingRouter.get("/", (req, res) => {
  res.send("pong");
});

export default pingRouter;
