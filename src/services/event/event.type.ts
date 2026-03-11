export class Verification_Mail {
  constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly name: string,
    public readonly year: number,
  ) {}
}

export class sendOrderEmailVerification {
  constructor(
    // public readonly email: string,
    // public readonly orderNumber: string,
    // public readonly instructorName: string,
    public readonly orderId: string,
    //  public readonly courses: any[],
    // public readonly totalAmount?: number,
    //  public readonly studentName?: string,
   
  ) {}

  

}



