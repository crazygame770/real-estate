
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoanCalculatorProps {
  isOpen: boolean;
}

const LoanCalculator = ({ isOpen }: LoanCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState<string>("300000");
  const [interestRate, setInterestRate] = useState<string>("3.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const { t } = useLanguage();

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;

    if (principal && rate && months) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      return monthlyPayment.toFixed(2);
    }
    return "0.00";
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-background">
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("Loan Amount (€)")}</Label>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="mt-1 border-0 px-0 h-8 text-base focus-visible:ring-0"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("Term (Years)")}</Label>
          <Input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="mt-1 border-0 px-0 h-8 text-base focus-visible:ring-0"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("Interest Rate (%)")}</Label>
          <Input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="mt-1 border-0 px-0 h-8 text-base focus-visible:ring-0"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("Monthly Payment")}</Label>
          <div className="text-xl font-medium mt-1 text-[#ea384c]">€{calculateMonthlyPayment()}</div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
