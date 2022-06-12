import { PaymentStatusPipe } from './payment-status.pipe';

describe('PaymentStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new PaymentStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
