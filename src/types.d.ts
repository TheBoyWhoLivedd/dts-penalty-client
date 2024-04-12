interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  password_reset_token?: string | null;
}

type InputOption = {
  label: string;
  value: string;
};

type CustomInput = {
  label: string;
  type: string;
  variable: string;
  options?: InputOption[];
};

type Penalty = {
  label: string;
  value: string;
  category: string;
  comparative: boolean;
  fixed: boolean;
  doubleTax: boolean;
  currencyPoints?: number;
  currencyPointsValue?: number;
  requiresCustomInputs?: boolean;
  inputs?: CustomInput[];
  calculationMethod?: string;
  fixedAmount?: number;
};

declare interface ErrorResponse {
  data: {
    message: string;
  };
}

type PenaltyConfig = {
  _id: string;
  id: string;
  penaltyTitle: string;
  penaltySection: string;
  comparative: boolean;
  fixed: boolean;
  category: string;
  requiresCustomInputs?: boolean;
  currencyPoints?: number;
  currencyPointsValue?: number;
  doubleTax: boolean;
  inputs?: InputConfig[];
  calculationMethod?: string;
  fixedAmount?: number;
};

type InputConfig = {
  label: string;
  type: string;
  variable: string;
  options?: OptionConfig[];
};

type OptionConfig = {
  label: string;
  value: string;
};

interface IssuedPenalty {
  id: string;
  penaltyTitle: string;
  penaltySection: string;
  category: string;
  comparative: boolean;
  fixed: boolean;
  doubleTax: boolean;
  finalAmount: number;
}

interface PaymentConfig {
  id: string;
  _id: string;
  tin: string;
  nin: string;
  name: string;
  penalties: IssuedPenalty[];
  description: string;
  totalAmount: number;
  prn: string;
  issuedBy: string;
  issuedAt: Date;
  attachments?: string[];
}


