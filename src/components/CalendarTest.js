import React from 'react'
import moment from 'moment'
import { WeekHeader } from './Calendar'
import Calendar from './Calendar'
const calendarStartDate = '2019-7-12'
const calendarEndDate = '2019-11-1'
const displayMonthNum = 3
const dateOptions = {}
const DATE_LONG2 = 'YYYYMMDD'
export default class CalendarTest extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            toggle:'none'
        }
    }
    handleHideCalendar(){
        this.setState({
            toggle:'none'
        })
    }

    handleShowCalendar(){
        this.setState({
            toggle:'block'
        })
    }
    render(){
        const { toggle } = this.state
        return (
        <div>
            <div onClick = {() => this.handleShowCalendar()}> tony chung! </div>
            <div className="new_mask" style={{display:`${toggle}`}}>
                <div className="new_bg" onClick={() => this.handleHideCalendar()} />
                <div className="new_pop_calendar slideInUp">
                    <div className="hd">
                        <span  onClick={() => this.handleHideCalendar()}>
                            取消
                        </span>
                        <h4>选择入住日期</h4>
                    </div>
                    <div className="new_pop_tit">
                        <WeekHeader />
                    </div>
                    <div className="new_calendar_con">
                        <Calendar
                            showWeekHead={false}
                            needFixedMonthHeader={false}
                            startDate={calendarStartDate}
                            endDate={calendarEndDate}
                            displayMonthNum={displayMonthNum}
                            dateOptions={dateOptions}
                            onItemClick={dayObj => {
                                alert(dayObj.date)
                                startDate === dayObj.date
                                    ? this.handleHideCalendar()
                                    : null
                            }}
                            idGenerator={dayObj => {
                                if (dayObj && dayObj.date) {
                                    return `jid-list-arrival-calendar-${moment(dayObj.date).format(
                                        DATE_LONG2,
                                    )}`
                                }
                                return null
                            }}
                            customValidDate={true}
                        />
                    </div>
                </div>
            </div>
        </div>
        )
    }
}