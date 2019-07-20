## payeer-node [![Build Status](https://travis-ci.org/kubk/algoholizm.svg?branch=master)](https://travis-ci.org/kubk/payeer-node)

[Payeer](https://payeer.com/en/) payment gateway API for Node.js

### Installation
- `npm install payeer-node`

### Examples
1. Generate payment page url:
```javascript
const payeer = new Payeer({
  shopId: process.env.PAYEER_SHOP_ID,
  secretKey: process.env.PAYEER_SECRET_KEY,
  callbackUrls: {
    success_url: 'https://test.com/success',
    fail_url: 'https://test.com/fail',
    status_url: 'https://test.com/status'
  }
});

const orderId = '12345';
const url = payeer.generatePaymentPageUrl(
  orderId,
  Money.fromDecimal(500, 'EUR')
);
```

2. Process Payeer webhook:
```javascript
const callback = payeer.parsePaymentCallback(request.body);

expect(callback.orderId).toEqual(50);
expect(callback.isPaymentSuccess).toBeTruthy();
```

Please refer [tests](https://github.com/kubk/payeer-node/blob/master/src/payeer.test.ts) for details.

### Contribution
- `git clone`
- `npm install`
- `npm test`
