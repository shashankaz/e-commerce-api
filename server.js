import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
