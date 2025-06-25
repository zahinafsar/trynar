import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, CreditCard, Cuboid as Cube } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTokens } from "@/hooks/use-tokens";
import { TokenRow } from "@/types/db";
import { formatTokenAmount } from "@/lib/utils";

export function TokenHistory() {
  const { tokens, loading } = useTokens();

  const getTransactionType = (amount: number) => {
    return amount > 0 ? "purchase" : "usage";
  };

  const getTransactionDescription = (amount: number) => {
    if (amount > 0) {
      return `Purchased ${formatTokenAmount(amount)} tokens`;
    } else {
      return `Used ${formatTokenAmount(Math.abs(amount))} tokens`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token History</CardTitle>
          <CardDescription>Recent token purchases and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between space-x-4 rounded-lg border p-3"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token History</CardTitle>
        <CardDescription>Recent token purchases and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No token transactions yet
            </div>
          ) : (
            tokens.map((transaction) => {
              const type = getTransactionType(transaction.amount);
              const description = getTransactionDescription(transaction.amount);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-3"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        type === "purchase"
                          ? "bg-green-500/10"
                          : "bg-blue-500/10"
                      }`}
                    >
                      {type === "purchase" ? (
                        <CreditCard className={`h-5 w-5 text-green-500`} />
                      ) : (
                        <Cube className={`h-5 w-5 text-blue-500`} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{description}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center ${
                        transaction.amount > 0
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowUp className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="mr-1 h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {transaction.amount > 0 ? "+" : ""}
                        {formatTokenAmount(transaction.amount)} token
                        {Math.abs(transaction.amount) !== 1 && "s"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
