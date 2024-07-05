export class AccessTokenPayload {
  constructor(
    readonly id: number,
    readonly email: string
  ) {}

  toPlain(): { id: number; email: string } {
    return {
      id: this.id,
      email: this.email,
    };
  }
}
