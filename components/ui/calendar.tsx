'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-4', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center mb-4',
                caption_label: 'text-base font-semibold text-stone-900',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-stone-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex gap-1 mb-2',
                head_cell: 'text-stone-600 rounded-md w-10 font-medium text-sm',
                row: 'flex w-full mt-2 gap-1',
                cell: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                    props.mode === 'range'
                        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                        : '[&:has([aria-selected])]:rounded-md'
                ),
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-10 w-10 p-0 font-normal hover:bg-stone-100 transition-colors cursor-pointer'
                ),
                day_range_start: 'day-range-start',
                day_range_end: 'day-range-end',
                day_selected:
                    'bg-stone-700 text-white hover:bg-stone-800 hover:text-white focus:bg-stone-700 focus:text-white',
                day_today: 'bg-stone-100 text-stone-900 font-semibold',
                day_outside:
                    'day-outside text-stone-400 opacity-50 aria-selected:bg-stone-100/50 aria-selected:text-stone-500 aria-selected:opacity-30',
                day_disabled: 'text-stone-400 opacity-50 cursor-not-allowed',
                day_range_middle:
                    'aria-selected:bg-stone-100 aria-selected:text-stone-900 hover:bg-stone-200',
                day_hidden: 'invisible',
                ...classNames
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />
            }}
            {...props}
        />
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
