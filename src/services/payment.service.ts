import { dataSource } from '../database/datasource';
import { Payment, PaymentStatus, ChainType } from '../entities/payment';
import { ethers } from 'ethers';
import { ApiKeyService } from './api-key.service';

export class PaymentService {
  private paymentRepository = dataSource.getRepository(Payment);
  private apiKeyService: ApiKeyService;

  constructor() {
    this.apiKeyService = new ApiKeyService();
  }

  async createPayment(userId: number, amount: string, chainType: ChainType): Promise<Payment> {
    const payment = new Payment();
    payment.userId = userId;
    payment.amount = amount;
    payment.chainType = chainType;
    payment.status = PaymentStatus.PENDING;
    
    return await this.paymentRepository.save(payment);
  }

  async verifyPayment(paymentId: number, txHash: string): Promise<boolean> {
    const payment = await this.paymentRepository.findOneBy({ id: paymentId });
    if (!payment) throw new Error('Payment not found');

    let verified = false;

    switch (payment.chainType) {
      case ChainType.SUI:
        verified = await this.verifySuiPayment(txHash, payment.amount);
        break;
      case ChainType.ETH:
        verified = await this.verifyEVMPayment(txHash, payment.amount, payment.chainType);
        break;
    }

    if (verified) {
      payment.status = PaymentStatus.COMPLETED;
      payment.txHash = txHash;
      await this.paymentRepository.save(payment);
      
      // Generate API key upon successful payment
      await this.apiKeyService.generateApiKey(payment.userId);
    }

    return verified;
  }

  private async verifySuiPayment(txHash: string, expectedAmount: string): Promise<boolean> {
    // TODO: SUI-specific payment verification
    return true;
  }

  private async verifyEVMPayment(
    txHash: string, 
    expectedAmount: string, 
    chainType: ChainType
  ): Promise<boolean> {
    // TODO: EVM-chain payment verification
    return true;
  }
}