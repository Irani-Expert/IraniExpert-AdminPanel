import { BankTypePipe } from './bank-type.pipe';

describe('BankTypePipe', () => {
  it('create an instance', () => {
    const pipe = new BankTypePipe();
    expect(pipe).toBeTruthy();
  });
});
