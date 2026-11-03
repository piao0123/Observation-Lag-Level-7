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
            // A. 中间房间最上方 3 大显示屏的封闭外墙 (顶边与左右最外侧斜边封死)
            // -----------------------------------------------------------------
            // 1. 顶角封口墙 (Y: 483 ~ 497, X: 1055 ~ 2145)
            {
                type: 'solid',
                points: [
                    { x: 1055, y: 483 },
                    { x: 2145, y: 483 },
                    { x: 2145, y: 497 },
                    { x: 1055, y: 497 }
                ],
                label: 'TOP SCREEN UPPER WALL',
                hideLabel: true
            },
            // 2. 左侧显示屏最外侧斜外墙 (1055, 490) -> (1110, 820)
            {
                type: 'poly_wall',
                points: [
                    { x: 1048, y: 490 },
                    { x: 1062, y: 490 },
                    { x: 1117, y: 820 },
                    { x: 1103, y: 820 }
                ],
                label: 'TOP LEFT SCREEN OUTER WALL',
                hideLabel: true
            },
            // 3. 右侧显示屏最外侧斜外墙 (2145, 490) -> (2090, 820)
            {
                type: 'poly_wall',
                points: [
                    { x: 2138, y: 490 },
                    { x: 2152, y: 490 },
                    { x: 2097, y: 820 },
                    { x: 2083, y: 820 }
                ],
                label: 'TOP RIGHT SCREEN OUTER WALL',
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

                    // --- 1. 巨型眼睛三大房间地坪底色（多边形整铺，向上拓展延伸至 Y:470 完美覆盖屏后与外围） ---
                    ctx.beginPath();
                    ctx.moveTo(150, 1200);      // 西端眼睛顶点
                    ctx.lineTo(1055, 470);     // 中室西北角 (覆盖屏后外围)
                    ctx.lineTo(2145, 470);     // 中室东北角 (覆盖屏后外围)
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

                    // --- 3. 最上方 3 大高科技控制显示屏 (High-Tech Tactical Display Screens) ---
                    // 屏背景边缘渐变色完全融于 Level 7 墨绿科技地坪色 (#05100c / #022c22)，无任何黑色边框
                    ctx.save();

                    // =========================================================================
                    // 3A. LEFT SCREEN: ABYSSAL DEEP MONITOR & CERBERUS DIAGRAM
                    // Quad: (1055, 490) -> (1403, 490) -> (1445, 740) -> (1110, 820)
                    // =========================================================================
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(1055, 490);
                    ctx.lineTo(1403, 490);
                    ctx.lineTo(1445, 740);
                    ctx.lineTo(1110, 820);
                    ctx.closePath();

                    // Radial illuminated backlight gradient blending to Level 7 floor color (#05100c)
                    const radLeft = ctx.createRadialGradient(1250, 650, 20, 1250, 650, 320);
                    radLeft.addColorStop(0, '#0b355c');
                    radLeft.addColorStop(0.45, '#061c3a');
                    radLeft.addColorStop(1, '#05100c');
                    ctx.fillStyle = radLeft;
                    ctx.fill();

                    // Smooth cyan border
                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    ctx.clip(); // clip contents to left screen quad

                    // CRT Scanlines
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.04)';
                    ctx.lineWidth = 1;
                    for (let gy = 480; gy < 830; gy += 3) {
                        ctx.beginPath(); ctx.moveTo(1000, gy); ctx.lineTo(1500, gy); ctx.stroke();
                    }

                    // Glass Glare
                    ctx.beginPath();
                    ctx.moveTo(1055, 490); ctx.lineTo(1250, 490); ctx.lineTo(1120, 750); ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fill();

                    // Header Bar
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.18)';
                    ctx.fillRect(1070, 495, 325, 22);
                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1070, 495, 325, 22);

                    ctx.font = 'bold 11px monospace';
                    ctx.fillStyle = '#00E5FF';
                    ctx.textAlign = 'center';
                    ctx.fillText('INFERNAL DEEP MONITOR', 1232, 510);

                    // --- UPPER HALF: Abyssal Sector Map Outline ---
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1075, 523, 318, 112);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1075, 523, 318, 112);

                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#38bdf8';
                    ctx.textAlign = 'left';
                    ctx.fillText('ABYSSAL DEEP SECTOR OUTLINE:', 1082, 535);

                    // Sector 1: Demon Wings (Satan)
                    ctx.strokeStyle = '#FF3344'; ctx.lineWidth = 1.2;
                    ctx.strokeRect(1080, 542, 90, 88);
                    ctx.fillStyle = 'rgba(255, 51, 68, 0.10)'; ctx.fillRect(1080, 542, 90, 88);

                    // Demon Wings Vector Drawing
                    ctx.save();
                    ctx.translate(1125, 580);
                    ctx.strokeStyle = '#ff3344';
                    ctx.fillStyle = 'rgba(255, 51, 68, 0.25)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(0, 5);
                    ctx.bezierCurveTo(-12, -15, -30, -12, -33, 2);
                    ctx.bezierCurveTo(-24, 8, -18, 18, -10, 10);
                    ctx.bezierCurveTo(-6, 15, -3, 12, 0, 5);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(0, 5);
                    ctx.bezierCurveTo(12, -15, 30, -12, 33, 2);
                    ctx.bezierCurveTo(24, 8, 18, 18, 10, 10);
                    ctx.bezierCurveTo(6, 15, 3, 12, 0, 5);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(-33, 2); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(33, 2); ctx.stroke();
                    ctx.restore();

                    ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#FF3344';
                    ctx.fillText('SEC 1: SATAN DOMAIN', 1125, 622);

                    // Sector 2: Irregular Lava Lake Polygon
                    ctx.strokeStyle = '#FFCC00'; ctx.lineWidth = 1.2;
                    ctx.strokeRect(1178, 542, 90, 88);
                    ctx.fillStyle = 'rgba(255, 204, 0, 0.10)'; ctx.fillRect(1178, 542, 90, 88);

                    // Irregular Lava Lake Vector
                    ctx.save();
                    ctx.translate(1223, 578);
                    ctx.strokeStyle = '#ffaa00';
                    ctx.fillStyle = 'rgba(255, 170, 0, 0.3)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(-28, -10);
                    ctx.lineTo(-10, -20);
                    ctx.lineTo(16, -16);
                    ctx.lineTo(28, -4);
                    ctx.lineTo(24, 16);
                    ctx.lineTo(2, 22);
                    ctx.lineTo(-22, 14);
                    ctx.lineTo(-28, 4);
                    ctx.closePath();
                    ctx.fill(); ctx.stroke();
                    ctx.strokeStyle = '#ffe600'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(-10, -20); ctx.lineTo(2, 22); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(-28, 4); ctx.lineTo(16, -16); ctx.stroke();
                    ctx.restore();

                    ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#FFCC00';
                    ctx.fillText('SEC 2: MOLTEN BASIN', 1223, 622);

                    // Sector 3: Sacrificial Altar Hexagon
                    ctx.strokeStyle = '#00FF66'; ctx.lineWidth = 1.2;
                    ctx.strokeRect(1276, 542, 112, 88);
                    ctx.fillStyle = 'rgba(0, 255, 102, 0.10)'; ctx.fillRect(1276, 542, 112, 88);

                    // Altar Hexagon Vector
                    ctx.save();
                    ctx.translate(1332, 578);
                    ctx.strokeStyle = '#00ff66';
                    ctx.fillStyle = 'rgba(0, 255, 102, 0.25)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let a = 0; a < 6; a++) {
                        const ang = (Math.PI / 3) * a;
                        const hx = 20 * Math.cos(ang);
                        const hy = 20 * Math.sin(ang);
                        if (a === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();

                    ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#00FF66';
                    ctx.fillText('SEC 3: SACRIFICE ALTAR', 1332, 622);


                    // --- LOWER HALF: Cerberus Diagram & Hazard Status ---
                    // Shifted right to X = 1098 to prevent clipping from inward sloping left wall
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1098, 642, 330, 138);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1098, 642, 330, 138);

                    ctx.font = 'bold 9px monospace';
                    ctx.fillStyle = '#ef4444'; ctx.textAlign = 'left';
                    ctx.fillText('SUBJECT: CERBERUS / HELLHOUND DIAGRAM', 1106, 655);

                    // Detailed Cerberus Graphic
                    ctx.save();
                    ctx.translate(1150, 712);

                    // 4 Legs
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath(); ctx.moveTo(-16, 8); ctx.lineTo(-22, 24); ctx.lineTo(-18, 25); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-12, 24); ctx.lineTo(-8, 25); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(10, 8); ctx.lineTo(8, 24); ctx.lineTo(12, 25); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(18, 8); ctx.lineTo(18, 24); ctx.lineTo(22, 25); ctx.stroke();

                    // Hound Body Torso
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
                    ctx.beginPath(); ctx.ellipse(0, 2, 22, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                    // Curved Tail
                    ctx.beginPath();
                    ctx.moveTo(-22, 2);
                    ctx.quadraticCurveTo(-32, -8, -28, -18);
                    ctx.stroke();
                    ctx.fillStyle = '#ff2200';
                    ctx.beginPath(); ctx.arc(-28, -18, 3, 0, Math.PI * 2); ctx.fill();

                    // 3 Heads
                    const drawHead = (hx, hy, angle) => {
                        ctx.save();
                        ctx.translate(hx, hy);
                        ctx.rotate(angle);
                        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
                        ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, 0); ctx.stroke();
                        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
                        ctx.beginPath(); ctx.arc(0, -2, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(3, -4); ctx.lineTo(10, -2); ctx.lineTo(3, 1); ctx.closePath(); ctx.fill(); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(-2, -6); ctx.lineTo(-4, -11); ctx.lineTo(1, -6); ctx.fill(); ctx.stroke();
                        ctx.fillStyle = '#ff0000';
                        ctx.beginPath(); ctx.arc(2, -3, 1.2, 0, Math.PI * 2); ctx.fill();
                        ctx.restore();
                    };

                    drawHead(-12, -8, -0.35);
                    drawHead(0, -12, 0);
                    drawHead(12, -8, 0.35);

                    ctx.restore();

                    // Specs Info Text
                    ctx.font = 'bold 8.5px monospace'; ctx.textAlign = 'left';
                    ctx.fillStyle = '#f87171';
                    ctx.fillText('ENTITY ID: CERBERUS-X', 1208, 672);
                    ctx.fillText('THREAT LEVEL: OMEGA-MAX', 1208, 687);
                    ctx.fillStyle = '#FFCC00';
                    ctx.fillText('STATUS: UNKNOWN', 1208, 702);
                    ctx.fillText('ANATOMY DATA: UNKNOWN', 1208, 717);
                    ctx.fillText('WEAKNESS: UNKNOWN', 1208, 732);

                    // Warning Bar
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                    ctx.fillRect(1106, 746, 314, 20);
                    ctx.strokeStyle = '#ef4444';
                    ctx.strokeRect(1106, 746, 314, 20);
                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#ff6666';
                    ctx.textAlign = 'center';
                    ctx.fillText('⚠️ DETAILED SPECIFICATIONS: UNKNOWN', 1263, 760);

                    ctx.restore(); // end Screen 1


                    // =========================================================================
                    // 3B. CENTER SCREEN: GLOBAL STRATEGIC COMMAND & WORLD THEATER MAP
                    // Quad / Inverted Trapezoid: (1403, 490) -> (1797, 490) -> (1755, 740) -> (1445, 740)
                    // =========================================================================
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(1403, 490);
                    ctx.lineTo(1797, 490);
                    ctx.lineTo(1755, 740);
                    ctx.lineTo(1445, 740);
                    ctx.closePath();

                    // Radial illuminated backlight gradient centered at (1600, 630), blending into Level 7 floor color (#05100c)
                    const gradCenter = ctx.createRadialGradient(1600, 630, 20, 1600, 630, 300);
                    gradCenter.addColorStop(0, '#0c3a6b');
                    gradCenter.addColorStop(0.45, '#071f40');
                    gradCenter.addColorStop(1, '#05100c');
                    ctx.fillStyle = gradCenter;
                    ctx.fill();

                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    ctx.clip(); // clip to center screen quad

                    // CRT Scanlines
                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
                    ctx.lineWidth = 1;
                    for (let gy = 480; gy < 750; gy += 3) {
                        ctx.beginPath(); ctx.moveTo(1400, gy); ctx.lineTo(1800, gy); ctx.stroke();
                    }

                    // Glass Glare
                    ctx.beginPath();
                    ctx.moveTo(1403, 490); ctx.lineTo(1620, 490); ctx.lineTo(1480, 740); ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fill();

                    // Header Bar
                    ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
                    ctx.fillRect(1410, 495, 380, 24);
                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1410, 495, 380, 24);

                    ctx.font = 'bold 11px monospace';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.fillText('GLOBAL STRATEGIC COMMAND - WORLD THEATER MAP', 1600, 511);

                    // Latitude & Longitude Grid Lines & Internal Ticks (at X = 1432, untouched by map)
                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.22)';
                    ctx.lineWidth = 0.8;
                    for (let latY = 530; latY <= 720; latY += 22) {
                        ctx.beginPath(); ctx.moveTo(1400, latY); ctx.lineTo(1800, latY); ctx.stroke();
                        ctx.font = 'bold 7px monospace'; ctx.fillStyle = 'rgba(0, 229, 255, 0.75)';
                        ctx.textAlign = 'left';
                        ctx.fillText(`${90 - Math.round((latY - 530) * 0.9)}°N`, 1432, latY - 2);
                    }
                    for (let lonX = 1430; lonX <= 1770; lonX += 30) {
                        ctx.beginPath();
                        ctx.moveTo(lonX, 525);
                        ctx.bezierCurveTo(lonX + (1600 - lonX) * 0.12, 600, lonX + (1600 - lonX) * 0.12, 680, lonX, 735);
                        ctx.stroke();
                    }

                    // Accurate World Continents Outline Perfectly Centered Vertically (+35px shift)
                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.85)';
                    ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
                    ctx.lineWidth = 1.2;

                    // North America (Center X = 1500, Y = 595)
                    ctx.beginPath();
                    ctx.moveTo(1465, 580);
                    ctx.lineTo(1490, 573);
                    ctx.lineTo(1530, 577);
                    ctx.lineTo(1525, 610);
                    ctx.lineTo(1512, 617); // Florida
                    ctx.lineTo(1508, 613);
                    ctx.lineTo(1495, 635); // Central America
                    ctx.lineTo(1480, 615);
                    ctx.lineTo(1468, 595);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // South America (Center X = 1515, Y = 670)
                    ctx.beginPath();
                    ctx.moveTo(1495, 635);
                    ctx.lineTo(1528, 643);
                    ctx.lineTo(1522, 700);
                    ctx.lineTo(1502, 685);
                    ctx.lineTo(1490, 653);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Eurasia (Europe + Asia, Center X = 1635, Y = 595)
                    ctx.beginPath();
                    ctx.moveTo(1560, 583);
                    ctx.lineTo(1578, 567); // Scandinavia
                    ctx.lineTo(1595, 567);
                    ctx.lineTo(1645, 565); // Russia
                    ctx.lineTo(1740, 573); // Kamchatka
                    ctx.lineTo(1745, 610); // East Asia coast
                    ctx.lineTo(1700, 630); // SE Asia
                    ctx.lineTo(1670, 650); // India
                    ctx.lineTo(1655, 623);
                    ctx.lineTo(1615, 625); // Arabia
                    ctx.lineTo(1610, 607); // Med coast
                    ctx.lineTo(1560, 587);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Africa (Center X = 1595, Y = 650)
                    ctx.beginPath();
                    ctx.moveTo(1570, 610);
                    ctx.lineTo(1615, 613);
                    ctx.lineTo(1622, 645); // Horn of Africa
                    ctx.lineTo(1595, 687);
                    ctx.lineTo(1568, 650);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Australia (Center X = 1715, Y = 680)
                    ctx.beginPath();
                    ctx.moveTo(1705, 665);
                    ctx.lineTo(1748, 660);
                    ctx.lineTo(1742, 700);
                    ctx.lineTo(1702, 691);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Japan Islands Dot
                    ctx.beginPath(); ctx.arc(1748, 595, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                    // --- 6 CAMPAIGN LOCATIONS MARKERS & CENTERED CALLOUTS ---
                    const campaignLocations = [
                        { name: 'LOC-01 AIRPORT', lat: '37.6° N', lon: '122.3° W', x: 1485, y: 600, boxX: 1438, boxY: 617 },
                        { name: 'LOC-02 SUBWAY',  lat: '40.7° N', lon: '73.9° W',  x: 1520, y: 593, boxX: 1452, boxY: 563 },
                        { name: 'LOC-03 BANK',    lat: '51.5° N', lon: '0.1° W',   x: 1570, y: 575, boxX: 1545, boxY: 545 },
                        { name: 'LOC-04 YACHT',   lat: '25.7° N', lon: '80.1° W',  x: 1510, y: 630, boxX: 1448, boxY: 655 },
                        { name: 'LOC-05 HOTEL',   lat: '47.3° N', lon: '8.5° E',   x: 1592, y: 585, boxX: 1602, boxY: 600 },
                        { name: 'LOC-06 EXPRESS', lat: '55.7° N', lon: '37.6° E',  x: 1640, y: 571, boxX: 1660, boxY: 550 },
                    ];

                    campaignLocations.forEach(loc => {
                        // Dot & pulse circle
                        ctx.fillStyle = '#00FF66';
                        ctx.beginPath(); ctx.arc(loc.x, loc.y, 3, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#00FF66'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.arc(loc.x, loc.y, 6, 0, Math.PI * 2); ctx.stroke();

                        // Callout Leader Line
                        ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath(); ctx.moveTo(loc.x, loc.y); ctx.lineTo(loc.boxX + 35, loc.boxY + 9); ctx.stroke();

                        // Callout Tag Box (translucent emerald-teal background matching Level 7)
                        ctx.fillStyle = 'rgba(6, 28, 22, 0.88)';
                        ctx.strokeStyle = '#00E5FF';
                        ctx.lineWidth = 0.8;
                        const w = 92;
                        const h = 18;
                        ctx.fillRect(loc.boxX, loc.boxY, w, h);
                        ctx.strokeRect(loc.boxX, loc.boxY, w, h);

                        ctx.font = 'bold 6.5px monospace';
                        ctx.fillStyle = '#00E5FF'; ctx.textAlign = 'left';
                        ctx.fillText(loc.name, loc.boxX + 3, loc.boxY + 7);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(`[${loc.lat}, ${loc.lon}]`, loc.boxX + 3, loc.boxY + 15);
                    });

                    ctx.restore(); // end Screen 2


                    // =========================================================================
                    // 3C. RIGHT SCREEN: PERSONNEL VITAL SIGNS & ARMORED EXPRESS SPECS
                    // Quad: (1797, 490) -> (2145, 490) -> (2090, 820) -> (1755, 740)
                    // =========================================================================
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(1797, 490);
                    ctx.lineTo(2145, 490);
                    ctx.lineTo(2090, 820);
                    ctx.lineTo(1755, 740);
                    ctx.closePath();

                    // Radial illuminated backlight gradient blending into Level 7 floor color (#05100c)
                    const gradRight = ctx.createRadialGradient(1950, 650, 20, 1950, 650, 320);
                    gradRight.addColorStop(0, '#0b355c');
                    gradRight.addColorStop(0.45, '#061c3a');
                    gradRight.addColorStop(1, '#05100c');
                    ctx.fillStyle = gradRight;
                    ctx.fill();

                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 2.0;
                    ctx.stroke();

                    ctx.clip(); // clip to right screen quad

                    // CRT Scanlines
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.04)';
                    ctx.lineWidth = 1;
                    for (let gy = 480; gy < 830; gy += 3) {
                        ctx.beginPath(); ctx.moveTo(1750, gy); ctx.lineTo(2200, gy); ctx.stroke();
                    }

                    // Glass Glare
                    ctx.beginPath();
                    ctx.moveTo(1797, 490); ctx.lineTo(1980, 490); ctx.lineTo(1850, 750); ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fill();

                    // Header Bar
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.15)';
                    ctx.fillRect(1805, 495, 330, 22);
                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1805, 495, 330, 22);

                    ctx.font = 'bold 11px monospace';
                    ctx.fillStyle = '#00E5FF';
                    ctx.textAlign = 'center';
                    ctx.fillText('PERSONNEL & TRAIN TELEMETRY', 1970, 510);

                    // --- UPPER HALF: Personnel Status & Vital Signs ---
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1808, 523, 324, 112);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1808, 523, 324, 112);

                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left';
                    ctx.fillText('PERSONNEL VITAL SIGNS MONITORING:', 1814, 535);

                    // 3 Personnel Profiles
                    const personnelList = [
                        { name: 'SPECTRE (AGENT)', status: 'ACTIVE', bpm: 72, o2: '98%', hp: '100%' },
                        { name: 'NEXUS (OPERATOR)', status: 'ONLINE', bpm: 68, o2: '99%', hp: '100%' },
                        { name: 'APEX (COMMANDER)', status: 'STANDBY', bpm: 75, o2: '97%', hp: '100%' },
                    ];

                    personnelList.forEach((p, i) => {
                        const py = 544 + i * 27;
                        // Avatar Icon Box
                        ctx.fillStyle = '#0a1a30'; ctx.fillRect(1814, py, 20, 20);
                        ctx.strokeStyle = '#00E5FF'; ctx.strokeRect(1814, py, 20, 20);
                        ctx.fillStyle = '#00E5FF';
                        ctx.beginPath(); ctx.arc(1824, py + 7, 3.5, 0, Math.PI * 2); ctx.fill();
                        ctx.beginPath(); ctx.arc(1824, py + 18, 6, Math.PI, 0); ctx.fill();

                        ctx.font = 'bold 7.5px monospace';
                        ctx.fillStyle = '#ffffff'; ctx.fillText(p.name, 1838, py + 7);
                        ctx.fillStyle = '#00FF66'; ctx.fillText(`[${p.status}]`, 1838, py + 16);

                        ctx.fillStyle = '#38bdf8';
                        ctx.fillText(`HR: ${p.bpm} BPM | O2: ${p.o2} | VITAL: ${p.hp}`, 1930, py + 11);

                        // ECG Heartbeat Waveform
                        ctx.strokeStyle = '#00FF66'; ctx.lineWidth = 1;
                        ctx.beginPath();
                        const ecgX = 2065;
                        ctx.moveTo(ecgX, py + 9);
                        ctx.lineTo(ecgX + 8, py + 9);
                        ctx.lineTo(ecgX + 11, py + 2);
                        ctx.lineTo(ecgX + 15, py + 16);
                        ctx.lineTo(ecgX + 18, py + 9);
                        ctx.lineTo(ecgX + 30, py + 9);
                        ctx.stroke();
                    });

                    // --- LOWER HALF: Armored Express & Bridge Layout ---
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1795, 642, 335, 138);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1795, 642, 335, 138);

                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left';
                    ctx.fillText('ARMORED EXPRESS & BRIDGE LAYOUT:', 1802, 655);

                    // 1. Armored Train Exterior Silhouette Diagram (6 Carriages)
                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 1.2;
                    ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';

                    const trainStartX = 1802;
                    const trainY = 663;
                    for (let c = 0; c < 6; c++) {
                        const cx = trainStartX + c * 22;
                        ctx.fillRect(cx, trainY, 19, 9);
                        ctx.strokeRect(cx, trainY, 19, 9);
                    }
                    ctx.beginPath();
                    ctx.moveTo(trainStartX + 132, trainY);
                    ctx.lineTo(trainStartX + 144, trainY + 4.5);
                    ctx.lineTo(trainStartX + 132, trainY + 9);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // 2. Control Room Floor Plan Diagram (Mirror of Train Bridge / Car 4)
                    ctx.fillStyle = '#081220';
                    ctx.fillRect(1802, 678, 145, 45);
                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1802, 678, 145, 45);

                    // Server Racks & Command Consoles in Floor Plan
                    ctx.fillStyle = '#00CCFF';
                    ctx.fillRect(1808, 682, 24, 7); // Rack 1
                    ctx.fillRect(1836, 682, 24, 7); // Rack 2
                    ctx.fillRect(1874, 682, 32, 7); // Main Console

                    ctx.fillRect(1808, 712, 24, 7); // Lower Console
                    ctx.fillRect(1874, 712, 32, 7); // Comms Desk

                    ctx.font = 'bold 6.5px monospace'; ctx.fillStyle = '#00FF66';
                    ctx.fillText('COMMAND BRIDGE (CAR 4)', 1806, 702);

                    // 3. Train Specifications Text (SPEED 240 KM/H)
                    ctx.font = 'bold 8px monospace';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText('ARMORED EXPRESS SPECS:', 1955, 682);

                    ctx.font = '7.5px monospace'; ctx.fillStyle = '#38bdf8';
                    ctx.fillText('SPEED: 240 KM/H', 1955, 695);
                    ctx.fillText('STATUS: CRUISING', 1955, 707);
                    ctx.fillText('CARRIAGES: 06 UNITS', 1955, 719);
                    ctx.fillText('DEFENSE: MAX LOCKDOWN', 1955, 731);

                    // Bottom System Status Banner
                    ctx.fillStyle = 'rgba(0, 255, 102, 0.15)';
                    ctx.fillRect(1802, 752, 318, 18);
                    ctx.strokeStyle = '#00FF66';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1802, 752, 318, 18);
                    ctx.font = 'bold 8.5px monospace'; ctx.fillStyle = '#00FF66';
                    ctx.textAlign = 'center';
                    ctx.fillText('SYSTEM STATUS: ALL SECURE', 1961, 765);

                    ctx.restore(); // end Screen 3

                    ctx.restore(); // end 3 screens block

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
                y: 830,
                w: 1090,
                h: 1130
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
