// =========================================================================
// LEVEL 7: 顶石深潜科研中心 (APEX NEXUS RESEARCH COMPLEX)
// 依据用户最新草图与指令继续扩展构建的巨型眼睛地图 (The Eye Map)
// =========================================================================
// 📐 核心地图架构与对称参数：
// 1. 全图三大区域合并构成“巨大眼睛”轮廓：
//    - 中央房间 (顶石中央指挥大厅 Room 01)
//    - 西侧三角房间 (顶石西侧观测区 West Sector)
//    - 东侧三角房间 (顶石东侧科研区 East Sector)
//    - 左右两个三角房间完全镜像对称
// 2. 中央大圆形正好位于整张地图正中心：
//    - 地图尺寸：3200 × 2400
//    - 中央圆台精确坐落于地图正中央 (X: 1600, Y: 1200)
//    - 眼睛左端顶角位于 (X: 150, Y: 1200)，右端顶角位于 (X: 3050, Y: 1200)
//    - 顶端外墙水平线 Y: 490，底端水平实墙 Y: 1960
// 3. 中间房间新放置的左右两个圆形：
//    - 位于最上方几何结构下方、中央圆台上方的左右两侧对称位置
//    - 左圆柱终端：cx: 1350, cy: 920, 半径 35px
//    - 右圆柱终端：cx: 1850, cy: 920, 半径 35px
//    - 留有充足通道宽度供角色自由穿行
// 4. 两个三角房间内部的圆弧与横线原样占位：
//    - 沿斜外墙内侧平行走向的导轨线
//    - 3 条竖向/斜向横向占位线（Line 1, Line 2, Line 3）
//    - 朝两侧外凸的大弧线（左弧与右弧，完美构成眼角膜/瞳孔眼状视觉）
// 5. 中间房间与两侧三角房间的连通：
//    - 通过西侧上门洞 (Y: 895~945) & 西侧下门洞 (Y: 1810~1860) 进入西三角房间
//    - 通过东侧上门洞 (Y: 895~945) & 东侧下门洞 (Y: 1810~1860) 进入东三角房间
//    - 地图完全支持上下左右移步换景滚动摄像机
// =========================================================================

window.level7MapWidth = 3200;
window.level7MapHeight = 2400;

