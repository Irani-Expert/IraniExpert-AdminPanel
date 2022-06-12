import { BankMethodPipe } from './bank-method.pipe';

describe('BankMethodPipe', () => {
  it('create an instance', () => {
    const pipe = new BankMethodPipe();
    expect(pipe).toBeTruthy();
  });
});
