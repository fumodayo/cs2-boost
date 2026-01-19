const reasonReports = [
  { value: "NOT_RESPONDING" },
  { value: "OVERCHARGING" },
  { value: "SLOW_DELIVERY" },
  { value: "LOW_QUALITY" },
  { value: "FRAUD" },
  { value: "TERMS_VIOLATION" },
];

const filterReportTypes = [
  { translationKey: "not_responding", value: "NOT_RESPONDING" },
  { translationKey: "overcharging", value: "OVERCHARGING" },
  { translationKey: "slow_delivery", value: "SLOW_DELIVERY" },
  { translationKey: "low_quality", value: "LOW_QUALITY" },
  { translationKey: "fraud", value: "FRAUD" },
  { translationKey: "terms_violation", value: "TERMS_VIOLATION" },
];

const filterReportStatus = [
  { translationKey: "pending", value: "PENDING" },
  { translationKey: "resolved", value: "RESOLVED" },
  { translationKey: "reject", value: "REJECT" },
  { translationKey: "in_progress", value: "IN_PROGRESS" },
];

export { reasonReports, filterReportTypes, filterReportStatus };