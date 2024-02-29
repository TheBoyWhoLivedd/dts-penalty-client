type Penalty = {
  label: string;
  value: string;
  category: string;
  comparative: boolean;
  currencyPoints: number;
  maxAmount?: number;
  doubleTax:boolean
  dailyFine:boolean
  dailyMaxAmount?:number
};
