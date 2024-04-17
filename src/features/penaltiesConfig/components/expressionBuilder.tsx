import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import React, { useRef, useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { FormValues } from "./penaltyConfigForm";
import { Textarea } from "@/components/ui/textarea";

interface ExpressionBuilderProps {
  variables: { label: string; variable: string }[];
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export const ExpressionBuilder: React.FC<ExpressionBuilderProps> = ({
  variables,
  control,
  setValue,
}) => {
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleButtonClick = (value: string) => {
    if (!inputRef.current) return;

    const { selectionStart, selectionEnd } = inputRef.current;
    const currentValue = inputRef.current.value;
    const beforeText = currentValue.substring(0, selectionStart ?? 0);
    const afterText = currentValue.substring(selectionEnd ?? 0);

    const newValue = `${beforeText}${value}${afterText}`;
    setValue("calculationMethod", newValue, { shouldValidate: true });
    setIsValid(isValidExpression(newValue));

    // Wait a tick to ensure the DOM has updated
    setTimeout(() => {
      const newCursorPosition = beforeText.length + value.length ?? 0;
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  // const isValidExpression = (expression: string): boolean => {
  //   console.log("Called");

  //   const stack: string[] = [];
  //   for (const char of expression) {
  //     if (char === "(") {
  //       stack.push(char);
  //     } else if (char === ")") {
  //       if (!stack.pop()) {
  //         return false;
  //       }
  //     }
  //   }
  //   if (stack.length > 0) return false;

  //   const varsPattern = variables.map((v) => `\\b${v.variable}\\b`).join("|");
  //   const validExpressionPattern = new RegExp(
  //     `^\\s*((${varsPattern}|\\d+(\\.\\d+)?|\\s|[+\\-*/()]|MAX\\(([^)]+)\\))+\\s*)$`,
  //     "i"
  //   );

  //   return validExpressionPattern.test(expression);
  // };

  // const isValidExpression = (expression: string): boolean => {
  //   console.log("Called");

  //   // Properly check for balanced parentheses
  //   const stack: string[] = [];
  //   for (const char of expression) {
  //     if (char === "(") {
  //       stack.push(char);
  //     } else if (char === ")") {
  //       if (!stack.pop()) {
  //         return false;
  //       }
  //     }
  //   }
  //   if (stack.length > 0) return false;

  //   // Regex to match variables and basic numerics accurately
  //   const varsPattern = variables.map((v) => `\\b${v.variable}\\b`).join("|");
  //   const numberPattern = "\\d+(\\.\\d+)?"; // Matches integers and floats

  //   // Regex for functions like MAX, ensuring proper argument forms
  //   const functionPattern = `MAX\\(\\s*(${varsPattern}|${numberPattern})\\s*,\\s*(${varsPattern}|${numberPattern})\\s*\\)`;

  //   // Combining all parts into one regex pattern
  //   const validExpressionPattern = new RegExp(
  //     `^\\s*((${varsPattern}|${numberPattern}|\\s|[+\\-*/()]|${functionPattern})+)\\s*$`,
  //     "i"
  //   );

  //   return validExpressionPattern.test(expression);
  // };

  const isValidExpression = (expression: string): boolean => {
    console.log("Called");

    // Properly check for balanced parentheses
    const stack: string[] = [];
    for (const char of expression) {
      if (char === "(") {
        stack.push(char);
      } else if (char === ")") {
        if (!stack.pop()) {
          return false;
        }
      }
    }
    if (stack.length > 0) return false;

    // Regex to match variables and basic numerics accurately
    const varsPattern = variables.map((v) => `\\b${v.variable}\\b`).join("|");
    const numberPattern = "\\d+(\\.\\d+)?"; // Matches integers and floats

    // Regex for functions like MAX, ensuring proper argument forms
    const functionPattern = `MAX\\(\\s*(${varsPattern}|${numberPattern})\\s*,\\s*(${varsPattern}|${numberPattern})\\s*\\)`;

    // Combining all parts into one regex pattern
    // Ensuring proper sequence and avoiding trailing operators
    const validExpressionPattern = new RegExp(
      `^\\s*(${varsPattern}|${numberPattern}|${functionPattern}|\\s|\\b\\(+\\b|\\b\\)+\\b)([+\\-*/]\\s*(${varsPattern}|${numberPattern}|${functionPattern}|\\s|\\b\\(+\\b|\\b\\)+\\b))*$`,
      "i"
    );

    return validExpressionPattern.test(expression);
  };

  return (
    <div>
      <div className="flex gap-2 my-2">
        <div>
          {variables.map((variable, index) => (
            <Button
              className="border border-green-500"
              variant="outline"
              type="button"
              key={index}
              onClick={() => handleButtonClick(variable.variable)}
            >
              {variable.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {["+", "-", "*", "/"].map((operator, index) => (
            <Button
              className="border border-blue-500"
              variant="outline"
              type="button"
              key={index}
              onClick={() => handleButtonClick(operator)}
            >
              {operator}
            </Button>
          ))}
          <Button
            className="border border-blue-500"
            variant="outline"
            type="button"
            onClick={() => handleButtonClick("MAX(, )")}
          >
            MAX(x, y)
          </Button>
        </div>
      </div>
      <div>
        <FormField
          control={control}
          name="calculationMethod"
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value}
              onChange={(e) => {
                setIsValid(isValidExpression(e.target.value));
                field.onChange(e);
              }}
              ref={inputRef}
              placeholder="Type expression here or use buttons"
            />
          )}
        />
      </div>
      {!isValid && <div className="text-red-500">Invalid expression</div>}
    </div>
  );
};
