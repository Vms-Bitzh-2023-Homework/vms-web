export interface DateInfo {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    seconds: number;
    miniSecond: number;
    weak: number;
}
export interface FormatDateInfo {
    yyyy: string;
    MM: string;
    dd: string;
    HH: string;
    mm: string;
    ss: string;
    ms: string;
    w: string;
}

const _formatNormalize = (formatter: any) => {
    if (typeof formatter === "function") {
        return formatter;
    }
    if (typeof formatter !== "string") {
        throw new TypeError("formatter must be a string.");
    }
    if (formatter === "date") {
        formatter = "yyyy-MM-dd";
    } else if (formatter === "datetime") {
        formatter = "yyyy-MM-dd HH:mm:ss";
    }
    const formatterFunc = (formatDateInfo: FormatDateInfo) => {
        const { yyyy, MM, dd, HH, mm, ss, ms } = formatDateInfo;
        return formatter
            .replaceAll("yyyy", yyyy)
            .replaceAll("MM", MM)
            .replaceAll("dd", dd)
            .replaceAll("HH", HH)
            .replaceAll("mm", mm)
            .replaceAll("ss", ss)
            .replaceAll("ms", ms);
    };
    return formatterFunc;
};

/**
 * 格式化时间函数
 * @params date Date对象，传入当前时间
 * @params formatter 格式
 * @params isPad 是否补0，如果为false,则个位数时间仅有一位
 * @return string 根据格式返回的字符串
 * @example FormatDate(new Date(), 'date', true)
 * FormatDate(new Date(), 'datetime', true)
 * FormatDate(new Date(), 'yyyy-MM', true)
 * FormatDate(new Date(), 'yyyy-MM-dd HH:mm', true)
 * FormatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss', true)
 */
const FormatDate = (date: Date, formatter: any, isPad: boolean = false) => {
    formatter = _formatNormalize(formatter);
    const dateInfo: DateInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        seconds: date.getSeconds(),
        miniSecond: date.getMilliseconds(),
        weak: date.getDay()
    };
    const formatDateInfo: FormatDateInfo = {
        yyyy: dateInfo.year.toString(),
        MM: dateInfo.month.toString(),
        dd: dateInfo.date.toString(),
        HH: dateInfo.hour.toString(),
        mm: dateInfo.minute.toString(),
        ss: dateInfo.seconds.toString(),
        ms: dateInfo.miniSecond.toString(),
        w: dateInfo.weak.toString()
    };

    const _pad = (prop: keyof FormatDateInfo, len: number) => {
        formatDateInfo[prop] = formatDateInfo[prop].padStart(len, "0");
    };

    if (isPad) {
        _pad("yyyy", 4);
        _pad("MM", 2);
        _pad("dd", 2);
        _pad("HH", 2);
        _pad("mm", 2);
        _pad("ss", 2);
        _pad("ms", 2);
    }

    const result = formatter(formatDateInfo);
    return result;
};

export default FormatDate
