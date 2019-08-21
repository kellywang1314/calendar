import React from 'react'
import moment from 'moment'
import { WeekHeader } from './NewCalendar'
import NewCalendar from './NewCalendar'
import Calendar from './Calendar'
//传递参数例子
const calendarStartDate = '2019-5-16'
const calendarEndDate = '2019-11-01'
const displayMonthNum = 6
const DATE_LONG2 = 'YYYYMMDD'
const dailyMinPrices = [{'date':"2019-08-11",'price':832},{'date':"2019-08-22",'price':892},{'date':"2019-09-15",'price':892}]
let dateOptions = {}
        dailyMinPrices.filter(day => day.isValid !== false)
        .map((day, index) => {
            let priceInfo =
                day.price > 0 ? (
                    <span
                        key={0}
                        className={day.price === 832 ? 'cld_price cld_low' : 'cld_price'}
                    >
                        <dfn>¥</dfn>
                        {day.price}起
                    </span>
                ) : (
                    <span key={0} className="cld_price">
                        实时计价
                    </span>
                )
            moment(day.date).isBefore(moment(calendarStartDate)) ? dateOptions[day.date] = null :
            dateOptions[day.date] = {
                isValid: true,
                className: day.date === calendarStartDate ? 'cld_daystart' : null,
                subStr: moment(day.date).isBefore(moment(calendarEndDate).add(1, 'day')) ? [priceInfo] : null,
            }
        })
export default class NewCalendarTest extends React.Component{
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
                    <div className="new_pop_tit">
                        <WeekHeader />
                    </div>
                        <NewCalendar
                            HeadInfo={{title:'请选择日期',leftbtn:'取消',rightbtn:'确定'}}
                            showWeekHead={true}
                            showMonthHead = {true}
                            needFixedMonthHeader={true}
                            startDate={calendarStartDate}
                            endDate={calendarEndDate}
                            MonthNum={displayMonthNum}
                            dateOptions={dateOptions}
                            onItemClick={dayObj => {
                                alert(dayObj.date)
                                startDate === dayObj.date
                                    ? this.handleHideCalendar()
                                    : null
                            }}
                            itemstyle = {{'WeekHead':{top:'0px',left:'0px'}}}
                            customValidDate={true}
                            anchorDate={'2019-09-13'}
                        />
                </div>
            </div>
        </div>
        )
    }
}