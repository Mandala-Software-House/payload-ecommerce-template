"use client";

import { CalendarIcon } from "@heroicons/react/20/solid";
import { subDays, format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utilities/cn";

export function AdminDatePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (fromParam) {
      return {
        from: new Date(fromParam),
        to: toParam ? new Date(toParam) : undefined,
      };
    }

    return {
      from: subDays(new Date(), 30),
      to: new Date(),
    };
  });

  const setDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange) return;

    setDate(dateRange);

    const params = new URLSearchParams(searchParams);
    if (dateRange.from) {
      params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (dateRange.to) {
      params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    console.log(params.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("twp grid min-h-[36px] gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "border-payload-elevation-150 bg-payload-elevation-50 hover:bg-payload-background-color h-full w-[300px] justify-start gap-2 border text-left font-normal",
              !date && "text-payload-elevation-900",
            )}
          >
            <CalendarIcon className="-mt-[2px]" width={20} height={20} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-payload-elevation-150 bg-payload-elevation-50 w-auto rounded-lg p-0"
          align={isMobile ? "start" : "end"}
        >
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDateRange}
            numberOfMonths={2}
            classNames={{
              day_selected: "bg-payload-elevation-200 text-payload-elevation-0",
              day_range_start: "bg-payload-elevation-800 text-payload-elevation-0",
              day_range_end: "bg-payload-elevation-800 text-payload-elevation-0",
              day_range_middle: "bg-payload-elevation-200 text-payload-elevation-900",
              day_today: "bg-payload-elevation-200 text-payload-elevation-0",
              day_outside: "bg-transparent text-muted-foreground",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-payload-elevation-200/50 [&:has([aria-selected])]:bg-payload-elevation-200 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
