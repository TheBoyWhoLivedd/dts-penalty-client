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


