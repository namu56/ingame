export class RefreshTokenPayload {
  constructor(readonly id: number) {}

  toPlain(): { id: number } {
    return {
      id: this.id,
    };
  }
}
