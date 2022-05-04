// 1. 饼形图 封装函数 方便ajax渲染
function setPie(arr) {
  let myChart = echarts.init(document.querySelector('.pie'))
  let option = {
    // 添加标题组件
    title: {
      text: '籍贯 Hometown',
      textStyle: {
        color: '#6d767e'
      },
    },
    tooltip: {
      // {a}系列名称 {b}name {c}value 
      formatter: '{a}<br>{b}:{c}人  占比:{d}%'
    },
    series: [{
      name: '各地人员分布',
      type: 'pie',
      radius: ['10%', '65%'],
      center: ['50%', '50%'],
      roseType: 'area', // 面积模式 或者 半径模式
      itemStyle: {
        borderRadius: 4 // 扇形边缘圆角设置
      },
      data: arr
    }]
  }
  myChart.setOption(option)
}



// 2. 折线图
function setLine(obj) {
  let myChart = echarts.init(document.querySelector('.line'))
  let option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      text: '薪资 Salary',
      textStyle: {
        color: '#6d767e'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: obj.name
    },

    yAxis: {
      type: 'value',
      // y 轴最大值最小值范围
      boundaryGap: [0, '50%']
    },
    dataZoom: [{
        type: 'slider',
        start: 0,
        end: 50
      },
      {
        start: 0,
        end: 10
      }
    ],
    // 添加图例组件
    legend: {
      top: 20
    },
    color: ['#ee6666', '#5470c6'],
    series: [{
        name: '期望薪资',
        type: 'line',
        symbol: 'none', // circle圆点 none无状态
        smooth: true, // 转折位置是否平滑
        sampling: 'lttb',
        data: obj.salary
      },
      {
        name: '实际薪资',
        type: 'line',
        symbol: 'none',
        smooth: true,
        sampling: 'lttb',
        data: obj.truesalary
      }

    ]
  };
  myChart.setOption(option)
}

// 3. 柱形图
function setBar(obj) {
  let myChart = echarts.init(document.querySelector('.barChart'))
  let option = {
    grid: {
      top: 30,
      bottom: 30,
      left: '7%',
      right: '7%'
    },
    legend: {
      // legend 删除data属性 series中的name属性
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    xAxis: [{
      type: 'category',
      data: obj.group,
      axisPointer: {
        type: 'shadow' // 鼠标放入有阴影
      }
    }],
    yAxis: [{
        type: 'value',
        min: 0,
        max: 100,
        interval: 10, // 间隔
        axisLabel: {
          formatter: '{value} 分'
        }
      },
      {
        type: 'value',
        min: 0,
        max: 10,
        interval: 1,
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [{
        name: '平均分',
        type: 'bar',
        barWidth: '15', // 柱形图宽度
        data: obj.avgScore,
      },
      {
        name: '低于60分人数',
        type: 'bar',
        yAxisIndex: 1, // Y轴索引，1表示使用第2个Y轴
        barWidth: '15', // 柱形图宽度
        data: obj.lt60,
      },
      {
        name: '60到80分之间',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: '15', // 柱形图宽度
        data: obj.gt60,
      },
      {
        name: '高于80分人数',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: '15', // 柱形图宽度
        data: obj.gt80,
      },

    ]
  };
  myChart.setOption(option)
}


// 4. 地图
function setMap(obj, arr) {
  let myChart = echarts.init(document.querySelector('.map'))
  // 位置 + 经纬度
  var chinaGeoCoordMap = obj;
  var chinaDatas = arr;

  var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = chinaGeoCoordMap[dataItem[0].name];
      var toCoord = [116.4551, 40.2539]; // 目标点经纬度（北京顺义校区）
      if (fromCoord && toCoord) {
        res.push([{
          coord: fromCoord,
          value: dataItem[0].value
        }, {
          coord: toCoord,
        }]);
      }
    }
    return res;
  };
  var series = [];
  [
    ['顺义校区', chinaDatas]
  ].forEach(function (item, i) {
    series.push({
        type: 'lines',
        zlevel: 2,
        effect: {
          show: true,
          period: 4, //箭头指向速度，值越小速度越快
          trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: 'arrow', //箭头图标
          symbolSize: 5, //图标大小
        },
        lineStyle: {
          normal: {
            width: 1, //尾迹线条宽度
            opacity: 1, //尾迹线条透明度
            curveness: 0.2 //尾迹线条曲直度
          }
        },
        data: convertData(item[1])
      }, {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: { //涟漪特效
          period: 4, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 4 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: true,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function (params) { //圆环显示文字
              return params.data.name;
            },
            fontSize: 12
          },
          emphasis: {
            show: true
          }
        },
        symbol: 'circle',
        symbolSize: function (val) {
          return 4 + val[2] * 5; //圆环大小
        },
        itemStyle: {
          normal: {
            show: false,
            color: '#f00'
          }
        },
        data: item[1].map(function (dataItem) {
          return {
            name: dataItem[0].name,
            value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
          };
        }),
      },
      //被攻击点
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          period: 4,
          brushType: 'stroke',
          scale: 4
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            offset: [5, 0],
            color: '#9eca7f', // 目标点文字颜色
            formatter: '{b}',
            textStyle: {
              color: "#9eca7f"
            }
          },
          emphasis: {
            show: true,
            color: "#f60", // 目标点鼠标移入的颜色
          }
        },
        symbol: 'pin',
        symbolSize: 50,
        data: [{
          name: item[0],
          value: chinaGeoCoordMap[item[0]].concat([10]),
        }],
      }
    );
  });

  let option = {
    title: {
      text: '来京路线 From',
      textStyle: {
        color: '#6d767e'
      }
    },
    // tooltip: {
    //   trigger: 'item',
    //   backgroundColor: 'rgba(166, 200, 76, 0.82)',
    //   borderColor: '#FFFFCC',
    //   showDelay: 0,
    //   hideDelay: 0,
    //   enterable: true,
    //   transitionDuration: 0,
    //   extraCssText: 'z-index:100',
    //   formatter: function (params, ticket, callback) {
    //     //根据业务自己拓展要显示的内容
    //     var res = "";
    //     var name = params.name;
    //     var value = params.value[params.seriesIndex + 1];
    //     res = "<span style='color:#fff;'>" + name + "</span><br/>数据：" + value;
    //     return res;
    //   }
    // },
    // backgroundColor: "#013954",
    // visualMap: { //图例值控制
    //   min: 0,
    //   max: 1,
    //   calculable: true,
    //   show: false,
    //   color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
    //   textStyle: {
    //     color: '#fff'
    //   }
    // },
    geo: {
      map: 'china',
      zoom: 1.2,
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true, //是否允许缩放
      itemStyle: {
        normal: {
          // color: 'rgba(51, 69, 89, .5)', //地图背景色
          // color: '#5a6fc0', //地图背景色
          // borderColor: '#516a89', //省市边界线00fcff 516a89
          borderWidth: 1
        },
        emphasis: {
          color: 'rgba(37, 43, 61, .5)' //悬浮背景
        }
      }
    },
    series: series
  };

  myChart.setOption(option)
}


