import cookieParser from "cookie-parser";
import express, { Request, Response, urlencoded } from "express";
import cors from "cors";
import httpStatus from "http-status";
import config from "./config";
import notFound from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/property/property.route";
import { rentalRequestRoutes } from "./modules/rental-request/rental-request.route";
import { rentalAgreementRoutes } from "./modules/rental-agreement/rental-agreement.route";
import { reviewRoutes } from "./modules/review/review.route";
import { paymentRoutes } from "./modules/payment/payment.route";


const app: express.Application = express();

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to RNest backend"
    })
})


app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rental-requests", rentalRequestRoutes);
app.use("/api/rental-agreements", rentalAgreementRoutes);
app.use("/api/reviews", reviewRoutes);
 app.use("/api/payments", paymentRoutes);

app.use(notFound);

app.use(globalErrorHandler);




// Handle 404 errors




export default app;