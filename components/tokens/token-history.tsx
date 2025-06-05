import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, CreditCard, Cuboid as Cube } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TokenTransaction {
  id: string;
  type: "purchase" | "usage";
  amount: number;
  date: Date;
  description: string;
}

const transactions: TokenTransaction[] = [
  {
    id: "1",
    type: "purchase",
    amount: 50,
    date: new Date(2025, 4, 10),
    description: "Purchased Pro Plan",
  },
  {
    id: "2",
    type: "usage",
    amount: -1,
    date: new Date(2025, 4, 12),
    description: "Generated model: Sneaker-Blue-3D",
  },
  {
    id: "3",
    type: "usage",
    amount: -1,
    date: new Date(2025, 4, 13),
    description: "Generated model: Watch-Silver-3D",
  },
  {
    id: "4",
    type: "usage",
    amount: -1,
    date: new Date(2025, 4, 14),
    description: "Generated model: Headphones-Black-3D",
  },
  {
    id: "5",
    type: "usage",
    amount: -1,
    date: new Date(2025, 4, 15),
    description: "Generated model: Backpack-Green-3D",
  },
  {
    id: "6",
    type: "usage",
    amount: -1,
    date: new Date(2025, 4, 16),
    description: "Generated model: Sunglasses-Black-3D",
  },
];

export function TokenHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token History</CardTitle>
        <CardDescription>
          Recent token purchases and usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between space-x-4 rounded-lg border p-3"
            >
              <div className="flex items-center space-x-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  transaction.type === "purchase"
                    ? "bg-green-500/10"
                    : "bg-blue-500/10"
                }`}>
                  {transaction.type === "purchase" ? (
                    <CreditCard className={`h-5 w-5 text-green-500`} />
                  ) : (
                    <Cube className={`h-5 w-5 text-blue-500`} />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(transaction.date, { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`flex items-center ${
                  transaction.amount > 0
                    ? "text-green-500"
                    : "text-blue-500"
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount} token{Math.abs(transaction.amount) !== 1 && "s"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}