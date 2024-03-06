export const penalties = [
  {
    label: "Penal Tax for Default in Furnishing a Tax Return",
    value: "FT_01",
    comparative: false,
    fixed: false,
    category: "General",
    requiresCustomInputs: true,
    currencyPoints: 10,
    currencyPointsValue: 250000,
    doubleTax: false,
    inputs: [
      {
        label: "Tax Payable Under the Return",
        type: "number",
        variable: "taxPayable",
      },
      {
        label: "Number of Months in Default",
        type: "number",
        variable: "monthsInDefault",
      },
    ],
    calculationMethod:
      "function(inputs) { const { taxPayable, monthsInDefault } = inputs; const percentagePenalty = taxPayable * 0.02; const fixedPenalty = 10 * 25000 * monthsInDefault; return Math.max(percentagePenalty, fixedPenalty); }",
  },

  {
    label: "Penal Tax for Failing to Maintain Proper Records",
    value: "PT_01",
    comparative: false,
    fixed: false,
    category: "General",
    doubleTax: true,
  },
  {
    label: "Penal Tax for Failure to Provide Information",
    value: "AEI_01",
    category: "General",
    doubleTax: false,
    comparative: false,
    fixed: true,
    fixedAmount: 50000000,
  },
  {
    label: "Penal Tax for Making False or Misleading Statements",
    value: "PT_MS_01",
    comparative: false,
    fixed: false,
    category: "General",
    doubleTax: true,
  },
  {
    label: "Penalty for Failing to Apply for Registration",
    value: "REG_01",
    comparative: true,
    currencyPoints: 50,
    currencyPointsValue: 1250000,
    category: "Registration",
    doubleTax: true,
    fixed: false,
  },
  {
    label: "Penal Tax for Understating Provisional Tax Estimates",
    value: "PTE_01",
    category: "Provisional Tax Estimates",
    comparative: false,
    fixed: false,
    requiresCustomInputs: true,
    doubleTax: false,
    inputs: [
      // {
      //   label: "Type of Estimate",
      //   type: "select",

      //   options: [
      //     { label: "Chargeable Income", value: "chargeableIncome" },
      //     { label: "Gross Turnover", value: "grossTurnover" },
      //   ],
      // },
      {
        label: "Tax Calculated on 90% of Actual Amount",
        type: "number",
        variable: "taxOn90PercentActualAmount",
      },
      {
        label: "Tax Calculated on Estimated Amount",
        type: "number",
        variable: "taxOnEstimatedAmount",
      },
    ],
    calculationMethod:
      "function(inputs) { const { taxOn90PercentActualAmount,taxOnEstimatedAmount } = inputs; return (taxOn90PercentActualAmount - taxOnEstimatedAmount) * 0.2; }",
  },
];
