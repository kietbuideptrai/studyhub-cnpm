import "dotenv/config";
import { app } from "./app";

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}`);
});
