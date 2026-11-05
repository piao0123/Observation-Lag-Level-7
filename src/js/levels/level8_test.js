// =========================================================================
// LEVEL 8: 隔离测试关卡 · 顶石中央大厅重装甲复刻与侧门测试场
// ISOLATED DESIGN SANDBOX: LEVEL 7 MIDDLE ROOM WITH LEVEL 6 HEAVY ARMORED WALLS & DOORS
// 100% 隔离测试关卡，将 Level 7 中间房间复制至此，外墙替换为 Level 6 重型装甲外墙，4个侧门替换为 Level 6 重型自动防爆门
// =========================================================================

window.level8MapWidth = 3200;
window.level8MapHeight = 2400;

// =========================================================================
// 全新扇形战术控制台绘制系统 (完全依据手绘草稿 IMG_7693 规范设计与渲染)
// 包含 5 大核心要素：
// 1. 控制台本身呈扇形（弧形外边、内凹弧形座舱边缘、径向收拢侧翼）
// 2. 前部三个连在一起的弧面显示屏（一体化铰链连接，雷达、频谱、动力监测）
// 3. 屏幕后方中央的机械键盘与操作员滑轮座椅（带腰托高靠背与扶手）
// 4. 左侧操作翼多排控制按钮（方块按键、指示摇臂、金属防护拨动开关）
// 5. 右侧操作翼多排控制按钮（双推子电位器、旋转刻度旋钮、微动矩阵、带黄黑警示圈的大型紧急制动按钮）
// =========================================================================
function getSectorWorkstation(cx, cy, angle = 0, scale = 1.0, label = "SECTOR WORKSTATION") {
    const R_out = 114 * scale;
    const R_in = 50 * scale;
    const maxTheta = 38 * Math.PI / 180;
    const pts = [];
    const steps = 8;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    for (let i = 0; i <= steps; i++) {
        const t = -maxTheta + (2 * maxTheta) * (i / steps);
        const lx = Math.sin(t) * R_out;
        const ly = -Math.cos(t) * R_out;
        pts.push({
            x: Math.round(cx + (lx * cosA - ly * sinA)),
            y: Math.round(cy + (lx * sinA + ly * cosA))
        });
    }
    for (let i = steps; i >= 0; i--) {
        const t = -maxTheta + (2 * maxTheta) * (i / steps);
        const lx = Math.sin(t) * R_in;
        const ly = -Math.cos(t) * R_in;
        pts.push({
            x: Math.round(cx + (lx * cosA - ly * sinA)),
            y: Math.round(cy + (lx * sinA + ly * cosA))
        });
    }

    const boundR = 135 * scale;
    return {
        type: "sector_workstation",
        cx: cx,
        cy: cy,
        angle: angle,
        scale: scale,
        x: cx - boundR,
        y: cy - boundR,
        w: boundR * 2,
        h: boundR * 2,
        points: pts,
        label: label,
        displayName: "SECTOR COMMAND CONSOLE",
        hideLabel: true,
        draw: (ctx) => {
            drawSectorWorkstation(ctx, cx, cy, angle, scale);
        }
    };
}

// =========================================================================
// 全新圆形全包围控制台绘制系统 (完全依据手绘草稿 IMG_7694 规范升级设计与渲染)
// 包含 5 大核心改进与规范：
// 1. 标准正圆外壳：采用标准原生圆弧几何绘制，彻底摒弃多边形棱角；纤薄外壳仅 5px，最大化保留舱内宽阔活动空间
// 2. 座位前方三块连体弧面大屏：鲜明高亮，严密顺应圆形外壳曲率展开（正中全景雷达、左侧反应堆示波、右侧防御力场）
// 3. 屏幕后方的机械键盘与操作员滑轮座椅：就坐于舱内中央，面向北方三连屏与机械键盘
// 4. 座位左右两侧按钮完全顺应圆弧曲线排列：左侧三环同心圆弧按键、翘板开关与安全拨动开关；右侧三环同心圆弧推子、旋钮、微动矩阵与紧急制动按钮
// 5. 座位后方蓝色玻璃质感平直隔板：【严格保持水平平直线段，非弧形】，升级为通透纯净的科技蓝玻璃质感（天蓝+宝蓝渐变、45度高光、发光蓝光导轨与立柱光环）
// =========================================================================
function getCircularPodWorkstation(cx, cy, angle = 0, scale = 1.0, label = "CIRCULAR POD CONSOLE") {
    const boundR = 80 * scale;
    return {
        type: "circular_pod_workstation",
        cx: cx,
        cy: cy,
        angle: angle,
        scale: scale,
        x: cx - boundR,
        y: cy - boundR,
        w: boundR * 2,
        h: boundR * 2,
        label: label,
        displayName: "CIRCULAR ENCLOSED COMMAND POD",
        noCollision: true,
        hideLabel: true,
        draw: (ctx) => {
            // ===== 动静分离优化 (2026-11-05)：静态预渲染 + 动态叠加 =====
            const cacheKey = '__podCache_' + cx + '_' + cy + '_' + angle + '_' + scale;
            if (!window[cacheKey]) {
                const sz = Math.ceil(boundR * 2 + 20);
                const off = document.createElement('canvas');
                off.width = sz; off.height = sz;
                const octx = off.getContext('2d');
                octx.save();
                octx.translate(sz / 2, sz / 2);
                octx.translate(-cx, -cy);
                drawCircularPodWorkstation(octx, cx, cy, angle, scale, 1);
                octx.restore();
                window[cacheKey] = { canvas: off, size: sz };
            }
            const c = window[cacheKey];
            ctx.drawImage(c.canvas, cx - c.size / 2, cy - c.size / 2);
            drawCircularPodWorkstationDynamic(ctx, cx, cy, angle, scale);
        }
    };
}

