// =========================================================================
// LEVEL 7: 顶石深潜科研中心 (APEX NEXUS RESEARCH COMPLEX)
// 依据用户最新草图与指令构建的巨型眼睛地图 (The Eye Map)
// =========================================================================

window.level7MapWidth = 3200;
window.level7MapHeight = 2400;

// =========================================================================
// 全新扇形战术控制台绘制系统 (自 Level 8 移植，完全依据手绘草稿 IMG_7693 设计)
// 包含 5 大核心要素：
// 1. 控制台本身呈扇形（弧形外边、内凹弧形座舱边缘、径向收拢侧翼）
// 2. 前部三个连在一起的弧面显示屏（一体化铰链连接，雷达、频谱、动力监测，角度贴合弧度）
// 3. 屏幕后方中央的机械键盘与操作员滑轮座椅（紧贴内凹工位，带腰托高靠背与扶手，无黑影）
// 4. 左侧操作翼多排控制按钮（方块按键、指示摇臂、金属防护拨动开关）
// 5. 右侧操作翼多排控制按钮（双推子电位器、旋转刻度旋钮、微动矩阵、带黄黑警示圈的大型紧急制动按钮）
// =========================================================================
function drawSectorWorkstation(ctx, cx, cy, angle = 0, scale = 1.0, freezeTime = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    if (scale !== 1.0) ctx.scale(scale, scale);

    const time = freezeTime ? 0 : Date.now() * 0.001;

    // --- 1. 扇形控制台主体工作台面 (Fan-shaped Console Desk Surface) ---
    const R_out = 112;
    const R_in = 52;
    const maxTheta = 36 * Math.PI / 180;
    const startAngle = -Math.PI / 2 - maxTheta;
    const endAngle = -Math.PI / 2 + maxTheta;

    // 1A. 底座与重型军工装甲包边
    ctx.beginPath();
    ctx.arc(0, 0, R_out + 2, startAngle - 0.02, endAngle + 0.02, false);
    ctx.lineTo(Math.sin(maxTheta) * (R_in - 2), -Math.cos(maxTheta) * (R_in - 2));
    ctx.arc(0, 0, R_in - 2, endAngle + 0.02, startAngle - 0.02, true);
    ctx.closePath();
    ctx.fillStyle = "#02120e";
    ctx.fill();
    ctx.strokeStyle = "#064e3b";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 1B. 碳纤军工翡翠科技台面 (Radial Gradient Surface)
    ctx.beginPath();
    ctx.arc(0, 0, R_out, startAngle, endAngle, false);
    ctx.lineTo(Math.sin(maxTheta) * R_in, -Math.cos(maxTheta) * R_in);
    ctx.arc(0, 0, R_in, endAngle, startAngle, true);
    ctx.closePath();
    const gradDesk = ctx.createRadialGradient(0, 0, R_in, 0, 0, R_out);
    gradDesk.addColorStop(0, "#08251e");
    gradDesk.addColorStop(0.6, "#041712");
    gradDesk.addColorStop(1, "#020d0a");
    ctx.fillStyle = gradDesk;
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 1C. 台面金属嵌缝与导轨线
    ctx.strokeStyle = "rgba(52, 211, 153, 0.28)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, (R_out + R_in) / 2 + 12, startAngle + 0.03, endAngle - 0.03);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, (R_out + R_in) / 2 - 12, startAngle + 0.03, endAngle - 0.03);
    ctx.stroke();

    // 两侧功能分界径向嵌线
    [-16 * Math.PI / 180, 16 * Math.PI / 180].forEach(radTheta => {
        ctx.beginPath();
        ctx.moveTo(Math.sin(radTheta) * (R_in + 2), -Math.cos(radTheta) * (R_in + 2));
        ctx.lineTo(Math.sin(radTheta) * (R_out - 4), -Math.cos(radTheta) * (R_out - 4));
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });

    // --- 2. 前部 3 连体全景弧面高科技显示屏 ("前部是三个连在一起的屏幕") ---
    const R_scr_out = 110;
    const R_scr_in = 94;
    const scrBezelOuter = 111.5;
    const scrBezelInner = 92.5;

    // 2A. 屏幕一体化金属悬臂底座与支架
    ctx.save();
    for (let sa = -30; sa <= 30; sa += 15) {
        const rad = sa * Math.PI / 180;
        const bx = Math.sin(rad) * 91;
        const by = -Math.cos(rad) * 91;
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(bx - 3, by - 2, 6, 4);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(bx - 1.5, by - 1, 3, 2);
    }
    ctx.restore();

    // 屏幕角度定义: Left (-33° to -11°), Center (-11° to +11°), Right (+11° to +33°)
    const screens = [
        { id: "L", startDeg: -33, endDeg: -11, label: "SPECTRAL / COMMS" },
        { id: "C", startDeg: -11, endDeg: 11, label: "TACTICAL RADAR HUD" },
        { id: "R", startDeg: 11, endDeg: 33, label: "REACTOR / SHIELD" }
    ];

    screens.forEach(scr => {
        ctx.save();
        const a1 = -Math.PI / 2 + scr.startDeg * Math.PI / 180;
        const a2 = -Math.PI / 2 + scr.endDeg * Math.PI / 180;

        // 边框 (Bezel)
        ctx.beginPath();
        ctx.arc(0, 0, scrBezelOuter, a1 + 0.01, a2 - 0.01, false);
        ctx.arc(0, 0, scrBezelInner, a2 - 0.01, a1 + 0.01, true);
        ctx.closePath();
        ctx.fillStyle = "#03100b";
        ctx.fill();
        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 屏幕玻璃面
        ctx.beginPath();
        ctx.arc(0, 0, R_scr_out, a1 + 0.02, a2 - 0.02, false);
        ctx.arc(0, 0, R_scr_in, a2 - 0.02, a1 + 0.02, true);
        ctx.closePath();
        ctx.fillStyle = "#021611";
        ctx.fill();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 限制在屏幕内裁切绘制高精度 UI
        ctx.clip();

        // 屏幕背景细密同心圆弧扫描线 (完美贴合屏幕弧度，杜绝斜切走样)
        ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
        ctx.lineWidth = 0.6;
        for (let r = R_scr_in + 2; r < R_scr_out - 1; r += 2.5) {
            ctx.beginPath();
            ctx.arc(0, 0, r, a1 + 0.02, a2 - 0.02);
            ctx.stroke();
        }

        // 屏幕局部中心坐标与倾斜角度
        const midDeg = (scr.startDeg + scr.endDeg) / 2;
        const midRad = midDeg * Math.PI / 180;
        const midR = (R_scr_out + R_scr_in) / 2;
        const smx = Math.sin(midRad) * midR;
        const smy = -Math.cos(midRad) * midR;

        // 旋转局部坐标系，与该屏幕弧度切线与法线完全平行 (消除一切歪斜)
        ctx.save();
        ctx.translate(smx, smy);
        ctx.rotate(midRad);

        if (scr.id === "C") {
            // 中央雷达与准星 (Radar HUD)
            ctx.strokeStyle = "rgba(52, 211, 153, 0.55)";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.stroke();
            // 准星十字刻度
            ctx.beginPath();
            ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
            ctx.moveTo(0, -7); ctx.lineTo(0, 7);
            ctx.stroke();

            // 动态旋转雷达扫描线
            const sweepA = (time * 2.5) % (Math.PI * 2);
            ctx.strokeStyle = "#34d399";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sweepA) * 7.5, Math.sin(sweepA) * 7.5);
            ctx.stroke();

            // 目标信号点 (Blips)
            ctx.fillStyle = "#38bdf8";
            ctx.beginPath(); ctx.arc(-3.5, -2.5, 1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(4, 2, 1, 0, Math.PI * 2); ctx.fill();
        } else if (scr.id === "L") {
            // 左屏: 频谱波形与遥测条形图 (Telemetric Spectrogram, 角度完全与屏对齐)
            const bars = 7;
            const barW = 2;
            for (let b = 0; b < bars; b++) {
                const bx = -10 + b * 3.2;
                const hVal = 3 + Math.abs(Math.sin(time * 3 + b * 0.9)) * 8;
                ctx.fillStyle = b === 5 ? "#f59e0b" : "#10b981";
                ctx.fillRect(bx, 4 - hVal, barW, hVal);
            }
            // 顶端通信微型波形
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(-12, -4);
            ctx.lineTo(-6, -6);
            ctx.lineTo(0, -3);
            ctx.lineTo(6, -7);
            ctx.lineTo(12, -4);
            ctx.stroke();
        } else if (scr.id === "R") {
            // 右屏: 反应堆核心环与防线状态指示 (Reactor Diagnostics, 角度完全与屏对齐)
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(-5, 0, 4, 0, Math.PI * 1.5);
            ctx.stroke();

            // 能量阶梯条
            ctx.fillStyle = "#10b981";
            ctx.fillRect(2, -5, 8, 2);
            ctx.fillRect(2, -2, 6, 2);
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(2, 1, 9, 2);
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(2, 4, 4, 2);
        }

        // 玻璃高光反光倾斜斜线 (沿屏幕切线)
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(-14, -10);
        ctx.lineTo(-4, -10);
        ctx.lineTo(6, 10);
        ctx.lineTo(-4, 10);
        ctx.closePath();
        ctx.fill();

        ctx.restore(); // 结束各屏幕旋转 HUD
        ctx.restore(); // 结束各屏幕主裁剪区
    });

    // 屏幕间关节铰链连接锁扣 ("前部是三个连在一起的屏幕")
    [-11 * Math.PI / 180, 11 * Math.PI / 180].forEach(jTheta => {
        const jx = Math.sin(jTheta) * ((R_scr_out + R_scr_in) / 2);
        const jy = -Math.cos(jTheta) * ((R_scr_out + R_scr_in) / 2);
        ctx.save();
        ctx.translate(jx, jy);
        ctx.rotate(jTheta);
        ctx.fillStyle = "#022c22";
        ctx.fillRect(-2, -9, 4, 18);
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 1;
        ctx.strokeRect(-2, -9, 4, 18);
        // 金属铰链螺栓
        ctx.fillStyle = "#10b981";
        ctx.beginPath(); ctx.arc(0, -5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    });

    // --- 3. 屏幕后方的键盘控制模块 ("屏幕后方是键盘和座椅") ---
    ctx.save();
    // 键盘凹槽托盘
    const kbCenterR = 74;
    const kbW = 28;
    const kbH = 14;
    ctx.translate(0, -kbCenterR);

    ctx.fillStyle = "#021a14";
    ctx.fillRect(-kbW / 2 - 2, -kbH / 2 - 2, kbW + 4, kbH + 4);
    ctx.strokeStyle = "#065f46";
    ctx.lineWidth = 1;
    ctx.strokeRect(-kbW / 2 - 2, -kbH / 2 - 2, kbW + 4, kbH + 4);

    // 机械键盘背光底板
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.fillRect(-kbW / 2, -kbH / 2, kbW, kbH);

    // 4 排机械键帽阵列
    const keyRows = 4;
    const keyCols = 8;
    const kw = 2.4;
    const kh = 1.9;
    const gapX = 0.8;
    const gapY = 0.8;
    const startKx = -kbW / 2 + 1.2;
    const startKy = -kbH / 2 + 1;

    for (let r = 0; r < keyRows; r++) {
        for (let c = 0; c < keyCols; c++) {
            if (r === 3 && (c >= 2 && c <= 5)) continue; // 空格键留空
            const kx = startKx + c * (kw + gapX);
            const ky = startKy + r * (kh + gapY);
            ctx.fillStyle = "#052e24";
            ctx.fillRect(kx, ky, kw, kh);
            ctx.fillStyle = (r === 0 && c === 0) ? "#ef4444" : "#34d399";
            ctx.fillRect(kx + 0.5, ky + 0.4, kw - 1, kh - 0.8);
        }
    }
    // 特别绘制长条空格键
    const spaceX = startKx + 2 * (kw + gapX);
    const spaceY = startKy + 3 * (kh + gapY);
    const spaceW = 4 * kw + 3 * gapX;
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(spaceX, spaceY, spaceW, kh);
    ctx.fillStyle = "#6ee7b7";
    ctx.fillRect(spaceX + 1, spaceY + 0.4, spaceW - 2, kh - 0.8);

    // 键盘下方集成高精度触控板/定位轨迹球模块
    ctx.fillStyle = "#041d16";
    ctx.fillRect(-6, kbH / 2 + 2, 12, 4);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 0.7;
    ctx.strokeRect(-6, kbH / 2 + 2, 12, 4);
    // 轨迹发光中线
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(-2, kbH / 2 + 3.5, 4, 1);
    ctx.restore();

    // --- 4. 左右两侧各有几排控制按钮 ("左右两侧各有几排控制按钮") ---
    // 4A. 左侧操作翼 (Left Wing Controls: 3 Rows of Push Switches, Rockers, Safety Toggles)
    ctx.save();
    const lAngle = -26 * Math.PI / 180;
    ctx.translate(Math.sin(lAngle) * 75, -Math.cos(lAngle) * 75);
    ctx.rotate(lAngle);

    // 控制板底座
    ctx.fillStyle = "#021a14";
    ctx.fillRect(-12, -12, 24, 24);
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1;
    ctx.strokeRect(-12, -12, 24, 24);

    // 第一排: 4 枚方型带背光指令按钮 (Row 1)
    const btnColors1 = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444"];
    for (let i = 0; i < 4; i++) {
        const bx = -9 + i * 5;
        const by = -8;
        ctx.fillStyle = "#03120e";
        ctx.fillRect(bx, by, 3.8, 3.8);
        ctx.fillStyle = btnColors1[i];
        ctx.fillRect(bx + 0.6, by + 0.6, 2.6, 2.6);
    }

    // 第二排: 4 枚长条型联动翘板开关 (Row 2)
    for (let i = 0; i < 4; i++) {
        const bx = -9 + i * 5;
        const by = -1;
        ctx.fillStyle = "#03120e";
        ctx.fillRect(bx, by, 3.8, 4.5);
        ctx.fillStyle = (i % 2 === 0) ? "#047857" : "#0f766e";
        ctx.fillRect(bx + 0.5, by + 0.5, 2.8, 3.5);
        // 状态指示灯
        ctx.fillStyle = (Math.sin(time * 4 + i) > 0) ? "#34d399" : "#022c22";
        ctx.beginPath(); ctx.arc(bx + 1.9, by + 1.5, 0.6, 0, Math.PI * 2); ctx.fill();
    }

    // 第三排: 3 枚带安全护盖的拨动开关 (Row 3: Heavy Guarded Toggle Switches)
    for (let i = 0; i < 3; i++) {
        const bx = -7.5 + i * 6.5;
        const by = 6.5;
        // 金属护盖座
        ctx.fillStyle = "#064e3b";
        ctx.fillRect(bx - 1.5, by - 1.5, 4, 4);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 0.6;
        ctx.strokeRect(bx - 1.5, by - 1.5, 4, 4);
        // 金属拨杆
        ctx.strokeStyle = "#f3f4f6";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bx + 0.5, by + 1.5);
        ctx.lineTo(bx + 0.5, by - 2);
        ctx.stroke();
    }
    ctx.restore();

    // 4B. 右侧操作翼 (Right Wing Controls: Linear Sliders, Rotary Dials, Key Matrix, Emergency Stop)
    ctx.save();
    const rAngle = 26 * Math.PI / 180;
    ctx.translate(Math.sin(rAngle) * 75, -Math.cos(rAngle) * 75);
    ctx.rotate(rAngle);

    // 控制板底座
    ctx.fillStyle = "#021a14";
    ctx.fillRect(-12, -12, 24, 24);
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1;
    ctx.strokeRect(-12, -12, 24, 24);

    // 第一排: 双线性电位器推子 (Dual Linear Sliders)
    [-7, -2].forEach((sx, sidx) => {
        // 滑轨槽
        ctx.fillStyle = "#020f0b";
        ctx.fillRect(sx, -9, 2.2, 11);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sx, -9, 2.2, 11);
        // 刻度线
        ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
        ctx.lineWidth = 0.5;
        for (let ty = -8; ty <= 1; ty += 2) {
            ctx.beginPath(); ctx.moveTo(sx - 1.5, ty); ctx.lineTo(sx - 0.3, ty); ctx.stroke();
        }
        // 滑块手柄
        const faderY = -7 + (sidx === 0 ? 3 : 5.5);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(sx - 1, faderY, 4.2, 2.2);
        ctx.fillStyle = "#e0f2fe";
        ctx.fillRect(sx, faderY + 0.7, 2.2, 0.8);
    });

    // 旋钮组: 2 个高精密旋转编码器旋钮 (Rotary Knurled Dials)
    [4, 9].forEach((dx, didx) => {
        const dy = -4;
        ctx.fillStyle = "#03120e";
        ctx.beginPath(); ctx.arc(dx, dy, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // 旋钮刻度指示指针
        const pointerRad = (time * 1.5 + didx * 2) % (Math.PI * 2);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx + Math.cos(pointerRad) * 2.8, dy + Math.sin(pointerRad) * 2.8);
        ctx.stroke();
    });

    // 第二排: 4 枚战术微动矩阵按键 (Tactical Microswitch Matrix)
    for (let c = 0; c < 2; c++) {
        for (let r = 0; r < 2; r++) {
            const bx = -8 + c * 5;
            const by = 4 + r * 3.8;
            ctx.fillStyle = (r === 0 ? "#10b981" : "#f59e0b");
            ctx.fillRect(bx, by, 3.5, 2.6);
            ctx.strokeStyle = "#022c22";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(bx, by, 3.5, 2.6);
        }
    }

    // 第三排: 大型带黄黑警示环的红色紧急制动主控按钮 (Guarded E-STOP Actuator Button)
    const eX = 6;
    const eY = 5.5;
    // 黄黑相间安全防护座圈
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(eX, eY, 4.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.beginPath(); ctx.arc(eX, eY, 4.8, 0, Math.PI * 0.5); ctx.lineTo(eX, eY); ctx.fill();
    ctx.beginPath(); ctx.arc(eX, eY, 4.8, Math.PI, Math.PI * 1.5); ctx.lineTo(eX, eY); ctx.fill();
    // 红色蘑菇头紧急按钮
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(eX, eY, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fee2e2";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    // --- 5. 屏幕后方中央凹槽处的操作员座椅 ("屏幕后方是键盘和座椅", 座位靠近控制台，底下黑影已删除) ---
    ctx.save();
    const seatY = -22; // 贴近内凹扇形弧操作工位，无缝就坐
    ctx.translate(0, seatY);

    // 5A. 五星万向轮金属底座 (5-Star Swivel Caster Base)
    ctx.strokeStyle = "#042018";
    ctx.lineWidth = 2.4;
    for (let arm = 0; arm < 5; arm++) {
        const starA = arm * (Math.PI * 2 / 5) - Math.PI / 2;
        const wx = Math.cos(starA) * 14;
        const wy = Math.sin(starA) * 11;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(wx, wy);
        ctx.stroke();
        // 轮子端头
        ctx.fillStyle = "#064e3b";
        ctx.beginPath(); ctx.arc(wx, wy, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    // 气压升降液压中柱
    ctx.fillStyle = "#10b981";
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();

    // 5B. 坐垫本体 (Ergonomic Bucket Seat Cushion with Stitching)
    ctx.fillStyle = "#031712";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-12, -10, 24, 18, 5); else ctx.rect(-12, -10, 24, 18);
    ctx.fill();
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 坐垫加厚层与中央双缝线
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-9, -8, 18, 14, 3); else ctx.rect(-9, -8, 18, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(0, 5);
    ctx.stroke();

    // 5C. 左右两侧带垫扶手 (Armrests)
    [-13, 11].forEach(ax => {
        ctx.fillStyle = "#02120e";
        ctx.fillRect(ax, -8, 2.6, 12);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(ax, -8, 2.6, 12);
        // 扶手软垫表面
        ctx.fillStyle = "#065f46";
        ctx.fillRect(ax + 0.4, -6, 1.8, 8);
    });

    // 5D. 人体工学高靠背与头枕 (High Backrest & Integrated Headrest)
    ctx.fillStyle = "#021a14";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-11, 3, 22, 10, 4); else ctx.rect(-11, 3, 22, 10);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 靠背腰托隆起部与头枕
    ctx.fillStyle = "#044e3b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-7, 6, 14, 5, 2.5); else ctx.rect(-7, 6, 14, 5);
    ctx.fill();
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();

    ctx.restore(); // end drawSectorWorkstation
}

// ===== 动态元素独立绘制 (2026-11-04 动静分离优化)：仅 4 处时间动画 =====
function drawSectorWorkstationDynamic(ctx, cx, cy, angle = 0, scale = 1.0) {
    const time = Date.now() * 0.001;
    const R_scr_out = 110, R_scr_in = 94;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    if (scale !== 1.0) ctx.scale(scale, scale);

    // 1. 中央屏幕雷达扫描线
    {
        const midR = (R_scr_out + R_scr_in) / 2;
        ctx.save();
        ctx.translate(0, -midR);
        const sweepA = (time * 2.5) % (Math.PI * 2);
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sweepA) * 7.5, Math.sin(sweepA) * 7.5);
        ctx.stroke();
        ctx.restore();
    }

    // 2. 左侧屏幕频谱柱
    {
        const midDeg = -22, midRad = midDeg * Math.PI / 180;
        const midR = (R_scr_out + R_scr_in) / 2;
        ctx.save();
        ctx.translate(Math.sin(midRad) * midR, -Math.cos(midRad) * midR);
        ctx.rotate(midRad);
        for (let b = 0; b < 7; b++) {
            const bx = -10 + b * 3.2;
            const hVal = 3 + Math.abs(Math.sin(time * 3 + b * 0.9)) * 8;
            ctx.fillStyle = b === 5 ? "#f59e0b" : "#10b981";
            ctx.fillRect(bx, 4 - hVal, 2, hVal);
        }
        ctx.restore();
    }

    // 3. 左侧操作翼指示灯
    {
        const lAngle = -26 * Math.PI / 180;
        ctx.save();
        ctx.translate(Math.sin(lAngle) * 75, -Math.cos(lAngle) * 75);
        ctx.rotate(lAngle);
        for (let i = 0; i < 4; i++) {
            const bx = -9 + i * 5;
            ctx.fillStyle = (Math.sin(time * 4 + i) > 0) ? "#34d399" : "#022c22";
            ctx.beginPath(); ctx.arc(bx + 1.9, 0.5, 0.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }

    // 4. 右侧操作翼旋钮指针
    {
        const rAngle = 26 * Math.PI / 180;
        ctx.save();
        ctx.translate(Math.sin(rAngle) * 75, -Math.cos(rAngle) * 75);
        ctx.rotate(rAngle);
        [4, 9].forEach((dx, didx) => {
            const pointerRad = (time * 1.5 + didx * 2) % (Math.PI * 2);
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dx, -4);
            ctx.lineTo(dx + Math.cos(pointerRad) * 2.8, -4 + Math.sin(pointerRad) * 2.8);
            ctx.stroke();
        });
        ctx.restore();
    }

    ctx.restore();
}

