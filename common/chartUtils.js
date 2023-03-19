/*
 * @Date: 2022-03-02 15:27:34
 * @LastEditors: Kunyang Xie
 * @LastEditTime: 2022-03-05 09:58:14
 * @FilePath: \Money_Back\common\chartUtils.js
 */

const detailListUtils = require("./detailListUtils")

exports.dateToWeek = function (month, day) {
    month = month - 1
    let myDate = new Date()
    const year = myDate.getFullYear()
    const newYear = new Date(year, 0, 1)
    const today = new Date(year, month, day)
    firstWeekLen = 7 - newYear.getDay()
    lenUntilToday = (today - newYear) / (1000 * 3600 * 24)
    week = Math.floor((lenUntilToday - firstWeekLen) / 7 + 1 + 1)
    return week
}

exports.weekToDate = function (week) {
    const dat = require("date-and-time")
    var myDate = new Date()
    const year = myDate.getFullYear()
    // if week = 1
    const newYear = new Date(year, 0, 1)
    const firstOfWeek = dat.addDays(newYear, -newYear.getDay())
    // if week > 1
    const firstWeekLen = 7 - newYear.getDay()
    const secondWeek = dat.addDays(newYear, firstWeekLen)
    const requiredStart = dat.addDays(secondWeek, 7 * (week - 2))
    var start = week == 1 ? firstOfWeek : requiredStart
    var strArr = new Array(7)
    for (var i = 0; i < 7; i++) {
        current = dat.addDays(start, i)
        strArr[i] = detailListUtils.dateToString(
            current.getFullYear(),
            current.getMonth() + 1,
            current.getDate()
        )
    }
    return {
        list: strArr,
    }
}

exports.weekDaysNum = function (week, date) {
    let startMonth = detailListUtils.dateToNumber(date.list[0]).month
    let startDay = detailListUtils.dateToNumber(date.list[0]).day
    let daysPerWeek = 7
    if (week === "1") {
        if (startMonth === 12) {
            daysPerWeek = startDay - 25
        }
    } else {
        if (startMonth === 12 && startDay > 25) {
            daysPerWeek = 32 - startDay
        }
    }
    return daysPerWeek
}

exports.resCategoryRecord = function (data) {
    let temp = []
    let sum = 0
    for (let dataItem of data) {
        let sign = 0
        for (let tempItem of temp) {
            if (tempItem.category === dataItem.category) {
                sign = 1
                break
            }
        }
        if (sign === 1) {
            for (let tempItem of temp) {
                if (tempItem.category === dataItem.category) {
                    tempItem.amount = tempItem.amount + dataItem.amount
                    sum = sum + dataItem.amount
                    break
                }
            }
        } else {
            let component = {}
            component.category = dataItem.category
            component.icon = dataItem.icon
            component.type = 0
            component.amount = dataItem.amount

            sum = sum + dataItem.amount

            temp.push(component)
        }
    }
    for (let tempItem of temp) {
        tempItem.percentage = Math.round((tempItem.amount / sum) * 100)
    }

    temp = temp.sort(ascendingSort("percentage")).reverse()

    return temp
}

function ascendingSort(property) {
    return function (obj1, obj2) {
        let value1 = obj1[property]
        let value2 = obj2[property]
        return value1 - value2
    }
}

exports.sumAndAveArray = function (array) {
    let sumAndAve = new Map()

    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }

    let ave = sum / array.length

    sumAndAve.sum = sum
    sumAndAve.ave = ave.toFixed(2)
    return sumAndAve
}

exports.lineChartFormatWeek = function (data, date, daysPerWeek) {
    let dayList = new Map()
    let dateKeys = new Array()
    let dateValues = new Array()

    for (let i = 0; i < daysPerWeek; i++) {
        dateKeys.push(date.list[i])
    }

    for (let i = 0; i < daysPerWeek; i++) {
        dayList[dateKeys[i]] = 0
    }

    for (let i = 0; i < data.length; i++) {
        dayList[
            detailListUtils.dateToString(
                data[i].year,
                data[i].month,
                data[i].day
            )
        ] += data[i].amount
    }

    for (let key in dayList) {
        dateValues.push(dayList[key])
    }

    return dateValues
}

exports.xAxis = function (date, daysPerWeek) {
    let dayArray = new Array(daysPerWeek)
    for (let i = 0; i < daysPerWeek; i++) {
        dayArray[i] = date.list[6 - i]
    }
    dayArray.sort()

    for (let i = 0; i < daysPerWeek; i++) {
        let monthNum = detailListUtils.dateToNumber(dayArray[i]).month
        let dayNum = detailListUtils.dateToNumber(dayArray[i]).day
        dayArray[i] = dayArray[i] =
            monthNum.toString() + "-" + dayNum.toString()
    }

    return dayArray
}

exports.lineChartFormatYear = function (data) {
    let monthList = new Map()
    let monthValues = new Array()

    for (let i = 1; i <= 12; i++) {
        monthList[i] = 0
    }

    for (let i = 0; i < data.length; i++) {
        monthList[data[i].month] += data[i].amount
    }

    for (let key in monthList) {
        monthValues.push(monthList[key])
    }

    return monthValues
}

exports.monthDaysNum = function (year, month) {
    let date = new Date(year, month, 0)
    let days = date.getDate()
    return days
}

exports.lineChartFormatMonth = function (data, daysPerMonth) {
    let dayList = new Map()
    let dayValues = new Array()

    for (let i = 1; i <= daysPerMonth; i++) {
        dayList[i] = 0
    }

    for (let i = 0; i < data.length; i++) {
        dayList[data[i].day] += data[i].amount
    }

    for (let key in dayList) {
        dayValues.push(dayList[key])
    }

    return dayValues
}
