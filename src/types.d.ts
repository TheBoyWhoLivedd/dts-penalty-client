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
