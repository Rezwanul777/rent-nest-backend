import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const PORT: number = config.port ? parseInt(config.port) : 5000;

const main = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    await prisma.$connect()
    console.log(`Database connected successfully.`);
  } catch (error: any) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}


main();