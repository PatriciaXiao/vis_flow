// layout settings
var nav_bar_height = $('#nav_bar').height();
var dom = document.getElementById("container");
dom.style.top = nav_bar_height + "px";
dom.style.height = ($(window).height() - nav_bar_height) + "px"; // set width to be "100%" - 40px;
dom.style.width = ($(window).width()) + "px";

// assets
var myChart = echarts.init(dom);
var MAX_INT = 10000;
var myPath = 'image://static/test_image.jpg';
var backgroundColor = '#444455';//'#404a59';
var backgroundColor_rgb = '#445';

// for debugging purpose
var DEBUG = false;
function debug(val){
    if (DEBUG) console.log(val);
    return val;
}

// coordinate range [(-200, 200), (-70, 90)]
var coordMap = {
    '上海': [200, 90], //[121.4648,31.2891],
    '北京': [-200,-70], //[116.4551,40.2539],
    '广州': [-200, 90],//[113.5107,23.2196],
    '重庆': [107.7539,30.1904],
    '常州': [119.4543,31.5582]
};

var BJData = [
    [{name:'北京'}, {name:'上海',value:95}],
    [{name:'北京'}, {name:'广州',value:90}],
    [{name:'北京'}, {name:'重庆',value:20}],
    [{name:'北京'}, {name:'常州',value:10}]
];

var SHData = [
    [{name:'上海'},{name:'广州',value:80}],
    [{name:'上海'},{name:'重庆',value:50}],
    [{name:'上海'},{name:'北京',value:30}],
];

var GZData = [
    [{name:'广州'},{name:'重庆',value:70}],
    [{name:'广州'},{name:'常州',value:40}],
    [{name:'广州'},{name:'北京',value:30}],
];

// input 
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = coordMap[dataItem[0].name];
        var toCoord = coordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name, // could be commented out
                toName: dataItem[1].name,   // also could be
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};

var color = ['#a6c84c', '#ffa022', '#46bee9'];
var series = [];
[['北京', BJData], ['上海', SHData], ['广州', GZData]].forEach(function (item, i) {
    series.push(
        // the "flow"
        {
            name: item[0] + ' Top10',
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6, //1, //6, // speed
                trailLength: 0.7,
                color: '#000', // '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: convertData(item[1]) //debug(item[1])//convertData(item[1])
        },
        // the "line"
        {
            name: item[0] + ' Top10',
            type: 'lines',
            zlevel: 2,
            // symbol: ['none', 'arrow'],
            symbol: ['none', 'none'],
            symbolSize: 10,
            effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: myPath,
                symbolSize: 15
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2
                }
            },
            tooltip: {
                formatter: function (params) {
                    // console.log(params)
                    return 'hello I am the line from ' + params.data.fromName + " to " + params.data.toName;
                }
            },
            data: convertData(item[1])
        },
        // the "node"
        {
            name: item[0] + ' Top10',
            type: 'effectScatter',
            coordinateSystem: 'geo', //'polar',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    // formatter: '{b}'
                    // formatter: '{b}' // {a} refers to 北京 Top 10 here
                    formatter: '{b}'
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: item[1].map(function (dataItem) {
                return {
                    name: dataItem[1].name,
                    value: debug(coordMap[dataItem[1].name].concat([dataItem[1].value])) //coordMap[dataItem[1].name].concat([dataItem[1].value])
                };
            })
        }
        
    );
    // add the original node // not necessary
    series.push({
         // the "node"
            name: item[0] + ' Top10', // item[0]
            type: 'effectScatter',
            coordinateSystem: 'geo',//'grid', //'geo', //'polar',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    // formatter: '{b}'
                    // formatter: '{b}' // {a} refers to 北京 Top 10 here
                    formatter: item[0]//'{a}'
                }
            },
            symbolSize: function (val) {
                return 100 / 8; //val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: [{
                    name: item[0],
                    value: coordMap[item[0]]//.concat(100)
            }]
    });
    

    

});

//////
    series.push(
        // the "line"
        {
            name: 'debug',
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6, //1, //6, // speed
                trailLength: 0.7,
                color:  backgroundColor, //'#000', // '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: backgroundColor,  //'#000',//color[i],
                    width: 1,
                    curveness: 0,
                    opacity: 0,
                }
            },
            data: [{
                fromName: 'inf_far',
                toName: 'inf_far_2',
                coords: [[-1 * MAX_INT, -1 * MAX_INT], [-1 * MAX_INT + 1, -1 * MAX_INT + 1]]
            }]
        }
    );
    series.push(
        {
            //
            name: 'debug',
            type: 'lines',
            zlevel: 2,
            // symbol: ['none', 'arrow'],
            symbol: ['none', 'none'],
            symbolSize: 10,
            lineStyle: {
                normal: {
                    color: backgroundColor, //'#ffffff',//color[i],
                    width: 1,
                    opacity: 0.6,
                    curveness: 0
                }
            },
            /*
            tooltip: {
                formatter: function (params) {
                    // console.log(params)
                    return 'hello I am the line from ' + params.data.fromName + " to " + params.data.toName;
                }
            },
            */

            data: [{
                fromName: 'inf_far',
                toName: 'inf_far_2',
                coords: [[-1 * MAX_INT, -1 * MAX_INT], [-1 * MAX_INT + 1, -1 * MAX_INT + 1]]
            }]
        }
    );
//////
    series.push(
        {
            name:'漏斗图',
            type:'funnel',
            left: 60,//'10%',
            zlevel: 2,
            top: 60,
            //x2: 80,
            // bottom: 60,
            width: 50,//'80%',
            height: 50,
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'left'//'inside'
                },
                emphasis: {
                    textStyle: {
                        fontSize: 5
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: [
                {value: 60, name: '访问'},
                {value: 30, name: '咨询'},
                {value: 10, name: '订单'},
                {value: 90, name: '点击'},
                {value: 100, name: '展现'}
            ],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
        }
    );

var option = {
    backgroundColor: backgroundColor,
    /*
    title : {
        text: '点线图测试效果',
        subtext: '基于世界地图',
        left: 'center',
        textStyle : {
            color: '#fff'
        }
    },
    */
    tooltip : {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        //data:['北京 Top10', '上海 Top10', '广州 Top10'],
        data:[
            {name: '北京 Top10', icon: 'circle'}, 
            {name: '上海 Top10', textStyle: {color: 'red'}}, 
            {name: '广州 Top10'},
            {name: '漏斗图'}
        ],

        textStyle: {
            color: '#fff'
        },
        selectedMode: 'multiple', //'single'
        selected: {
            '北京 Top10': false,
            '上海 Top10': false,
            '广州 Top10': true
        },
        // 使用字符串模板，模板变量为图例名称 {name}
        // formatter: 'Legend {name}'
        // 使用回调函数
        
        formatter: function (dat) {
            // console.log(dat)
            return 'Legend ' + dat;
        }
        // show: false
    },
    geo: {
        map: 'coordinateMap',
        // show: false, // hide map will stop zooming
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        silent: true,
        itemStyle: {
            normal: {
                areaColor: backgroundColor,
                borderColor: backgroundColor
            },
            emphasis: {
                areaColor: backgroundColor
            }
        }
    },
    series: series
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
    console.log(myChart)
}