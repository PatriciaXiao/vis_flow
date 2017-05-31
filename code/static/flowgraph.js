// layout settings
var nav_bar_height = $('#nav_bar').height();
var dom = document.getElementById("container");
dom.style.top = nav_bar_height + "px";
dom.style.height = ($(window).height() - nav_bar_height) + "px"; // set width to be "100%" - 40px;
dom.style.width = ($(window).width()) + "px";

// assets
var myChart = echarts.init(dom);
var MAX_INT = 10000;
var coordRange = {
    left: -200,
    right: 160,
    top: 90,
    bottom: -70
}
var myPath = 'image://static/test_image.jpg';
var backgroundColor = '#444455';//'#404a59';
var backgroundColor_rgb = '#445';
var colorSet = ['#a6c84c', '#ffa022', '#46bee9', '#e9967a', '#ffd700', '#dda0dd'];
var nodesInfo = {};
var linkeInfo = {};
var nodes = [];
var links = [];

// for debugging purpose
var DEBUG = true;//false;
function debug(val){
    if (DEBUG) console.log(val);
    return val;
}

// variables to be used
// ['groupName', groupData]
// groupData: [{name: 'startPointName'}, {name: 'endPointName', value: value of the line}]
var mergedGroups = [];
var series = [];
var option = {};

// coordinate range [(-200, 200), (-70, 90)]
// mapping data
var coordMap = {
    // for debugging purpose
    'corner_topright': [coordRange.right, coordRange.top], //[121.4648,31.2891],
    'corner_bottomleft': [coordRange.left,coordRange.bottom], //[116.4551,40.2539],
    'corner_topleft': [coordRange.left, coordRange.top],//[113.5107,23.2196],
    'corner_bottomright': [coordRange.right, coordRange.bottom],
    'center': [(coordRange.left + coordRange.right) / 2. , (coordRange.top + coordRange.bottom) / 2.]
};
// could add / modify its contents like this:
// coordMap['center'] = [(coordRange.left + coordRange.right) / 2. , (coordRange.top + coordRange.bottom) / 2.];

// functions 
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
                value: dataItem[1].value,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};
// find the location of the nodes
function locateNodes() {
    //
}
function drawNodes() {
    // console.log(nodes.length);
    nodes.forEach( function(item, i){
        series.push({
            name: nodesInfo[item].group_name,
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
                    formatter: nodesInfo[item].label_name
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: colorSet[i]
                }
            },
            data: [{
                name: item,
                value: coordMap[item].concat([nodesInfo[item].value])
            }]
        });
    });
}

// prepare data
nodesInfo = {
    'corner_bottomleft': {label_name: 'BottomLeftNode', group_name: 'BottomLeft', value: 30},
    'corner_bottomright': {label_name: 'BottomRightNode', group_name: 'BottomRight', value: 50},
    'corner_topleft': {label_name: 'TopLeftNode', group_name: 'TopLeft', value: 70},
    'corner_topright': {label_name: 'TopRightNode', group_name: 'TopRight', value: 80},
    'center': {label_name: 'CenterNode', group_name: 'Center', value: 10}
};
nodes = ['corner_bottomleft', 'corner_bottomright', 'corner_topleft', 'corner_topright', 'center'];
drawNodes();

var Group1 = [
    [{name:'corner_bottomleft'}, {name:'corner_topright',value:95}],
    [{name:'corner_bottomleft'}, {name:'corner_topleft',value:90}],
    [{name:'corner_bottomleft'}, {name:'corner_bottomright',value:20}],
    [{name:'corner_bottomleft'}, {name:'center',value:10}]
];

var Group2 = [
    [{name:'corner_topright'},{name:'corner_topleft',value:80}],
    [{name:'corner_topright'},{name:'corner_bottomright',value:50}],
    [{name:'corner_topright'},{name:'corner_bottomleft',value:30}],
];

var Group3 = [
    [{name:'corner_topleft'},{name:'corner_bottomright',value:70}],
    [{name:'corner_topleft'},{name:'center',value:40}],
    [{name:'corner_topleft'},{name:'corner_bottomleft',value:30}],
];

links = [['Group1', Group1], ['Group2', Group2], ['Group3', Group3]];

links.forEach(function (item, i) {
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
                    color: colorSet[i],
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
                    color: colorSet[i],
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2
                }
            },
            tooltip: {
                formatter: function (params) {
                    // console.log(params)
                    return 'hello I am the line from ' + params.data.fromName + " to " + params.data.toName + " with value " + params.data.value;
                }
            },
            data: convertData(item[1])
        },
        // the "node"
        /*
        
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
                    // formatter: '{b}' // {a} refers to corner_bottomleft Top 10 here
                    formatter: '{b}'
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: colorSet[i]
                }
            },
            data: debug(item[1].map(function (dataItem) {
                return {
                    name: dataItem[1].name,
                    value: coordMap[dataItem[1].name].concat([dataItem[1].value]) //coordMap[dataItem[1].name].concat([dataItem[1].value])
                };
            })
            )
        }
        */
        
        
        
    );
    

});

//////////////////////////////////
/*
series.push(

        {
            name: 'Group1 Top10',
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
                    // formatter: '{b}' // {a} refers to corner_bottomleft Top 10 here
                    formatter: 'hello'
                }
            },
            symbolSize: function (val) {
                return 20;
            },
            itemStyle: {
                normal: {
                    color: '#ffffff'
                }
            },
            data: debug([{
                name: 'hello',
                value: coordMap['center'].concat([20])
            }])
        });
*/
//////////////////////////////////

//////
series.push(
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
            left: 5,//'10%',
            zlevel: 2,
            top: 5,
            //x2: 80,
            // bottom: 60,
            width: 60,//'80%',
            height: 100,
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            funnelAlign: 'left',
            sort: 'descending',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'right'//'inside'
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
                    borderColor:  backgroundColor_rgb, //backgroundColor, //'#fff',
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
            color: colorSet
        }
    );

option = {
    backgroundColor: backgroundColor,
    tooltip : {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        //data:['corner_bottomleft Top10', 'corner_topright Top10', 'corner_topleft Top10'],
        data:[
            {name: 'Group1 Top10', icon: 'circle'}, 
            {name: 'Group2 Top10', textStyle: {color: 'red'}}, 
            {name: 'Group3 Top10'},
            {name: '分层统计'} // '漏斗图'
        ],

        textStyle: {
            color: '#fff'
        },
        selectedMode: 'multiple', //'single'
        selected: {
            'corner_bottomleft Top10': false,
            'corner_topright Top10': false,
            'corner_topleft Top10': true
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