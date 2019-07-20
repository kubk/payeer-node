import { Money } from 'ts-money';
import { stringify } from 'querystring';
import { base64encode, md5, rijndael256ecb, sha256 } from './crypto';
import { Config, OrderId, PaymentCallback } from './types';

export class Payeer {
  constructor(private config: Config) {}

  generatePaymentPageUrl(orderId: OrderId, price: Money): string {
    const { shopId, secretKey, callbackUrls } = this.config;
    const description = base64encode(`Order ID: ${orderId}`);
    const amount = price.toDecimal().toFixed(2);
    const hash = [shopId, orderId, amount, price.currency, description];
    const key = md5(secretKey + orderId);
    const urls = JSON.stringify(callbackUrls);
    const params = encodeURIComponent(rijndael256ecb(urls, key));
    hash.push(params, secretKey);
    const sign = sha256(hash.join(':')).toUpperCase();

    const queryParams = {
      m_shop: shopId,
      m_orderid: orderId,
      m_amount: amount,
      m_curr: price.currency,
      m_desc: description,
      m_sign: sign,
      m_params: params,
      m_process: 'send'
    };

    return `https://payeer.com/merchant/?${stringify(queryParams)}`;
  }

  parsePaymentCallback(
    body: { [key in string]: string | number }
  ): PaymentCallback {
    const callbackHash = [
      body['m_operation_id'],
      body['m_operation_ps'],
      body['m_operation_date'],
      body['m_operation_pay_date'],
      body['m_shop'],
      body['m_orderid'],
      body['m_amount'],
      body['m_curr'],
      body['m_desc'],
      body['m_status'],
      this.config.secretKey
    ];

    const validSign = sha256(callbackHash.join(':')).toUpperCase();
    const isSignValid = body['m_sign'] === validSign;
    const isPaymentSuccess = isSignValid && body['m_status'] === 'success';
    const amountPaid = isPaymentSuccess
      ? Money.fromDecimal(body['m_amount'], body['m_curr'])
      : new Money(0, 'USD');

    return {
      isPaymentSuccess,
      orderId: body['m_orderid'],
      amountPaid
    };
  }
}
