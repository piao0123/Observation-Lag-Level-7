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
function drawServerCluster(ctx, cx, cy, angle = 0, scale = 1.0) {
    ctx.save();
    ctx.translate(cx, cy);
    if (angle !== 0) ctx.rotate(angle);
    if (scale !== 1.0) ctx.scale(scale, scale);

    const time = Date.now() * 0.001;
    const numCabinets = 5;
    const cabW = 66; // 单机柜宽 66px (约为角色模型 26px 的 2.54 倍，显著宽厚)
    const cabH = 96; // 单机柜深 96px
    const totalW = numCabinets * cabW; // 330px 总宽 (放大 2.36 倍)
    const halfW = totalW / 2;
    const halfH = cabH / 2;

    // --- 0. 地坪散热与重型机房减震基座 (Floor Heavy Vibration-Damping Base) ---
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(-halfW - 4, -halfH + 4, totalW + 8, cabH + 4);

    // 强化机房钢质底座槽钢 (Heavy Steel Base Frame)
    ctx.fillStyle = "#010e0b";
    ctx.fillRect(-halfW - 2, -halfH, totalW + 4, cabH);
    ctx.strokeStyle = "#043327";
    ctx.lineWidth = 1.8;
    ctx.strokeRect(-halfW - 2, -halfH, totalW + 4, cabH);

    // 底部机柜固定膨胀地脚螺栓
    for (let c = 0; c < numCabinets; c++) {
        const bx = -halfW + c * cabW;
        ctx.fillStyle = "#021a14";
        ctx.fillRect(bx + 4, halfH - 3, 6, 2.5);
        ctx.fillRect(bx + cabW - 10, halfH - 3, 6, 2.5);
        ctx.fillStyle = "#10b981";
        ctx.beginPath(); ctx.arc(bx + 7, halfH - 1.8, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + cabW - 7, halfH - 1.8, 0.9, 0, Math.PI * 2); ctx.fill();
    }

    // 机柜专业职能分类定义与多彩主题配置
    const cabinetConfigs = [
        { id: "SRV-01", name: "CRYPTO", primaryColor: "#c084fc", accentColor: "#00E5FF", beacon: "#d946ef" },
        { id: "SRV-02", name: "NEURAL", primaryColor: "#00FF66", accentColor: "#a3e635", beacon: "#10b981" },
        { id: "SRV-03", name: "MAINFRAME", primaryColor: "#fbbf24", accentColor: "#ef4444", beacon: "#f59e0b" },
        { id: "SRV-04", name: "RADAR-FX", primaryColor: "#00E5FF", accentColor: "#3b82f6", beacon: "#38bdf8" },
        { id: "SRV-05", name: "SIM-CORE", primaryColor: "#f43f5e", accentColor: "#fb923c", beacon: "#ef4444" }
    ];

    // --- 1. 逐个绘制 5 个大型独立机柜 ---
    for (let c = 0; c < numCabinets; c++) {
        const cabX = -halfW + c * cabW;
        const cfg = cabinetConfigs[c];

        // 1A. 单机柜外壳装甲框 (Heavy Armored Exterior Frame with Chamfers)
        const gradCasing = ctx.createLinearGradient(cabX, -halfH, cabX + cabW, -halfH + cabH);
        gradCasing.addColorStop(0, "#06241d");
        gradCasing.addColorStop(0.35, "#093328");
        gradCasing.addColorStop(0.7, "#041b16");
        gradCasing.addColorStop(1, "#02120e");
        ctx.fillStyle = gradCasing;
        ctx.fillRect(cabX, -halfH, cabW, cabH);

        // 外框装甲精细倒角描边
        ctx.strokeStyle = "#0d4a3c";
        ctx.lineWidth = 1.4;
        ctx.strokeRect(cabX + 0.7, -halfH + 0.7, cabW - 1.4, cabH - 1.4);

        // 顶部门楣金属横梁与机柜专业铭牌 (Header Nameplate)
        ctx.fillStyle = "#031712";
        ctx.fillRect(cabX + 2, -halfH + 2, cabW - 4, 11);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(cabX + 2, -halfH + 2, cabW - 4, 11);

        // 顶棚激光蚀刻机柜编号与职能
        ctx.font = "bold 5.2px monospace";
        ctx.fillStyle = cfg.primaryColor;
        ctx.textAlign = "center";
        ctx.fillText(cfg.id, cabX + cabW / 2 - 10, -halfH + 9.5);

        ctx.font = "bold 4.4px monospace";
        ctx.fillStyle = "#a7f3d0";
        ctx.textAlign = "left";
        ctx.fillText(cfg.name, cabX + cabW / 2 + 1, -halfH + 9.5);

        // 机柜门楣顶部双色状态信标灯塔 (Dual Tower Beacon LEDs)
        const bPulse = Math.sin(time * 3.5 + c * 1.6) > -0.1;
        ctx.fillStyle = bPulse ? cfg.beacon : "#042018";
        ctx.beginPath(); ctx.arc(cabX + 6.5, -halfH + 7.5, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = (bPulse ? "#ffffff" : "#02120e");
        ctx.beginPath(); ctx.arc(cabX + 6.5, -halfH + 7.5, 0.7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = (Math.sin(time * 5.2 + c * 2.1) > 0.2) ? cfg.accentColor : "#052e24";
        ctx.beginPath(); ctx.arc(cabX + cabW - 6.5, -halfH + 7.5, 1.4, 0, Math.PI * 2); ctx.fill();

        // 1B. 内部深暗机架舱室 (Dark Recessed Equipment Bay)
        const bayX = cabX + 5.0;
        const bayY = -halfH + 15.0;
        const bayW = cabW - 10.0; // 56px
        const bayH = cabH - 22.0; // 74px

        ctx.fillStyle = "#010a08";
        ctx.fillRect(bayX, bayY, bayW, bayH);
        ctx.strokeStyle = "#053d30";
        ctx.lineWidth = 1.0;
        ctx.strokeRect(bayX, bayY, bayW, bayH);

        // 左右 19 英寸机架立柱与 EIA 方孔导轨 (Vertical EIA-310 Heavy Mounting Rails)
        ctx.fillStyle = "#04241c";
        ctx.fillRect(bayX, bayY, 3.2, bayH);
        ctx.fillRect(bayX + bayW - 3.2, bayY, 3.2, bayH);

        ctx.fillStyle = "#010806";
        for (let ry = bayY + 2.5; ry < bayY + bayH - 2; ry += 3.8) {
            ctx.fillRect(bayX + 0.8, ry, 1.6, 1.6);
            ctx.fillRect(bayX + bayW - 2.4, ry, 1.6, 1.6);
        }

        // 1C. 纵向排列的多层服务器抽屉 (7 层 1U/2U 刀片服务器机箱)
        const numServers = 7;
        const srvH = 8.6;
        const srvGap = 1.6;
        const startSrvY = bayY + 1.6;

        for (let s = 0; s < numServers; s++) {
            const sy = startSrvY + s * (srvH + srvGap);
            const sx = bayX + 3.8;
            const sw = bayW - 7.6; // ~48.4px

            // 服务器外壳金属底板渐变
            const srvGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + srvH);
            srvGrad.addColorStop(0, "#0a261f");
            srvGrad.addColorStop(0.35, "#103a30");
            srvGrad.addColorStop(0.7, "#0d2e26");
            srvGrad.addColorStop(1, "#071c17");
            ctx.fillStyle = srvGrad;
            ctx.fillRect(sx, sy, sw, srvH);

            // 服务器上下边缘微细装甲倒角线条
            ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(sx, sy, sw, srvH);

            // 左右双侧机架抽拉拉手 (Rack Handles)
            ctx.fillStyle = "#031712";
            ctx.fillRect(sx + 0.4, sy + 1.2, 1.4, srvH - 2.4);
            ctx.fillRect(sx + sw - 1.8, sy + 1.2, 1.4, srvH - 2.4);
            ctx.fillStyle = "#059669";
            ctx.fillRect(sx + 0.6, sy + 2.0, 0.8, srvH - 4.0);
            ctx.fillRect(sx + sw - 1.4, sy + 2.0, 0.8, srvH - 4.0);

            // --- 左侧：热插拔 NVMe/SSD 硬盘仓 (Hot-Swap Drive Caddies with Status LEDs) ---
            const driveW = 3.6;
            const driveGap = 1.0;
            const numDrives = 3;
            const driveStartX = sx + 2.6;

            for (let d = 0; d < numDrives; d++) {
                const dx = driveStartX + d * (driveW + driveGap);
                ctx.fillStyle = "#02120e";
                ctx.fillRect(dx, sy + 1.2, driveW, srvH - 2.4);
                ctx.strokeStyle = "#064e3b";
                ctx.lineWidth = 0.4;
                ctx.strokeRect(dx, sy + 1.2, driveW, srvH - 2.4);

                // 硬盘插拔手柄扣
                ctx.fillStyle = "#06382b";
                ctx.fillRect(dx + 0.6, sy + srvH - 3.2, driveW - 1.2, 1.4);

                // 硬盘读写指示灯 (多彩闪烁)
                const dActive = (Math.sin(time * 23 + c * 13 + s * 7 + d * 5) + Math.cos(time * 41 + d * 11)) > 0.4;
                let dColor = "#00FF66"; // 默认绿
                if (c === 0) dColor = dActive ? "#00E5FF" : "#0284c7"; // 冰蓝
                else if (c === 2) dColor = dActive ? "#fbbf24" : "#b45309"; // 琥珀
                else if (c === 4) dColor = dActive ? "#f43f5e" : "#881337"; // 珊瑚红
                else dColor = dActive ? "#10b981" : "#064e3b";

                ctx.fillStyle = dColor;
                ctx.fillRect(dx + 1.1, sy + 2.0, 1.4, 1.2);
            }

            // --- 中间：高精度六角形蜂窝状散热网格 (Honeycomb Cooling Mesh) ---
            const meshX = driveStartX + numDrives * (driveW + driveGap) + 1.4;
            const meshW = 16.5; // 16.5px 宽进风网格
            const meshY = sy + 1.0;
            const meshH = srvH - 2.0;

            // 风道暗部与微弱科技气流内光
            ctx.fillStyle = "rgba(4, 38, 29, 0.85)";
            ctx.fillRect(meshX, meshY, meshW, meshH);

            // 雕刻正六边形蜂窝微阵列 (True Hexagonal Lattice)
            ctx.strokeStyle = "rgba(52, 211, 153, 0.65)";
            ctx.lineWidth = 0.4;
            for (let hx = meshX + 1.1; hx < meshX + meshW - 0.6; hx += 2.2) {
                for (let hy = meshY + 1.0; hy < meshY + meshH - 0.4; hy += 1.8) {
                    const stagger = (Math.round((hx - meshX) / 2.2) % 2 === 1) ? 0.9 : 0;
                    const chy = hy + stagger;
                    if (chy >= meshY + meshH - 0.3) continue;

                    ctx.beginPath();
                    for (let a = 0; a < 6; a++) {
                        const ang = (Math.PI / 3) * a;
                        const px = hx + 0.85 * Math.cos(ang);
                        const py = chy + 0.85 * Math.sin(ang);
                        if (a === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            // --- 右侧：多彩丰富绚丽的 LED 指示灯矩阵与微型 LCD 仪表窗 ---
            const rightAreaX = meshX + meshW + 1.6;
            const rightAreaW = (sx + sw - 2.4) - rightAreaX;

            // 特殊 Master 节点绘制微型高科技 LCD 状态视窗 (Mini Telemetry LCD)
            const hasLcd = (s === 1 && (c === 1 || c === 2 || c === 3));
            if (hasLcd) {
                ctx.fillStyle = "#02120e";
                ctx.fillRect(rightAreaX, sy + 1.2, rightAreaW - 0.6, srvH - 2.4);
                ctx.strokeStyle = cfg.primaryColor;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(rightAreaX, sy + 1.2, rightAreaW - 0.6, srvH - 2.4);

                // LCD 内部微型频谱波形
                ctx.strokeStyle = cfg.accentColor;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                for (let lx = 0; lx < rightAreaW - 2; lx += 1.5) {
                    const ly = sy + srvH / 2 + Math.sin(time * 8 + lx * 0.8 + c) * 1.5;
                    if (lx === 0) ctx.moveTo(rightAreaX + 1 + lx, ly);
                    else ctx.lineTo(rightAreaX + 1 + lx, ly);
                }
                ctx.stroke();
            } else {
                // 标准服务器：绘制多行多列绚丽多色 LED 阵列与 VU 柱状灯
                // 1) 3 阶垂直彩色状态阶梯柱 (Vertical VU Meter Bar)
                const vuX = rightAreaX + 0.8;
                const vuColors = ["#ef4444", "#fbbf24", "#00FF66"]; // 红黄绿三阶
                for (let v = 0; v < 3; v++) {
                    const vy = sy + 1.4 + v * 2.0;
                    const vActive = Math.sin(time * 6 + c * 3 + s * 2 + (2 - v)) > -0.2;
                    ctx.fillStyle = vActive ? vuColors[v] : "#041a13";
                    ctx.fillRect(vuX, vy, 1.8, 1.4);
                }

                // 2) 绚丽多彩的 4 枚主控指示灯 (Multi-Colored Status LED Array)
                const ledColorsPool = [
                    // 根据机柜特色与服务器层级分配绚烂多彩的颜色组合
                    [
                        { on: "#c084fc", off: "#2e1065", glow: "rgba(192, 132, 252, 0.5)" }, // 紫色
                        { on: "#00E5FF", off: "#083344", glow: "rgba(0, 229, 255, 0.5)" },   // 冰蓝
                        { on: "#38bdf8", off: "#0c4a6e", glow: "rgba(56, 189, 248, 0.4)" },  // 天蓝
                        { on: "#ffffff", off: "#1e293b", glow: "rgba(255, 255, 255, 0.5)" }   // 纯白
                    ],
                    [
                        { on: "#00FF66", off: "#022c22", glow: "rgba(0, 255, 102, 0.5)" },   // 翡翠绿
                        { on: "#a3e635", off: "#1a2e05", glow: "rgba(163, 230, 53, 0.5)" },   // 荧光黄绿
                        { on: "#00E5FF", off: "#083344", glow: "rgba(0, 229, 255, 0.5)" },   // 冰蓝
                        { on: "#fbbf24", off: "#451a03", glow: "rgba(251, 191, 36, 0.5)" }   // 琥珀金
                    ],
                    [
                        { on: "#fbbf24", off: "#451a03", glow: "rgba(251, 191, 36, 0.5)" },   // 琥珀金
                        { on: "#ef4444", off: "#450a0a", glow: "rgba(239, 68, 68, 0.5)" },   // 警戒红
                        { on: "#00FF66", off: "#022c22", glow: "rgba(0, 255, 102, 0.5)" },   // 翡翠绿
                        { on: "#3b82f6", off: "#172554", glow: "rgba(59, 130, 246, 0.5)" }   // 皇家蓝
                    ],
                    [
                        { on: "#38bdf8", off: "#082f49", glow: "rgba(56, 189, 248, 0.5)" },  // 天蓝
                        { on: "#3b82f6", off: "#172554", glow: "rgba(59, 130, 246, 0.5)" },  // 宝蓝
                        { on: "#d946ef", off: "#4a044e", glow: "rgba(217, 70, 239, 0.5)" },  // 霓虹品红
                        { on: "#00FF66", off: "#022c22", glow: "rgba(0, 255, 102, 0.5)" }   // 翡翠绿
                    ],
                    [
                        { on: "#ef4444", off: "#450a0a", glow: "rgba(239, 68, 68, 0.5)" },   // 警戒红
                        { on: "#f97316", off: "#431407", glow: "rgba(249, 115, 22, 0.5)" },  // 烈焰橙
                        { on: "#fbbf24", off: "#451a03", glow: "rgba(251, 191, 36, 0.5)" },  // 琥珀金
                        { on: "#ffffff", off: "#1e293b", glow: "rgba(255, 255, 255, 0.5)" }   // 闪光白
                    ]
                ][c];

                const ledStartX = vuX + 3.4;
                const ledSpacingX = 2.4;

                for (let l = 0; l < 4; l++) {
                    const lx = ledStartX + l * ledSpacingX;
                    const ly = sy + srvH / 2;
                    const lDef = ledColorsPool[l];

                    // 真实硬件闪烁动态算法（包含高频读写爆闪、平稳呼吸与随机脉冲）
                    let lit = false;
                    if (l === 0) {
                        // 电源健康：平稳微呼吸
                        lit = (Math.sin(time * 3 + c + s) > -0.6);
                    } else if (l === 1) {
                        // 高速总线突发闪烁
                        lit = (Math.sin(time * 19 + c * 11 + s * 17 + l * 7) + Math.cos(time * 37 + s * 23)) > 0.3;
                    } else if (l === 2) {
                        // 网络集群脉冲
                        lit = (Math.sin(time * 9.5 + c * 5 + s * 13 + l * 3) > 0.0);
                    } else {
                        // 随机状态/异常跳动脉冲
                        lit = (Math.sin(time * 14 + s * 19 + c * 7) > 0.4);
                    }

                    // 绘制发光光晕与明亮中心核
                    if (lit) {
                        ctx.fillStyle = lDef.glow;
                        ctx.beginPath(); ctx.arc(lx, ly, 1.8, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = lDef.on;
                        ctx.beginPath(); ctx.arc(lx, ly, 0.9, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "#ffffff";
                        ctx.beginPath(); ctx.arc(lx, ly, 0.4, 0, Math.PI * 2); ctx.fill();
                    } else {
                        ctx.fillStyle = lDef.off;
                        ctx.beginPath(); ctx.arc(lx, ly, 0.7, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }
        }

        // 1D. 四角重型钛合金装甲加固角铁与六角沉头螺栓 (Heavy Corner Brackets & Hex Bolts)
        const cornerSize = 4.2;
        const cornerOffsets = [
            [cabX + 2, -halfH + 2],
            [cabX + cabW - 2 - cornerSize, -halfH + 2],
            [cabX + 2, halfH - 2 - cornerSize],
            [cabX + cabW - 2 - cornerSize, halfH - 2 - cornerSize]
        ];
        cornerOffsets.forEach(([bx, by]) => {
            ctx.fillStyle = "#010e0b";
            ctx.fillRect(bx, by, cornerSize, cornerSize);
            ctx.strokeStyle = "#0d4a3c";
            ctx.lineWidth = 0.6;
            ctx.strokeRect(bx, by, cornerSize, cornerSize);

            // 六角螺栓
            ctx.fillStyle = "#10b981";
            ctx.beginPath(); ctx.arc(bx + cornerSize / 2, by + cornerSize / 2, 0.9, 0, Math.PI * 2); ctx.fill();
        });

        // 机柜正面防静电钢化玻璃/金属孔网门边框锁扣与拉手 (Door Frame & Heavy Lock Handle)
        ctx.fillStyle = "#04382c";
        ctx.fillRect(cabX + cabW - 3.2, -halfH + 32, 2.0, 24);
        ctx.fillStyle = "#a7f3d0";
        ctx.fillRect(cabX + cabW - 2.6, -halfH + 38, 1.2, 10);

        // 机柜之间模块化防爆重缝拼装线 (Inter-cabinet Heavy Seams)
        if (c < numCabinets - 1) {
            ctx.strokeStyle = "#010a08";
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(cabX + cabW, -halfH);
            ctx.lineTo(cabX + cabW, halfH);
            ctx.stroke();

            ctx.strokeStyle = "#064e3b";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(cabX + cabW, -halfH + 2);
            ctx.lineTo(cabX + cabW, halfH - 2);
            ctx.stroke();
        }
    }

    // --- 2. 横贯 5 机柜后部的重型发光光纤主干桥架 (Top Multi-Color Optical Trunk Duct) ---
    const racewayH = 5.0;
    ctx.fillStyle = "#010b09";
    ctx.fillRect(-halfW, -halfH - racewayH, totalW, racewayH);
    ctx.strokeStyle = "#064e3b";
    ctx.lineWidth = 1.0;
    ctx.strokeRect(-halfW, -halfH - racewayH, totalW, racewayH);

    // 内部四路多彩发光光纤光缆 (Emerald Green, Electric Cyan, Neon Purple, Safety Amber)
    const fibers = [
        { color: "#00FF66", yPct: 0.2 },
        { color: "#00E5FF", yPct: 0.45 },
        { color: "#c084fc", yPct: 0.7 },
        { color: "#fbbf24", yPct: 0.9 }
    ];
    fibers.forEach(fib => {
        ctx.strokeStyle = fib.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-halfW + 4, -halfH - racewayH * fib.yPct);
        ctx.lineTo(halfW - 4, -halfH - racewayH * fib.yPct);
        ctx.stroke();
    });

    // 桥架外壳高光金属倒角反射线
    ctx.strokeStyle = "rgba(52, 211, 153, 0.45)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.lineTo(halfW, -halfH);
    ctx.stroke();

    ctx.restore();
}

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
            drawServerCluster(ctx, cx, cy, angle, scale);
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
// =========================================================================
function drawConferenceTableSystem(ctx, cx, cy, radius = 155) {
    const time = Date.now() * 0.001;
    const numSeats = 12;
    const seatRadius = 202; // 座位中心距桌心距离
    const itemRadius = 118; // 桌上物品摆放距桌心距离

    // 辅助圆角矩形绘制函数
    const drawRoundRect = (x, y, w, h, r) => {
        if (typeof ctx.roundRect === 'function') {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
        } else {
            const rad = Math.min(Math.abs(w) / 2, Math.abs(h) / 2, r || 0);
            ctx.beginPath();
            ctx.moveTo(x + rad, y);
            ctx.arcTo(x + w, y, x + w, y + h, rad);
            ctx.arcTo(x + w, y + h, x, y + h, rad);
            ctx.arcTo(x, y + h, x, y, rad);
            ctx.arcTo(x, y, x + w, y, rad);
            ctx.closePath();
        }
    };

    // =========================================================================
    // 1. 环绕大圆会议桌的 12 个高管战术人体工学转椅 (位置与桌上物品一一对应)
    // 尺寸放大至与其他控制台椅子相当 (宽 24px 坐垫 + 28.8px 扶手间距)，面向会议桌中心
    // 包含五星脚轮底座、深色皮革加厚软垫与双人体工学扶手靠背
    // =========================================================================
    for (let k = 0; k < numSeats; k++) {
        // 角度偏移 15° (半个席位)，确保正北 (12点) 与正南 (6点) 留出宽达 105px 的主通行干道，角色自由行走畅通无阻
        const theta = (k + 0.5) * (2 * Math.PI / numSeats) - Math.PI / 2;
        const sx = cx + Math.cos(theta) * seatRadius;
        const sy = cy + Math.sin(theta) * seatRadius;

        ctx.save();
        ctx.translate(sx, sy);
        // 朝向桌心 (theta + Math.PI/2 使局部 +y 指向桌心，-y 朝向背部)
        ctx.rotate(theta + Math.PI / 2);

        // 1A. 座椅地坪柔和环境微阴影 (与放大后的座椅尺寸相匹配)
        ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 17, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // 1B. 重型五星滚轮合金底座 (Five-Star Heavy Swivel Base，与其它控制台座椅规格统一)
        const hubY = -1;
        ctx.fillStyle = "#0c1412";
        ctx.beginPath();
        ctx.arc(0, hubY, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // 5 个星芒滚轮臂 (臂长 14.5px)
        for (let a = 0; a < 5; a++) {
            const spokeAng = a * (2 * Math.PI / 5) - Math.PI / 2;
            const spkX = Math.cos(spokeAng) * 14.5;
            const spkY = hubY + Math.sin(spokeAng) * 14.5;

            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(0, hubY);
            ctx.lineTo(spkX, spkY);
            ctx.stroke();

            ctx.strokeStyle = "#64748b";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(0, hubY);
            ctx.lineTo(spkX, spkY);
            ctx.stroke();

            // 双轮静音尼龙脚轮
            ctx.fillStyle = "#090d0c";
            ctx.fillRect(spkX - 1.5, spkY - 1.5, 3.0, 3.0);
        }

        // 中心液压升降立柱镀铬顶盖
        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.arc(0, hubY, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // 1C. 高级炭黑真皮加厚座垫 (Executive Leather Seat Cushion)
        // 尺寸放大到宽 24px, 深 17px (与其他工作台 24-26px 完全一致)
        const seatGrad = ctx.createLinearGradient(-12, -7.5, 12, 9.5);
        seatGrad.addColorStop(0, "#1c2421");
        seatGrad.addColorStop(0.5, "#141b18");
        seatGrad.addColorStop(1, "#0a0f0d");

        drawRoundRect(-12, -7.5, 24, 17, 4.0);
        ctx.fillStyle = seatGrad;
        ctx.fill();

        // 边缘战术翡翠缝线包边 (Piping Seam)
        ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 内部加厚坐垫与纵向微凹缝线
        drawRoundRect(-9.5, -5.5, 19, 13, 3.0);
        ctx.fillStyle = "#161e1b";
        ctx.fill();
        ctx.strokeStyle = "rgba(5, 150, 105, 0.28)";
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, -5.5);
        ctx.lineTo(0, 7.5);
        ctx.stroke();

        // 1D. 左右人体工学宽扶手 (Dual Ergonomic Armrests, 外跨度 28.8px)
        // 左扶手
        drawRoundRect(-14.4, -7.5, 2.8, 13, 1.4);
        ctx.fillStyle = "#1e2926";
        ctx.fill();
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // 右扶手
        drawRoundRect(11.6, -7.5, 2.8, 13, 1.4);
        ctx.fillStyle = "#1e2926";
        ctx.fill();
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // 1E. 人体工学加宽靠背与腰托 (Sculpted High-Back Backrest，宽 22px，面向桌心)
        drawRoundRect(-11, -14.5, 22, 7.0, 3.0);
        ctx.fillStyle = "#151d1a";
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 后方金属背部支撑龙骨
        ctx.fillStyle = "#334155";
        ctx.fillRect(-2.5, -15.5, 5.0, 3.5);

        // 柔软腰靠枕
        drawRoundRect(-8, -11.5, 16, 3.0, 1.4);
        ctx.fillStyle = "#202d28";
        ctx.fill();

        ctx.restore();
    }

    // =========================================================================
    // 2. 大圆会议桌本体 (深色木制质感，类似已做好的讲台道具的红木/黑胡桃木纹理)
    // 保持原本正圆形状 (radius = 155px)
    // =========================================================================
    ctx.save();

    // 2A. 会议桌底层大型环境遮蔽阴影
    ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
    ctx.beginPath();
    ctx.arc(cx + 4, cy + 6, radius + 2, 0, Math.PI * 2);
    ctx.fill();

    // 2B. 会议桌深色实木外倒角防撞重包边 (Solid Wood Chamfer Rim)
    ctx.fillStyle = "#120503";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 外轮廓翡翠装甲装饰环 (与 Level 8 外墙及讲台轮廓 #10b981 统一风格)
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 倒角分界暗缝
    ctx.strokeStyle = "#080201";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // 2C. 会议桌面主体：奢华深色红木/黑胡桃木底色与天然木纹 (Dark Mahogany / Walnut Grain)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 3.5, 0, Math.PI * 2);
    ctx.clip(); // 限制木纹在实木桌面范围内

    // 模拟从左上角 45° 投射的全局柔和环境光深邃木质渐变
    const woodGrad = ctx.createRadialGradient(cx - 45, cy - 45, 15, cx, cy, radius);
    woodGrad.addColorStop(0, "#4a1c12");   // 受光面：深红胡桃木
    woodGrad.addColorStop(0.35, "#34130a"); // 核心质感色：奢华黑胡桃木
    woodGrad.addColorStop(0.70, "#220b06"); // 暗调区：深邃红木暗影
    woodGrad.addColorStop(1, "#110402");   // 边缘深邃沉稳黑檀收边
    ctx.fillStyle = woodGrad;
    ctx.fill();

    // 1) 真实同心微波木材年轮 (Concentric Wavy Tree Rings)
    const ringRadii = [48, 62, 76, 90, 104, 118, 132, 144];
    ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
            const waveR = r + Math.sin(a * 7) * 1.3 + Math.cos(a * 13) * 0.7;
            const px = cx + Math.cos(a) * waveR;
            const py = cy + Math.sin(a) * waveR;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = (idx % 2 === 0) ? "rgba(92, 34, 18, 0.42)" : "rgba(18, 5, 2, 0.52)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
    });

    // 2) 放射状木质射线微纹 (Radial Medullary Rays)
    for (let rDeg = 0; rDeg < 360; rDeg += 15) {
        const rad = rDeg * Math.PI / 180;
        const x1 = cx + Math.cos(rad) * 46;
        const y1 = cy + Math.sin(rad) * 46;
        const x2 = cx + Math.cos(rad) * (radius - 5);
        const y2 = cy + Math.sin(rad) * (radius - 5);
        ctx.strokeStyle = "rgba(92, 34, 18, 0.18)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // 3) 桌面高光漆面斜向漫反射 (Polished Lacquer Satin Sheen)
    const sheenGrad = ctx.createLinearGradient(cx - 150, cy - 150, cx + 150, cy + 150);
    sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
    sheenGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.03)");
    sheenGrad.addColorStop(0.7, "transparent");
    sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0.02)");
    ctx.fillStyle = sheenGrad;
    ctx.fill();

    // 4) 桌面席位分区同心黄铜/翡翠嵌条 (Inlaid Trim Rings)
    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(cx, cy, 92, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, 148, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore(); // 结束木纹裁剪

    // =========================================================================
    // 3. 会议桌中央高科技全向音频与全息战术核心 (Boardroom Central Hub)
    // =========================================================================
    const hubGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 44);
    hubGrad.addColorStop(0, "#081410");
    hubGrad.addColorStop(0.7, "#030a08");
    hubGrad.addColorStop(1, "#010504");
    ctx.fillStyle = hubGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0d4a3c";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 环形 360° 全向会议麦克风透声微网格 (Acoustic Mesh Grille)
    ctx.fillStyle = "#020705";
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.stroke();

    for (let mg = 0; mg < 24; mg++) {
        const ma = mg * (Math.PI * 2 / 24);
        const mx = cx + Math.cos(ma) * 33;
        const my = cy + Math.sin(ma) * 33;
        ctx.fillStyle = "rgba(16, 185, 129, 0.65)";
        ctx.beginPath(); ctx.arc(mx, my, 0.7, 0, Math.PI * 2); ctx.fill();
    }

    // 中央全息投影透镜与微型战术状态光环 (Central Holo Projector Lens)
    const holoPulse = Math.sin(time * 3.0) * 0.2 + 0.8;
    ctx.fillStyle = "#010806";
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.75 * holoPulse})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 229, 255, ${0.15 * holoPulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    // 全息十字微准星
    ctx.strokeStyle = "rgba(0, 229, 255, 0.75)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy);
    ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy + 7);
    ctx.stroke();

    // 4 枚十字方位微型状态 LED
    for (let cLed = 0; cLed < 4; cLed++) {
        const ca = cLed * (Math.PI / 2);
        const clx = cx + Math.cos(ca) * 23;
        const cly = cy + Math.sin(ca) * 23;
        ctx.fillStyle = "#00FF66";
        ctx.beginPath(); ctx.arc(clx, cly, 0.8, 0, Math.PI * 2); ctx.fill();
    }

    // =========================================================================
    // 4. 会议桌上排满一圈的 12 席高精度战术终端、TOP SECRET 机密文件夹与金属签字笔
    // 与四周 12 个座位一一对应，严密顺应圆桌曲率排列
    // 关键朝向规范：
    // - 局部坐标系中，+y 朝向会议桌中心，-y 朝向就坐席位
    // - 笔：笔帽与笔尖朝向桌子中心 (+y)，笔尾朝向座位 (-y)
    // - 文件夹：文件顶部/回形针/TOP SECRET 印章朝向桌子中心 (+y)，公文正文向下流向座位 (-y)
    // - 平板：顶部边框/摄像头/状态栏朝向桌子中心 (+y)，底部触控条朝向座位 (-y)
    // =========================================================================
    for (let k = 0; k < numSeats; k++) {
        const theta = (k + 0.5) * (2 * Math.PI / numSeats) - Math.PI / 2;
        const wx = cx + Math.cos(theta) * itemRadius;
        const wy = cy + Math.sin(theta) * itemRadius;

        ctx.save();
        ctx.translate(wx, wy);
        // 朝向桌心 (+y 指向会议桌中心，-y 指向就座人员)
        ctx.rotate(theta + Math.PI / 2);

        // 4A. 绝密文件夹 / 战术简报公文 (位于座位左侧 x: -18.5 到 -4.5)
        // 规范朝向：文件顶部（回形针、TOP SECRET 戳记）朝向桌心 (+y)，纸张底部朝向座位 (-y)
        const docX = -18.5;
        const docY = -7.5;
        const docW = 14.0;
        const docH = 15.5;

        // 文件夹底层暗影
        ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
        ctx.fillRect(docX + 0.8, docY + 0.8, docW, docH);

        // 文件夹真皮封套 (深蓝黑 #0c131d 搭配金色护角)
        ctx.fillStyle = "#0c131d";
        ctx.fillRect(docX, docY, docW, docH);
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 0.6;
        ctx.strokeRect(docX, docY, docW, docH);

        // 4 角黄铜/金属防磨包角
        ctx.fillStyle = "#d97706";
        ctx.fillRect(docX, docY, 1.4, 1.4);
        ctx.fillRect(docX + docW - 1.4, docY, 1.4, 1.4);
        ctx.fillRect(docX, docY + docH - 1.4, 1.4, 1.4);
        ctx.fillRect(docX + docW - 1.4, docY + docH - 1.4, 1.4, 1.4);

        // 左侧皮革书脊压痕线
        ctx.strokeStyle = "#05090f";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(docX + 1.8, docY);
        ctx.lineTo(docX + 1.8, docY + docH);
        ctx.stroke();

        // 内部雪白机密公文纸张 (内页摊开效果)
        const pX = docX + 2.5;
        const pY = docY + 1.2;
        const pW = docW - 3.5;
        const pH = docH - 2.4;
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(pX, pY, pW, pH);

        // 顶部金属票夹 / 镀金回形针 (朝向桌心 +y，即 pY + pH 顶部)
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(pX + 1.2, pY + pH - 1.6, 2.2, 1.8);
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 0.4;
        ctx.strokeRect(pX + 1.2, pY + pH - 1.6, 2.2, 1.8);

        // 绝密公文右上角红色 TOP SECRET 戳记 (朝向桌心 +y，右上角)
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
        ctx.fillRect(pX + pW - 4.4, pY + pH - 3.2, 3.6, 2.0);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(pX + pW - 4.4, pY + pH - 3.2, 3.6, 2.0);

        // 纸张上 4 排深灰微型横向打印正文线条 (从 +y 朝向 -y 排列)
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 0.5;
        for (let rw = 0; rw < 4; rw++) {
            const ry = pY + pH - 4.8 - rw * 1.8;
            ctx.beginPath();
            ctx.moveTo(pX + 1.2, ry);
            ctx.lineTo(pX + pW - 1.2, ry);
            ctx.stroke();
        }

        // 4B. 金属行政签字笔 / 战术手写笔 (摆放在文件夹与平板电脑之间)
        // 关键规范：笔帽与笔尖朝向桌子中心 (+y)，笔尾朝向座位 (-y)
        const penX = -2.8;
        const penW = 1.8;
        const penTailY = -5.8;  // 笔尾朝向座位 (-y)
        const penNibY = 6.2;    // 笔尖朝向桌心 (+y)
        const penBodyH = 12.0;

        // 笔下细微投影
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(penX + 0.6, penTailY + 0.6, penW, penBodyH);

        // 1) 笔尾 (Pen End Cap / Tail，朝向座位 -y)
        ctx.fillStyle = "#475569";
        drawRoundRect(penX - 0.1, penTailY, penW + 0.2, 1.6, 0.7);
        ctx.fill();

        // 2) 钛黑金属笔杆主体 (Pen Barrel)
        const penGrad = ctx.createLinearGradient(penX, 0, penX + penW, 0);
        penGrad.addColorStop(0, "#0f172a");
        penGrad.addColorStop(0.5, "#334155");
        penGrad.addColorStop(1, "#0f172a");
        ctx.fillStyle = penGrad;
        ctx.fillRect(penX, penTailY + 1.6, penW, 6.5);

        // 3) 中段高亮镀铬饰环 (Chrome Accent Ring)
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(penX - 0.15, penTailY + 8.1, penW + 0.3, 0.9);

        // 4) 笔帽 (Pen Cap，朝向桌心 +y)
        ctx.fillStyle = "#090d16";
        ctx.fillRect(penX - 0.1, penTailY + 9.0, penW + 0.2, 2.5);

        // 笔夹 (Pocket Clip，附着在笔帽上，朝向右侧)
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(penX + penW + 0.2, penTailY + 8.5);
        ctx.lineTo(penX + penW + 0.2, penTailY + 11.2);
        ctx.stroke();

        // 5) 黄金色锥形笔尖 (Golden Nib，精准朝向桌心 +y 尖锐聚拢)
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(penX, penTailY + 11.5);
        ctx.lineTo(penX + penW, penTailY + 11.5);
        ctx.lineTo(penX + penW / 2, penNibY);
        ctx.closePath();
        ctx.fill();

        // 铱金笔尖微亮点
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(penX + penW / 2, penNibY - 0.2, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // 4C. 平板电脑 / 战术终端 (位于座位右侧 x: 1.5 到 18.0)
        // 规范朝向：顶部边框与状态栏朝向桌心 (+y)，底部触控条朝向座位 (-y)
        const tabX = 1.5;
        const tabY = -6.0;
        const tabW = 16.5;
        const tabH = 12.5;

        // 终端微阴影
        ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
        ctx.fillRect(tabX + 0.8, tabY + 0.8, tabW, tabH);

        // 钛灰哑光外壳
        drawRoundRect(tabX, tabY, tabW, tabH, 1.6);
        ctx.fillStyle = "#0b131c";
        ctx.fill();
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // 顶部边框微型前置摄像头与光线传感器 (朝向桌心 +y 边缘)
        ctx.fillStyle = "#04080c";
        ctx.beginPath();
        ctx.arc(tabX + tabW / 2, tabY + tabH - 0.7, 0.55, 0, Math.PI * 2);
        ctx.fill();

        // 战术蓝光液晶显示屏
        const scrX = tabX + 1.2;
        const scrY = tabY + 1.2;
        const scrW = tabW - 2.4;
        const scrH = tabH - 2.4;

        const scrGrad = ctx.createLinearGradient(scrX, scrY + scrH, scrX + scrW, scrY);
        scrGrad.addColorStop(0, "#032845");
        scrGrad.addColorStop(0.5, "#0b355c");
        scrGrad.addColorStop(1, "#061c3a");
        ctx.fillStyle = scrGrad;
        ctx.fillRect(scrX, scrY, scrW, scrH);

        ctx.strokeStyle = "#00CCFF";
        ctx.lineWidth = 0.6;
        ctx.strokeRect(scrX, scrY, scrW, scrH);

        // 屏幕高精 UI 与动态频谱波形
        ctx.save();
        ctx.beginPath();
        ctx.rect(scrX, scrY, scrW, scrH);
        ctx.clip();

        // 水平细微扫描线
        ctx.strokeStyle = "rgba(0, 229, 255, 0.18)";
        ctx.lineWidth = 0.4;
        for (let l = scrY + 1.2; l < scrY + scrH; l += 1.6) {
            ctx.beginPath();
            ctx.moveTo(scrX, l);
            ctx.lineTo(scrX + scrW, l);
            ctx.stroke();
        }

        // 实时波形曲线 (居中展开)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        for (let bx = 0; bx < scrW - 1; bx += 1.2) {
            const by = scrY + scrH / 2 + Math.sin(time * 5.0 + bx * 0.9 + k * 1.5) * 1.4;
            if (bx === 0) ctx.moveTo(scrX + 0.5 + bx, by);
            else ctx.lineTo(scrX + 0.5 + bx, by);
        }
        ctx.stroke();

        // 顶部微型战术状态文字条 (朝向桌心 +y)
        ctx.fillStyle = "rgba(0, 229, 255, 0.75)";
        ctx.fillRect(scrX + 1.0, scrY + scrH - 1.4, 4.0, 0.6);

        // 底部触控指示条 (朝向座位 -y)
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fillRect(scrX + scrW / 2 - 2.0, scrY + 0.6, 4.0, 0.5);

        // 45° 玻璃反光
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(scrX, scrY);
        ctx.lineTo(scrX + 4.5, scrY);
        ctx.lineTo(scrX + 1.5, scrY + scrH);
        ctx.lineTo(scrX, scrY + scrH);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // 平板右上角绿/蓝微型指示灯点 (朝向桌心 +y 侧)
        ctx.fillStyle = (k % 3 === 0) ? "#00FF66" : "#00E5FF";
        ctx.beginPath();
        ctx.arc(scrX + scrW - 1.2, scrY + scrH - 1.2, 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // =========================================================================
    // 5. 大圆会议桌悬挂发光灯环 (圆环形灯环保持原本形状与颜色，做出一颗一颗微型灯珠和发光点亮效果)
    // 半径严格保持原本 143px，配色保持天空蓝/极光青蓝 (rgba(56, 189, 248, 0.95) 与 #00E5FF)
    // =========================================================================
    const ringRadius = 143;
    const numBeads = 64; // 64 颗高精度独立 LED 灯珠

    // 5A. 灯环在木质桌面上的宏大发光光晕与泛光投影
    ctx.strokeStyle = "rgba(56, 189, 248, 0.24)";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 5B. 原原本本的圆环灯槽基座导轨 (宽 8px 的金属灯环凹槽)
    ctx.strokeStyle = "#041620";
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 双侧导轨金属边缘线
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius - 3.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius + 3.8, 0, Math.PI * 2);
    ctx.stroke();

    // 导轨中央高亮青蓝光纤发光管
    ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 5C. 一颗一颗清晰可辨的 LED 灯珠与点亮效果 ("做出一颗一颗灯珠和点亮的效果")
    for (let b = 0; b < numBeads; b++) {
        const bAngle = b * (Math.PI * 2 / numBeads);
        const bx = cx + Math.cos(bAngle) * ringRadius;
        const by = cy + Math.sin(bAngle) * ringRadius;

        // 柔和的顺时针巡回发光微波动效 (点亮闪耀质感)
        const beadPulse = Math.sin(time * 3.2 + b * 0.35) * 0.18 + 0.82;

        // 1) 微型灯珠固定金属底座
        ctx.fillStyle = "#010e17";
        ctx.beginPath();
        ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0369a1";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // 2) 独立灯珠发光光晕 (Illuminated Glow Corona)
        ctx.fillStyle = `rgba(56, 189, 248, ${0.48 * beadPulse})`;
        ctx.beginPath();
        ctx.arc(bx, by, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // 3) 原版经典青蓝发光灯体核心 (Electric Cyan Phosphor Lens)
        ctx.fillStyle = "#00E5FF";
        ctx.beginPath();
        ctx.arc(bx, by, 1.35, 0, Math.PI * 2);
        ctx.fill();

        // 4) 极其明亮的一颗颗点亮发光极小亮点 (Specular Lit Phosphor Core)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(bx, by, 0.65, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

window.drawConferenceTableSystem = drawConferenceTableSystem;

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
                    drawConferenceTableSystem(ctx, cx, cy, 155);
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
