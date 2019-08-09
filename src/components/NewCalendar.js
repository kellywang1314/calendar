/** 
 *  @author ynan_wang
 *  @param
 *      startDate:'2019-08-07' //默认今天
 *      endDate:'2010-08-07' //默认今天+365
 *      MonthNum:12 //日历展示的月数，默认12
 *      
 *      onDateClick:()=>{} //单击某个日期触发函数，默认空
 *      isShowMonthTitle:true //是否展示月份，默认true
 *      isShowWeekend:true //是否展示头部星期，默认true
 *      isShowFestive:true //是否展示节假日，默认true
 *      isShowTody:true //是否展示今天/明天/后天
 *      customValidDate:false //自定义可点击日期
 *      dateOptions:{  //自定义单个日期展示
 *          isValid:true  //customValidDate为true才生效
 *          className:自定义样式
 *          style:{}：支持style传入样式,
 *          subStr: //传入完整dom结构
 *      }
 * **/

 import React from 'react'
 import moment from 'moment'
 import DATE_LONG1 from '../constants/date-format'

 //日历类
 export default class NewCalendar extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    dealMonths = () =>{
        showMonth()
    }
    render() {
        const monthInfos = this.dealMonths(this.props)
        return (
            <div
                className='dp_calendar'
                ref={ele => {
                    this.calendar = ele
                }}
            >
                {this.props.showWeekHead && WeekHeader()}
                <div className='flex_column' style={{ position: 'relative' }}>
                    <section
                        className='cldunit'
                        style={{
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            WebkitFlex: 1,
                            flex: 1,
                        }}
                        ref={ele => (this.cldContent = ele)}
                    >
                        {monthInfos.map(info => {
                            return this.getMonthView(info)
                        })}
                    </section>
                </div>
            </div>
        )
    }
 }

 //week头
 export const WeekHeader = () => {
    const week = ['日', '一', '二', '三', '四', '五', '六']
    return (
        <ul className="cldweek" style={{ overflow: 'visible' }}>
            {week.map((wk, key) => {
                return <li key={key}>{wk}</li>
            })}
        </ul>
    )
 }

//计算展示的月份:MonthNum优先级大于endDate
const showMonth = (startDate,MonthNum,endDate) => {
    let monthobj = {}
    let start = moment(startDate).format(DATE_LONG1)
    console.log(start)
}