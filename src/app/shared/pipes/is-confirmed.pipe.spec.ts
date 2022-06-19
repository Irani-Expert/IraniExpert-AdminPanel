import { IsConfirmedPipe } from './is-confirmed.pipe';

describe('IsConfirmedPipe', () => {
  it('create an instance', () => {
    const pipe = new IsConfirmedPipe();
    expect(pipe).toBeTruthy();
  });
});