// 需求1: 渲染班级数据 发送ajax请求
axios({
  url: '/student/overview',
  method: 'get',
}).then(({
  data: res
}) => {
  //成功回调
  if (res.code == 0) {
    document.querySelector('.total').innerHTML = res.data.total
    document.querySelector('.avgSalary').innerHTML = res.data.avgSalary
    document.querySelector('.avgAge').innerHTML = res.data.avgAge
    document.querySelector('.proportion').innerHTML = res.data.proportion
  }
})

// 需求2: 点击显示隐藏第几次成绩
let btn = document.querySelector('.btn')
let ul = document.querySelector('#batch')
btn.onclick = function () {
  if (ul.style.display == 'none') {
    ul.style.display = 'block'
  } else {
    ul.style.display = 'none'
  }
}

// 需求3: 点击li 渲染 柱形图
let lis = document.querySelectorAll('#batch li')
lis.forEach((item, index) => {
  lis[index].onclick = function () {
    // 发送ajax
    axios({
      url: '/score/batch',
      method: 'get',
      params: {
        batch: index + 1
      }
    }).then(({
      data: res
    }) => {
      //成功回调
      if (res.code == 0) {
        // console.log(res)
        setBar(res.data)
      }
    })
  }
})
// 页面加载,模拟第一次点击
lis[0].onclick()

// 需求4: 发送ajax 渲染 折线图 饼形图 地图
axios({
  url: '/student/list',
  method: 'get',
}).then(({
  data: res
}) => {
  //成功回调
  if (res.code == 0) {
    console.log(res)
    // 4.1 折线图制作 三个数组 放入一个对象
    let lineData = {
      name: [],
      salary: [],
      truesalary: []
    }
    // 4.2 饼形图制作 是一个数组
    let pieData = []
    // 4.3 地图制作 一个对象 一个二维数组
    let mapData1 = {
      "顺义校区": [
        116.4551,
        40.2539
      ]
    }
    let mapData2 = []
    // 循环数组
    res.data.forEach(item => {
      // 往对象中添加数据 -- 折线图
      lineData.name.push(item.name)
      lineData.salary.push(item.salary)
      lineData.truesalary.push(item.truesalary)
      // 往数组中添加数据 -- 饼形图 [{value: 6,name: '河南省'}]
      let index = pieData.findIndex(ele => ele.name == item.province)
      if (index == -1) {
        pieData.push({
          value: 1,
          name: item.province
        })
      } else {
        pieData[index].value++
      }
      // 数组 + 对象 -- 地图  [{"name": "海拉尔区","value": 0}]
      mapData1[item.county] = [item.jing, item.wei]
      let i = mapData2.findIndex(ele => ele[0].name == item.county)
      if (i = -1) {
        mapData2.push([{
          value: 1,
          name: item.county
        }])
      } else {
        mapData2[i][0].value++
      }


    })
    // console.log(mapData1)
    setLine(lineData)
    setPie(pieData)
    setMap(mapData1, mapData2)
  }
})