// =====================================================================
// 圆形全包围控制台 (从 Level 8 移植，2026-11-04)
// =====================================================================
function drawCircularPodWorkstation(ctx, cx, cy, angle = 0, scale = 1.0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    if (scale !== 1.0) ctx.scale(scale, scale);

    const time = Date.now() * 0.001;

    // --- 几何常量 (标准正圆外壳与平直后隔板位置) ---
    const R_out = 62; // 外壳正圆半径
    const R_in = 57;  // 外壳内壁正圆半径 (外壳厚度仅 5px，释放充裕内部空间)
    const y_part = 38; // 平直隔板位于水平 y = 38
    // 在正圆 x^2 + y^2 = 72^2 上，y = 44 时：x = sqrt(72^2 - 44^2) = sqrt(5184 - 1936) = sqrt(3248) ≈ 56.99
    const x_part = 49;
    const door_hw = 16; // 中央进出门洞半宽 19px，净通道宽 38px
    const theta_r = Math.atan2(y_part, x_part);  // ~0.657 rad (37.66°)
    const theta_l = Math.atan2(y_part, -x_part); // ~2.484 rad (142.34°)

    // --- 1. 标准圆形全包围舱内地坪与科技微导轨 (Standard Circular Cabin Floor) ---
    ctx.save();
    ctx.beginPath();
    // 顺时针沿原生标准正圆弧自左后点绕过顶部圆弧至右后点
    ctx.arc(0, 0, R_in, theta_l, Math.PI * 2 + theta_r, false);
    ctx.lineTo(door_hw, y_part);
    ctx.lineTo(-door_hw, y_part);
    ctx.lineTo(-x_part, y_part);
    ctx.closePath();
    ctx.fillStyle = "#061c3a";
    ctx.fill();

    // (已删除：偏心同心圆导轨线)
    ctx.restore();

    // --- 2. 纤薄轻量化标准正圆重型装甲外壳 (Slim Standard Circular Outer Shell: 5px) ---
    ctx.save();
    // 2A. 纤薄外壳本体 (在 R_in 和 R_out 之间形成规整正圆环壁)
    ctx.beginPath();
    ctx.arc(0, 0, R_out, theta_l, Math.PI * 2 + theta_r, false);
    ctx.lineTo(x_part, y_part);
    ctx.arc(0, 0, R_in, Math.PI * 2 + theta_r, theta_l, true);
    ctx.lineTo(-x_part, y_part);
    ctx.closePath();
    const gradShell = ctx.createRadialGradient(0, 0, R_in, 0, 0, R_out);
    gradShell.addColorStop(0, "#031c15");
    gradShell.addColorStop(0.5, "#063e30");
    gradShell.addColorStop(1, "#02120e");
    ctx.fillStyle = gradShell;
    ctx.fill();
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 2B. 外壳最外沿高亮翡翠科技饰圈 (Precision Outer Ring)
    ctx.beginPath();
    ctx.arc(0, 0, R_out + 0.6, theta_l - 0.01, Math.PI * 2 + theta_r + 0.01, false);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 2C. 外壳内沿金属导轨强化线
    ctx.beginPath();
    ctx.arc(0, 0, R_in, theta_l, Math.PI * 2 + theta_r, false);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // 2D. 纤薄外壳圆周微型钛合金紧固铆钉 (均匀分布于正圆弧上)
    const totalBolts = 15;
    for (let i = 0; i < totalBolts; i++) {
        const bt = theta_l + (Math.PI * 2 + theta_r - theta_l) * (i / (totalBolts - 1));
        const bx = Math.cos(bt) * (R_out - 2.5);
        const by = Math.sin(bt) * (R_out - 2.5);
        ctx.fillStyle = "#021a14";
        ctx.beginPath(); ctx.arc(bx, by, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#34d399";
        ctx.beginPath(); ctx.arc(bx, by, 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // --- 3. 左右两侧完全顺应外壳曲线排列的操作按钮控制台台面底衬 ---
    // 左控制台弧形台板 (从 phi = -67° 至 -136°)
    const leftDeskS = -Math.PI / 2 - 136 * Math.PI / 180;
    const leftDeskE = -Math.PI / 2 - 67 * Math.PI / 180;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 56, leftDeskS, leftDeskE, false);
    ctx.arc(0, 0, 36, leftDeskE, leftDeskS, true);
    ctx.closePath();
    ctx.fillStyle = "#061c3a";
    ctx.fill();
    ctx.strokeStyle = "#075985";
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // 右控制台弧形台板 (从 phi = 67° 至 136°)
    const rightDeskS = -Math.PI / 2 + 67 * Math.PI / 180;
    const rightDeskE = -Math.PI / 2 + 136 * Math.PI / 180;
    ctx.beginPath();
    ctx.arc(0, 0, 56, rightDeskS, rightDeskE, false);
    ctx.arc(0, 0, 36, rightDeskE, rightDeskS, true);
    ctx.closePath();
    ctx.fillStyle = "#061c3a";
    ctx.fill();
    ctx.strokeStyle = "#075985";
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.restore();

    // --- 4. 前部三块连在一起的弧面大屏 ("位于座位前方 排列完全顺着圆形外壳的曲线") ---
    const R_scr_out = 57.0;
    const R_scr_in = 42.0; // 13px 宽屏高度，气势磅礴

    // 三块屏幕各自的弧度定义 (以北向 -PI/2 为中心对称，完全紧贴外壳曲线排列)
    const screens = [
        {
            name: "LEFT_MONITOR",
            startDeg: -65,
            endDeg: -23,
            midDeg: -44,
            hudType: "reactor"
        },
        {
            name: "CENTER_MONITOR",
            startDeg: -20,
            endDeg: 20,
            midDeg: 0,
            hudType: "radar"
        },
        {
            name: "RIGHT_MONITOR",
            startDeg: 23,
            endDeg: 65,
            midDeg: 44,
            hudType: "defense"
        }
    ];

    screens.forEach(scr => {
        const sRad = -Math.PI / 2 + scr.startDeg * Math.PI / 180;
        const eRad = -Math.PI / 2 + scr.endDeg * Math.PI / 180;
        const midRad = scr.midDeg * Math.PI / 180;

        ctx.save();
        // 4A. 屏幕外壳加固边框 (Screen Heavy Bezel)
        ctx.beginPath();
        ctx.arc(0, 0, R_scr_out + 0.8, sRad - 0.015, eRad + 0.015, false);
        ctx.arc(0, 0, R_scr_in - 0.8, eRad + 0.015, sRad - 0.015, true);
        ctx.closePath();
        ctx.fillStyle = "#061c3a";
        ctx.fill();
        ctx.strokeStyle = "#00E5FF";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 4B. 屏幕活跃显示表面 (Active Phosphor Glass Surface)
        ctx.beginPath();
        ctx.arc(0, 0, R_scr_out, sRad, eRad, false);
        ctx.arc(0, 0, R_scr_in, eRad, sRad, true);
        ctx.closePath();
        const gradScr = ctx.createRadialGradient(0, 0, R_scr_in, 0, 0, R_scr_out);
        gradScr.addColorStop(0, "#061c3a");
        gradScr.addColorStop(0.65, "#0b355c");
        gradScr.addColorStop(1, "#033d2f");
        ctx.fillStyle = gradScr;
        ctx.fill();
        ctx.strokeStyle = "#00CCFF";
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // 4C. 同心同弧度扫描线 (Concentric Scanlines strictly fitting curve)
        ctx.strokeStyle = "rgba(0, 229, 255, 0.22)";
        ctx.lineWidth = 0.7;
        for (let r = R_scr_in + 2; r < R_scr_out - 1.0; r += 2.4) {
            ctx.beginPath();
            ctx.arc(0, 0, r, sRad + 0.02, eRad - 0.02, false);
            ctx.stroke();
        }

        // 4D. 屏幕内部高精切向 HUD 渲染
        const midR = (R_scr_out + R_scr_in) / 2;
        const smx = Math.sin(midRad) * midR;
        const smy = -Math.cos(midRad) * midR;

        ctx.save();
        ctx.translate(smx, smy);
        ctx.rotate(midRad);

        if (scr.hudType === "radar") {
            // === 正中大屏: 战术全景扫描雷达 (Facing Seat Directly) ===
            ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.arc(0, 0, 4.2, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, 2.0, 0, Math.PI * 2); ctx.stroke();

            // 雷达旋转扫描波束
            const sweepA = (time * 2.5) % (Math.PI * 2);
            ctx.strokeStyle = "#00CCFF";
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sweepA) * 4.6, Math.sin(sweepA) * 4.6);
            ctx.stroke();

            // 动态敌我识别目标光点
            if (Math.sin(time * 3) > 0) {
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(-2.8, -2.2, 1.2, 1.2);
            }
            ctx.fillStyle = "#00E5FF";
            ctx.fillRect(2.4, 1.6, 1.0, 1.0);

            // 屏幕顶部科技标示
            ctx.font = "bold 3.2px monospace";
            ctx.fillStyle = "#7dd3fc";
            ctx.textAlign = "center";
            ctx.fillText("TACTICAL RADAR", 0, -3.6);

            // 屏幕底部状态与锁定标记
            ctx.font = "bold 2.8px monospace";
            ctx.fillStyle = "#38bdf8";
            ctx.fillText("LOCK: ENGAGED", 0, 4.6);

        } else if (scr.hudType === "reactor") {
            // === 左侧大屏: 反应堆动力流与能量示波波形 ===
            ctx.font = "bold 3.0px monospace";
            ctx.fillStyle = "#00CCFF";
            ctx.textAlign = "center";
            ctx.fillText("REACTOR TELEM", 0, -3.6);

            // 动态实时正弦能量波形
            ctx.strokeStyle = "#00E5FF";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            for (let px = -12; px <= 12; px += 1.2) {
                const py = Math.sin(time * 4.8 + px * 0.45) * 2.0;
                if (px === -12) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // 4 阶梯动力输出指示条
            const powerBars = [1, 1, 1, Math.sin(time * 2) > 0 ? 1 : 0];
            const pColors = ["#00E5FF", "#00CCFF", "#38bdf8", "#f59e0b"];
            for (let b = 0; b < 4; b++) {
                ctx.fillStyle = powerBars[b] ? pColors[b] : "#0b355c";
                ctx.fillRect(-9 + b * 4.6, 3.4, 3.6, 1.4);
            }

        } else if (scr.hudType === "defense") {
            // === 右侧大屏: 防护力场频谱与加密通信矩阵 ===
            ctx.font = "bold 3.0px monospace";
            ctx.fillStyle = "#38bdf8";
            ctx.textAlign = "center";
            ctx.fillText("SHIELD MATRIX", 0, -3.6);

            // 6 段跳动脉冲均衡柱
            const freqVals = [0.85, 0.45, 0.95, 0.65, 0.8, 0.55];
            for (let f = 0; f < 6; f++) {
                const fh = 1.4 + Math.abs(Math.sin(time * 3.8 + f * 1.2)) * 3.4 * freqVals[f];
                ctx.fillStyle = "#0284c7";
                ctx.fillRect(-10 + f * 3.4, 2.8 - fh, 2.4, fh);
            }

            // 底部防御状态
            ctx.font = "bold 2.8px monospace";
            ctx.fillStyle = "#00E5FF";
            ctx.fillText("SHIELD: 100%", 0, 4.6);
        }

        ctx.restore(); // end local screen content
        ctx.restore(); // end screen clip/stroke
    });

    // 4E. 屏幕间一体化钛合金连接锁扣 ("三块连在一起的屏幕")
    [-21.5 * Math.PI / 180, 21.5 * Math.PI / 180].forEach(jTheta => {
        const jx = Math.sin(jTheta) * ((R_scr_out + R_scr_in) / 2);
        const jy = -Math.cos(jTheta) * ((R_scr_out + R_scr_in) / 2);
        ctx.save();
        ctx.translate(jx, jy);
        ctx.rotate(jTheta);
        ctx.fillStyle = "#0b355c";
        ctx.fillRect(-2.0, -7, 4.0, 14);
        ctx.strokeStyle = "#00CCFF";
        ctx.lineWidth = 1.0;
        ctx.strokeRect(-2.0, -7, 4.0, 14);
        // 连接螺栓
        ctx.fillStyle = "#00E5FF";
        ctx.beginPath(); ctx.arc(0, -4, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 4, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    });

    // 4F. 屏幕表面晶体高光斜向弧反光 (Curved Screen Glare Sheen)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R_scr_out - 1, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9, false);
    ctx.arc(0, 0, R_scr_out - 4, -Math.PI / 2 + 0.9, -Math.PI / 2 - 0.9, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.fill();
    ctx.restore();

    // --- 5. 左右两侧完全顺应圆弧曲线排列的控制按钮 ("左右两侧的按钮也要顺着他的曲线排列") ---
    // 5A. 左侧操作翼: 顺应圆形曲率的三排弧形按键组
    // 外弧排 (Radius 62): 5 枚顺弧排列的带背光方形指令按键
    const leftBtnsAngles = [-75, -89, -103, -117, -131];
    const leftBtnColors = ["#00E5FF", "#0284c7", "#f59e0b", "#ef4444", "#38bdf8"];
    leftBtnsAngles.forEach((deg, idx) => {
        const aRad = deg * Math.PI / 180;
        ctx.save();
        ctx.rotate(aRad);
        ctx.translate(0, -52);
    ctx.scale(1.2, 1.2); // 沿法线定位到半径 62
        // 按键底座与键帽
        ctx.fillStyle = "#061c3a";
        ctx.fillRect(-2.4, -2.4, 4.8, 4.8);
        ctx.strokeStyle = "#075985";
        ctx.lineWidth = 0.6;
        ctx.strokeRect(-2.4, -2.4, 4.8, 4.8);
        ctx.fillStyle = leftBtnColors[idx];
        ctx.fillRect(-1.7, -1.7, 3.4, 3.4);
        ctx.restore();
    });

    // 中弧排 (Radius 54): 4 枚顺弧排列的翘板开关 (带脉冲指示灯)
    const leftRockersAngles = [-81, -96, -111, -125];
    leftRockersAngles.forEach((deg, idx) => {
        const aRad = deg * Math.PI / 180;
        ctx.save();
        ctx.rotate(aRad);
        ctx.translate(0, -47);
    ctx.scale(1.2, 1.2);
        ctx.fillStyle = "#061c3a";
        ctx.fillRect(-2.2, -2.8, 4.4, 5.6);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-2.2, -2.8, 4.4, 5.6);
        ctx.fillStyle = (idx % 2 === 0) ? "#075985" : "#0f766e";
        ctx.fillRect(-1.6, -2.2, 3.2, 4.4);
        // 状态微灯
        ctx.fillStyle = (Math.sin(time * 4 + idx) > 0) ? "#00CCFF" : "#0b355c";
        ctx.beginPath(); ctx.arc(0, -1.0, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    });

    // 内弧排 (Radius 46): 3 枚顺弧排列的带安全护盖重型拨动开关
    const leftTogglesAngles = [-88, -104, -120];
    leftTogglesAngles.forEach((deg) => {
        const aRad = deg * Math.PI / 180;
        ctx.save();
        ctx.rotate(aRad);
        ctx.translate(0, -41);
    ctx.scale(1.2, 1.2);
        ctx.fillStyle = "#064e3b";
        ctx.fillRect(-1.6, -1.6, 3.2, 3.2);
        ctx.strokeStyle = "#00E5FF";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-1.6, -1.6, 3.2, 3.2);
        // 金属拨杆
        ctx.strokeStyle = "#f3f4f6";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, 1.2); ctx.lineTo(0, -1.8);
        ctx.stroke();
        ctx.restore();
    });

    // 5B. 右侧操作翼: 顺应圆形曲率的三排弧形按键组
    // 外弧排 (Radius 62): 顺弧双线性推子电位器与双旋转编码器旋钮
    // 弧形推子滑轨 1 (deg 75 到 89)
    ctx.save();
    const fader1S = -Math.PI / 2 + 74 * Math.PI / 180;
    const fader1E = -Math.PI / 2 + 88 * Math.PI / 180;
    ctx.beginPath(); ctx.arc(0, 0, 62, fader1S, fader1E, false);
    ctx.strokeStyle = "#061c3a"; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = "#064e3b"; ctx.lineWidth = 0.6; ctx.stroke();
    // 推子滑块 (deg 81)
    ctx.rotate(81 * Math.PI / 180);
    ctx.translate(0, -52);
    ctx.scale(1.2, 1.2);
    ctx.fillStyle = "#00E5FF"; ctx.fillRect(-1.6, -2.4, 3.2, 4.8);
    ctx.fillStyle = "#e0f2fe"; ctx.fillRect(-0.8, -1.4, 1.6, 2.8);
    ctx.restore();

    // 弧形推子滑轨 2 (deg 93 到 107)
    ctx.save();
    const fader2S = -Math.PI / 2 + 93 * Math.PI / 180;
    const fader2E = -Math.PI / 2 + 107 * Math.PI / 180;
    ctx.beginPath(); ctx.arc(0, 0, 62, fader2S, fader2E, false);
    ctx.strokeStyle = "#061c3a"; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = "#064e3b"; ctx.lineWidth = 0.6; ctx.stroke();
    // 推子滑块 (deg 101)
    ctx.rotate(101 * Math.PI / 180);
    ctx.translate(0, -52);
    ctx.scale(1.2, 1.2);
    ctx.fillStyle = "#00E5FF"; ctx.fillRect(-1.6, -2.4, 3.2, 4.8);
    ctx.fillStyle = "#e0f2fe"; ctx.fillRect(-0.8, -1.4, 1.6, 2.8);
    ctx.restore();

    // 顺弧双高精旋钮 (deg 115 与 127)
    [115, 127].forEach((deg, idx) => {
        ctx.save();
        ctx.rotate(deg * Math.PI / 180);
        ctx.translate(0, -52);
    ctx.scale(1.2, 1.2);
        ctx.fillStyle = "#061c3a";
        ctx.beginPath(); ctx.arc(0, 0, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#00E5FF"; ctx.lineWidth = 0.7; ctx.stroke();
        // 旋钮指针
        const pRad = (time * 1.8 + idx * 2.2) % (Math.PI * 2);
        ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(pRad) * 2.4, Math.sin(pRad) * 2.4); ctx.stroke();
        ctx.restore();
    });

    // 中弧排 (Radius 54): 4 枚顺弧排列的战术微动按键
    const rightMicroAngles = [80, 94, 108, 122];
    rightMicroAngles.forEach((deg, idx) => {
        ctx.save();
        ctx.rotate(deg * Math.PI / 180);
        ctx.translate(0, -47);
    ctx.scale(1.2, 1.2);
        ctx.fillStyle = (idx % 2 === 0 ? "#00E5FF" : "#f59e0b");
        ctx.fillRect(-2.0, -1.8, 4.0, 3.6);
        ctx.strokeStyle = "#0b355c"; ctx.lineWidth = 0.5;
        ctx.strokeRect(-2.0, -1.8, 4.0, 3.6);
        ctx.restore();
    });

    // 内弧排 (Radius 46): 大型带黄黑警示圈的红色紧急制动主控按钮 (E-STOP)
    ctx.save();
    ctx.rotate(115 * Math.PI / 180);
    ctx.translate(0, -41);
    ctx.scale(1.2, 1.2);
    // 黄黑相间安全防护座圈
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(0, 0, 4.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.beginPath(); ctx.arc(0, 0, 4.4, 0, Math.PI * 0.5); ctx.lineTo(0, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 4.4, Math.PI, Math.PI * 1.5); ctx.lineTo(0, 0); ctx.fill();
    // 红色蘑菇头紧急制动按钮
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(0, 0, 3.0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fee2e2"; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.restore();

    // --- 6. 屏幕后方的机械键盘与操作员滑轮座椅 ("后方是键盘和座位", 靠近控制台，面向北方屏幕) ---
    // 6A. 机械键盘模块
    ctx.save();
    const kbY = -22;
    const kbW = 24;
    const kbH = 11;
    ctx.translate(0, kbY);
    ctx.scale(1.2, 1.2);

    // 键盘底托
    ctx.fillStyle = "#061c3a";
    ctx.fillRect(-kbW / 2 - 1.5, -kbH / 2 - 1.5, kbW + 3, kbH + 3);
    ctx.strokeStyle = "#0c4a6e";
    ctx.lineWidth = 0.9;
    ctx.strokeRect(-kbW / 2 - 1.5, -kbH / 2 - 1.5, kbW + 3, kbH + 3);

    // 机械键盘背光基板
    ctx.fillStyle = "rgba(0, 204, 255, 0.16)";
    ctx.fillRect(-kbW / 2, -kbH / 2, kbW, kbH);

    // 4 排机械键帽
    const keyRows = 4;
    const keyCols = 7;
    const kw = 2.2;
    const kh = 1.6;
    const gapX = 0.8;
    const gapY = 0.7;
    const startKx = -kbW / 2 + 1.2;
    const startKy = -kbH / 2 + 0.9;

    for (let r = 0; r < keyRows; r++) {
        for (let c = 0; c < keyCols; c++) {
            if (r === 3 && (c >= 2 && c <= 4)) continue; // 空格留空
            const kx = startKx + c * (kw + gapX);
            const ky = startKy + r * (kh + gapY);
            ctx.fillStyle = "#052e24";
            ctx.fillRect(kx, ky, kw, kh);
            ctx.fillStyle = (r === 0 && c === 0) ? "#ef4444" : "#00CCFF";
            ctx.fillRect(kx + 0.4, ky + 0.3, kw - 0.8, kh - 0.6);
        }
    }
    // 空格键
    const spaceX = startKx + 2 * (kw + gapX);
    const spaceY = startKy + 3 * (kh + gapY);
    const spaceW = 3 * kw + 2 * gapX;
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(spaceX, spaceY, spaceW, kh);
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(spaceX + 0.8, spaceY + 0.3, spaceW - 1.6, kh - 0.6);

    // 触控板
    ctx.fillStyle = "#041d16";
    ctx.fillRect(-4.5, kbH / 2 + 1.6, 9, 3.2);
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 0.6;
    ctx.strokeRect(-4.5, kbH / 2 + 1.6, 9, 3.2);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(-1.5, kbH / 2 + 2.8, 3, 0.8);
    ctx.restore();

    // 6B. 操作员滑轮座椅 (就坐于键盘后方中心，面朝前部屏幕)
    ctx.save();
    const seatY = 10;
    ctx.translate(0, seatY);
    ctx.scale(1.2, 1.2);

    // 五星万向轮金属底座
    ctx.strokeStyle = "#042018";
    ctx.lineWidth = 2.2;
    for (let arm = 0; arm < 5; arm++) {
        const starA = arm * (Math.PI * 2 / 5) - Math.PI / 2;
        const wx = Math.cos(starA) * 12;
        const wy = Math.sin(starA) * 10;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(wx, wy);
        ctx.stroke();
        ctx.fillStyle = "#064e3b";
        ctx.beginPath(); ctx.arc(wx, wy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    // 气压升降液压中柱
    ctx.fillStyle = "#00E5FF";
    ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fill();

    // 坐垫本体
    ctx.fillStyle = "#031712";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, -8, 20, 15, 4); else ctx.rect(-10, -8, 20, 15);
    ctx.fill();
    ctx.strokeStyle = "#075985";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 坐垫加厚层与中央双缝线
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, -6, 16, 11, 2.5); else ctx.rect(-8, -6, 16, 11);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, -5); ctx.lineTo(0, 4);
    ctx.stroke();

    // 左右两侧扶手
    [-11, 9].forEach(ax => {
        ctx.fillStyle = "#061c3a";
        ctx.fillRect(ax, -6, 2.4, 10);
        ctx.strokeStyle = "#00E5FF";
        ctx.lineWidth = 0.7;
        ctx.strokeRect(ax, -6, 2.4, 10);
        ctx.fillStyle = "#0c4a6e";
        ctx.fillRect(ax + 0.3, -4.5, 1.8, 7);
    });

    // 人体工学高靠背与头枕
    ctx.fillStyle = "#061c3a";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-9, 4, 18, 9, 3.5); else ctx.rect(-9, 4, 18, 9);
    ctx.fill();
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // 靠背腰托
    ctx.fillStyle = "#044e3b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-6, 6.5, 12, 4.5, 2); else ctx.rect(-6, 6.5, 12, 4.5);
    ctx.fill();
    ctx.strokeStyle = "#00CCFF";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.restore(); // end seat

    // --- 7. 座位后方蓝色玻璃质感平直隔板 ("隔板做的基本没问题 但是要改成蓝色玻璃质感的") ---
    // 【核心规范】: 隔板本身严格保持平直横线，绝非弧形！全面换装科技通透蓝玻璃质感
    ctx.save();

    // 7A. 中央门洞通道地坪导向耐磨板 (Blue Tech Walk-in Entrance Threshold)
    ctx.fillStyle = "#031726";
    ctx.fillRect(-door_hw, y_part - 2.5, door_hw * 2, 5.0);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 1.0;
    ctx.strokeRect(-door_hw, y_part - 2.5, door_hw * 2, 5.0);

    // 门洞进入导向箭头 (Blue Entry Chevron Decals: ▲ ▲ ▲)
    ctx.fillStyle = "#38bdf8";
    [-8, 0, 8].forEach(arrX => {
        ctx.beginPath();
        ctx.moveTo(arrX, y_part - 1.4);
        ctx.lineTo(arrX - 2.4, y_part + 1.4);
        ctx.lineTo(arrX + 2.4, y_part + 1.4);
        ctx.closePath();
        ctx.fill();
    });

    // 7B. 左侧平直蓝色玻璃隔板面板 (Left Straight Blue Glass Panel: x from -x_part to -door_hw, y = y_part)
    const glassThickness = 5.0;
    const lGlassW = x_part - door_hw; // 57 - 19 = 38px

    // 左侧通透纯正科技蓝玻璃本体渐变
    const gradBlueL = ctx.createLinearGradient(-x_part, y_part - glassThickness / 2, -door_hw, y_part + glassThickness / 2);
    gradBlueL.addColorStop(0, "rgba(56, 189, 248, 0.75)");  // 顶部天蓝高光边缘
    gradBlueL.addColorStop(0.25, "rgba(14, 165, 233, 0.45)"); // 清透蔚蓝主体
    gradBlueL.addColorStop(0.75, "rgba(30, 64, 175, 0.40)");  // 宝石深蓝核心
    gradBlueL.addColorStop(1, "rgba(96, 165, 250, 0.70)");   // 底部电光蓝边
    ctx.fillStyle = gradBlueL;
    ctx.fillRect(-x_part, y_part - glassThickness / 2, lGlassW, glassThickness);

    // 左隔板顶部平直蓝钛金属固定导轨 (Straight Top Blue Rail)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-x_part, y_part - glassThickness / 2);
    ctx.lineTo(-door_hw, y_part - glassThickness / 2);
    ctx.stroke();

    // 左隔板底部平直钴蓝锁止底梁 (Straight Bottom Cobalt Rail)
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-x_part, y_part + glassThickness / 2);
    ctx.lineTo(-door_hw, y_part + glassThickness / 2);
    ctx.stroke();

    // 纯平直 45 度亮白水晶镜面反光斜线 (Crisp Specular Reflection Streaks)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-48, y_part + glassThickness / 2);
    ctx.lineTo(-42, y_part - glassThickness / 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(186, 230, 253, 0.90)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-33, y_part + glassThickness / 2);
    ctx.lineTo(-27, y_part - glassThickness / 2);
    ctx.stroke();

    // 内部平直蓝色激光防撞指示中线 (Internal Blue Refraction Line)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-x_part, y_part);
    ctx.lineTo(-door_hw, y_part);
    ctx.stroke();

    // 7C. 右侧平直蓝色玻璃隔板面板 (Right Straight Blue Glass Panel: x from door_hw to x_part, y = y_part)
    const rGlassW = x_part - door_hw; // 38px

    // 右侧通透纯正科技蓝玻璃本体渐变
    const gradBlueR = ctx.createLinearGradient(door_hw, y_part - glassThickness / 2, x_part, y_part + glassThickness / 2);
    gradBlueR.addColorStop(0, "rgba(56, 189, 248, 0.70)");
    gradBlueR.addColorStop(0.25, "rgba(30, 64, 175, 0.40)");
    gradBlueR.addColorStop(0.75, "rgba(14, 165, 233, 0.45)");
    gradBlueR.addColorStop(1, "rgba(96, 165, 250, 0.75)");
    ctx.fillStyle = gradBlueR;
    ctx.fillRect(door_hw, y_part - glassThickness / 2, rGlassW, glassThickness);

    // 右隔板顶部平直导轨
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(door_hw, y_part - glassThickness / 2);
    ctx.lineTo(x_part, y_part - glassThickness / 2);
    ctx.stroke();

    // 右隔板底部平直底梁
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(door_hw, y_part + glassThickness / 2);
    ctx.lineTo(x_part, y_part + glassThickness / 2);
    ctx.stroke();

    // 右隔板表面平直 45 度反光斜线
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(27, y_part + glassThickness / 2);
    ctx.lineTo(33, y_part - glassThickness / 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(186, 230, 253, 0.90)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(42, y_part + glassThickness / 2);
    ctx.lineTo(48, y_part - glassThickness / 2);
    ctx.stroke();

    // 内部平直蓝色激光防撞指示中线
    ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(door_hw, y_part);
    ctx.lineTo(x_part, y_part);
    ctx.stroke();

    // 7D. 四根重型金属圆柱立柱与蓝光安全感应器 (Four Stanchion Posts with Blue LED Rings)
    // 坐标: 外左端 (-57, 44)、门洞左立柱 (-19, 44)、门洞右立柱 (19, 44)、外右端 (57, 44)
    const stanchions = [-x_part, -door_hw, door_hw, x_part];
    stanchions.forEach((sx, idx) => {
        // 立柱金属基座
        ctx.fillStyle = "#061c3a";
        ctx.beginPath(); ctx.arc(sx, y_part, 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#1e3a8a";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 不锈钢镀铬圆芯
        ctx.fillStyle = "#93c5fd";
        ctx.beginPath(); ctx.arc(sx, y_part, 2.0, 0, Math.PI * 2); ctx.fill();

        // 门洞两侧立柱蓝色安全红外感应光圈 (Blue Optical Trip-Beam Sensor)
        if (idx === 1 || idx === 2) {
            ctx.fillStyle = (Math.sin(time * 3.5) > 0) ? "#38bdf8" : "#0284c7";
            ctx.beginPath(); ctx.arc(sx, y_part, 1.0, 0, Math.PI * 2); ctx.fill();
        }
    });

    ctx.restore(); // end blue straight glass partition

    ctx.restore(); // end drawCircularPodWorkstation
}

function getCircularPodWorkstation(cx, cy, angle = 0, scale = 1.0, label = "CIRCULAR POD CONSOLE") {
    const boundR = 65 * scale; // 剔除框半径（比视觉略大，用于视锥剔除）
    const collR = 62 * scale; // 碰撞半径 = 视觉外壳 R_out，16边形逼近
    // 16边形碰撞多边形，贴近圆形视觉
    const points = [];
    for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        points.push({ x: cx + Math.cos(a) * collR, y: cy + Math.sin(a) * collR });
    }
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
        points: points,
        label: label,
        displayName: "CIRCULAR ENCLOSED COMMAND POD",
        noCollision: false,
        hideLabel: true,
        draw: (ctx) => {
            drawCircularPodWorkstation(ctx, cx, cy, angle, scale);
        }
    };
}




