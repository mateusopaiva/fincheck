import { CrossCircledIcon } from "@radix-ui/react-icons";
import { cn } from "../../../../app/utils/cn";
import { useState } from "react";
import { formatDate } from "../../../../app/utils/formateDate";
import { Popover } from "../../../components/Popover";
import { DatePicker } from "../../../components/DatePicker";

interface DatePickerInputProps {
  error?: string;
  className?: string;
}

export function DatePickerInput({ className, error }: DatePickerInputProps) {
  const [selectedDate, setSelectSingleContext] = useState(new Date());

  return (
    <div>
      <Popover.Root>
        <Popover.Trigger>
          <button
            type="button"
            className={cn(
              'bg-white w-full rounded-lg border border-gray-500 px-3 h-[52px] text-gray-700  focus:border-gray-800 transition-none outline-none text-left relative pt-4',
              error && '!border-red-900',
              className,
            )}
          >
            <span className="absolute text-gray-700 text-xs left-[13px] top-2 pointer-events-none">
              Data
            </span>
            <span>
              {formatDate(selectedDate)}
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Content>
          <DatePicker
            value={selectedDate}
            onChange={date => setSelectSingleContext(date)}
          />
        </Popover.Content>
      </Popover.Root>


      {error && (
        <div className="flex gap-2 items-center mt-2 text-red-900">
          <CrossCircledIcon />
          <span className=" text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
