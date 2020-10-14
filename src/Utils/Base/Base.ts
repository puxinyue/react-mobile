import { DateFormatType } from './BaseTypes';
import { Toast } from 'antd-mobile';
import { TagOutlined } from '@ant-design/icons';
import React from "react";
export const mapKey = "3180595fffa04cb3a0988d48ffad5422"; // 高德地图key值

/** 防抖
 * @param fn     回掉函数 
 * @param time   时间
 * @example
 *      debounce(() => {
 *          // 做些什么
 *      }, 500)
 */
export const debounce = (fn: any, time: number) => {
    let timer: NodeJS.Timeout | null = null;
    // tslint:disable-next-line:only-arrow-functions
    return function () {
        const self = debounce;
        const args = arguments;
        if(timer){ 
            clearTimeout(timer);
            timer = null;
        };
        timer = setTimeout(() => {
            fn.apply(self, args);
        }, time)
    }
}

/** 函数节流
 * @param fn    回调函数
 * @param time  时间
 * @example 
 *      throttle(() => {
 *             // 做些什么
 *      }, 1000)
 */
export const throttle = (fn:any, time: number) => {
    let timer: NodeJS.Timeout  | null = null;;
    let lastTime: number = Date.now();
    return function() {
        const nowTimer: number =  Date.now();
        const args = arguments;
        const context = throttle;
        if(nowTimer - lastTime > time) {
            if(time) {
                clearTimeout(timer!);
            }
            fn.apply(context, args);
            lastTime = Date.now();
        }else {
            if(!timer) {
                timer = setTimeout(() => {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }, time - (nowTimer - lastTime))
            }
        }
    }
}

/** 小数点经度问题,保留2位小数
 * @param str 数据
 */
export const decimal: (str: number) => number = (str: number) => {
    // 数字类型转换字符串
    const newStr: string = str.toString();
    // 截取.前面字符串
    const pointBeforeReg:RegExp = /\d+\./g;
    const pointBefore: string = newStr.match(pointBeforeReg)![0];
    // 截取.后面的2位
    const pointAfterReg:RegExp = /\.(\d+)/g;
    const pointAfter: string = newStr.match(pointAfterReg)![0].slice(1, 3);
    return Number(pointBefore + pointAfter);
}
/**时间格式化
 * @param day 当前时间
 */
export const dateFormat: (day: Date | number) => DateFormatType = (day: Date | number) => {
    let nowDayWeek: Date = new Date();
    
    if(toString.call(day) === "[object Number]") {
        if(day.toString().length < 13) {
            
            day = Number(day);
        }
        nowDayWeek = new Date(day)
    }else {
        nowDayWeek = day as Date;
    }
    const year = nowDayWeek.getFullYear();
    const month = nowDayWeek.getMonth() + 1;
    const nowDay = nowDayWeek.getDate();
    const hours =  nowDayWeek.getHours();
    const minutes = nowDayWeek.getMinutes();
    const seconds = nowDayWeek.getSeconds();
    const milliseconds = nowDayWeek.getMilliseconds();
    return {
        year,
        month,
        nowDay,
        hours,
        minutes,
        seconds,
        milliseconds
    }
}

// 获取url参数
export const getQueryVariable = (variable:string) => {
       const query = window.location.href.split('?');
       if(query.length > 1) {
        console.log(query);
        const vars = query[query.length - 1].split("&");
        for (let i=0;i<vars.length;i++) {
                const pair = vars[i].split("=");
                console.log(pair)
                if(pair[0] === variable){
                    return pair[1];
            }
        }
       }
       return '';
       
       
}

/**
 * Canvas高清分辨路显示模糊问题
 * @param context 屏幕大小
 */
const canvasRatio = (context: any) => {
    const backingStore = context ? context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1 : 1;
    return (window.devicePixelRatio || 1) / backingStore;
}

/** 图片转base64
 *  @param src  图片路径
 */
export const imgToBase64 = (src: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.width = 150;
        img.height = 150;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            const ratio = canvasRatio(ctx);
            if(ctx) {
                ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);
                const blur: number = 1;
                const canvasToBase64 = canvas.toDataURL("img/jpg", blur);
                resolve(canvasToBase64);
            }
        }
    }).then(res => {
        return res;
    })
}

