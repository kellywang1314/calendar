/** 
 *  @author ynan_wang
 *  @param
 *      startDate:'2019-08-07' //默认今天
 *      endDate:'2010-08-07' //默认今天+365
 *      MonthNum:12 //日历展示的月数，默认12
 *      itemstyle: //每个模块的自定义样式
 *      HeadInfo: //日历头部标题，取消，确定
 *      onItemClick:()=>{} //单击某个日期触发函数，默认空
 *      isShowMonthTitle:true //是否展示月份，默认true
 *      isShowWeekend:true //是否展示头部星期，默认true
 *      isShowFestive:true //是否展示节假日，默认true
 *      isShowTody:true //是否展示今天/明天/后天
 *      customValidDate:false //自定义可点击日期
 *      dateOptions:{  //自定义单个日期展示
 *          isValid:true  //customValidDate为true才生效
 *          className:自定义样式
 *          style:{}：支持style传入样式,
 *      },
 *      anchorDate:'2019-08-13' //锚定日期，因为获取不到高度，暂时有问题
 * **/

 import React from 'react'
 import moment from 'moment'
 import { DATE_LONG1 }  from '../constants/date-format'
 import { solarHoliday, Holiday } from '../constants/holiday'

 //日历类
 const scrollEvents = ['scroll', 'touchmove']
 export default class Calendar extends React.Component{
    static defaultProps = {
        startDate :moment(new Date()),
        endDate:moment(new Date()).add(365,'D'),
        MonthNum:12,
        itemstyle:{},
        HeadInfo:{},
        onItemClick:()=>{},
        showWeekHead: true,
        showMonthHead:true,
        needFixedMonthHeader: true,
        dateOptions:{},
        customValidDate:true,
        anchorDate:''
    }
    constructor(props){
        super(props)
        this.state = {
            holidayInfo: {},
            toggle:'block'
        }
        this.monthHeaders = [] //所有月份头DOM
        this.monthHeadersTop = [] //所有月份头距顶部的距离
        this.fixedMonthHeaderTop = 0
        this.scrollInfo = {
            scrollTop: 0
        }
        this.onCalendarScroll = this.onCalendarScroll.bind(this)
    }

   componentDidMount(){
        this.getHolidays().then((resp) =>{
            this.setState({
                holidayInfo:resp
            })
        })  
        this.didTimer && clearTimeout(this.didTimer)
        //和css加载有时序影响，这里一定要加setTimeout
        this.didTimer = setTimeout(() => {
            //需要月份头固定
            if (this.props.needFixedMonthHeader) {
                this.bindScrollEvent()
                this.computeMonthHeaderTop()
                this.initMonthHeaderFixed()
            }
            if (this.props.anchorDate) {
                //需要锚定到某个日期
                this.anchorDate()
            }
        }, 0)
    }

    componentWillUnmount() {
        this.didTimer && clearTimeout(this.didTimer)
        this.unbindScrollEvent()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.needFixedMonthHeader) {
            this.bindScrollEvent()
            this.computeMonthHeaderTop()
        } else {
            this.unbindScrollEvent()
        }
    }

    /********************* 月份数据结构化 ********************************/
    //计算展示的月份
    dealMonths = (props) =>{
        let {startDate = '', MonthNum = 0} = props
        let res = []
        let startdate = moment(startDate)
        let enddate = moment(startDate).add(MonthNum,'M')
        //是否展示今明后
        let now = moment(new Date()).format(DATE_LONG1)
        let tomorrow = moment(new Date()).add(1,'day').format(DATE_LONG1)
        let nexttomorrow = moment(new Date()).add(2,'day').format(DATE_LONG1)
        let showtoday = {
            [now]:'今天',
            [tomorrow]:'明天',
            [nexttomorrow ]:'后天',
        }
        while(enddate.diff(startdate,'M') > 0){
            let obj = {}, key = `${startdate.get('Y')}-${('00'+(startdate.get('M')+1)).substr(-2)}`
            obj["showMonth"] = key
            obj["daylists"] = this.dealDates(key,props,showtoday)
            res.push(obj)
            startdate = startdate.add(1,'M')
        }
        return res
    }

    dealDates = (key,props,showtoday) =>{
        let { dateOptions,isShowFestive,anchorDate,startDate,endDate,customValidDate} = props
        let { holidayInfo = {} } = this.state
        let startdate = moment(startDate),enddate = moment(endDate),nowdate = moment(new Date)
        let daylists = []
        //计算每个月前面空余几天,通过星期计算，该月第一个月星期几就空几天
        let empty = moment(key).day()
        for(let i=0;i<empty;i++){
            daylists.push({day:''})
        }
        //正常的日期
        let days = moment(key).daysInMonth()
        let monthinfo = key
        for(let i=1;i<=days;i++){
            let date = monthinfo + '-'+('00'+i).substr(-2)
            let day = i || showtoday[date]
            let option = dateOptions[date] || {}
            let holidaystr = '',className= ''
            //节假日样式处理
            if(isShowFestive){
                if(holidayInfo && holidayInfo.length>1){
                    holidaystr = holidayInfo[workDay][date] || holidayInfo[holiday][date] || holidayInfo[restDay][date]
                if (holidayInfo[workDay][date]) {
                    className = 'cld_working'
                } else if (holidayInfo[restDay][date]) {
                    className = 'cld_holiday'
                }
                }else {
                    holidaystr = solarHoliday[date]
                }
            }
            if (date === anchorDate) className += ' anchorDate'
            let isValid = true
            if (customValidDate) {
                isValid = option.isValid
            } else {
                isValid = !(nowdate < startdate || nowdate > enddate)
            }
            let dayObj = {
                date,
                day,
                holidaystr,
                isValid,
                option,
                className,
            }
            daylists.push(dayObj)
        }
        return daylists
    }

    //节假日的处理，这个每年都会变，需要配置
    getHolidays = () =>{
       return fetch(Holiday).then(response => {
            return response.text().then(responseText => {
                const responseData = JSON.parse(responseText)
                const configData = JSON.parse(responseData.rspJsonStr)
                return formatHolidayInfo(configData.configList[0])  
            })
        })
    }

    /********************* 事件相关 ********************************/
    //点击事件
    handleCancel = () =>{

    }

    handleOk = () => {

    }

    handleClick = dayObj => e => {
        this.props.onItemClick(dayObj)
    }

    handleHideCalendar(){
        this.props.handleHideCalendar() 
    }

    /* 滚动事件相关 */
    bindScrollEvent() {
        scrollEvents.forEach(event => {
            this.cldContent.removeEventListener(event, this.onCalendarScroll)
            this.cldContent.addEventListener(event, this.onCalendarScroll)
        })
    }
    unbindScrollEvent() {
        scrollEvents.forEach(event => {
            this.cldContent.removeEventListener(event, this.onCalendarScroll)
        })
    }

    onCalendarScroll() {
        const scrollTop = this.cldContent.scrollTop
        this.props.handleScroll && this.props.handleScroll(scrollTop)
        const monthHeadersTop = this.monthHeadersTop
        const length = monthHeadersTop.length
        for(let i = 0; i < length; i++){
            let height = monthHeadersTop[i]
            if(scrollTop >= height && (scrollTop < monthHeadersTop[i + 1] || i === length - 1)){
                this.fixedMonthHeader.innerHTML = this.monthHeaders[i] && this.monthHeaders[i].innerHTML
                return
            }
        }  
    }
    //clone一个吸顶元素
    initMonthHeaderFixed() {
        const { showWeekHead } = this.props
        if(this.monthHeaders.length){
            let currentMonthHeader = this.monthHeaders[0]
            this.monthHeaderHeight = currentMonthHeader.scrollHeight
            this.fixedMonthHeader = currentMonthHeader.cloneNode(true)
            this.fixedMonthHeader.className = "cldmonth_fixed"
            this.fixedMonthHeader.style.position = 'absolute'
            this.fixedMonthHeader.style.top = '25px'
            this.cldContent.parentNode.appendChild(this.fixedMonthHeader)
        }
    }
    anchorDate() {
        const anchorDateDom = this.cldContent.getElementsByClassName('anchorDate')[0]
        console.log(anchorDateDom.getBoundingClientRect())
        if (anchorDateDom) {
            this.cldContent.scrollTop =
                anchorDateDom.offsetTop + anchorDateDom.parentNode.offsetTop - this.monthHeaderHeight
        }
    }
    computeMonthHeaderTop() {
        this.monthHeaders = this.cldContent.getElementsByClassName('month_header') || []
        this.monthHeadersTop = [];
        [].forEach.call(this.monthHeaders, item => {
            this.monthHeadersTop.push(item.offsetTop)
        })
    }


    /********************* 渲染相关 ********************************/
    //render每个日期
    getMonthView(info,index) {
        const { showMonth, daylists } = info
        const monthTitle = (
            <h2 key={showMonth + 'title'} className='cldmonth month_header'>
                {showMonth}
            </h2>
        )
        const daysDom = (
            <ul className="cld_daybox" key={showMonth}>
                {daylists.map((dayObj, key) => {
                    const { day, isValid, option = {}, holidaystr, className = '' } = dayObj
                    //日期主体部分
                    let style = option.style || {}
                    let optionClass = option.className || ''
                    //日期子类（例如在日期上显示价格等）
                    let subStr = option.subStr || '' //调用者传递完整的日期子类结构，此时下面三个不生效
                    let subClass = option.subClass || ''
                    let subStyle = option.subStyle || ''
                    let subText = option.subText || ''
                    return (
                        <li
                            key={key}
                            onClick={isValid ? this.handleClick(dayObj) : undefined}
                            className={`${optionClass} ${!isValid ? 'cld_daypass' : ''} ${
                                className === 'cld_working' && !isValid ? '' : className
                            }`}
                            style={style}
                        >
                            {holidaystr ? <ins>{holidaystr}</ins> : null}
                            <em>{day}</em>
                            {subStr ? (
                                subStr
                            ) : (
                                <span className={subClass} style={{subStyle}}>
                                    {subText}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ul>
        )
        return this.props.showMonthHead ? [monthTitle, daysDom] : [daysDom]
    }
    render() {
        const monthInfos = this.dealMonths(this.props) || []
        const {itemstyle:{ WeekHead },HeadInfo = {}} = this.props
        const { toggle } = this.state
        return (
            <div id="calendar" className="new_calendar_con"  ref={ele => (this.cldContent = ele)}>
                <div className="hd">
                    {HeadInfo && HeadInfo.leftbtn && <span  onClick={() => this.handleHideCalendar()}>
                            {HeadInfo.leftbtn}
                        </span>
                    }
                    {HeadInfo && HeadInfo.title && <h4>{HeadInfo.title}</h4>}
                    {HeadInfo && HeadInfo.rightbtn && <span  className="rightbtn" onClick={() => this.handleHideCalendar() }>
                        {HeadInfo.rightbtn}
                    </span>
                    }
                </div>
                {this.props.showWeekHead && 
                    <div  className="new_pop_tit" style={WeekHead}>
                        {WeekHeader()}
                    </div >
                }
                <div
                    className='dp_calendar'
                    ref={ele => {
                        this.calendar = ele
                    }}
                >
                    <div className='flex_column' style={{ position: 'relative'}}>
                        <section
                            className='cldunit'
                            style={{
                                overflowY: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                WebkitFlex: 1,
                                flex: 1,
                            }}
                            
                        >
                           {monthInfos.map(info => {
                            return this.getMonthView(info)
                        })}
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

 //该格式还可以直接配置
 const formatHolidayInfo = holidayData => {
    let result = {
        workDay: {},  //调休，即放假前周末上班日期（坑货)，这些日期显示班
        restDay: {},  // 休
        holiday: {},  //假日
    }
    const holidayContent = JSON.parse(holidayData.configContent)
    const holidayArr = holidayContent.Holiday
    console.log(holidayArr)
    holidayArr.forEach(item => {
        const { Year: year, HolidayList: holidayList } = item
        holidayList.forEach(holidayItem => {
            const {
                HolidayDay: holidayDay,
                HolidayCount: holidayCount,
                StartDay: startDay,
                EndDay: endDay,
                HolidayName: holidayName,
                WorkDay: workDay,
            } = holidayItem

            //假期开始日期
            holidayDay &&
                (result.holiday[`${year}-${holidayDay.slice(0, 2)}-${holidayDay.slice(-2)}`] = holidayName)
            //调休
            if (workDay) {
                const workDayArr = workDay.split(',')
                workDayArr.forEach(workDayItem => {
                    result.workDay[`${year}-${workDayItem.slice(0, 2)}-${workDayItem.slice(-2)}`] = '班'
                })
            }
            //假期长度
            let tempDate = moment(`${year}/${startDay.slice(0, 2)}/${startDay.slice(-2)}`)
            const endDate = moment(`${year}/${endDay.slice(0, 2)}/${endDay.slice(-2)}`)
            while (endDate.diff(tempDate)>0 && holidayCount) {
                const monthStr = ('0' + (tempDate.get("M") + 1)).slice(-2)
                const dayStr = ('0' + tempDate.get("D")).slice(-2)
                result.restDay[`${year}-${monthStr}-${dayStr}`] = '休'
                tempDate = tempDate.add(1,'day')
            }
        })
    })
    return result
}

//二分查找
function binsearch(arr,low,high,target){
    if(low > high) return -1
    let mid = Math.floor((low+high)/2)
    if(arr[mid] > target){
        return binsearch(arr,low,mid-1,target)
    }else if(arr[mid] < target){
        return binsearch(arr,mid+1,high,target)
    }else{
        return mid
    }
}

//冒泡
function bubble(arr){
    for(let i=0;i<arr.length-1;i++){
        for(let j=0;j<arr.length-i-1;j++){
            if(arr[j]>arr[j+1]){
                let temp = arr[j]
                arr[j]=arr[j+1]
                arr[j+1]=temp
            } 
        }
    }
    return arr
}

//快排
function quickSort(arr){
    if(arr.length<=1){
        return arr
    }
    let pos = Math.floor(arr.length/2)
    let posvalue = arr.splice(pos,1)[0]
    let low = [],high = []
    for(let i=0;i<arr.length;i++){
        if(arr[i]<posvalue){
            low.push(arr[i])
        }else{
            high.push(arr[i])
        }
    }
    return quickSort(low).concat([posvalue],quickSort(high))
}

//Lazyman

class _Lazyman{
    constructor(name){
        this.name = name
        this.tasks = []
        let task = () =>{
            console.log(`Hi! this is ${this.name}`)
            this.next()
        }
        this.tasks.push(task)
        setTimeout(() => {
            this.next()
        },0)
    }

    next(){
        let task = this.tasks.shift()
        task && task()
    }

    eat(something){
        let task = () =>{
            console.log(`Eat ${something}`)
            this.next()
        }
        this.tasks.push(task)
        return this
    }

    sleep(time){
        this._sleep(time,false)
        return this
    }

    sleepFirst(time){
        this._sleep(time,true)
        return this
    }

    _sleep(time,first){
        let task = () =>{
            setTimeout(() => {
                console.log(`Wake up ${time}`)
                this.next()
            },time*1000)  
        }
        if(first){
            this.tasks.unshift(task)
        }else{
            this.tasks.push(task)
        }
    }   
}
function Lazyman(name){
    return new _Lazyman(name)
}