// =========================================================================
// 全新三联方形隔间战术控制台绘制系统 (完全依据手绘草稿 IMG_7697 规范设计与渲染)
// 包含 5 大核心要素与尺寸升级：
// 1. 三个连在一起的方形隔间：4 根贯通式重型金属隔断侧壁与前部横梁架构，形成规整方形工作舱 (Square Cubicles)
// 2. 每个隔间前部三个连在一起的高清战术显示屏：三隔间共 9 块屏，一体化钛合金铰链连接与精密 HUD 动效
// 3. 屏幕后方的机械键盘与重型操作员五星轮滑座椅：座椅全面扩大（宽 26px 坐垫 + 32px 扶手间距），完美适配角色身形体格
// 4. 键盘左右两侧的多排控制按钮：左侧方块按键、翘板开关与安全拨动开关；右侧线性推子、旋转刻度旋钮、微动矩阵与带警示圈紧急制动按钮
// 5. 严格横向尺寸约束：总宽度 273px (精确为原正圆控制台 124px 直径的 2.2016 倍，严格控制在 2.2 倍左右)
// =========================================================================
function getTripleCubicleWorkstation(cx, cy, angle = 0, scale = 1.0, label = "TRIPLE CUBICLE WORKSTATION") {
    const boundW = 280 * scale;
    const boundH = 106 * scale;
    return {
        type: "triple_cubicle_workstation",
        cx: cx,
        cy: cy,
        angle: angle,
        scale: scale,
        x: cx - boundW / 2,
        y: cy - boundH / 2,
        w: boundW,
        h: boundH,
        label: label,
        displayName: "TRIPLE CUBICLE COMMAND POD",
        noCollision: true,
        hideLabel: true,
        draw: (ctx) => {
            // ===== 动静分离优化 (2026-11-05)：静态预渲染 + 动态叠加 =====
            const cacheKey = '__tripleCache_' + cx + '_' + cy + '_' + angle + '_' + scale;
            if (!window[cacheKey]) {
                const cw = Math.ceil(boundW + 20), ch = Math.ceil(boundH + 20);
                const off = document.createElement('canvas');
                off.width = cw; off.height = ch;
                const octx = off.getContext('2d');
                octx.save();
                octx.translate(cw / 2, ch / 2);
                octx.translate(-cx, -cy);
                drawTripleCubicleWorkstation(octx, cx, cy, angle, scale, 1);
                octx.restore();
                window[cacheKey] = { canvas: off, w: cw, h: ch };
            }
            const c = window[cacheKey];
            ctx.drawImage(c.canvas, cx - c.w / 2, cy - c.h / 2);
            drawTripleCubicleWorkstationDynamic(ctx, cx, cy, angle, scale);
        }
    };
}

// =========================================================================
// 全新战术讲台绘制系统 (完全依据手绘草稿 IMG_7701 规范设计与渲染)
// 包含 7 大核心规范：
// 1. 讲台主体为长方形，后方带有两侧护翼 (Main desk rectangle + two side wings)
// 2. 摆放有朝后的麦克风和一平板电脑 (Microphone angled backwards + tablet computer terminal)
// 3. 电脑屏幕为战术科技蓝 (参考 Level 7 蓝色屏幕 #061c3a -> #0b355c，边缘 #00CCFF / #00E5FF 高亮与扫描线)
// 4. 下有黑色半圆形底座支撑 (承托站立区域，与两侧护翼平滑衔接)
// 5. 主体和护翼部分为深色木质质感 (胡桃红木深色木纹与光泽覆层)
// 6. 讲台整体轮廓使用与 Level 8 外墙相同的蓝绿色线 (#10b981) 勾勒
// 7. 尺寸比角色略大，刚好能站上去 (内侧站立槽宽 40px，角色碰撞直径 36px，角色可自然站立并演讲)
// =========================================================================
function getPodium(cx, cy, angle = 0, scale = 1.0, label = "COMMAND PODIUM") {
    const boundW = 60 * scale;
    const boundH = 50 * scale;
    return {
        type: "command_podium",
        cx: cx,
        cy: cy,
        angle: angle,
        scale: scale,
        x: cx - boundW / 2,
        y: cy - boundH / 2,
        w: boundW,
        h: boundH,
        label: label,
        displayName: "COMMAND PODIUM",
        noCollision: true, // 确保角色能自然走入护翼并站上底座
        hideLabel: true,
        draw: (ctx) => {
            drawPodium(ctx, cx, cy, angle, scale);
        }
    };
}

// =========================================================
// 服务器集群 (从 GitHub 最新版合并，2026-11-05)
// =========================================================
// =========================================================================


function getServerCluster(cx, cy, angle = 0, scale = 1.0, label = "TACTICAL 5-RACK SERVER CLUSTER") {
    // 整体尺寸放大 2.35 倍：宽 330px，高 96px (单柜宽 66px 远超角色宽度，气势磅礴)
    const boundW = 330 * scale;
    const boundH = 96 * scale;
    const halfW = boundW / 2;
    const halfH = boundH / 2;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const localCorners = [
        { x: -halfW, y: -halfH },
        { x: halfW, y: -halfH },
        { x: halfW, y: halfH },
        { x: -halfW, y: halfH }
    ];
    const points = localCorners.map(p => ({
        x: Math.round(cx + (p.x * cosA - p.y * sinA)),
        y: Math.round(cy + (p.x * sinA + p.y * cosA))
    }));

    return {
        type: "server_cluster",
        cx: cx,
        cy: cy,
        angle: angle,
        scale: scale,
        x: cx - halfW,
        y: cy - halfH,
        w: boundW,
        h: boundH,
        points: points,
        label: label,
        displayName: "SERVER CLUSTER RACK ARRAY",
        hideLabel: true,
        draw: (ctx) => {
            // ===== 动静分离优化 (2026-11-05)：静态预渲染 + 动态叠加 =====
            const cacheKey = '__serverCache_' + cx + '_' + cy + '_' + angle + '_' + scale;
            if (!window[cacheKey]) {
                const sz = Math.ceil(Math.hypot(boundW + 10, boundH + 14) + 20);
                const off = document.createElement('canvas');
                off.width = sz; off.height = sz;
                const octx = off.getContext('2d');
                octx.save();
                octx.translate(sz / 2, sz / 2);
                octx.translate(-cx, -cy);
                drawServerCluster(octx, cx, cy, angle, scale, 1);
                octx.restore();
                window[cacheKey] = { canvas: off, size: sz };
            }
            const c = window[cacheKey];
            ctx.drawImage(c.canvas, cx - c.size / 2, cy - c.size / 2);
            // 动态元素每帧叠加
            drawServerClusterDynamic(ctx, cx, cy, angle, scale);
        }
    };
}

