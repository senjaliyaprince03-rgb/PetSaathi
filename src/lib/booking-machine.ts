import { BookingStatus } from "@prisma/client";

export class BookingMachine {
  private static readonly transitions: Record<BookingStatus, BookingStatus[]> = {
    [BookingStatus.DRAFT]: [BookingStatus.REQUESTED],
    [BookingStatus.REQUESTED]: [
      BookingStatus.PAYMENT_PENDING, 
      BookingStatus.CONFIRMED, 
      BookingStatus.DECLINED,
      BookingStatus.CUSTOMER_CANCELLED
    ],
    [BookingStatus.RISK_REVIEW]: [],
    [BookingStatus.MATCHING]: [],
    [BookingStatus.SITTER_PROPOSED]: [],
    [BookingStatus.CUSTOMER_APPROVAL_PENDING]: [],
    [BookingStatus.PAYMENT_PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CUSTOMER_CANCELLED],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.IN_PROGRESS, 
      BookingStatus.CUSTOMER_CANCELLED, 
      BookingStatus.SITTER_CANCELLED
    ],
    [BookingStatus.SITTER_EN_ROUTE]: [],
    [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
    [BookingStatus.REPORT_PENDING]: [],
    [BookingStatus.COMPLETED]: [BookingStatus.CLOSED],
    [BookingStatus.CLOSED]: [],
    [BookingStatus.DECLINED]: [],
    [BookingStatus.CUSTOMER_CANCELLED]: [],
    [BookingStatus.SITTER_CANCELLED]: [],
    [BookingStatus.REPLACEMENT_REQUIRED]: [],
    [BookingStatus.NO_SHOW]: [],
    [BookingStatus.INCIDENT_HOLD]: [],
  };

  public static canTransition(currentStatus: BookingStatus, nextStatus: BookingStatus): boolean {
    const validNextStates = this.transitions[currentStatus] || [];
    return validNextStates.includes(nextStatus);
  }

  public static validateTransition(currentStatus: BookingStatus, nextStatus: BookingStatus) {
    if (!this.canTransition(currentStatus, nextStatus)) {
      throw new Error(`Invalid state transition from ${currentStatus} to ${nextStatus}`);
    }
  }
}
