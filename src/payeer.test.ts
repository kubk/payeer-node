import { Payeer } from './payeer';
import { Money } from 'ts-money';

describe('Payeer', () => {
  const payeer = new Payeer({
    shopId: '111',
    secretKey: '222',
    callbackUrls: {
      success_url: 'https://test.com/success',
      fail_url: 'https://test.com/fail',
      status_url: 'https://test.com/status'
    }
  });

  it('should generate payment page url', () => {
    const orderId = '12345';
    const url = payeer.generatePaymentPageUrl(
      orderId,
      Money.fromDecimal(500, 'EUR')
    );

    expect(url).toBeTruthy();
    expect(url).toContain(orderId);
    expect(url).toContain(500);
    expect(url).toContain('EUR');
  });

  it('should parse success payment callback', () => {
    const callback = payeer.parsePaymentCallback({
      m_operation_id: 12435,
      m_operation_ps: 12345,
      m_operation_date: '2019-04-18',
      m_operation_pay_date: '2019-04-18',
      m_shop: 12345,
      m_orderid: 50,
      m_amount: 5,
      m_curr: 'USD',
      m_desc: 'Order ID: 5',
      m_status: 'success',
      m_sign: 'F5DCB3F86DAA2A0C8A660C9070197CC80F4AAD80ECC3C5DB59EB369A180356AC'
    });

    expect(callback.orderId).toEqual(50);
    expect(callback.isPaymentSuccess).toBeTruthy();
    expect(callback.amountPaid.getAmount()).toEqual(500);
  });

  it('should parse corrupted payment callback', () => {
    const callback = payeer.parsePaymentCallback({
      m_operation_id: 12435,
      m_operation_ps: 12345,
      m_operation_date: '2019-04-18',
      m_operation_pay_date: '2019-04-18',
      m_shop: 12345,
      m_orderid: 50,
      m_amount: 999999999,
      m_curr: 'USD',
      m_desc: 'Order ID: 5',
      m_status: 'success',
      m_sign: 'F5DCB3F86DAA2A0C8A660C9070197CC80F4AAD80ECC3C5DB59EB369A180356AC'
    });

    expect(callback.orderId).toEqual(50);
    expect(callback.isPaymentSuccess).toBeFalsy();
    expect(callback.amountPaid.isZero()).toBeTruthy();
  });
});
