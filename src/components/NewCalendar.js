/** 
 *  @author ynan_wang
 *  @param
 *      startDate:'2019-08-07' //默认今天
 *      endDate:'2010-08-07' //默认今天+365
 *      MonthNum:12 //日历展示的月数，默认12
 *      itemstyle: //每个模块的自定义样式
 *      HeadInfo: //日历头部标题，取消，确定
 *      onDateClick:()=>{} //单击某个日期触发函数，默认空
 *      isShowMonthTitle:true //是否展示月份，默认true
 *      isShowWeekend:true //是否展示头部星期，默认true
 *      isShowFestive:true //是否展示节假日，默认true
 *      isShowTody:true //是否展示今天/明天/后天
 *      customValidDate:false //自定义可点击日期
 *      dateOptions:{  //自定义单个日期展示
 *          isValid:true  //customValidDate为true才生效
 *          className:自定义样式
 *          datestyle:{}：支持style传入样式,
 *          datedom: //传入完整dom结构
 *      },
 *      anchorDate:'2019-08-13' //锚定日期
 * **/

 import React from 'react'
 import moment from 'moment'
 import { DATE_LONG1 }  from '../constants/date-format'
 import {solarHoliday, Holiday} from '../constants/holiday'

 //日历类
 export default class NewCalendar extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    //计算展示的月份
    dealMonths = (props) =>{
        let {startDate = '', MonthNum = 0} = props
        let res = []
        let startdate = moment(startDate)
        let enddate = moment(startDate).add(MonthNum,'M')
        //是否展示今明后
        let now = moment(new Date()).format(DATE_LONG1)
        console.log(now)
        let tomorrow = moment(new Date()).add(1,'day').format(DATE_LONG1)
        let nexttomorrow = moment(new Date()).add(2,'day').format(DATE_LONG1)
        let showtoday = {
            [now]:'今天',
            [tomorrow]:'明天',
            [nexttomorrow ]:'后天',
        }
        while(enddate.diff(startdate,'M') > 0){
            let obj = {}, key = `${startdate.get('Y')}-${('00'+(startdate.get('M')+1)).substr(-2)}`
            obj[key] = this.dealDates(key,props,showtoday)
            res.push(obj)
            startdate = startdate.add(1,'M')
        }
       
        console.log(res)
        return res
    }

    /**
     * 月份下的每一天的数据结构,后面可补充
     * dateobj = {
     *      datedom,
     *      datestyle,
     *      isvalid: 标志该天是不是合法，比如价格日历，如果该天没有价格，就认为不合法，禁止用户对它的操作
     *  }
     * 
     * 
     */
    dealDates = (key,props,showtoday) =>{
        let { dateOptions,isShowFestive,anchorDate} = props
        let datelist = []
        //计算每个月前面空余几天,通过星期计算，改月第一个月星期几就空几天
        let empty = moment(key).day()
        for(let i=0;i<empty;i++){
            datelist.push({day:''})
        }
        //正常的日期
        let days = moment(key).daysInMonth()
        let monthinfo = key
        for(let i=1;i<=days;i++){
            let date = monthinfo + '-'+('00'+i).substr(-2)
            let day = i || showtoday[date]
            let dateobj = dateOptions[date] || {}
            let { datedom=null, datestyle={}, isvalid=false } = dateobj
            if(isShowFestive){

            }
        }
    }


    handleCancel = () =>{

    }

    handleOk = () => {

    }
    render() {
        const monthInfos = this.dealMonths(this.props) || []
        const WeekHeadStyle = this.props.itemstyle.WeekHead
        const HeadInfo = this.props.HeadInfo
        return (
            <div id="calendar">
                <div className="hd">
                    {HeadInfo.leftbtn && <span  onClick={() => this.handleCancel()}>
                            {HeadInfo.leftbtn}
                        </span>
                    }
                    {HeadInfo.title && <h4>{HeadInfo.title}</h4>}
                    {HeadInfo.rightbtn && <span  className="rightbtn" onClick={() => this.handleOk() }>
                        {HeadInfo.rightbtn}
                    </span>
                    }
                </div>
                {this.props.showWeekHead && 
                    <div  className="new_pop_tit" style={WeekHeadStyle}>
                        {WeekHeader()}
                    </div >
                    }
                <div
                    className='dp_calendar'
                    ref={ele => {
                        this.calendar = ele
                    }}
                >
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
                            {/* {monthInfos.map(info => {
                                return this.getMonthView(info)
                            })} */}
                        </section>
                    </div>
                </div>
        </div>
        )
    }
 }

 //week头
 export const WeekHeader = () => {
    const week = ['日', '一', '二', '三', '四', '五', '六']
    return (
        <ul className="cldweek">
            {week.map((wk, key) => {
                return <li key={key}>{wk}</li>
            })}
        </ul>
    )
 }