const LEVEL_LAB = {
    id: "level7_lab",
    name: "第 7 关 · 顶石科研中心",
    nameEn: "Level 07 · Apex Research Complex",
    themeColor: "#022c22",
    gridColor: "rgba(16, 185, 129, 0.22)",
    accentColor: "#10b981",
    // 玩家出生点：位于大厅南侧区域（第3排长方形与底墙之间），面朝北面中轴过道
    playerStart: { x: 1600, y: 1835 },

    getMapLayout: (width, height) => {
        const cx = 1600;
        const cy = 1200; // 整张地图正中央 (3200 x 2400 之中心点)

        // =====================================================================
        // 1. 实体阻挡障碍物 (Obstacles)
        // =====================================================================
        const obstacles = [
            // -----------------------------------------------------------------
            // A. 中间房间最上方几何结构底部封闭外墙 (不可进入，完全隔断)
            // 中间倒梯形下底宽 310px (X: 1445 ~ 1755, Y: 740)，精确等同于圆台直径 310px
            // -----------------------------------------------------------------
            {
                type: 'solid',
                points: [
                    { x: 1105, y: 814 },
                    { x: 1440, y: 734 },
                    { x: 1450, y: 746 },
                    { x: 1115, y: 826 }
                ],
                label: 'TOP CHAMBER BASE LEFT',
                hideLabel: true
            },
            {
                type: 'solid',
                points: [
                    { x: 1440, y: 733 },
                    { x: 1760, y: 733 },
                    { x: 1760, y: 747 },
                    { x: 1440, y: 747 }
                ],
                label: 'TOP INVERTED TRAPEZOID BASE',
                hideLabel: true
            },
            {
                type: 'solid',
                points: [
                    { x: 1750, y: 746 },
                    { x: 2085, y: 826 },
                    { x: 2095, y: 814 },
                    { x: 1760, y: 734 }
                ],
                label: 'TOP CHAMBER BASE RIGHT',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // B. 中间房间与西侧三角房间的共享分割斜墙 (包含西上门洞与西下门洞)
            // -----------------------------------------------------------------
            // 段 1: 顶部 Y:820 ~ 上门洞 Y:895
            {
                type: 'poly_wall',
                points: [
                    { x: 1103, y: 820 },
                    { x: 1117, y: 820 },
                    { x: 1131, y: 895 },
                    { x: 1117, y: 895 }
                ],
                label: 'WEST SHARED WALL 1',
                hideLabel: true
            },
            // [西侧上门洞：Y: 895 ~ 945，净宽 50px，角色可通过]
            // 段 2: 上门洞下 Y:945 ~ 下门洞上 Y:1810
            {
                type: 'poly_wall',
                points: [
                    { x: 1126, y: 945 },
                    { x: 1140, y: 945 },
                    { x: 1294, y: 1810 },
                    { x: 1280, y: 1810 }
                ],
                label: 'WEST SHARED WALL 2',
                hideLabel: true
            },
            // [西侧下门洞：Y: 1810 ~ 1860，净宽 50px，角色可通过]
            // 段 3: 下门洞下 Y:1860 ~ 底角 Y:1960
            {
                type: 'poly_wall',
                points: [
                    { x: 1287, y: 1860 },
                    { x: 1301, y: 1860 },
                    { x: 1318, y: 1960 },
                    { x: 1304, y: 1960 }
                ],
                label: 'WEST SHARED WALL 3',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // C. 中间房间与东侧三角房间的共享分割斜墙 (包含东上门洞与东下门洞)
            // -----------------------------------------------------------------
            // 段 1: 顶部 Y:820 ~ 上门洞 Y:895
            {
                type: 'poly_wall',
                points: [
                    { x: 2083, y: 820 },
                    { x: 2097, y: 820 },
                    { x: 2083, y: 895 },
                    { x: 2069, y: 895 }
                ],
                label: 'EAST SHARED WALL 1',
                hideLabel: true
            },
            // [东侧上门洞：Y: 895 ~ 945，净宽 50px，角色可通过]
            // 段 2: 上门洞下 Y:945 ~ 下门洞上 Y:1810
            {
                type: 'poly_wall',
                points: [
                    { x: 2060, y: 945 },
                    { x: 2074, y: 945 },
                    { x: 1920, y: 1810 },
                    { x: 1906, y: 1810 }
                ],
                label: 'EAST SHARED WALL 2',
                hideLabel: true
            },
            // [东侧下门洞：Y: 1810 ~ 1860，净宽 50px，角色可通过]
            // 段 3: 下门洞下 Y:1860 ~ 底角 Y:1960
            {
                type: 'poly_wall',
                points: [
                    { x: 1899, y: 1860 },
                    { x: 1913, y: 1860 },
                    { x: 1896, y: 1960 },
                    { x: 1882, y: 1960 }
                ],
                label: 'EAST SHARED WALL 3',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // D. 中间房间南侧底部封闭水平实墙 (底边完全封死)
            // -----------------------------------------------------------------
            {
                type: 'solid',
                points: [
                    { x: 1304, y: 1953 },
                    { x: 1896, y: 1953 },
                    { x: 1896, y: 1967 },
                    { x: 1304, y: 1967 }
                ],
                label: 'SOUTH SEALED WALL',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // E. 巨型眼睛外围轮廓斜外墙 (西三角房间与东三角房间外侧封口)
            // -----------------------------------------------------------------
            // 1. 西北斜外墙：连接眼睛左尖端 (150, 1200) 至中间房间顶角 (1055, 490)
            {
                type: 'poly_wall',
                points: [
                    { x: 145.1, y: 1193.7 },
                    { x: 1050.1, y: 483.7 },
                    { x: 1059.9, y: 496.3 },
                    { x: 154.9, y: 1206.3 }
                ],
                label: 'WEST EYE OUTER WALL TOP',
                hideLabel: true
            },
            // 2. 西南斜外墙：连接眼睛左尖端 (150, 1200) 至中间房间底角 (1304, 1960)
            {
                type: 'poly_wall',
                points: [
                    { x: 154.4, y: 1193.3 },
                    { x: 1308.4, y: 1953.3 },
                    { x: 1299.6, y: 1966.7 },
                    { x: 145.6, y: 1206.7 }
                ],
                label: 'WEST EYE OUTER WALL BOTTOM',
                hideLabel: true
            },
            // 西侧眼睛尖角封口端帽 (X: 140 ~ 155, Y: 1190 ~ 1210)
            {
                type: 'solid',
                points: [
                    { x: 138, y: 1190 },
                    { x: 155, y: 1190 },
                    { x: 155, y: 1210 },
                    { x: 138, y: 1210 }
                ],
                label: 'WEST EYE APEX CAP',
                hideLabel: true
            },

            // 3. 东北斜外墙：连接中间房间顶角 (2145, 490) 至眼睛右尖端 (3050, 1200)
            {
                type: 'poly_wall',
                points: [
                    { x: 2149.9, y: 483.7 },
                    { x: 3054.9, y: 1193.7 },
                    { x: 3045.1, y: 1206.3 },
                    { x: 2140.1, y: 496.3 }
                ],
                label: 'EAST EYE OUTER WALL TOP',
                hideLabel: true
            },
            // 4. 东南斜外墙：连接中间房间底角 (1896, 1960) 至眼睛右尖端 (3050, 1200)
            {
                type: 'poly_wall',
                points: [
                    { x: 1891.6, y: 1953.3 },
                    { x: 3045.6, y: 1193.3 },
                    { x: 3054.4, y: 1206.7 },
                    { x: 1900.4, y: 1966.7 }
                ],
                label: 'EAST EYE OUTER WALL BOTTOM',
                hideLabel: true
            },
            // 东侧眼睛尖角封口端帽 (X: 3045 ~ 3062, Y: 1190 ~ 1210)
            {
                type: 'solid',
                points: [
                    { x: 3045, y: 1190 },
                    { x: 3062, y: 1190 },
                    { x: 3062, y: 1210 },
                    { x: 3045, y: 1210 }
                ],
                label: 'EAST EYE APEX CAP',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // F. 正中央圆台（整张地图正中间：X: 1600, Y: 1200，半径 155px，带发光灯环）
            // -----------------------------------------------------------------
            {
                type: 'solid',
                circle: { cx: cx, cy: cy, radius: 155 },
                innerRing: { radius: 143, width: 8 },
                label: 'CENTRAL ROUND TABLE',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // G. 新增：中间房间最上方矩形下方的左右两个实体圆形柱 (X: 1350 & 1850, Y: 920)
            // -----------------------------------------------------------------
            {
                type: 'solid',
                circle: { cx: 1350, cy: 920, radius: 35 },
                innerRing: { radius: 23, width: 4 },
                label: 'LEFT CYLINDRICAL TERMINAL',
                hideLabel: true
            },
            {
                type: 'solid',
                circle: { cx: 1850, cy: 920, radius: 35 },
                innerRing: { radius: 23, width: 4 },
                label: 'RIGHT CYLINDRICAL TERMINAL',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // H. 环绕在中央圆台四周的 4 个加长圆弧结构 (两两间距 30px)
            // -----------------------------------------------------------------
            // 东北弧
            {
                type: 'solid',
                arc: {
                    cx: cx,
                    cy: cy,
                    radius: 180,
                    startAngle: -1.487,
                    endAngle: -0.084,
                    thickness: 20
                },
                label: 'CURVED ARC NE',
                hideLabel: true
            },
            // 东南弧
            {
                type: 'solid',
                arc: {
                    cx: cx,
                    cy: cy,
                    radius: 180,
                    startAngle: 0.084,
                    endAngle: 1.487,
                    thickness: 20
                },
                label: 'CURVED ARC SE',
                hideLabel: true
            },
            // 西南弧
            {
                type: 'solid',
                arc: {
                    cx: cx,
                    cy: cy,
                    radius: 180,
                    startAngle: 1.655,
                    endAngle: 3.058,
                    thickness: 20
                },
                label: 'CURVED ARC SW',
                hideLabel: true
            },
            // 西北弧
            {
                type: 'solid',
                arc: {
                    cx: cx,
                    cy: cy,
                    radius: 180,
                    startAngle: 3.226,
                    endAngle: 4.628,
                    thickness: 20
                },
                label: 'CURVED ARC NW',
                hideLabel: true
            },

            // -----------------------------------------------------------------
            // I. 中间房间南侧长方形系统 (3 排 × 2 列 = 6 个长方形)
            // -----------------------------------------------------------------
            // 第 1 排 (Y: 1480)
            {
                type: 'solid',
                x: 1330,
                y: 1480,
                w: 220,
                h: 36,
                label: 'RECTANGLE R1-L',
                hideLabel: true
            },
            {
                type: 'solid',
                x: 1650,
                y: 1480,
                w: 220,
                h: 36,
                label: 'RECTANGLE R1-R',
                hideLabel: true
            },
            // 第 2 排 (Y: 1580)
            {
                type: 'solid',
                x: 1330,
                y: 1580,
                w: 220,
                h: 36,
                label: 'RECTANGLE R2-L',
                hideLabel: true
            },
            {
                type: 'solid',
                x: 1650,
                y: 1580,
                w: 220,
                h: 36,
                label: 'RECTANGLE R2-R',
                hideLabel: true
            },
            // 第 3 排 (Y: 1680)
            {
                type: 'solid',
                x: 1330,
                y: 1680,
                w: 220,
                h: 36,
                label: 'RECTANGLE R3-L',
                hideLabel: true
            },
            {
                type: 'solid',
                x: 1650,
                y: 1680,
                w: 220,
                h: 36,
                label: 'RECTANGLE R3-R',
                hideLabel: true
            }
        ];

        // =====================================================================
        // 2. Blueprint 视觉图层 (巨型眼睛地坪 + 三角房间圆弧/横线 + 门洞刻度)
        // =====================================================================
        const props = [
            {
                x: 100,
                y: 400,
                w: 3000,
                h: 1650,
                noCollision: true,
                hideLabel: true,
                draw: (ctx) => {
                    ctx.save();

                    // --- 1. 巨型眼睛三大房间地坪底色（多边形整铺） ---
                    ctx.beginPath();
                    ctx.moveTo(150, 1200);      // 西端眼睛顶点
                    ctx.lineTo(1055, 490);     // 中室西北角
                    ctx.lineTo(2145, 490);     // 中室东北角
                    ctx.lineTo(3050, 1200);    // 东端眼睛顶点
                    ctx.lineTo(1896, 1960);    // 中室东南角
                    ctx.lineTo(1304, 1960);    // 中室西南角
                    ctx.closePath();
                    ctx.fillStyle = '#05100c';
                    ctx.fill();

                    // --- 2. 中间大圆形内部悬挂发光灯环 (位于地图正中心 cx:1600, cy:1200) ---
                    ctx.beginPath();
                    ctx.arc(cx, cy, 143, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(52, 211, 153, 0.95)';
                    ctx.lineWidth = 8;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(cx, cy, 143, 0, Math.PI * 2);
                    ctx.strokeStyle = '#e6fffa';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // --- 3. 最上方 3 个几何结构 (中间倒梯形 + 左右共用倾斜边) ---
                    ctx.save();
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2.5;

                    // 顶端水平通线 (Y: 490，X: 1055 ~ 2145)
                    ctx.beginPath();
                    ctx.moveTo(1055, 490);
                    ctx.lineTo(2145, 490);
                    ctx.stroke();

                    // 左侧最外侧斜边 (X: 1055, Y: 490 至 X: 1110, Y: 820)
                    ctx.beginPath();
                    ctx.moveTo(1055, 490);
                    ctx.lineTo(1110, 820);
                    ctx.stroke();

                    // 右侧最外侧斜边 (X: 2145, Y: 490 至 X: 2090, Y: 820)
                    ctx.beginPath();
                    ctx.moveTo(2145, 490);
                    ctx.lineTo(2090, 820);
                    ctx.stroke();

                    // 中间倒梯形左侧斜边 (平行于左侧最外侧斜边：(1403, 490) -> (1445, 740))
                    ctx.beginPath();
                    ctx.moveTo(1403, 490);
                    ctx.lineTo(1445, 740);
                    ctx.stroke();

                    // 中间倒梯形右侧斜边 (平行于右侧最外侧斜边：(1797, 490) -> (1755, 740))
                    ctx.beginPath();
                    ctx.moveTo(1797, 490);
                    ctx.lineTo(1755, 740);
                    ctx.stroke();

                    // 底边折角线：左斜段 (1110, 820)->(1445, 740)，中平底边 (1445, 740)->(1755, 740)，右斜段 (1755, 740)->(2090, 820)
                    ctx.beginPath();
                    ctx.moveTo(1110, 820);
                    ctx.lineTo(1445, 740);
                    ctx.lineTo(1755, 740);
                    ctx.lineTo(2090, 820);
                    ctx.stroke();

                    ctx.restore();

                    // --- 4. 左右三角房间大圆弧结构 ---
                    ctx.save();
                    ctx.strokeStyle = '#10b981';

                    // 4A. 西侧三角房间 (Left Sector) 大圆弧 (外凸向左，构成眼睛虹膜/眼球轮廓)
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.moveTo(1142, 985);
                    ctx.bezierCurveTo(1010, 1070, 1010, 1330, 1215, 1415);
                    ctx.stroke();

                    // 4B. 东侧三角房间 (Right Sector) 大圆弧 (外凸向右，与西侧大弧构成完整对称眼睛轮廓)
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.moveTo(2058, 985);
                    ctx.bezierCurveTo(2190, 1070, 2190, 1330, 1985, 1415);
                    ctx.stroke();

                    ctx.restore();

                    // --- 5. 门洞两侧垂直于斜外墙的短刻度标线 (连通三个房间) ---
                    ctx.save();
                    ctx.strokeStyle = '#34d399';
                    ctx.lineWidth = 3;

                    // A. 西侧上门洞刻度 (Y: 895 & Y: 945)
                    ctx.beginPath();
                    ctx.moveTo(1107, 895);
                    ctx.lineTo(1137, 895);
                    ctx.moveTo(1116, 945);
                    ctx.lineTo(1146, 945);
                    ctx.stroke();

                    // B. 东侧上门洞刻度 (Y: 895 & Y: 945)
                    ctx.beginPath();
                    ctx.moveTo(2063, 895);
                    ctx.lineTo(2093, 895);
                    ctx.moveTo(2054, 945);
                    ctx.lineTo(2084, 945);
                    ctx.stroke();

                    // C. 西侧下门洞刻度 (Y: 1810 & Y: 1860)
                    ctx.beginPath();
                    ctx.moveTo(1275, 1810);
                    ctx.lineTo(1305, 1810);
                    ctx.moveTo(1283, 1860);
                    ctx.lineTo(1313, 1860);
                    ctx.stroke();

                    // D. 东侧下门洞刻度 (Y: 1810 & Y: 1860)
                    ctx.beginPath();
                    ctx.moveTo(1895, 1810);
                    ctx.lineTo(1925, 1810);
                    ctx.moveTo(1887, 1860);
                    ctx.lineTo(1917, 1860);
                    ctx.stroke();

                    ctx.restore();
                    ctx.restore();
                }
            }
        ];

        // =====================================================================
        // 3. 区域与房间定义 (Zones)
        // =====================================================================
        const zones = [
            {
                id: 'apex_chamber_1',
                name: '顶石中央指挥大厅 (Room 01)',
                x: 1055,
                y: 490,
                w: 1090,
                h: 1470
            },
            {
                id: 'apex_chamber_west',
                name: '顶石西侧观测区 (West Sector)',
                x: 150,
                y: 490,
                w: 905,
                h: 1470
            },
            {
                id: 'apex_chamber_east',
                name: '顶石东侧科研区 (East Sector)',
                x: 2145,
                y: 490,
                w: 905,
                h: 1470
            }
        ];

        // =====================================================================
        // 4. 寻路与视野导航路点 (Waypoints: 覆盖三大房间与全部四处门洞)
        // =====================================================================
        const waypoints = [
            // 中间大厅中轴
            { x: 1600, y: 1835 },
            { x: 1600, y: 1645 },
            { x: 1600, y: 1545 },
            { x: 1600, y: 1435 },
            { x: 1300, y: 1200 },
            { x: 1900, y: 1200 },
            { x: 1600, y: 980 },
            { x: 1600, y: 800 },
            // 中间房间左右圆柱终端旁
            { x: 1350, y: 840 },
            { x: 1850, y: 840 },
            // 四个门洞通道
            { x: 1125, y: 920 },
            { x: 2075, y: 920 },
            { x: 1295, y: 1835 },
            { x: 1905, y: 1835 },
            // 西侧三角房间内部
            { x: 950, y: 920 },
            { x: 950, y: 1835 },
            { x: 805, y: 1200 },
            { x: 665, y: 1200 },
            { x: 530, y: 1200 },
            { x: 300, y: 1200 },
            // 东侧三角房间内部
            { x: 2250, y: 920 },
            { x: 2250, y: 1835 },
            { x: 2395, y: 1200 },
            { x: 2535, y: 1200 },
            { x: 2670, y: 1200 },
            { x: 2900, y: 1200 }
        ];

        return {
            obstacles,
            props,
            zones,
            waypoints,
            cameras: [],
            lasers: [],
            securityGates: []
        };
    }
};

window.LEVEL_LAB = LEVEL_LAB;
