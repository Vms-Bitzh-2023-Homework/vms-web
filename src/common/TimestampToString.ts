interface TimeLong{
    years: number
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    minisecond: number,
    calcTemp?: number
}

const stampToString = (timestamp: number): TimeLong => {
    const re: TimeLong = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        minisecond: 0
    }
    re.calcTemp = timestamp

    re.years = Math.floor(re.calcTemp / (1000 * 60 * 60 * 24 * 30 * 12))
    re.calcTemp -= re.years * 1000 * 60 * 60 * 24 * 30 * 12

    re.months = Math.floor(re.calcTemp / (1000 * 60 * 60 * 24 * 30))
    re.calcTemp -= re.months * 1000 * 60 * 60 * 24 * 30

    re.days = Math.floor(re.calcTemp / (1000 * 60 * 60 * 24))
    re.calcTemp -= re.days * 1000 * 60 * 60 * 24

    re.hours = Math.floor(re.calcTemp / (1000 * 60 * 60))
    re.calcTemp -= re.hours * 1000 * 60 * 60

    re.minutes = Math.floor(re.calcTemp / (1000 * 60))
    re.calcTemp -= re.minutes * 1000 * 60

    re.seconds = Math.floor(re.calcTemp / 1000)
    re.calcTemp -= re.seconds * 1000

    re.minisecond = re.calcTemp

    return re
}

export default stampToString