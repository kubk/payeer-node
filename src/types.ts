import { Money } from 'ts-money';

export type OrderId = string | number;

export interface PaymentCallback {
  orderId: OrderId;
  isPaymentSuccess: boolean;
  amountPaid: Money;
}

export interface Config {
  shopId: number | string;
  secretKey: string;
  callbackUrls: {
    success_url: string;
    fail_url: string;
    status_url: string;
  };
}
