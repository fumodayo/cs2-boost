import { Widget } from "~/components/ui";
import { IOrder } from "~/types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

type StatusHistory = IOrder["status_history"];

const StatusHistoryWidget = ({ history }: { history: StatusHistory }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <Widget>
      <Widget.BigHeader>
        <h3 className="font-display font-semibold">Order Status History</h3>
      </Widget.BigHeader>
      <Widget.Content>
        <div className="flow-root">
          <ul className="-mb-8">
            {history
              .slice()
              .reverse()
              .map((event, eventIdx) => (
                <li key={uuidv4()}>
                  <div className="relative pb-8">
                    {eventIdx !== history.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div>
                        <div className="relative px-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary ring-8 ring-card">
                            <span className="text-sm font-bold uppercase">
                              {event.status.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 py-1.5">
                        <div className="text-sm text-foreground">
                          Status changed to{" "}
                          <span className="font-medium capitalize">
                            {event.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <time dateTime={event.date.toString()}>
                            {format(new Date(event.date), "dd MMM yyyy, HH:mm")}
                          </time>
                          {event.admin_action && " (by Admin)"}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </Widget.Content>
    </Widget>
  );
};

export default StatusHistoryWidget;