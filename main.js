import { CPUBench } from './cpu_bench.js';
import { MagnetometerMonitor } from './magnetometer_monitor.js';

// 初始化
const cpuBench = new CPUBench();
const magnetometer = new MagnetometerMonitor();
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const startSensorBtn = document.getElementById('startSensorBtn');
const stopSensorBtn = document.getElementById('stopSensorBtn');

// CPU测试控制
startBtn.addEventListener('click', () => {
    // 读取用户输入
    const task1 = document.getElementById('task1Input').value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const task2 = document.getElementById('task2Input').value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const taskSeq = document.getElementById('taskSeqInput').value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const atomTime = parseInt(document.getElementById('atomTimeInput').value, 10);
    const taskTotalTime = parseInt(document.getElementById('taskTotalTimeInput').value, 10);
    const totalDuration = parseInt(document.getElementById('totalDurationInput').value, 10);
    if (task1.length === 0 || task2.length === 0 || taskSeq.length === 0 || !atomTime || !taskTotalTime || !totalDuration) {
        alert('请完整输入任务1、任务2、任务序列、原子任务时间、任务总时间和总时长');
        return;
    }
    startBtn.disabled = true;
    stopBtn.disabled = false;
    //here
    cpuBench.startTest(task1, task2, taskSeq, atomTime, taskTotalTime, totalDuration);
});

stopBtn.addEventListener('click', () => {
    cpuBench.stopTest();
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

// 磁传感器控制
startSensorBtn.addEventListener('click', () => {
    startSensorBtn.disabled = true;
    stopSensorBtn.disabled = false;
    magnetometer.start();
});

stopSensorBtn.addEventListener('click', () => {
    magnetometer.stop();
    startSensorBtn.disabled = false;
    stopSensorBtn.disabled = true;
});

// 页面加载完成后自动启动磁传感器
window.addEventListener('load', () => {
    startSensorBtn.click();
});

cpuBench.setMagnetometer(magnetometer); 