// =========================================================================
// 全新大圆会议桌系统 (依据用户指令规范设计与渲染)
// 包含 4 大核心要素：
// 1. 地图中间大圆形改成大圆会议桌 (深色木质质感，类似讲台道具的红木/胡桃木木纹与光泽，保留原正圆 155px 半径)
// 2. 会议桌上排满一圈平板电脑、文件夹和笔 (共 16 席高精度战术终端、TOP SECRET 机密文件夹与金属签字笔)
// 3. 圆环形灯环保持原本形状与颜色 (143px 半径，原版天空蓝/青蓝配色)，做出一颗一颗灯珠和点亮发光动态效果 (64 颗独立发光灯珠带光晕与光核)
// 4. 四周原 4 个圆弧删除，替换为环绕会议桌的 16 个高管人体工学转椅 (位置与会议桌上的物品席位一一对应，面向会议桌)

const LEVEL_8_TEST = {
    id: "level8_test",
    name: "第 8 关 · 隔离测试关卡",
    nameEn: "Level 08 · Isolated Test Sandbox",
    themeColor: "#022c22",
    gridColor: "rgba(16, 185, 129, 0.22)",
    accentColor: "#10b981",
    playerStart: { x: 1600, y: 995 },

    getMapLayout: (width, height) => {
        const cx = 1600;
        const cy = 1200;

        // =========================================================
        // 1. 实体碰撞墙体与 Level 6 重型装甲外壳外墙
        // =========================================================
        const obstacles = [
            // A. 中间房间最上方 3 大显示屏的封闭重装甲墙
            {
                type: 'solid',
                points: [
                    { x: 1055, y: 483 },
                    { x: 2145, y: 483 },
                    { x: 2145, y: 497 },
                    { x: 1055, y: 497 }
                ],
                label: 'TOP SCREEN UPPER HEAVY ARMORED WALL',
                hideLabel: true
            },
            {
                type: 'poly_wall',
                points: [
                    { x: 1048, y: 490 },
                    { x: 1062, y: 490 },
                    { x: 1117, y: 820 },
                    { x: 1103, y: 820 }
                ],
                label: 'TOP LEFT SCREEN HEAVY ARMORED WALL',
                hideLabel: true
            },
            {
                type: 'poly_wall',
                points: [
                    { x: 2138, y: 490 },
                    { x: 2152, y: 490 },
                    { x: 2097, y: 820 },
                    { x: 2083, y: 820 }
                ],
                label: 'TOP RIGHT SCREEN HEAVY ARMORED WALL',
                hideLabel: true
            },

            // B. 西侧重型装甲墙体 (4扇重型自动防爆门留出 120px 门洞)
            {
                type: 'poly_wall',
                points: [
                    { x: 1103, y: 820 },
                    { x: 1117, y: 820 },
                    { x: 1124, y: 860 },
                    { x: 1110, y: 860 }
                ],
                label: 'WEST HEAVY ARMORED WALL 1',
                hideLabel: true
            },
            {
                type: 'poly_wall',
                points: [
                    { x: 1132, y: 980 },
                    { x: 1146, y: 980 },
                    { x: 1285, y: 1775 },
                    { x: 1271, y: 1775 }
                ],
                label: 'WEST HEAVY ARMORED WALL 2',
                hideLabel: true
            },
            {
                type: 'poly_wall',
                points: [
                    { x: 1292, y: 1895 },
                    { x: 1306, y: 1895 },
                    { x: 1318, y: 1960 },
                    { x: 1304, y: 1960 }
                ],
                label: 'WEST HEAVY ARMORED WALL 3',
                hideLabel: true
            },

            // C. 东侧重型装甲墙体 (4扇重型自动防爆门留出 120px 门洞)
            {
                type: 'poly_wall',
                points: [
                    { x: 2083, y: 820 },
                    { x: 2097, y: 820 },
                    { x: 2090, y: 860 },
                    { x: 2076, y: 860 }
                ],
                label: 'EAST HEAVY ARMORED WALL 1',
                hideLabel: true
            },
            {
                type: 'poly_wall',
                points: [
                    { x: 2054, y: 980 },
                    { x: 2068, y: 980 },
                    { x: 1929, y: 1775 },
                    { x: 1915, y: 1775 }
                ],
                label: 'EAST HEAVY ARMORED WALL 2',
                hideLabel: true
            },
            {
                type: 'poly_wall',
                points: [
                    { x: 1894, y: 1895 },
                    { x: 1908, y: 1895 },
                    { x: 1896, y: 1960 },
                    { x: 1882, y: 1960 }
                ],
                label: 'EAST HEAVY ARMORED WALL 3',
                hideLabel: true
            },

            // D. 南侧底部重型装甲封底墙
            {
                type: 'solid',
                points: [
                    { x: 1304, y: 1953 },
                    { x: 1896, y: 1953 },
                    { x: 1896, y: 1967 },
                    { x: 1304, y: 1967 }
                ],
                label: 'SOUTH HEAVY ARMORED WALL',
                hideLabel: true
            },

            // E. 正中央大圆会议桌系统 (保留正圆实体碰撞与物理阻挡，由专属绘制闭包渲染深色木纹、一圈平板电脑文件夹笔、发光灯珠灯环与环绕座位)
            {
                type: 'solid',
                circle: { cx: cx, cy: cy, radius: 155 },
                label: 'CENTRAL CONFERENCE TABLE',
                displayName: 'CONFERENCE TABLE',
                hideLabel: true,
                draw: (ctx) => {
                    // ===== 动静分离优化 (2026-11-05)：静态预渲染 + 动态叠加 =====
                    const cacheKey = '__confCache_' + cx + '_' + cy;
                    if (!window[cacheKey]) {
                        const sz = 500;
                        const off = document.createElement('canvas');
                        off.width = sz; off.height = sz;
                        const octx = off.getContext('2d');
                        octx.save();
                        octx.translate(sz / 2, sz / 2);
                        octx.translate(-cx, -cy);
                        drawConferenceTableSystem(octx, cx, cy, 155, 1);
                        octx.restore();
                        window[cacheKey] = { canvas: off, size: sz };
                    }
                    const cc = window[cacheKey];
                    ctx.drawImage(cc.canvas, cx - cc.size / 2, cy - cc.size / 2);
                    // 动态元素每帧叠加
                    drawConferenceTableSystemDynamic(ctx, cx, cy, 155);
                }
            },

            // H. 南侧 6 个控制长方台
            { type: 'solid', x: 1330, y: 1480, w: 220, h: 36, label: 'RECTANGLE R1-L', hideLabel: true },
            { type: 'solid', x: 1650, y: 1480, w: 220, h: 36, label: 'RECTANGLE R1-R', hideLabel: true },
            { type: 'solid', x: 1330, y: 1580, w: 220, h: 36, label: 'RECTANGLE R2-L', hideLabel: true },
            { type: 'solid', x: 1650, y: 1580, w: 220, h: 36, label: 'RECTANGLE R2-R', hideLabel: true },
            { type: 'solid', x: 1330, y: 1680, w: 220, h: 36, label: 'RECTANGLE R3-L', hideLabel: true },
            { type: 'solid', x: 1650, y: 1680, w: 220, h: 36, label: 'RECTANGLE R3-R', hideLabel: true }
        ];

        // =========================================================
        // 2. 道具与 Level 6 重型自动防爆门
        // =========================================================
        const props = [
            // 1. 中间房间蓝图与 3 大战术屏幕绘图 (BACKGROUND PROP FIRST)
            {
                x: 100,
                y: 400,
                w: 3000,
                h: 1650,
                noCollision: true,
                hideLabel: true,
                draw: (ctx) => {
                    ctx.save();

                    // --- 1. 中间大厅防静电科技地坪底色 ---
                    ctx.beginPath();
                    ctx.moveTo(1055, 470);
                    ctx.lineTo(2145, 470);
                    ctx.lineTo(2097, 820);
                    ctx.lineTo(1908, 1960);
                    ctx.lineTo(1292, 1960);
                    ctx.lineTo(1103, 820);
                    ctx.closePath();
                    ctx.fillStyle = '#0a101d';
                    ctx.fill();


                    // --- 3. 最上方 3 大高科技控制显示屏 ---
                    ctx.save();

                    // 3A. LEFT SCREEN
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(1055, 490);
                    ctx.lineTo(1403, 490);
                    ctx.lineTo(1445, 740);
                    ctx.lineTo(1110, 820);
                    ctx.closePath();

                    const radLeft = ctx.createRadialGradient(1250, 650, 20, 1250, 650, 320);
                    radLeft.addColorStop(0, '#0b355c');
                    radLeft.addColorStop(0.45, '#061c3a');
                    radLeft.addColorStop(1, '#05100c');
                    ctx.fillStyle = radLeft;
                    ctx.fill();

                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    ctx.clip();

                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.04)';
                    ctx.lineWidth = 1;
                    for (let gy = 480; gy < 830; gy += 3) {
                        ctx.beginPath(); ctx.moveTo(1000, gy); ctx.lineTo(1500, gy); ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.moveTo(1055, 490); ctx.lineTo(1250, 490); ctx.lineTo(1120, 750); ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fill();

                    ctx.fillStyle = 'rgba(0, 204, 255, 0.18)';
                    ctx.fillRect(1070, 495, 325, 22);
                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1070, 495, 325, 22);

                    ctx.font = 'bold 11px monospace';
                    ctx.fillStyle = '#00E5FF';
                    ctx.textAlign = 'center';
                    ctx.fillText('INFERNAL DEEP MONITOR', 1232, 510);

                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1075, 523, 318, 112);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1075, 523, 318, 112);

                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#38bdf8';
                    ctx.textAlign = 'left';
                    ctx.fillText('ABYSSAL DEEP SECTOR OUTLINE:', 1082, 535);

                    // Sector 1: Demon Wings
                    ctx.strokeStyle = '#FF3344'; ctx.lineWidth = 1.2;
                    ctx.strokeRect(1080, 542, 90, 88);
                    ctx.fillStyle = 'rgba(255, 51, 68, 0.10)'; ctx.fillRect(1080, 542, 90, 88);

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

                    // Cerberus Diagram
                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1098, 642, 330, 138);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1098, 642, 330, 138);

                    ctx.font = 'bold 9px monospace';
                    ctx.fillStyle = '#ef4444'; ctx.textAlign = 'left';
                    ctx.fillText('SUBJECT: CERBERUS / HELLHOUND DIAGRAM', 1106, 655);

                    ctx.save();
                    ctx.translate(1150, 712);

                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath(); ctx.moveTo(-16, 8); ctx.lineTo(-22, 24); ctx.lineTo(-18, 25); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-12, 24); ctx.lineTo(-8, 25); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(10, 8); ctx.lineTo(8, 24); ctx.lineTo(12, 25); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(18, 8); ctx.lineTo(18, 24); ctx.lineTo(22, 25); ctx.stroke();

                    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
                    ctx.beginPath(); ctx.ellipse(0, 2, 22, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(-22, 2);
                    ctx.quadraticCurveTo(-32, -8, -28, -18);
                    ctx.stroke();
                    ctx.fillStyle = '#ff2200';
                    ctx.beginPath(); ctx.arc(-28, -18, 3, 0, Math.PI * 2); ctx.fill();

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

                    ctx.font = 'bold 8.5px monospace'; ctx.textAlign = 'left';
                    ctx.fillStyle = '#f87171';
                    ctx.fillText('ENTITY ID: CERBERUS-X', 1208, 672);
                    ctx.fillText('THREAT LEVEL: OMEGA-MAX', 1208, 687);
                    ctx.fillStyle = '#FFCC00';
                    ctx.fillText('STATUS: UNKNOWN', 1208, 702);
                    ctx.fillText('ANATOMY DATA: UNKNOWN', 1208, 717);
                    ctx.fillText('WEAKNESS: UNKNOWN', 1208, 732);

                    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                    ctx.fillRect(1106, 746, 314, 20);
                    ctx.strokeStyle = '#ef4444';
                    ctx.strokeRect(1106, 746, 314, 20);
                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#ff6666';
                    ctx.textAlign = 'center';
                    ctx.fillText('⚠️ DETAILED SPECIFICATIONS: UNKNOWN', 1263, 760);

                    ctx.restore(); // end Screen 1

                    // 3B. CENTER SCREEN: GLOBAL STRATEGIC COMMAND & WORLD THEATER MAP
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(1403, 490);
                    ctx.lineTo(1797, 490);
                    ctx.lineTo(1755, 740);
                    ctx.lineTo(1445, 740);
                    ctx.closePath();

                    const gradCenter = ctx.createRadialGradient(1600, 630, 20, 1600, 630, 300);
                    gradCenter.addColorStop(0, '#0c3a6b');
                    gradCenter.addColorStop(0.45, '#071f40');
                    gradCenter.addColorStop(1, '#05100c');
                    ctx.fillStyle = gradCenter;
                    ctx.fill();

                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    ctx.clip();

                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
                    ctx.lineWidth = 1;
                    for (let gy = 480; gy < 750; gy += 3) {
                        ctx.beginPath(); ctx.moveTo(1400, gy); ctx.lineTo(1800, gy); ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.moveTo(1403, 490); ctx.lineTo(1620, 490); ctx.lineTo(1480, 740); ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fill();

                    ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
                    ctx.fillRect(1410, 495, 380, 24);
                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1410, 495, 380, 24);

                    ctx.font = 'bold 11px monospace';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.fillText('GLOBAL STRATEGIC COMMAND - WORLD THEATER MAP', 1600, 511);

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

                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.85)';
                    ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
                    ctx.lineWidth = 1.2;

                    // North America
                    ctx.beginPath();
                    ctx.moveTo(1465, 580);
                    ctx.lineTo(1490, 573);
                    ctx.lineTo(1530, 577);
                    ctx.lineTo(1525, 610);
                    ctx.lineTo(1512, 617);
                    ctx.lineTo(1508, 613);
                    ctx.lineTo(1495, 635);
                    ctx.lineTo(1480, 615);
                    ctx.lineTo(1468, 595);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // South America
                    ctx.beginPath();
                    ctx.moveTo(1495, 635);
                    ctx.lineTo(1528, 643);
                    ctx.lineTo(1522, 700);
                    ctx.lineTo(1502, 685);
                    ctx.lineTo(1490, 653);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Eurasia
                    ctx.beginPath();
                    ctx.moveTo(1560, 583);
                    ctx.lineTo(1578, 567);
                    ctx.lineTo(1595, 567);
                    ctx.lineTo(1645, 565);
                    ctx.lineTo(1740, 573);
                    ctx.lineTo(1745, 610);
                    ctx.lineTo(1700, 630);
                    ctx.lineTo(1670, 650);
                    ctx.lineTo(1655, 623);
                    ctx.lineTo(1615, 625);
                    ctx.lineTo(1610, 607);
                    ctx.lineTo(1560, 587);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Africa
                    ctx.beginPath();
                    ctx.moveTo(1570, 610);
                    ctx.lineTo(1615, 613);
                    ctx.lineTo(1622, 645);
                    ctx.lineTo(1595, 687);
                    ctx.lineTo(1568, 650);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Australia
                    ctx.beginPath();
                    ctx.moveTo(1705, 665);
                    ctx.lineTo(1748, 660);
                    ctx.lineTo(1742, 700);
                    ctx.lineTo(1702, 691);
                    ctx.closePath(); ctx.fill(); ctx.stroke();

                    // Japan Islands Dot
                    ctx.beginPath(); ctx.arc(1748, 595, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                    const campaignLocations = [
                        { name: 'LOC-01 AIRPORT', lat: '37.6° N', lon: '122.3° W', x: 1485, y: 600, boxX: 1438, boxY: 617 },
                        { name: 'LOC-02 SUBWAY',  lat: '40.7° N', lon: '73.9° W',  x: 1520, y: 593, boxX: 1452, boxY: 563 },
                        { name: 'LOC-03 BANK',    lat: '51.5° N', lon: '0.1° W',   x: 1570, y: 575, boxX: 1545, boxY: 545 },
                        { name: 'LOC-04 YACHT',   lat: '25.7° N', lon: '80.1° W',  x: 1510, y: 630, boxX: 1448, boxY: 655 },
                        { name: 'LOC-05 HOTEL',   lat: '47.3° N', lon: '8.5° E',   x: 1592, y: 585, boxX: 1602, boxY: 600 },
                        { name: 'LOC-06 EXPRESS', lat: '55.7° N', lon: '37.6° E',  x: 1640, y: 571, boxX: 1660, boxY: 550 },
                    ];

                    campaignLocations.forEach(loc => {
                        ctx.fillStyle = '#00FF66';
                        ctx.beginPath(); ctx.arc(loc.x, loc.y, 3, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#00FF66'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.arc(loc.x, loc.y, 6, 0, Math.PI * 2); ctx.stroke();

                        ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath(); ctx.moveTo(loc.x, loc.y); ctx.lineTo(loc.boxX + 35, loc.boxY + 9); ctx.stroke();

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

                    // 3C. RIGHT SCREEN
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(1797, 490);
                    ctx.lineTo(2145, 490);
                    ctx.lineTo(2090, 820);
                    ctx.lineTo(1755, 740);
                    ctx.closePath();

                    const gradRight = ctx.createRadialGradient(1950, 650, 20, 1950, 650, 320);
                    gradRight.addColorStop(0, '#0b355c');
                    gradRight.addColorStop(0.45, '#061c3a');
                    gradRight.addColorStop(1, '#05100c');
                    ctx.fillStyle = gradRight;
                    ctx.fill();

                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 2.0;
                    ctx.stroke();

                    ctx.clip();

                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.04)';
                    ctx.lineWidth = 1;
                    for (let gy = 480; gy < 830; gy += 3) {
                        ctx.beginPath(); ctx.moveTo(1750, gy); ctx.lineTo(2200, gy); ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.moveTo(1797, 490); ctx.lineTo(1980, 490); ctx.lineTo(1850, 750); ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fill();

                    ctx.fillStyle = 'rgba(0, 204, 255, 0.15)';
                    ctx.fillRect(1790, 495, 312, 22);
                    ctx.strokeStyle = '#00CCFF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1790, 495, 312, 22);

                    ctx.font = 'bold 11px monospace';
                    ctx.fillStyle = '#00E5FF';
                    ctx.textAlign = 'center';
                    ctx.fillText('PERSONNEL & TRAIN TELEMETRY', 1946, 510);

                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1790, 523, 320, 112);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1790, 523, 320, 112);

                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left';
                    ctx.fillText('PERSONNEL VITAL SIGNS MONITORING:', 1796, 535);

                    const personnelList = [
                        { name: 'SPECTRE (AGENT)', status: 'ACTIVE', bpm: 72, o2: '98%', hp: '100%' },
                        { name: 'NEXUS (OPERATOR)', status: 'ONLINE', bpm: 68, o2: '99%', hp: '100%' },
                        { name: 'APEX (COMMANDER)', status: 'STANDBY', bpm: 75, o2: '97%', hp: '100%' },
                    ];

                    personnelList.forEach((p, i) => {
                        const py = 544 + i * 27;
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

                    ctx.fillStyle = 'rgba(0, 204, 255, 0.08)';
                    ctx.fillRect(1795, 642, 335, 138);
                    ctx.strokeStyle = 'rgba(0, 204, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(1795, 642, 335, 138);

                    ctx.font = 'bold 8.5px monospace';
                    ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left';
                    ctx.fillText('ARMORED EXPRESS & BRIDGE LAYOUT:', 1802, 655);

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

                    ctx.fillStyle = '#081220';
                    ctx.fillRect(1802, 678, 145, 45);
                    ctx.strokeStyle = '#00E5FF';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(1802, 678, 145, 45);

                    ctx.fillStyle = '#00CCFF';
                    ctx.fillRect(1808, 682, 24, 7);
                    ctx.fillRect(1836, 682, 24, 7);
                    ctx.fillRect(1874, 682, 32, 7);

                    ctx.fillRect(1808, 712, 24, 7);
                    ctx.fillRect(1874, 712, 32, 7);

                    ctx.font = 'bold 6.5px monospace'; ctx.fillStyle = '#00FF66';
                    ctx.fillText('COMMAND BRIDGE (CAR 4)', 1806, 702);

                    ctx.font = 'bold 8px monospace';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText('ARMORED EXPRESS SPECS:', 1955, 682);

                    ctx.font = '7.5px monospace'; ctx.fillStyle = '#38bdf8';
                    ctx.fillText('SPEED: 240 KM/H', 1955, 695);
                    ctx.fillText('STATUS: CRUISING', 1955, 707);
                    ctx.fillText('CARRIAGES: 06 UNITS', 1955, 719);
                    ctx.fillText('DEFENSE: MAX LOCKDOWN', 1955, 731);

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

                    // --- 4. LEVEL 7 翡翠装甲外墙多层强化结构与 4 扇侧门自然咬合系统 ---
                    ctx.save();

                    // =================================================================
                    // A. 4 扇侧门与斜外墙的高精度自然咬合装甲门套 (Slanted Heavy Door Jambs)
                    // 仅绘制门洞顶部和底部的门套箱，中央通行通道完全中空，由真实的重型自动门动态滑动开启
                    // =================================================================
                    const doorsData = [
                        { name: 'WEST UPPER', cx: 1128, cy: 920, angle: -0.1813, topX: 1117, topY: 860, botX: 1139, botY: 980 },
                        { name: 'WEST LOWER', cx: 1288.5, cy: 1835, angle: -0.173, topX: 1278, topY: 1775, botX: 1299, botY: 1895 },
                        { name: 'EAST UPPER', cx: 2072, cy: 920, angle: 0.1813, topX: 2083, topY: 860, botX: 2061, botY: 980 },
                        { name: 'EAST LOWER', cx: 1911.5, cy: 1835, angle: 0.173, topX: 1922, topY: 1775, botX: 1901, botY: 1895 }
                    ];

                    doorsData.forEach(d => {
                        ctx.save();
                        ctx.translate(d.cx, d.cy);
                        ctx.rotate(d.angle);

                        const halfH = 60;
                        const halfW = 12;

                        // 1. 顶部重型门套立柱与液压气动箱 (Level 7 翡翠军工装甲配色)
                        ctx.fillStyle = '#051914';
                        ctx.fillRect(-halfW - 4, -halfH - 8, halfW * 2 + 8, 10);
                        ctx.strokeStyle = '#10b981';
                        ctx.lineWidth = 1.6;
                        ctx.strokeRect(-halfW - 4, -halfH - 8, halfW * 2 + 8, 10);

                        // 顶部黄色斜纹安全警示标志
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-halfW - 3, -halfH - 7, halfW * 2 + 6, 8);
                        ctx.clip();
                        ctx.fillStyle = '#f59e0b';
                        for (let sx = -halfW - 10; sx < halfW + 15; sx += 8) {
                            ctx.beginPath();
                            ctx.moveTo(sx, -halfH + 1);
                            ctx.lineTo(sx + 5, -halfH - 7);
                            ctx.lineTo(sx + 9, -halfH - 7);
                            ctx.lineTo(sx + 4, -halfH + 1);
                            ctx.closePath();
                            ctx.fill();
                        }
                        ctx.restore();

                        // 顶部液压活塞缸体
                        ctx.fillStyle = '#064e3b';
                        ctx.fillRect(-6, -halfH - 4, 12, 6);
                        ctx.strokeStyle = '#34d399';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(-6, -halfH - 4, 12, 6);

                        // 2. 底部重型门套地梁与导向槽
                        ctx.fillStyle = '#051914';
                        ctx.fillRect(-halfW - 4, halfH - 2, halfW * 2 + 8, 10);
                        ctx.strokeStyle = '#10b981';
                        ctx.lineWidth = 1.6;
                        ctx.strokeRect(-halfW - 4, halfH - 2, halfW * 2 + 8, 10);

                        // 底部黄色斜纹警示
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-halfW - 3, halfH - 1, halfW * 2 + 6, 8);
                        ctx.clip();
                        ctx.fillStyle = '#f59e0b';
                        for (let sx = -halfW - 10; sx < halfW + 15; sx += 8) {
                            ctx.beginPath();
                            ctx.moveTo(sx, halfH + 7);
                            ctx.lineTo(sx + 5, halfH - 1);
                            ctx.lineTo(sx + 9, halfH - 1);
                            ctx.lineTo(sx + 4, halfH + 7);
                            ctx.closePath();
                            ctx.fill();
                        }
                        ctx.restore();

                        // 两侧重型装甲卡槽护壁线
                        ctx.strokeStyle = '#064e3b';
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(-halfW - 2, -halfH); ctx.lineTo(-halfW - 2, halfH);
                        ctx.moveTo(halfW + 2, -halfH); ctx.lineTo(halfW + 2, halfH);
                        ctx.stroke();

                        ctx.restore();
                    });

                    // =================================================================
                    // B. 斜外墙装甲钢板拼缝与战术能量导轨 (Armor Seams & Energy Conduit Lines)
                    // 严格保持平整外壁轮廓，不带有任何对外突出的锯齿
                    // =================================================================
                    // 1. 西侧长斜外墙装甲拼缝 (West Wall 2)
                    {
                        const outX1 = 1132, outY1 = 980, outX2 = 1271, outY2 = 1775;
                        const inX1 = 1146, inY1 = 980, inX2 = 1285, inY2 = 1775;
                        const steps = 18;
                        for (let i = 1; i < steps; i++) {
                            const t = i / steps;
                            const ox = outX1 + (outX2 - outX1) * t;
                            const oy = outY1 + (outY2 - outY1) * t;
                            const ix = inX1 + (inX2 - inX1) * t;
                            const iy = inY1 + (inY2 - inY1) * t;

                            ctx.strokeStyle = '#02120e';
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ix, iy); ctx.stroke();

                            ctx.strokeStyle = '#34d399';
                            ctx.lineWidth = 0.8;
                            ctx.beginPath(); ctx.moveTo(ox + 0.5, oy + 0.5); ctx.lineTo(ix + 0.5, iy + 0.5); ctx.stroke();
                        }

                        // 墙体中心贯穿的翡翠绿战术能量光条
                        ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
                        ctx.lineWidth = 1.4;
                        ctx.beginPath();
                        ctx.moveTo((outX1 + inX1) / 2, (outY1 + inY1) / 2);
                        ctx.lineTo((outX2 + inX2) / 2, (outY2 + inY2) / 2);
                        ctx.stroke();
                    }

                    // 2. 东侧长斜外墙装甲拼缝 (East Wall 2)
                    {
                        const outX1 = 2068, outY1 = 980, outX2 = 1929, outY2 = 1775;
                        const inX1 = 2054, inY1 = 980, inX2 = 1915, inY2 = 1775;
                        const steps = 18;
                        for (let i = 1; i < steps; i++) {
                            const t = i / steps;
                            const ox = outX1 + (outX2 - outX1) * t;
                            const oy = outY1 + (outY2 - outY1) * t;
                            const ix = inX1 + (inX2 - inX1) * t;
                            const iy = inY1 + (inY2 - inY1) * t;

                            ctx.strokeStyle = '#02120e';
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ix, iy); ctx.stroke();

                            ctx.strokeStyle = '#34d399';
                            ctx.lineWidth = 0.8;
                            ctx.beginPath(); ctx.moveTo(ox - 0.5, oy + 0.5); ctx.lineTo(ix - 0.5, iy + 0.5); ctx.stroke();
                        }

                        ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
                        ctx.lineWidth = 1.4;
                        ctx.beginPath();
                        ctx.moveTo((outX1 + inX1) / 2, (outY1 + inY1) / 2);
                        ctx.lineTo((outX2 + inX2) / 2, (outY2 + inY2) / 2);
                        ctx.stroke();
                    }

                    // 3. 南侧封底装甲墙拼装缝
                    {
                        for (let x = 1350; x < 1880; x += 45) {
                            ctx.strokeStyle = '#02120e';
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(x, 1953); ctx.lineTo(x, 1967); ctx.stroke();
                            ctx.strokeStyle = '#34d399';
                            ctx.lineWidth = 0.8;
                            ctx.beginPath(); ctx.moveTo(x + 1, 1953); ctx.lineTo(x + 1, 1967); ctx.stroke();
                        }
                    }

                    ctx.restore();
                    ctx.restore();
                }
            },

            // =========================================================
            // 2. 4 扇 Level 6 重型自动防爆装甲门 (完全实装自动感应平移门系统，窄型紧凑装甲外壳，配色与 Level 7 一致)
            // 门体厚度设定为 14px，与 14px 重型装甲墙完美对齐，仅微凸 1px 保护边框，绝不臃肿
            // =========================================================
            // 1. 西侧上门: 连接 (1110,860)-(1124,860) 与 (1132,980)-(1146,980)
            {
                type: 'heavy_auto_door',
                cx: 1128,
                cy: 920,
                topX: 1117,
                topY: 860,
                botX: 1139,
                botY: 980,
                x: 1121,
                y: 859,
                w: 14,
                h: 122,
                angle: -0.1813,
                label: 'WEST UPPER HEAVY AUTO DOOR',
                displayName: 'HEAVY AUTO DOOR',
                hideLabel: true,
                points: [
                    { x: 1110, y: 860 },
                    { x: 1124, y: 860 },
                    { x: 1146, y: 980 },
                    { x: 1132, y: 980 }
                ]
            },
            // 2. 西侧下门: 连接 (1271,1775)-(1285,1775) 与 (1292,1895)-(1306,1895)
            {
                type: 'heavy_auto_door',
                cx: 1288.5,
                cy: 1835,
                topX: 1278,
                topY: 1775,
                botX: 1299,
                botY: 1895,
                x: 1281.5,
                y: 1774,
                w: 14,
                h: 122,
                angle: -0.173,
                label: 'WEST LOWER HEAVY AUTO DOOR',
                displayName: 'HEAVY AUTO DOOR',
                hideLabel: true,
                points: [
                    { x: 1271, y: 1775 },
                    { x: 1285, y: 1775 },
                    { x: 1306, y: 1895 },
                    { x: 1292, y: 1895 }
                ]
            },
            // 3. 东侧上门: 连接 (2076,860)-(2090,860) 与 (2054,980)-(2068,980)
            {
                type: 'heavy_auto_door',
                cx: 2072,
                cy: 920,
                topX: 2083,
                topY: 860,
                botX: 2061,
                botY: 980,
                x: 2065,
                y: 859,
                w: 14,
                h: 122,
                angle: 0.1813,
                label: 'EAST UPPER HEAVY AUTO DOOR',
                displayName: 'HEAVY AUTO DOOR',
                hideLabel: true,
                points: [
                    { x: 2090, y: 860 },
                    { x: 2076, y: 860 },
                    { x: 2054, y: 980 },
                    { x: 2068, y: 980 }
                ]
            },
            // 4. 东侧下门: 连接 (1915,1775)-(1929,1775) 与 (1894,1895)-(1908,1895)
            {
                type: 'heavy_auto_door',
                cx: 1911.5,
                cy: 1835,
                topX: 1922,
                topY: 1775,
                botX: 1901,
                botY: 1895,
                x: 1904.5,
                y: 1774,
                w: 14,
                h: 122,
                angle: 0.173,
                label: 'EAST LOWER HEAVY AUTO DOOR',
                displayName: 'HEAVY AUTO DOOR',
                hideLabel: true,
                points: [
                    { x: 1929, y: 1775 },
                    { x: 1915, y: 1775 },
                    { x: 1894, y: 1895 },
                    { x: 1908, y: 1895 }
                ]
            },

            // =========================================================
            // 3. 全新扇形战术主控台 (置于原被挡圆柱 (1350, 920) 与 (1850, 920) 位置，已删除正中与底部控制台)
            // =========================================================
            // 西侧主控台 (位于原西侧圆柱 1350, 920 位置)
            getSectorWorkstation(1350, 920, 0, 1.0, 'WEST SECTOR COMMAND CONSOLE'),
            // 东侧主控台 (位于原东侧圆柱 1850, 920 位置)
            getSectorWorkstation(1850, 920, 0, 1.0, 'EAST SECTOR COMMAND CONSOLE'),

            // =========================================================
            // 4. 全新三联方形隔间战术控制台 (完全依据手绘草稿 IMG_7697 规范制作：三联方形隔间、前部3连放大屏、键盘与左右按钮、后方与其他控制台同尺寸座椅、宽度273px为圆形台2.20倍)
            // 置于北侧中央开阔广场 (1600, 890) 核心指挥席位，面向北方大屏
            // =========================================================
            getTripleCubicleWorkstation(1600, 890, 0, 1.0, 'CENTRAL TRIPLE CUBICLE WORKSTATION'),
            getServerCluster(1600, 1865, 0, 1.0, 'TACTICAL 5-RACK SERVER CLUSTER'),

            // =========================================================
            // 5. 全新战术讲台 (完全依据手绘草稿 IMG_7701 规范设计与渲染)
            // 讲台主体长方形桌面与后方两侧护翼 (深色红木/黑胡桃木木纹质感)、朝后的鹅颈麦克风、Level 7 战术蓝屏平板电脑 (终端)、
            // 黑色半圆形底座支撑、整体蓝绿色外轮廓勾勒，比角色略大刚好能站上去。
            // 置于北侧中央演讲席位 (1600, 960)；角色出生于正后方入口 (1600, 995) 举步即可登台。
            // =========================================================
            getPodium(1600, 960, 0, 1.0, 'CENTRAL COMMAND PODIUM')
        ];

        return {
            obstacles: obstacles,
            securityGates: [],
            props: props,
            zones: [
                { name: "HEAVY ARMORED COMMAND CHAMBER (LEVEL 8 COPIED)", x: 1055, y: 830, w: 1090, h: 1130, labelX: 1600, labelY: 850, align: 'center' }
            ],
            waypoints: [
                { x: 1600, y: 1835 },
                { x: 1600, y: 1645 },
                { x: 1600, y: 1545 },
                { x: 1600, y: 1435 },
                { x: 1300, y: 1200 },
                { x: 1900, y: 1200 },
                { x: 1600, y: 980 },
                { x: 1600, y: 800 },
                { x: 1350, y: 840 },
                { x: 1850, y: 840 },
                { x: 1125, y: 920 },
                { x: 2075, y: 920 },
                { x: 1295, y: 1835 },
                { x: 1905, y: 1835 }
            ],
            cameras: [],
            lasers: []
        };
    }
};

window.LEVEL_8_TEST = LEVEL_8_TEST;
