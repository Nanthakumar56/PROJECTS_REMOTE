import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { GrPrevious, GrNext } from "react-icons/gr";
import { DateCalender, Months } from "./DateCalender";

const CalendarPopup = ({ selectedDate, onSelectDate, onClose, style }) => {
  const currentDate = dayjs();
  const [today, setToday] = useState(
    selectedDate ? dayjs(selectedDate) : currentDate
  );
  const overlayRef = useRef(null);

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (selectedDate) {
      setToday(dayjs(selectedDate));
    }
  }, [selectedDate]);

  return (
    <div
      className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10 mr-1"
      ref={overlayRef}
      style={style}
    >
      <div className="w-60 h-60 p-3 lg:!w-80 lg:!h-80 lg:!p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[10px] lg:!text-xs font-semibold">
            {Months[today.month()]}, {today.year()}
          </h1>
          <div className="flex items-center gap-x-3 lg:!gap-x-5">
            <GrPrevious
              onClick={() => setToday(today.month(today.month() - 1))}
              className="text-[8px] lg:!text-[10px] cursor-pointer"
            />
            <p
              className="cursor-pointer text-[10px] lg:!text-xs"
              onClick={() => setToday(dayjs())}
            >
              Today
            </p>
            <GrNext
              onClick={() => setToday(today.month(today.month() + 1))}
              className="text-[8px] lg:!text-[10px] cursor-pointer"
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-7">
          {days.map((day, index) => (
            <h2
              className="text-[10px] lg:!text-xs h-7 lg:!h-10 grid place-content-center"
              key={index}
            >
              {day}
            </h2>
          ))}
        </div>
        <div className="w-full grid grid-cols-7">
          {DateCalender(today.month(), today.year()).map(
            ({ date, currentMonth, today: isToday }, index) => {
              const formattedDate = dayjs(date)
                .format("DD MMM YYYY")
                .toLowerCase();
              const isSelectedDate =
                selectedDate?.toLowerCase() === formattedDate;

              return (
                <div
                  key={index}
                  className="text-[10px] lg:!text-xs h-7 lg:!h-10 border-t grid place-content-center"
                >
                  <h2
                    className={` h-5 lg:!h-7 w-5 lg:!w-7 grid place-content-center rounded-full cursor-pointer ${
                      currentMonth ? "" : "text-gray-400"
                    } ${isToday ? "bg-red-600 text-white" : ""} ${
                      isSelectedDate ? "bg-[#18636F] text-white" : ""
                    }`}
                    onClick={() => {
                      onSelectDate(formattedDate);
                    }}
                  >
                    {date.date()}
                  </h2>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;
