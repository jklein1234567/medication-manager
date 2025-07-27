import { FC } from "react";
import moment from "moment";
import type { Moment } from "moment";
import { Medication, Day } from "../../../types";

interface Props {
  currentDate: Moment;
  meds: Medication[];
  setCurrentDate: (date: Moment) => void;
  setSelectedMed: (med: Medication) => void;
}

export const Calendar: FC<Props> = ({
  currentDate,
  meds,
  setCurrentDate,
  setSelectedMed,
}: Props) => {
  const start = currentDate.clone().startOf("month");
  const end = currentDate.clone().endOf("month");

  const startOffset = start.day(); // 0 = Sunday
  const endOffset = 6 - end.day(); // 6 = Saturday
  const startCalendar = start.clone().subtract(startOffset, "days");
  const endCalendar = end.clone().add(endOffset, "days");
  const days = [];
  const day = startCalendar.clone();
  while (day.isBefore(endCalendar, "day") || day.isSame(endCalendar, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="hover:cursor-pointer"
          onClick={() =>
            setCurrentDate(
              currentDate.clone().subtract(1, "month").startOf("month")
            )
          }
        >
          &larr; Prev
        </button>

        <h2 className="text-lg font-semibold">
          {currentDate.format("MMMM YYYY")}
        </h2>

        <button
          className="hover:cursor-pointer"
          onClick={() =>
            setCurrentDate(currentDate.clone().add(1, "month").startOf("month"))
          }
        >
          Next &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center font-medium mb-2">
        {Object.values(Day).map((d, i) => (
          <div key={i} className="text-gray-700 text-center font-medium mb-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => {
          const greyedOut = day.isBefore(moment(), "day");
          const today = day.isSame(moment(), "day");
          return (
            <div
              key={day.toISOString()}
              className={`border rounded p-2 min-h-[80px] ${
                greyedOut ? "bg-gray-100 text-gray-400" : ""
              } ${today ? "bg-yellow-100 border-yellow-500" : ""}`}
            >
              <div className="flex flex-col gap-1 mt-1 text-sm font-semibold">
                {day.format("D")}
              </div>
              {meds
                .filter(
                  (m) =>
                    m.isActive &&
                    (m.scheduleType === "daily" ||
                      (m.scheduleType === "weekly" &&
                        m.daysOfWeek?.includes(day.format("ddd") as Day)))
                )
                .map((med) => {
                  const isTaken = med.takenLog?.includes(
                    day.format("YYYY-MM-DD")
                  );
                  return (
                    <button
                      key={med.id}
                      className={`flex mb-1 text-xs hover:cursor-pointer ${
                        greyedOut && !today ? "text-gray-400" : "text-blue-600"
                      } ${isTaken ? "line-through" : ""}`}
                      onClick={() => setSelectedMed(med)}
                    >
                      {med.name}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
