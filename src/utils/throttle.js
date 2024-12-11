// src/utils/throttle.js

/**
 * 节流阀函数，用于限制函数在指定时间内只能执行一次
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 节流的时间间隔（毫秒）2000=2秒
 * @returns {Function} - 返回一个新的节流函数
 */
export function throttle(func, wait) {
    let timeoutId;
    let lastExecutedTime = 0;

    return function(...args) {
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutedTime;

        if (!timeoutId && timeSinceLastExecution >= wait) {
            func.apply(this, args);
            lastExecutedTime = now;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (timeSinceLastExecution >= wait) {
                    func.apply(this, args);
                    lastExecutedTime = now;
                } else {
                    timeoutId = setTimeout(() => {
                        func.apply(this, args);
                        lastExecutedTime = now;
                    }, wait - timeSinceLastExecution);
                }
            }, wait);
        }
    };
}

// 使用案例
// 假设我们有一个按钮，点击时会触发一个异步操作
// 我们使用 throttle 来限制这个操作，使其每 2 秒只能执行一次
const button = document.getElementById('myButton');
button.addEventListener('click', throttle(async () => {
    // 这里是异步操作的代码
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
}, 2000));
