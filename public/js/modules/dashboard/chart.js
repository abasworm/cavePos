
'use strict'

//convert hsl to hex
var hslToHex = (t,n,e)=>{let o,r,s;if(t/=360,e/=100,0===(n/=100))o=r=s=e;else{const c=(t,n,e)=>(e<0&&(e+=1),e>1&&(e-=1),e<1/6?t+6*(n-t)*e:e<.5?n:e<2/3?t+(n-t)*(2/3-e)*6:t),l=e<.5?e*(1+n):e+n-e*n,u=2*e-l;o=c(u,l,t+1/3),r=c(u,l,t),s=c(u,l,t-1/3)}const c=t=>{const n=Math.round(255*t).toString(16);return 1===n.length?"0"+n:n};return`#${c(o)}${c(r)}${c(s)}`}

//search percentage
var percentage = (m,v)=>{return (v*100)/(m);};

//tooltips on chart
var tooltipcs = (value, ratio) => {
    let percentFormat = d3.format('.1%'), twoDecimal = d3.format('.2f');
    return 'PERCENTAGE: '+percentFormat(ratio) + ', TOTAL: ' + twoDecimal(value);
};

//create color rand for chart
var colorand = (data)=>{
    let result = {}, colors = {}, len = data.length, actionAxis = [];
    for(var x in data){ colors[data[x][0]] = hslToHex(((percentage(len,x)*360)/100).toFixed(),60,50).toString(); }
    for(var x in data){ actionAxis.push(data[x][0]+ ', Total: '+data[x][1]); }
    result.colors = colors;
    result.actionAxis = actionAxis;
    return result;
};

// create mini tabel in chart with functoin
var ftable = (select,chartx,data)=>{
    $(select+' tbody').html('');
    let tr = d3
        .select(select+' tbody')
        .selectAll("tr")
        .data(data)
        .enter().append('tr')
        .on('mouseover', function(id) {
            chartx.focus(id.substring(0,(id.indexOf(','))));
        })
        .on('mouseout', function(id) {
            chartx.revert();
        })

    let td1 = tr
        .append('td')
        .html(function(id) {
            return chartx.data(id.substring(0,(id.indexOf(','))));
        })
        .html((id)=>{return id.substring(0,(id.indexOf(',')));});

    let td2 = tr
        .append('td')
        .insert('span', '.legend-label-action').attr('class', 'badge')
        .each(function(id) {
            d3.select(this).style('background-color', chartx.color(id.substring(0,(id.indexOf(',')))));
        })
        .text((id)=>{
            let a = id.substring(id.indexOf(','), id.length);
            let b = a.replace(', Total: ','');
            return b;
        });
};

//chart variable on generate
const initChart = (fn)=>{return c3.generate({
    data:{type: 'pie', columns : [], onclick:fn},
    legend:{show: false },
    tooltip: { format: { value: tooltipcs }}
});};

//chart obj declaration
var chartp = {
    chartAll:{},
    chartAllFlm: {},
    chartFlm : {},
    chartSlm : {},
    chartProblemCategory: {},
    chartTimeCategory: {},
    chartProblemClasification: {},
    chartTimeClasification: {},
    chartActivity: {},
    chartTimeActivity: {},
};

//run chart x
const run=()=>{
    x.ajax.getAll();

    x.ajax.getAllFlm();
    x.ajax.getFlm();
    x.ajax.getSlm();

    x.ajax.getProblemCategory();
    x.ajax.getTimeCategory();
    x.ajax.getProblemClasification();
    x.ajax.getTimeClasification();
    x.ajax.getActivity();
    x.ajax.getTimeActivity();

    x.ajax.getTicketFlm();
    x.ajax.getTicketSlm();
};
const ax = (sec)=>{setTimeout(async()=>{
    run();ax(sec);
}, sec * 1000);}

$(document).ready(async (e)=>{
    $('#bln_problem').val(toDateString(new Date()).substring(0,7));
    $('#btn_search').click((e)=>{
        run();
    })
    $('.date').datepicker({
        autoclose : true,
        format: 'yyyy-mm',
        todayHighlight: true,
        language: 'id',
        startView : 1,
        minViewMode: 1
    })
    let cvt = (data)=>{return btoa(JSON.stringify(data))}
    let views = "";
    chartp.chartAll = initChart((d,i)=>{
        let paramD = {
            type : 'allData',
            field: d.id,
            date : $('#bln_problem').val()
        };
        console.log(cvt(paramD));
    });

    chartp.chartAllFlm = initChart(views);
    chartp.chartFlm =  initChart(views);
    chartp.chartSlm = initChart(views);

    chartp.chartProblemCategory = initChart(views);
    chartp.chartTimeCategory = initChart(views);
    chartp.chartProblemClasification = initChart(views);
    chartp.chartTimeClasification = initChart(views);
    chartp.chartActivity = initChart(views);
    chartp.chartTimeActivity = initChart(views);
    run();
    ax(30);
    
});

var x = {
    ajax:{
        getAll:()=>{$.post('/api/dashboard/get/sla/all',{bln_problem:$('#bln_problem').val()},x.complete.getAll);},

        getAllFlm:()=>{$.post('/api/dashboard/get/sla/allflm',{bln_problem:$('#bln_problem').val()},x.complete.getAllFlm);},
        getFlm:()=>{$.post('/api/dashboard/get/sla/flm',{bln_problem:$('#bln_problem').val()},x.complete.getFlm);},
        getSlm:()=>{$.post('/api/dashboard/get/sla/slm',{bln_problem:$('#bln_problem').val()},x.complete.getSlm);},

        getProblemCategory:()=>{$.post('/api/dashboard/get/problem/category',{bln_problem:$('#bln_problem').val()},x.complete.getProblemCategory);},
        getTimeCategory:()=>{$.post('/api/dashboard/get/time/category',{bln_problem:$('#bln_problem').val()},x.complete.getTimeCategory);},
        getProblemClasification:()=>{$.post('/api/dashboard/get/problem/clasification',{bln_problem:$('#bln_problem').val()},x.complete.getProblemClasification);},
        getTimeClasification:()=>{$.post('/api/dashboard/get/time/clasification',{bln_problem:$('#bln_problem').val()},x.complete.getTimeClasification);},
        getActivity:()=>{$.post('/api/dashboard/get/problem/activity',{bln_problem:$('#bln_problem').val()},x.complete.getActivity);},
        getTimeActivity:()=>{$.post('/api/dashboard/get/time/activity',{bln_problem:$('#bln_problem').val()},x.complete.getTimeActivity);},
        
        
        getTicketSlm:()=>{$.post('/api/dashboard/get/ticket/slm',x.param,x.complete.getTicketSlm);},
        getTicketFlm:()=>{$.post('/api/dashboard/get/ticket/flm',x.param,x.complete.getTicketFlm);},
    },
    complete:{
        getTicketSlm:(res,ret)=>{
            $('#ticket_slm').html(res.results);
        },
        getTicketFlm:(res,ret)=>{
            $('#ticket_flm').html(res.results);
        },
        
        getAll: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartAll;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_all',cp,cr.actionAxis);
            $('#chartAll').html(await cp.element);
        },
        getAllFlm: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartAllFlm;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_allflm',cp,cr.actionAxis);
            $('#chartAllFlm').html(await cp.element);
        },
        getFlm: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartFlm;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_flm',cp,cr.actionAxis);
            $('#chartFlm').html(await cp.element);
        },
        getSlm: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartSlm;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_slm',cp,cr.actionAxis);
            $('#chartSlm').html(await cp.element);
        },

        getProblemCategory: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartProblemCategory;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_action',cp,cr.actionAxis);
            $('#chartProblemCategory').html(await cp.element);
        },
        getTimeCategory: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartTimeCategory;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#ttb_action',cp,cr.actionAxis);
            $('#chartTimeCategory').html(await cp.element);
        },

        getProblemClasification: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartProblemClasification;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_clasification',cp,cr.actionAxis);
            $('#chartProblemClasification').html(await cp.element);
        },
        getTimeClasification: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartTimeClasification;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#ttb_clasification',cp,cr.actionAxis);
            $('#chartTimeClasification').html(await cp.element);
        },

        getActivity: async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartActivity;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#tb_activity',cp,cr.actionAxis);
            $('#chartActivity').html(await cp.element);
        },
        getTimeActivity:async (res,ret)=>{
            let data = res.results;
            let cr = colorand(data);

            var cp = chartp.chartTimeActivity;
            // cp.data.colors = cr.colors;
            cp.load({
                columns: res.results,
                colors : cr.colors
            })
            ftable('#ttb_activity',cp,cr.actionAxis);
            $('#chartTimeActivity').html(await cp.element);
        }
    }
}