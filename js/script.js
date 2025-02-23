let clickCount = 0;
const initialPosition = { x: 0, y: 0 };
const confirm = document.querySelector('.Confirm');
const boi = document.querySelector('.Boi');
const btnDelete = document.querySelector('.Confirm-Body-Button_Delete');
const btnCancel = document.querySelector('.Confirm-Body-Button_Cancel');
const current = {
	happiness: 0.9,
	derp: 1,
	px: 0.5,
	py: 0.5
};
const target = { ...current };

confirm.addEventListener('mousemove', onMouseMove);
confirm.addEventListener('mouseleave', onMouseLeave);

function onMouseMove({ clientX: x, clientY: y }) {
	let dx1 = x - btnDelete.getBoundingClientRect().x - btnDelete.getBoundingClientRect().width * 0.5;
	let dy1 = y - btnDelete.getBoundingClientRect().y - btnDelete.getBoundingClientRect().height * 0.5;
	let dx2 = x - btnCancel.getBoundingClientRect().x - btnCancel.getBoundingClientRect().width * 0.5;
	let dy2 = y - btnCancel.getBoundingClientRect().y - btnCancel.getBoundingClientRect().height * 0.5;
	let px = (x - confirm.getBoundingClientRect().x) / confirm.getBoundingClientRect().width;
	let py = (y - confirm.getBoundingClientRect().y) / confirm.getBoundingClientRect().height;
	let distDelete = Math.sqrt(dx1 * dx1 + dy1 * dy1);
	let distCancel = Math.sqrt(dx2 * dx2 + dy2 * dy2);
	let happiness = Math.pow(distDelete / (distCancel + distDelete), 0.75);

	target.happiness = happiness;
	target.derp = 0;
	target.px = px;
	target.py = py;
}


// 在文件末尾添加点击事件监听
btnDelete.addEventListener('click', onReject);

// 在变量声明部分添加
const titleElement = document.querySelector('.Confirm-Body-Title');

// 修改 onReject 函数
function onReject() {
    clickCount++;
    
    // 记录初始位置
    if (clickCount === 1) {
        // 计算两个按钮的原始水平间距
        const cancelRect = btnCancel.getBoundingClientRect();
        const deleteRect = btnDelete.getBoundingClientRect();
        initialPosition.x = (cancelRect.right - deleteRect.left) + 20; // 右侧间距20px
    }

    // 处理按钮移动逻辑
    if (clickCount <= 4) {
        const shouldMove = clickCount % 2 === 1;
        btnDelete.style.transform = shouldMove 
            ? `translateX(${initialPosition.x}px)`
            : 'translateX(0)';
    } else {
        // 移动到屏幕外并隐藏
        btnDelete.style.transform = 'translate(9999px, 9999px)';
        btnDelete.style.display = 'none';
    }

    // 强制触发鼠标移动更新（保持表情同步）
    const fakeEvent = {
        clientX: btnCancel.getBoundingClientRect().x,
        clientY: btnCancel.getBoundingClientRect().y
    };
    onMouseMove(fakeEvent);

    // 更新标题文本
    if (clickCount === 2) {
        titleElement.textContent = '我们可以试着和好嘛？';
    } else if (clickCount === 4) {
        titleElement.textContent = '和好是有可能的！';
    } else if (clickCount === 5) {
        titleElement.textContent = '我们一定能和好吧！';
    }
}


function onMouseLeave() {
	target.happiness = 0.9;
	target.derp = 1;
	target.px = 0.5;
	target.py = 0.5;
}

function update() {
	for (let prop in target) {
		if (target[prop] === current[prop]) {
			continue;
		} else if (Math.abs(target[prop] - current[prop]) < 0.01) {
			current[prop] = target[prop];
		} else {
			current[prop] += (target[prop] - current[prop]) * 0.1;
		}
		boi.style.setProperty(`--${prop}`, current[prop]);
	}
	requestAnimationFrame(update);
}

// 新增点击事件监听
btnCancel.addEventListener('click', onAccept);

function onAccept() {
    // 移除鼠标事件监听
    confirm.removeEventListener('mousemove', onMouseMove);
    confirm.removeEventListener('mouseleave', onMouseLeave);
    
    // 隐藏按钮
    btnCancel.style.display = 'none';
    btnDelete.style.display = 'none';
    
    // 设置目标值为待机状态（保留动画过渡）
    Object.assign(target, {
        happiness: 0.9,
        derp: 1,
        px: 0.5,
        py: 0.5
    });
    
    // 保持 current 不变，让 update() 函数自然过渡（约0.3秒完成）
    
    // 更新标题文本
    titleElement.textContent = '我们一定能和好的！';
}


update();