/** base64转换bolb流
 *  @param base64  base64 地址
 */
export const base64ToBolb = (base64: string) => {
    return new Promise((resolve, reject) => {
        const arr = base64.split(",");
        if(arr && arr.length > 0) {
            const main = arr[0].match(/:(.*?);/);
            if(main) {
                const startBolb = main[0];
                const bolbStr = atob(arr[1]);
                let length = bolbStr.length;
                const unit8Arr = new Uint8Array(length);
                while(length--) {
                    unit8Arr[length] = bolbStr.charCodeAt(length);  
                }
                resolve(new Blob([unit8Arr], {type: startBolb})); 
            }
        }
    }).then(res => {
        console.log(res);
        return res;
    }).catch(err => {
        Toast.fail("图片上传失败,请重试");
        
    }) 
}

/** 是否刘海屏
 *  @returns true 是 false 否
 */
export const isIphoneX = (): boolean => {
    const { clientHeight, clientWidth } = document.documentElement;
    if(clientHeight / clientWidth <= 16 /9) {
        return false
    }
    return true
}



export const menuDevList = [
    // 系统管理
    {
      icon:  TagOutlined,
      index: Math.random() + '',
      title: '系统管理',
      roleTypes: 'admin:manage',
      subList: [{
        label: "资源权限",
        icon: TagOutlined,
        roleTypes: 'back:resourcePer',
        subs: [{
          index: 'roleList',
          title: '角色管理',
          roleTypes: 'admin:role:list'
        }, {
          index: 'userList',
          title: '用户管理',
          roleTypes: 'admin:sysUser:list'
        }, {
          index: 'resourceList',
          title: '资源管理',
          roleTypes: 'admin:sysPermission:list'
        }]
      }
    ],
    },
    // 运营管理
    {
      icon: 'el-icon-date',
      index: Math.random() + '',
      title: '运营管理',
      roleTypes: 'back:operate',
      subList: [{
        label: "标签管理",
        roleTypes: 'back:sysTag',
        subs: [{
          index: 'tagsList',
          title: '标签管理',
          roleTypes: 'back:sysTag:list'
        }, {
          index: 'tagsGrouped',
          title: '标签分组',
          roleTypes: 'back:sysTagGroup:list'
        }]
      },
      // 分类管理
      {
        label: "分类管理",
        roleTypes: 'back:sysClassify',
        subs: [{
          index: 'classifyList',
          title: '分类管理',
          roleTypes: 'back:sysClassify:list'
        }]
      },
      // 会员级别
      {
        label: "会员级别",
        roleTypes: 'back:memberLevel',
        subs: [{
          index: 'membershipGradeList',
          title: '会员级别',
          roleTypes: 'back:memberLevel:list'
        }]
      },
      // 价格策略
      {
        label: "价格策略",
        roleTypes: 'back:priceTacticsBase',
        subs: [{
          index: 'priceStrategyList',
          title: '价格策略',
          roleTypes: 'back:priceTacticsBase:list'
        },
        {
          index: 'worksPricingList',
          title: '单品定价',
          roleTypes: 'back:priceTacticsBase:skuList'
        },
        {
          index: 'sampleReelsPriceList',
          title: '作品集定价',
          roleTypes: 'back:priceTacticsBase:setList'
        },
        
      ]
      },
      // 广告位管理
      {
        label: "广告管理",
        roleTypes: 'back:advert',
        subs: [{
          index: 'advertisingManagementList',
          title: '广告位管理',
          roleTypes: 'back:advert:list'
        },{
          index: 'scheduleList',
          title: '排程管理',
          roleTypes: 'back:advertSchedule:list'
        }]
      },
      // 大小专题
      {
        label: "大小专题",
        roleTypes: 'back:subjectBase',
        subs: [{
          index: 'littlespecialList',
          title: '小专题管理',
          roleTypes: 'back:subjectBase:list'
        }]
      },
      // 首页 homeAppList
      {
        label: "首页管理",
        roleTypes: 'back:zFirst',
        subs: [{
          index: 'homeAppList',
          title: '一天一书',
          roleTypes: 'back:zFirst:list'
        }]
      },
      
      // {
      //   index: 'preferential',
      //   label: "优惠促销",
      //   roleTypes: 'back:advert',
      //   subs:[{
      //     index: 'sales',
      //     title: '促销',
      //     roleTypes: 'back:memberCardSku:list'
      //   }]
      // }
      // 动态管理
      {
        label: "动态管理",
        roleTypes: 'back:dynamic',
        subs: [{
          index: 'commentList',
          title: '动态管理',
          roleTypes: 'back:dynamic:list'
        }]
      },
      {
          label: "举报投诉",
          roleTypes: 'back:tipOff',
          subs: [
            {
              index: 'report',
              title: '举报列表',
              roleTypes: 'back:tipOff:list'
            }
          ]
      },
    //   {
    //       label: "海报列表",
    //       roleTypes: 'back:tipOff',
    //       subs: [
    //         {
    //           index: 'poster',
    //           title: '海报列表',
    //           roleTypes: 'back:tipOff:list'
    //         }
    //       ]
    //   }
    ],
    },
    // 内容管理
    {
      icon: 'el-icon-date',
      index: Math.random() + '',
      title: '内容管理',
      roleTypes: 'back:content',
      subList: [{
        label: "资源管理",
        roleTypes: 'back:resource',
        subs: [{
          index: 'coverList',
          title: '封面管理',
          roleTypes: 'back:worksCover:list'
        }, {
          index: 'avManagementList',
          title: '媒体资源',
          roleTypes: 'back:mediaFile:list'
        }, {
          index: 'articleManList',
          title: '文章管理',
          roleTypes: 'back:articleBase:list'
        }, {
          index: 'authorList',
          title: '作者管理',
          roleTypes: 'back:authorBase:list'
        }, {
          index: 'publishersList',
          title: '出版方管理',
          roleTypes: 'back:publisherBase:list'
        }, {
          index: 'bookMegList',
          title: '书籍管理',
          roleTypes: 'back:booksBase:list'
        }]
      }, {
        label: "作品管理",
        roleTypes: 'back:projectSetBase',
        subs: [{
          index: 'sampleReelsList',
          title: '作品集管理',
          roleTypes: 'back:projectSetBase:list'
        }, {
          index: 'sampleReelsBaseList',
          title: '作品管理',
          roleTypes: 'back:projectsBase:list'
        },
        {
          index: 'course',
          title: '课程',
          roleTypes: 'back:courseBase:list',
        }
      ]
      }],
    },
    // 应用管理
    {
      icon: 'el-icon-date',
      index: Math.random() + '',
      title: '应用管理',
      roleTypes: 'back:application',
      subList: [{
        label: "系统参数",
        roleTypes: 'back:sysArticle',
        subs: [{
          index: 'systemArticleList',
          title: '系统文章',
          roleTypes: 'back:sysArticle:list'
        },{
          index: 'systemParameterList',
          title: '系统参数',
          roleTypes: 'back:sysParams:list'
        }]
      },
      {
        label: "APP管理",
        roleTypes: 'back:platform',
        subs: [{
          index: 'appManagementList',
          title: 'APP管理',
          roleTypes: 'back:platform:list'
        }]
      },
  
    ]
    },
      // 会员卡管理
  
    {
      icon: 'el-icon-date',
      index: Math.random() + '',
      title: '商品管理',
      roleTypes: 'back:memberCardSpu',
      subList: [
        {
          label: '商品管理',
          index: 'memberSpuList',
          title: '商品管理',
          roleTypes: 'back:memberCardSpu:list',
          subs: [{
            index: 'memberSpuList',
            title: 'SPU管理',
            roleTypes: 'back:memberCardSpu:list'
          },
          {
            index: 'memberSkuList',
            title: 'SKU管理',
            roleTypes: 'back:memberCardSku:list'
          }
        ]
        },
      ]
    },
    // vipTag, orderTag, financeTag
  ]






