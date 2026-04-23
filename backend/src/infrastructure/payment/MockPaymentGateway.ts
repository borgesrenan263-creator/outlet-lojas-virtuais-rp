export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: string;
}

export interface IPaymentGateway {
  processPayment(amount: number, paymentMethod: string): Promise<PaymentResult>;
}

export class MockPaymentGateway implements IPaymentGateway {
  async processPayment(amount: number, paymentMethod: string): Promise<PaymentResult> {
    // Simula um pagamento sempre aprovado
    return {
      success: true,
      transactionId: `mock_txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      status: 'paid',
    };
  }
}
