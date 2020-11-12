import * as d3 from 'd3';

var width = 1024;
var height = 640;

function renderChart(body, data) {
    // var body = d3.select('#map');//选择文档中id为map的元素
    // var myP = body.select('.myP');//选择body中class为myP的元素
    // var p = body.selectAll('p');//选择body中的所有p元素

    // myP.style('color','red');//设置myP元素的颜色为red
    // p.text('四种水果');//为p元素添加文本

    // var dataList = ['苹果', '香蕉', '橘子', '西瓜'];
    // p.data(dataList)
    //     .text((d, i) => '第' + i + '个水果是' + d);//d表示数据，i表示索引

    // var str = 'fruit';
    // p.datum(str)
    //     .text(d => '这是一个' + d);

    // body.append('p')
    //     .text('增加一种水果');

    // body.insert('p', '.myP')   //在class为myP的元素前面插入p元素
    //     .text('增加一种水果');

    // var dataList = [3, 6, 9, 12, 15];
    // var update = p.data(dataList);
    // var enter = update.enter();

    // update.text((d, i) => 'update:' + d + ',index:' + i);

    // enter.append('p')
    //     .text((d, i) => 'enter:' + d + ',index:' + i);

    // var dataList = [3, 6];
    // var update = p.data(dataList);
    // var exit = update.exit();

    // update.text((d, i) => 'update:' + d + ',index:' + i);

    // //对于exit的处理通常是删除 ，但在这里为了显示效果并没有这么做
    // exit.text((d, i) => 'exit');

    // const svg = d3.select(body)
    //     .append('svg')
    //     .attr('width', 1024)
    //     .attr('height', 640);

    // svg.append('line')
    //     .attr('stroke', 'rgb(72,235,195)')
    //     .attr('stroke-width', 2)
    //     .attr('stroke-opacity', 0.7)
    //     .attr('x1', 100)
    //     .attr('y1', 100)
    //     .attr('x2', 200)
    //     .attr('y2', 200);

    // svg.append('rect')
    //     .attr('fill', 'rgb(201,197,61)')
    //     .attr('stroke', 'rgb(105,113,89)')
    //     .attr('stroke-width', 2)
    //     .attr('fill-opacity', 0.7)
    //     .attr('width', 40)
    //     .attr('height', 36)
    //     .attr('x', 100)
    //     .attr('y', 100);

    // svg.append('circle')
    //     .attr('fill', '#5596FF')
    //     .attr('stroke', '#937DFF')
    //     .attr('stroke-width', 2)
    //     .attr('fill-opacity', 0.7)
    //     .attr('r', 20)
    //     .attr('cx', 100)
    //     .attr('cy', 100);




    //Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    //新建一个力导向图
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).distance(200).strength(0.1).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-80))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(60));

    //拖拽事件
    const dragEvent = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);

    function dragstarted(event, d) {
        if (!event.active) {
            //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
            simulation.alphaTarget(0.3).restart()
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) {
            simulation.alphaTarget(0)
        }
        d.fx = null;
        d.fy = null;
    }

    const zoomEvent = d3.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed);

    const svg = d3.select(body)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoomEvent)
        .append('g');

    //滚轮缩放事件
    function zoomed(event) {
        svg.attr("transform", event.transform);
    }

    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', 'rgb(72,235,195)')
        .attr('stroke-width', 2);

    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 20)
        .attr('fill', '#5596FF')
        .call(dragEvent);

    //获取坐标点
    simulation.on('tick', () => {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
}

export default {
    renderChart
};