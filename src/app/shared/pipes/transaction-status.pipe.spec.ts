import { TransactionStatusPipe } from './transaction-status.pipe';

describe('TransactionStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new TransactionStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
