
/**
 * 日历接口定义
 */
interface Calendar{
    /*
     * 日历初始日期
     * startDate:'2019-08-07' //默认今天
     */
    startDate: string
    /*
     * 日历结束日期
     * startDate:'2020-08-07' //默认今天+365
     */
    endDate?: string
     /*
     * 日历展示的月数
     * MonthNum:12 //默认12
     */
    MonthNum: number
     /*
     * 锚定日期
     * anchorDate:''
     */
    anchorDate:string
    /*
     * 不同模块自定义样式
     * itemstyle:{} //默认{}
     */
    itemstyle?:{}
     /*
     * 日历头部信息
     * HeadInfo:{} //默认{}
     */
    HeadInfo?:{}
     /*
     * 是否展示日历标题
     * isShowMonthTitle:true
     */
    isShowMonthTitle:boolean
     /*
     * 是否展示日历头部星期
     * isShowMonthTitle:true
     */
    isShowWeekend:boolean
     /*
     * 是否展示节假日
     * isShowMonthTitle:true
     */
    isShowFestive:boolean
     /*
     * 是否展示今天/明天/后天
     * isShowMonthTitle:true
     */
    isShowTody:boolean
     /*
     * 是否自定义可点击日期
     * isShowMonthTitle:false
     */
    customValidDate:boolean
     /*
     * 单击日期触发的函数
     * onItemClick:()=>{} //默认()=>{}
     */
    onItemClick:(dateobj:{}) => void

     /*
     * 自定义单个日期展示
     * onItemClick:{}
     */
     dateOptions:{
        isValid:boolean  //customValidDate为true才生效
        className:string
        style:any
     }

    /*
     * 月份处理函数
     */
     dealMonths:(any) => Array<any>

    /*
     * 每日处理函数
     */
    dealDates:(key:any,props:any,showtoday:any) => Array<any>


}