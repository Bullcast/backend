import { Controller, Post, Body, Route, Tags } from "tsoa";
import { PaymentService } from "../services/payment.service";
import { ChainType } from "../entities/payment";

interface CreatePaymentRequest {
  userId: number;
  amount: string;
  chainType: ChainType;
}

interface VerifyPaymentRequest {
  paymentId: number;
  txHash: string;
}

@Route("api/payments")
@Tags("Payments")
export class PaymentController extends Controller {
  private paymentService: PaymentService;

  constructor() {
    super();
    this.paymentService = new PaymentService();
  }

  @Post("create")
  public async createPayment(@Body() req: CreatePaymentRequest) {
    return await this.paymentService.createPayment(
      req.userId,
      req.amount,
      req.chainType
    );
  }

  @Post("verify")
  public async verifyPayment(@Body() req: VerifyPaymentRequest) {
    return await this.paymentService.verifyPayment(
      req.paymentId,
      req.txHash
    );
  }
}