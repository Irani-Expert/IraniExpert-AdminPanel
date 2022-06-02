import { OrderIdPipe } from './order-id.pipe';

describe('OrderIdPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderIdPipe();
    expect(pipe).toBeTruthy();
  });
});