// =========================================================
// 三联方形隔间战术控制台 (从 Level 8 移植，2026-11-05)
// =========================================================
function drawTripleCubicleWorkstation(ctx, cx, cy, angle = 0, scale = 1.0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    if (scale !== 1.0) ctx.scale(scale, scale);

    const time = Date.now() * 0.001;

    // --- 几何与尺寸常量 (精确 2.2016 倍原正圆控制台，严格控制在 2.2 倍左右) ---
    // 原正圆外壳直径 124px，2.2016 倍 = 273px (轴间距 91px)
    const totalW = 273;
    const halfW = totalW / 2; // 136.5
    const bayPitch = 91;      // 每个隔间轴间距 91px (3个隔间刚好 273px)
    const bayOffsets = [-bayPitch, 0, bayPitch]; // 三个隔间中心 x 坐标: -91, 0, 91
    const partitionX = [-136.5, -45.5, 45.5, 136.5]; // 4 根隔断侧壁 x 坐标
    const partYTop = -49;                        // 隔断墙顶端 (北部前沿)
    const partYBottom = 48;                      // 隔断墙底端 (南部进出口)
    const deskYTop = -29;                        // 桌面北沿
    const deskYBottom = 5;                       // 桌面南沿 (深度 34px)

    // --- 1. 三隔间整体地坪底衬与科技防静电耐磨地席 ---
    ctx.save();
    ctx.fillStyle = "#020f0b";
    ctx.fillRect(-halfW - 2, partYTop - 2, totalW + 4, (partYBottom - partYTop) + 4);
    ctx.strokeStyle = "#064e3b";
    ctx.lineWidth = 1.0;
    ctx.strokeRect(-halfW - 2, partYTop - 2, totalW + 4, (partYBottom - partYTop) + 4);

    // 三个隔间各自的坐席地坪微导轨与边缘警示线
    bayOffsets.forEach(bx => {
        ctx.fillStyle = "#031712";
        ctx.fillRect(bx - 39.5, deskYBottom + 2, 79, partYBottom - deskYBottom - 4);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(bx - 39.5, deskYBottom + 2, 79, partYBottom - deskYBottom - 4);

        for (let gy = deskYBottom + 8; gy < partYBottom - 4; gy += 6) {
            ctx.beginPath();
            ctx.moveTo(bx - 33, gy);
            ctx.lineTo(bx + 33, gy);
            ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
            ctx.lineWidth = 0.6;
            ctx.stroke();
        }
    });
    ctx.restore();

    // --- 2. 三隔间贯通桌面底板与前部主梁框架 ---
    ctx.save();
    // 前部主梁 (Bulkhead Beam)
    ctx.fillStyle = "#01140e";
    ctx.fillRect(-halfW - 1, partYTop, totalW + 2, 6);
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-halfW - 1, partYTop, totalW + 2, 6);

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-halfW, partYTop + 3);
    ctx.lineTo(halfW, partYTop + 3);
    ctx.stroke();

    // 三隔间碳纤维军工翡翠科技台面 (Desk Counter Surface)
    bayOffsets.forEach((bx, bIdx) => {
        const deskX = bx - 43.5;
        const deskW = 87;
        const deskH = deskYBottom - deskYTop;

        const gradDesk = ctx.createLinearGradient(0, deskYTop, 0, deskYBottom);
        gradDesk.addColorStop(0, "#031d16");
        gradDesk.addColorStop(0.5, "#062b21");
        gradDesk.addColorStop(1, "#021611");
        ctx.fillStyle = gradDesk;
        ctx.fillRect(deskX, deskYTop, deskW, deskH);

        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 1.0;
        ctx.strokeRect(deskX, deskYTop, deskW, deskH);

        // 桌面南侧金属包边与微发光翡翠导光条
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(deskX, deskYBottom - 1.5, deskW, 2.5);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(deskX + 2, deskYBottom, deskW - 4, 1.0);

        // 线缆收纳孔
        [-35, 35].forEach(gx => {
            ctx.fillStyle = "#010a07";
            ctx.beginPath();
            ctx.arc(bx + gx, deskYTop + 4.5, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#064e3b";
            ctx.lineWidth = 0.6;
            ctx.stroke();
        });

        // 桌面编号
        ctx.font = "bold 3.5px monospace";
        ctx.fillStyle = "rgba(52, 211, 153, 0.4)";
        ctx.textAlign = "left";
        ctx.fillText(`TAC-BAY 0${bIdx + 1}`, deskX + 4, deskYTop + 6);
    });
    ctx.restore();

    // --- 3. 逐个隔间核心内装：每个隔间前部3连屏 + 键盘 + 左右控制按钮 + 座位 ---
    bayOffsets.forEach((bx, bIdx) => {
        ctx.save();
        ctx.translate(bx, 0);

        // 3A. 前部三个连在一起的屏幕 (Three Connected Screens side-by-side, 明显做大至 27.5 x 16.5)
        const scrW = 27.5;
        const scrH = 16.5;
        const scrY = -44.0;
        const scrConfigs = [
            { id: "L", sx: -28.0 },
            { id: "C", sx: 0 },
            { id: "R", sx: 28.0 }
        ];

        scrConfigs.forEach((scr, sIdx) => {
            const scx = scr.sx;

            // 屏幕边框
            ctx.fillStyle = "#01120d";
            ctx.fillRect(scx - scrW / 2 - 0.8, scrY - 0.8, scrW + 1.6, scrH + 1.6);
            ctx.strokeStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
            ctx.lineWidth = 1.0;
            ctx.strokeRect(scx - scrW / 2 - 0.8, scrY - 0.8, scrW + 1.6, scrH + 1.6);

            // 屏幕玻璃面
            const gradScr = ctx.createLinearGradient(scx - scrW / 2, scrY, scx + scrW / 2, scrY + scrH);
            if (bIdx === 1) {
                gradScr.addColorStop(0, "#031d2e");
                gradScr.addColorStop(0.65, "#072b3b");
                gradScr.addColorStop(1, "#021622");
            } else {
                gradScr.addColorStop(0, "#021a14");
                gradScr.addColorStop(0.65, "#042c22");
                gradScr.addColorStop(1, "#02130e");
            }
            ctx.fillStyle = gradScr;
            ctx.fillRect(scx - scrW / 2, scrY, scrW, scrH);

            ctx.strokeStyle = (bIdx === 1) ? "rgba(0, 229, 255, 0.7)" : "rgba(16, 185, 129, 0.7)";
            ctx.lineWidth = 0.6;
            ctx.strokeRect(scx - scrW / 2, scrY, scrW, scrH);

            ctx.save();
            ctx.beginPath();
            ctx.rect(scx - scrW / 2, scrY, scrW, scrH);
            ctx.clip();

            // 细密扫描线
            ctx.strokeStyle = (bIdx === 1) ? "rgba(0, 229, 255, 0.12)" : "rgba(16, 185, 129, 0.12)";
            ctx.lineWidth = 0.5;
            for (let ly = scrY + 1.5; ly < scrY + scrH; ly += 2.0) {
                ctx.beginPath();
                ctx.moveTo(scx - scrW / 2, ly);
                ctx.lineTo(scx + scrW / 2, ly);
                ctx.stroke();
            }

            // 战术 HUD
            if (bIdx === 0) {
                // 左隔间: 通信、频谱与扇区雷达
                if (sIdx === 0) {
                    for (let b = 0; b < 6; b++) {
                        const bxBar = scx - 10 + b * 3.4;
                        const hVal = 2.0 + Math.abs(Math.sin(time * 3.2 + b * 1.1)) * 7.5;
                        ctx.fillStyle = (b === 4) ? "#f59e0b" : "#10b981";
                        ctx.fillRect(bxBar, scrY + scrH - 2 - hVal, 2.2, hVal);
                    }
                    ctx.font = "bold 2.6px monospace";
                    ctx.fillStyle = "#34d399";
                    ctx.textAlign = "center";
                    ctx.fillText("SPEC-RF", scx, scrY + 3.5);
                } else if (sIdx === 1) {
                    ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
                    ctx.lineWidth = 0.7;
                    ctx.beginPath(); ctx.arc(scx, scrY + scrH / 2, 4.5, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(scx, scrY + scrH / 2, 2.2, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(scx - 5.5, scrY + scrH / 2); ctx.lineTo(scx + 5.5, scrY + scrH / 2);
                    ctx.moveTo(scx, scrY + scrH / 2 - 5.5); ctx.lineTo(scx, scrY + scrH / 2 + 5.5);
                    ctx.stroke();
                    const sw = (time * 2.8) % (Math.PI * 2);
                    ctx.strokeStyle = "#34d399";
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(scx, scrY + scrH / 2);
                    ctx.lineTo(scx + Math.cos(sw) * 4.8, scrY + scrH / 2 + Math.sin(sw) * 4.8);
                    ctx.stroke();
                    ctx.fillStyle = "#38bdf8";
                    ctx.fillRect(scx - 2.5, scrY + scrH / 2 - 2, 1.2, 1.2);
                } else {
                    ctx.font = "bold 2.6px monospace";
                    ctx.fillStyle = "#38bdf8";
                    ctx.textAlign = "center";
                    ctx.fillText("UPLINK: 99%", scx, scrY + 3.5);
                    ctx.strokeStyle = "#10b981";
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    for (let wx = -10; wx <= 10; wx += 1.5) {
                        const wy = Math.sin(time * 4.0 + wx * 0.4) * 2.2;
                        if (wx === -10) ctx.moveTo(scx + wx, scrY + scrH / 2 + 1 + wy);
                        else ctx.lineTo(scx + wx, scrY + scrH / 2 + 1 + wy);
                    }
                    ctx.stroke();
                }
            } else if (bIdx === 1) {
                // 中隔间: 反应堆核心、主控准星与防御护盾
                if (sIdx === 0) {
                    ctx.font = "bold 2.6px monospace";
                    ctx.fillStyle = "#00E5FF";
                    ctx.textAlign = "center";
                    ctx.fillText("REACTOR", scx, scrY + 3.5);
                    ctx.strokeStyle = "#38bdf8";
                    ctx.lineWidth = 0.9;
                    ctx.beginPath();
                    for (let rx = -10; rx <= 10; rx += 1.5) {
                        const ry = Math.cos(time * 5.0 + rx * 0.5) * 2.5;
                        if (rx === -10) ctx.moveTo(scx + rx, scrY + scrH / 2 + 1 + ry);
                        else ctx.lineTo(scx + rx, scrY + scrH / 2 + 1 + ry);
                    }
                    ctx.stroke();
                    ctx.fillStyle = "#10b981";
                    ctx.fillRect(scx - 8, scrY + scrH - 3.5, 4, 1.5);
                    ctx.fillRect(scx - 2, scrY + scrH - 3.5, 4, 1.5);
                    ctx.fillStyle = "#f59e0b";
                    ctx.fillRect(scx + 4, scrY + scrH - 3.5, 4, 1.5);
                } else if (sIdx === 1) {
                    ctx.strokeStyle = "#00E5FF";
                    ctx.lineWidth = 0.8;
                    ctx.strokeRect(scx - 4.5, scrY + scrH / 2 - 4, 9, 8);
                    ctx.beginPath();
                    ctx.moveTo(scx - 7, scrY + scrH / 2); ctx.lineTo(scx + 7, scrY + scrH / 2);
                    ctx.moveTo(scx, scrY + scrH / 2 - 5); ctx.lineTo(scx, scrY + scrH / 2 + 5);
                    ctx.stroke();
                    if (Math.sin(time * 4) > 0) {
                        ctx.fillStyle = "#ef4444";
                        ctx.fillRect(scx - 1.2, scrY + scrH / 2 - 1.2, 2.4, 2.4);
                    }
                    ctx.font = "bold 2.4px monospace";
                    ctx.fillStyle = "#7dd3fc";
                    ctx.textAlign = "center";
                    ctx.fillText("TARGET: LOCK", scx, scrY + scrH - 2);
                } else {
                    ctx.font = "bold 2.6px monospace";
                    ctx.fillStyle = "#38bdf8";
                    ctx.textAlign = "center";
                    ctx.fillText("SHIELD: 100%", scx, scrY + 3.5);
                    const sBars = [1, 1, 1, 1, Math.sin(time * 2.5) > 0 ? 1 : 0];
                    for (let sb = 0; sb < 5; sb++) {
                        ctx.fillStyle = sBars[sb] ? "#00E5FF" : "#0c4a6e";
                        ctx.fillRect(scx - 9 + sb * 3.8, scrY + scrH / 2, 3.0, 3.5);
                    }
                }
            } else {
                // 右隔间: 无人机、防火墙与供电
                if (sIdx === 0) {
                    ctx.strokeStyle = "#10b981";
                    ctx.lineWidth = 0.7;
                    ctx.strokeRect(scx - 6, scrY + 3.5, 12, 7);
                    ctx.fillStyle = "#34d399";
                    ctx.beginPath(); ctx.arc(scx - 3, scrY + 6, 1, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(scx + 3, scrY + 8, 1, 0, Math.PI * 2); ctx.fill();
                    ctx.font = "bold 2.4px monospace";
                    ctx.fillStyle = "#6ee7b7";
                    ctx.textAlign = "center";
                    ctx.fillText("DRONE: 02", scx, scrY + scrH - 1.5);
                } else if (sIdx === 1) {
                    ctx.font = "bold 2.6px monospace";
                    ctx.fillStyle = "#10b981";
                    ctx.textAlign = "center";
                    ctx.fillText("FIREWALL: OK", scx, scrY + 3.5);
                    for (let cxp = -8; cxp <= 8; cxp += 4) {
                        for (let cyp = scrY + 5; cyp <= scrY + scrH - 3; cyp += 2.5) {
                            ctx.fillStyle = (Math.sin(time * 4 + cxp + cyp) > 0) ? "#34d399" : "#064e3b";
                            ctx.fillRect(scx + cxp, cyp, 1.8, 1.2);
                        }
                    }
                } else {
                    ctx.font = "bold 2.6px monospace";
                    ctx.fillStyle = "#f59e0b";
                    ctx.textAlign = "center";
                    ctx.fillText("GRID: 480V", scx, scrY + 3.5);
                    ctx.strokeStyle = "#f59e0b";
                    ctx.lineWidth = 0.9;
                    ctx.beginPath();
                    ctx.arc(scx, scrY + scrH / 2 + 1.5, 3.5, Math.PI * 0.8, Math.PI * 2.2);
                    ctx.stroke();
                    const pA = Math.PI * 0.8 + Math.abs(Math.sin(time * 2.2)) * Math.PI * 1.4;
                    ctx.beginPath();
                    ctx.moveTo(scx, scrY + scrH / 2 + 1.5);
                    ctx.lineTo(scx + Math.cos(pA) * 3.2, scrY + scrH / 2 + 1.5 + Math.sin(pA) * 3.2);
                    ctx.stroke();
                }
            }

            // 玻璃斜高光
            ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
            ctx.beginPath();
            ctx.moveTo(scx - scrW / 2 + 2, scrY);
            ctx.lineTo(scx - scrW / 2 + 7, scrY);
            ctx.lineTo(scx - scrW / 2 + 1, scrY + scrH);
            ctx.lineTo(scx - scrW / 2 - 4, scrY + scrH);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });

        // 铰链连接扣
        [-14.0, 14.0].forEach(jx => {
            ctx.fillStyle = "#031d16";
            ctx.fillRect(jx - 1.5, scrY + 1, 3.0, scrH - 2);
            ctx.strokeStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
            ctx.lineWidth = 0.8;
            ctx.strokeRect(jx - 1.5, scrY + 1, 3.0, scrH - 2);
            ctx.fillStyle = "#93c5fd";
            ctx.beginPath(); ctx.arc(jx, scrY + 3.5, 0.7, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(jx, scrY + scrH - 3.5, 0.7, 0, Math.PI * 2); ctx.fill();
        });

        // 3B. 屏幕后方中央机械键盘 ("屏幕后是键盘")
        const kbY = -14.0;
        const kbW = 24.0;
        const kbH = 11.5;

        ctx.fillStyle = "#021711";
        ctx.fillRect(-kbW / 2 - 1.2, kbY - kbH / 2 - 1.2, kbW + 2.4, kbH + 2.4);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-kbW / 2 - 1.2, kbY - kbH / 2 - 1.2, kbW + 2.4, kbH + 2.4);

        ctx.fillStyle = (bIdx === 1) ? "rgba(0, 229, 255, 0.16)" : "rgba(16, 185, 129, 0.16)";
        ctx.fillRect(-kbW / 2, kbY - kbH / 2, kbW, kbH);

        const kRows = 4;
        const kCols = 7;
        const kw = 2.2;
        const kh = 1.7;
        const gx = 0.8;
        const gy = 0.7;
        const startKx = -kbW / 2 + 1.2;
        const startKy = kbY - kbH / 2 + 0.9;

        for (let r = 0; r < kRows; r++) {
            for (let c = 0; c < kCols; c++) {
                if (r === 3 && (c >= 2 && c <= 4)) continue;
                const kx = startKx + c * (kw + gx);
                const ky = startKy + r * (kh + gy);
                ctx.fillStyle = "#031c15";
                ctx.fillRect(kx, ky, kw, kh);
                ctx.fillStyle = (r === 0 && c === 0) ? "#ef4444" : ((bIdx === 1) ? "#00E5FF" : "#34d399");
                ctx.fillRect(kx + 0.3, ky + 0.3, kw - 0.6, kh - 0.6);
            }
        }
        const spX = startKx + 2 * (kw + gx);
        const spY = startKy + 3 * (kh + gy);
        const spW = 3 * kw + 2 * gx;
        ctx.fillStyle = "#064e3b";
        ctx.fillRect(spX, spY, spW, kh);
        ctx.fillStyle = (bIdx === 1) ? "#7dd3fc" : "#6ee7b7";
        ctx.fillRect(spX + 0.6, spY + 0.3, spW - 1.2, kh - 0.6);

        ctx.fillStyle = "#02120e";
        ctx.fillRect(-4.5, kbY + kbH / 2 + 1.5, 9.0, 3.0);
        ctx.strokeStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-4.5, kbY + kbH / 2 + 1.5, 9.0, 3.0);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(-1.5, kbY + kbH / 2 + 2.6, 3.0, 0.8);

        // 3C. 键盘左右两侧的多排控制按钮 ("键盘左右两侧有按钮")
        // 左侧操作面板
        const lpX = -27.0;
        const lpY = -13.0;
        const lpW = 19.0;
        const lpH = 20.0;

        ctx.fillStyle = "#021711";
        ctx.fillRect(lpX - lpW / 2, lpY - lpH / 2, lpW, lpH);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 0.9;
        ctx.strokeRect(lpX - lpW / 2, lpY - lpH / 2, lpW, lpH);

        const lBtnColors = ["#10b981", "#06b6d4", "#f59e0b"];
        for (let i = 0; i < 3; i++) {
            const bxBtn = lpX - 6.5 + i * 5.0;
            const byBtn = lpY - 7.0;
            ctx.fillStyle = "#01120d";
            ctx.fillRect(bxBtn, byBtn, 3.6, 3.6);
            ctx.fillStyle = lBtnColors[i];
            ctx.fillRect(bxBtn + 0.5, byBtn + 0.5, 2.6, 2.6);
        }

        for (let i = 0; i < 3; i++) {
            const rxBtn = lpX - 6.5 + i * 5.0;
            const ryBtn = lpY - 1.0;
            ctx.fillStyle = "#01120d";
            ctx.fillRect(rxBtn, ryBtn, 3.6, 4.2);
            ctx.strokeStyle = "#047857";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(rxBtn, ryBtn, 3.6, 4.2);
            ctx.fillStyle = (i % 2 === 0) ? "#075985" : "#047857";
            ctx.fillRect(rxBtn + 0.4, ryBtn + 0.4, 2.8, 3.4);
            ctx.fillStyle = (Math.sin(time * 4.0 + i + bIdx) > 0) ? "#34d399" : "#022c22";
            ctx.beginPath(); ctx.arc(rxBtn + 1.8, ryBtn + 1.2, 0.6, 0, Math.PI * 2); ctx.fill();
        }

        [-4, 4].forEach(tx => {
            const tbx = lpX + tx;
            const tby = lpY + 5.5;
            ctx.fillStyle = "#064e3b";
            ctx.fillRect(tbx - 1.5, tby - 1.5, 3.0, 3.0);
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(tbx - 1.5, tby - 1.5, 3.0, 3.0);
            ctx.strokeStyle = "#f3f4f6";
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(tbx, tby + 1.2);
            ctx.lineTo(tbx, tby - 1.8);
            ctx.stroke();
        });

        // 右侧操作面板
        const rpX = 27.0;
        const rpY = -13.0;
        const rpW = 19.0;
        const rpH = 20.0;

        ctx.fillStyle = "#021711";
        ctx.fillRect(rpX - rpW / 2, rpY - rpH / 2, rpW, rpH);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 0.9;
        ctx.strokeRect(rpX - rpW / 2, rpY - rpH / 2, rpW, rpH);

        [-5.5, -1.0].forEach((fx, fIdx) => {
            const fxPos = rpX + fx;
            ctx.fillStyle = "#010e09";
            ctx.fillRect(fxPos - 0.9, rpY - 7.5, 1.8, 9.0);
            ctx.strokeStyle = "#064e3b";
            ctx.lineWidth = 0.4;
            ctx.strokeRect(fxPos - 0.9, rpY - 7.5, 1.8, 9.0);
            const fyPos = rpY - 6.0 + (fIdx === 0 ? 3.0 : 5.0);
            ctx.fillStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
            ctx.fillRect(fxPos - 1.5, fyPos, 3.0, 1.8);
            ctx.fillStyle = "#e0f2fe";
            ctx.fillRect(fxPos - 0.7, fyPos + 0.5, 1.4, 0.8);
        });

        const dialX = rpX + 5.0;
        const dialY = rpY - 3.0;
        ctx.fillStyle = "#01120d";
        ctx.beginPath(); ctx.arc(dialX, dialY, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
        ctx.lineWidth = 0.7;
        ctx.stroke();
        const dialA = (time * 1.5 + bIdx) % (Math.PI * 2);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(dialX, dialY);
        ctx.lineTo(dialX + Math.cos(dialA) * 2.4, dialY + Math.sin(dialA) * 2.4);
        ctx.stroke();

        for (let mc = 0; mc < 2; mc++) {
            for (let mr = 0; mr < 2; mr++) {
                const mxPos = rpX - 6.0 + mc * 4.0;
                const myPos = rpY + 3.0 + mr * 3.0;
                ctx.fillStyle = (mr === 0) ? "#10b981" : "#f59e0b";
                ctx.fillRect(mxPos, myPos, 2.8, 2.0);
                ctx.strokeStyle = "#01120d";
                ctx.lineWidth = 0.4;
                ctx.strokeRect(mxPos, myPos, 2.8, 2.0);
            }
        }

        const estopX = rpX + 4.8;
        const estopY = rpY + 4.8;
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath(); ctx.arc(estopX, estopY, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.beginPath(); ctx.arc(estopX, estopY, 3.6, 0, Math.PI * 0.5); ctx.lineTo(estopX, estopY); ctx.fill();
        ctx.beginPath(); ctx.arc(estopX, estopY, 3.6, Math.PI, Math.PI * 1.5); ctx.lineTo(estopX, estopY); ctx.fill();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(estopX, estopY, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#fee2e2";
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // 3D. 再后方中央的操作员座椅 ("座椅跟其他控制台的座椅大小相同即可")
        const seatY = 24.0;
        ctx.save();
        ctx.translate(0, seatY);
        ctx.scale(1.2, 1.2); // 放大20%，与圆形舱座椅一致

        // 五星万向轮金属底座 (5-Star Swivel Base, 尺寸与其他控制台座椅严格相同)
        ctx.strokeStyle = "#042018";
        ctx.lineWidth = 1.8;
        for (let arm = 0; arm < 5; arm++) {
            const starA = arm * (Math.PI * 2 / 5) - Math.PI / 2;
            const wx = Math.cos(starA) * 11.0;
            const wy = Math.sin(starA) * 9.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(wx, wy);
            ctx.stroke();
            // 滚轮
            ctx.fillStyle = "#064e3b";
            ctx.beginPath(); ctx.arc(wx, wy, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        // 液压升降中柱
        ctx.fillStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
        ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fill();

        // 坐垫本体 (与其他控制台座椅尺寸严格一致: 宽 20px, 深 15px)
        ctx.fillStyle = "#031712";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-10.0, -8.0, 20.0, 15.0, 4.0); else ctx.rect(-10.0, -8.0, 20.0, 15.0);
        ctx.fill();
        ctx.strokeStyle = (bIdx === 1) ? "#0284c7" : "#047857";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // 坐垫加厚层与中央双缝线 (与圆形控制台座椅一致: 宽 16px, 深 11px)
        ctx.fillStyle = "#064e3b";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-8.0, -6.0, 16.0, 11.0, 2.5); else ctx.rect(-8.0, -6.0, 16.0, 11.0);
        ctx.fill();
        ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -5.0); ctx.lineTo(0, 4.0);
        ctx.stroke();

        // 左右两侧扶手 (外跨间距 22.4px，与圆形控制台座椅严格一致)
        [-11.0, 9.0].forEach(ax => {
            ctx.fillStyle = "#061c3a";
            ctx.fillRect(ax, -6.0, 2.4, 10.0);
            ctx.strokeStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
            ctx.lineWidth = 0.7;
            ctx.strokeRect(ax, -6.0, 2.4, 10.0);
            ctx.fillStyle = (bIdx === 1) ? "#0c4a6e" : "#065f46";
            ctx.fillRect(ax + 0.3, -4.5, 1.8, 7.0);
        });

        // 人体工学靠背 (与圆形控制台座椅严格一致: 宽 18px, 高 9px)
        ctx.fillStyle = "#061c3a";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-9.0, 4.0, 18.0, 9.0, 3.5); else ctx.rect(-9.0, 4.0, 18.0, 9.0);
        ctx.fill();
        ctx.strokeStyle = (bIdx === 1) ? "#00E5FF" : "#10b981";
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // 靠背腰托 (与圆形控制台座椅严格一致: 宽 12px, 高 4.5px)
        ctx.fillStyle = "#044e3b";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-6.0, 6.5, 12.0, 4.5, 2.0); else ctx.rect(-6.0, 6.5, 12.0, 4.5);
        ctx.fill();
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 0.7;
        ctx.stroke();

        ctx.restore(); // end seat

        ctx.restore(); // end bay
    });

    // --- 4. 四根纵向重型金属隔断侧壁 ("外形上相当于三个连在一起的方形隔间") ---
    partitionX.forEach((px, idx) => {
        const isOuter = (idx === 0 || idx === 3);
        const pWidth = isOuter ? 5.2 : 4.2;
        const pLeft = px - pWidth / 2;
        const pHeight = partYBottom - partYTop;

        ctx.save();
        const gradPart = ctx.createLinearGradient(pLeft, 0, pLeft + pWidth, 0);
        gradPart.addColorStop(0, "#01120c");
        gradPart.addColorStop(0.5, "#063e2f");
        gradPart.addColorStop(1, "#021610");
        ctx.fillStyle = gradPart;
        ctx.fillRect(pLeft, partYTop, pWidth, pHeight);

        ctx.strokeStyle = isOuter ? "#10b981" : "#047857";
        ctx.lineWidth = isOuter ? 1.4 : 1.0;
        ctx.strokeRect(pLeft, partYTop, pWidth, pHeight);

        ctx.strokeStyle = isOuter ? "#34d399" : "rgba(52, 211, 153, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(px, partYTop + 4);
        ctx.lineTo(px, partYBottom - 4);
        ctx.stroke();

        [partYTop, partYBottom].forEach(py => {
            ctx.fillStyle = "#021f17";
            ctx.beginPath();
            ctx.arc(px, py, isOuter ? 3.4 : 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = isOuter ? "#10b981" : "#059669";
            ctx.lineWidth = 1.0;
            ctx.stroke();

            ctx.fillStyle = (Math.sin(time * 3.0 + idx) > 0) ? "#34d399" : "#022c22";
            ctx.beginPath();
            ctx.arc(px, py, isOuter ? 1.5 : 1.1, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    });

    ctx.restore(); // end drawTripleCubicleWorkstation
}

// 生成三联方形隔间战术控制台道具对象 (完全依据手绘草稿 IMG_7697 规范制作)
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
        noCollision: false,
        hideLabel: true,
        draw: (ctx) => {
            drawTripleCubicleWorkstation(ctx, cx, cy, angle, scale);
        }
    };
}


// 生成扇形控制台的高精度物理碰撞多边形顶点及道具对象
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
            // ===== 动静分离优化 (2026-11-04)：静态预渲染 + 动态叠加 =====
            const cacheKey = '__wsCache_' + cx + '_' + cy + '_' + angle + '_' + scale;
            if (!window[cacheKey]) {
                const sz = Math.ceil(boundR * 2);
                const off = document.createElement('canvas');
                off.width = sz; off.height = sz;
                const octx = off.getContext('2d');
                octx.save();
                octx.translate(boundR, boundR);
                // 静态绘制（时间冻结在0），注意：原函数内部会 translate(cx,cy)，
                // 这里我们反向补偿，让 (cx,cy) 落在 offscreen 中心
                octx.translate(-cx, -cy);
                drawSectorWorkstation(octx, cx, cy, angle, scale, true);
                octx.restore();
                window[cacheKey] = { canvas: off, size: sz };
            }
            const c = window[cacheKey];
            ctx.drawImage(c.canvas, cx - boundR, cy - boundR);
            // 动态元素每帧叠加
            drawSectorWorkstationDynamic(ctx, cx, cy, angle, scale);
        }
    };
}

const LEVEL_LAB = {
    id: "level7_lab",
    name: "第 7 关 · 顶石科研中心",
    nameEn: "Level 07 · Apex Research Complex",
    themeColor: "#022c22",
    gridColor: "rgba(16, 185, 129, 0.22)",
    accentColor: "#10b981",
    playerStart: { x: 1600, y: 1835 },

    getMapLayout: (width, height) => {
        const cx = 1600;
        const cy = 1200; // 整张地图正中央 (3200 x 2400 之中心点)

        // =====================================================================
        // 1. 实体阻挡障碍物 (Obstacles)
        // =====================================================================
        const obstacles = [
            // A. 中间房间最上方 3 大显示屏的封闭外墙
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

            // E. 巨型眼睛外围轮廓斜外墙
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

            // F. 正中央圆台
            {
                type: 'solid',
                circle: { cx: cx, cy: cy, radius: 155 },
                innerRing: { radius: 143, width: 8 },
                label: 'CENTRAL ROUND TABLE',
                hideLabel: true
            },

            // G. 中间房间左圆柱终端 (右侧终端柱已替换为全新斜向扇形主控台)
            {
                type: 'solid',
                circle: { cx: 1350, cy: 920, radius: 35 },
                label: 'LEFT TERMINAL PILLAR',
                hideLabel: true
            },

            // H. 环绕在中央圆台四周的 4 个加长圆弧结构
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

            // I. 中间房间南侧长方形系统 (3 排 × 2 列 = 6 个长方形)
            // (圆形控制台已移至 props 数组)
            // (已删除 R1-L，替换为圆形控制台)
            // (已删除 R1-R，替换为圆形控制台)
            // (已删除 R2-L，替换为圆形控制台)
            // (已删除 R2-R，替换为圆形控制台)
            // (已删除 R3-L/R3-R，替换为三联方形隔间控制台，2026-11-05)
        ];

        // =====================================================================
        // 2. Blueprint 视觉图层 (巨型眼睛地坪 + 3 大屏幕 + 圆弧/门洞刻度)
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
                    // ===== 离屏预渲染优化 (2026-11-04)：蓝图静态内容只画一次 =====
                    const P = { x: 100, y: 400, w: 3000, h: 1650 };
                    if (!window.__l7BlueprintCache) {
                        const off = document.createElement('canvas');
                        off.width = P.w; off.height = P.h;
                        const octx = off.getContext('2d');
                        octx.save();
                        octx.translate(-P.x, -P.y);
                        ((ctx) => {
                    ctx.save();

                    // --- 1. 巨型眼睛三大房间地坪底色 ---
                    ctx.beginPath();
                    ctx.moveTo(150, 1200);      // 西端眼睛顶点
                    ctx.lineTo(1055, 470);     // 中室西北角
                    ctx.lineTo(2145, 470);     // 中室东北角
                    ctx.lineTo(3050, 1200);    // 东端眼睛顶点
                    ctx.lineTo(1896, 1960);    // 中室东南角
                    ctx.lineTo(1304, 1960);    // 中室西南角
                    ctx.closePath();
                    ctx.fillStyle = '#05100c';
                    ctx.fill();

                    // --- 2. 中间大圆形内部悬挂发光灯环 ---
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

                    // --- 4. 左右三角房间大圆弧结构 ---
                    ctx.save();
                    ctx.strokeStyle = '#10b981';

                    // 4A. 西侧三角房间大圆弧
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.moveTo(1142, 985);
                    ctx.bezierCurveTo(1010, 1070, 1010, 1330, 1215, 1415);
                    ctx.stroke();

                    // 4B. 东侧三角房间大圆弧
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.moveTo(2058, 985);
                    ctx.bezierCurveTo(2190, 1070, 2190, 1330, 1985, 1415);
                    ctx.stroke();

                    ctx.restore();

                    ctx.restore();
                
                        })(octx);
                        octx.restore();
                        window.__l7BlueprintCache = off;
                    }
                    ctx.drawImage(window.__l7BlueprintCache, P.x, P.y);
                },
            },

            // =========================================================
            // 2. 4 扇重型自动防爆装甲门 (完全实装自动感应平移门系统，窄型紧凑装甲外壳，翡翠暗绿配色)
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
            // 3. 移植自 Level 8 的全新扇形战术主控台 (置于原右圆柱 1850, 920 位置，斜 45 度朝向下方大圆台)
            // =========================================================
            getSectorWorkstation(1850, 920, -Math.PI * 0.75, 1.0, 'EAST SECTOR COMMAND CONSOLE'),
            // =========================================================
            // 4. 圆形全包围控制台 ×4 (替代 R1/R2 长方形，2026-11-04)
            // 左侧2个横排，右侧2个横排，中间过道 50px（2026-11-05 收窄，碰撞半径65）
            // 已加碰撞体积（noCollision: false）
            // =========================================================
            getCircularPodWorkstation(1370, 1548, 0, 1.0, 'L7 LEFT POD A'),
            getCircularPodWorkstation(1510, 1548, 0, 1.0, 'L7 LEFT POD B'),
            getCircularPodWorkstation(1690, 1548, 0, 1.0, 'L7 RIGHT POD A'),
            getCircularPodWorkstation(1830, 1548, 0, 1.0, 'L7 RIGHT POD B'),
            // =========================================================
            // 5. 三联方形隔间控制台 ×2 (替代 R3 长方形，2026-11-05)
            // 左右各1个横排，中间过道 60px；上移与圆形舱保持距离
            // 已加碰撞体积（noCollision: false）
            // =========================================================
            getTripleCubicleWorkstation(1430, 1675, 0, 1.0, 'L7 LEFT TRIPLE CUBICLE'),
            getTripleCubicleWorkstation(1770, 1675, 0, 1.0, 'L7 RIGHT TRIPLE CUBICLE')
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
        // 4. 寻路与视野导航路点
        // =====================================================================
        const waypoints = [
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
            { x: 1905, y: 1835 },
            { x: 950, y: 920 },
            { x: 950, y: 1835 },
            { x: 805, y: 1200 },
            { x: 665, y: 1200 },
            { x: 530, y: 1200 },
            { x: 300, y: 1200 },
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
