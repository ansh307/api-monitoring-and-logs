import { CheckCircle, PlusCircle, XCircle, RefreshCw } from "lucide-react";

type ChangeItem = {
  type: string;
  path?: string;
  method?: string;
  param?: string;
  message: string;
};

export function ApiChangeLog({ changes }: { changes: ChangeItem[] }) {
  return (
    <div className="space-y-4">
      {changes.map((change, idx) => {
        let Icon = CheckCircle;
        let color = "text-gray-600";

        if (change.type.includes("added")) {
          Icon = PlusCircle;
          color = "text-green-600";
        } else if (change.type.includes("removed")) {
          Icon = XCircle;
          color = "text-red-600";
        } else if (change.type.includes("changed")) {
          Icon = RefreshCw;
          color = "text-yellow-600";
        }

        return (
          <div key={idx} className="flex items-start space-x-2">
            <Icon className={`h-5 w-5 mt-1 ${color}`} />
            <div>
              <p className="text-sm">{change.message}</p>
              {change.path && change.method && (
                <p className="text-xs text-muted-foreground">
                  {change.method.toUpperCase()} {change.path}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
