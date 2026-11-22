/* ============================================================
   DashUpgrade — 运行时增强脚本（逐套注入，在所有图表库之后执行）
   1) 注册统一 ECharts 主题并让后续 init 默认使用它
   2) 对已有实例套用统一的文字/网格/图例风格
   3) 统一 tooltip / 字体 / 颜色，让 126 套 ECharts 大屏质感一致升级
   全程 try/catch，绝不阻断原页面。
   ============================================================ */
(function () {
  "use strict";

  // 统一配色：冷调科技感，主色青蓝，辅助紫/黄，语义化渐层
  var PALETTE = [
    "#2fd8ff", "#4d8bff", "#7b6bff", "#38f0b0",
    "#ffd24d", "#ff7a9c", "#59e0ff", "#9a8bff",
    "#22c7a9", "#ffa94d"
  ];

  var THEME = {
    color: PALETTE,
    backgroundColor: "transparent",
    textStyle: {
      fontFamily: '"PingFang SC","Microsoft YaHei","HarmonyOS Sans SC",sans-serif',
      fontSize: 13,
      color: "#dbe9ff"
    },
    title: {
      textStyle: { color: "#eaf3ff", fontWeight: 600, fontSize: 15, letterSpacing: 1 },
      subtextStyle: { color: "#7f97c4" }
    },
    legend: {
      textStyle: { color: "#a9bde0", fontSize: 12 },
      itemWidth: 12, itemHeight: 8, itemGap: 12,
      icon: "roundRect"
    },
    tooltip: {
      backgroundColor: "rgba(10,20,38,0.92)",
      borderColor: "rgba(47,216,255,0.45)",
      borderWidth: 1,
      textStyle: { color: "#e4eeff", fontSize: 13 },
      extraCssText: "backdrop-filter:blur(8px);border-radius:8px;box-shadow:0 8px 28px -8px rgba(0,0,0,.7);"
    },
    grid: { left: 48, right: 24, top: 48, bottom: 36, containLabel: true },
    categoryAxis: axisStyle(),
    valueAxis: axisStyle(),
    logAxis: axisStyle(),
    timeAxis: axisStyle(),
    // 深色地图：把默认白底地图重着色为科技深蓝，去掉“白地图”的廉价感
    geo: {
      itemStyle: {
        areaColor: "rgba(20,42,80,0.85)",
        borderColor: "rgba(90,190,255,0.65)",
        borderWidth: 1,
        shadowColor: "rgba(47,216,255,0.35)",
        shadowBlur: 12
      },
      label: { color: "#bcd4f5", fontSize: 11 },
      emphasis: {
        itemStyle: { areaColor: "rgba(47,216,255,0.55)", borderColor: "#8fe3ff" },
        label: { color: "#ffffff" }
      }
    },
    line: { smooth: true, symbol: "circle", symbolSize: 6, lineStyle: { width: 2 } },
    bar: { barMaxWidth: 26, itemStyle: { borderRadius: [4, 4, 0, 0] } },
    pie: { itemStyle: { borderColor: "rgba(6,11,24,0.7)", borderWidth: 2 } }
  };

  function axisStyle() {
    return {
      axisLine: { lineStyle: { color: "rgba(120,150,200,0.35)" } },
      axisTick: { show: false },
      axisLabel: { color: "#8ea6cf", fontSize: 12 },
      splitLine: { lineStyle: { color: "rgba(90,130,190,0.12)", type: "dashed" } },
      splitArea: { show: false },
      nameTextStyle: { color: "#8ea6cf", fontSize: 12 }
    };
  }

  function applyThemeToInstance(inst) {
    try {
      if (!inst || !inst.getOption) return;
      var opt = inst.getOption();
      if (!opt) return;
      // 合并文字与坐标轴风格，不改数据
      var patch = {
        textStyle: THEME.textStyle,
        color: (opt.color && opt.color.length) ? opt.color : PALETTE
      };
      // 深色地图重着色：geo 组件 + map 类 series（仅在未显式设成深色时覆盖）
      try {
        if (opt.geo) {
          patch.geo = (Array.isArray(opt.geo) ? opt.geo : [opt.geo]).map(function () {
            return {
              itemStyle: THEME.geo.itemStyle,
              label: THEME.geo.label,
              emphasis: THEME.geo.emphasis
            };
          });
        }
        if (opt.series) {
          var maps = [];
          opt.series.forEach(function (s) {
            if (s && s.type === "map") {
              maps.push({
                itemStyle: THEME.geo.itemStyle,
                emphasis: THEME.geo.emphasis,
                label: { color: "#bcd4f5", fontSize: 11 }
              });
            }
          });
          if (maps.length) {
            // 按原顺序仅对 map series 打补丁
            patch.series = opt.series.map(function (s) {
              return (s && s.type === "map")
                ? { itemStyle: THEME.geo.itemStyle, emphasis: THEME.geo.emphasis,
                    label: { color: "#bcd4f5", fontSize: 11 } }
                : {};
            });
          }
        }
      } catch (e) {}
      inst.setOption(patch, false);
    } catch (e) {}
  }

  function hook() {
    var ec = window.echarts;
    if (!ec || !ec.init) return false;
    if (ec.__duThemed) return true;
    ec.__duThemed = true;

    try { ec.registerTheme("dashUpgrade", THEME); } catch (e) {}

    var origInit = ec.init;
    ec.init = function () {
      var args = Array.prototype.slice.call(arguments);
      // 若未显式传入 theme，则注入默认主题
      var hasTheme = false;
      for (var i = 1; i < args.length; i++) {
        if (typeof args[i] === "string" || (args[i] && typeof args[i] === "object" && args[i].color)) {
          hasTheme = true; break;
        }
      }
      if (!hasTheme) {
        if (args.length >= 2) args.splice(1, 0, "dashUpgrade");
        else args.push("dashUpgrade");
      }
      var inst = origInit.apply(this, args);
      try { applyThemeToInstance(inst); } catch (e) {}
      return inst;
    };

    // 对已经存在的实例统一风格
    try {
      if (ec.getInstanceByDom) {
        var nodes = document.querySelectorAll("div");
        for (var i = 0; i < nodes.length; i++) {
          var inst = ec.getInstanceByDom(nodes[i]);
          if (inst) applyThemeToInstance(inst);
        }
      }
    } catch (e) {}
    return true;
  }

  // 遍历所有 ECharts 实例：重套主题 + resize（修复初始化时容器尺寸为 0 导致图表不显示的问题）
  function refreshAll() {
    try {
      var ec = window.echarts;
      if (!ec || !ec.getInstanceByDom) return;
      var nodes = document.querySelectorAll("div");
      for (var i = 0; i < nodes.length; i++) {
        var inst = ec.getInstanceByDom(nodes[i]);
        if (inst) {
          applyThemeToInstance(inst);
          // 容器实际有尺寸但实例尺寸为 0 时，resize 可让图表重新铺满并绘制
          try {
            var dom = inst.getDom && inst.getDom();
            if (dom && dom.clientWidth > 0 && dom.clientHeight > 0) inst.resize();
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  // 立即尝试；若 echarts 尚未加载，排轮询（最多 ~10s）
  var tries = 0;
  function poll() {
    if (hook()) return;
    if (++tries > 100) return;
    setTimeout(poll, 100);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", poll);
  } else {
    poll();
  }

  // 多时机刷新，覆盖：图表延迟初始化、容器尺寸后置、tab 切换等常见时序问题
  window.addEventListener("load", function () {
    [200, 600, 1200, 2500].forEach(function (t) { setTimeout(refreshAll, t); });
  });
  // 窗口尺寸变化时同步 resize
  var rzT;
  window.addEventListener("resize", function () {
    clearTimeout(rzT); rzT = setTimeout(refreshAll, 200);
  });
  document.addEventListener("DOMContentLoaded", function () {
    [400, 1000].forEach(function (t) { setTimeout(refreshAll, t); });
  });
})();
