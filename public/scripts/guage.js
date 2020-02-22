function updateGuageChart(chartID, title, ratio) {
    chartRatio = null;
    chartRatio = new Highcharts.chart(
      chartID,
      Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: title
          }
        },
  
        credits: {
          enabled: false
        },
  
        series: [
          {
            name: title,
            data: [ratio],
            dataLabels: {
              format:
                '<div style="text-align:center"><span style="font-size:25px;color:' +
                "black" +
                '">{y:.2f}</span><br/>' +
                '<span style="font-size:12px;color:silver">percent</span></div>'
            },
            tooltip: {
              valueSuffix: " percent"
            }
          }
        ]
      })
    );
  
    return chartRatio;
  }

  var gaugeOptions = {
    chart: {
      type: "solidgauge"
    },
  
    title: null,
  
    pane: {
      center: ["50%", "85%"],
      size: "140%",
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: "#EEE",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc"
      }
    },
  
    tooltip: {
      enabled: false
    },
  
    // the value axis
    yAxis: {
      stops: [
        [0.1, "#DF5353"], // red
        [0.5, "#DDDF0D"], // yellow
        [0.9, "#55BF3B"] // green
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        y: -70
      },
      labels: {
        y: 16
      }
    },
  
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };