import "dotenv/config";
import http from "node:http";
import { createServer } from "./server.js";

const main = async () => {
  const app = await createServer();

  const httpserver = http.createServer(app);

  httpserver.listen(process.env.PORT, () =>
    console.log(`Server is listening on port: ${process.env.PORT}`),
  );
};

main();
