document.addEventListener('DOMContentLoaded', function() {
    let charts = {};

    function createProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDarkMode ? '#d1d5db' : '#4b5563';
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();

        charts.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Actual Raised',
                        data: [100000, 300000, 450000, 600000, 800000, 1000000, 1250000, null, null, null, null, null],
                        borderColor: `hsl(${primaryColor})`,
                        backgroundColor: `hsl(${primaryColor} / 0.1)`,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: "Last Year's Raised",
                        data: [80000, 250000, 400000, 550000, 700000, 900000, 1100000, 1300000, 1500000, 1700000, 1900000, 2100000],
                        borderColor: '#9ca3af',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Projected',
                        data: [2500000, 2600000, 2300000, 2400000, 2450000, 2550000, 2650000, null, null, null, null, null],
                        borderColor: '#f97316', // orange-500
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Goal',
                        data: Array(12).fill(2500000),
                        borderColor: '#ef4444', // red-500
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: labelColor },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        max: 3000000,
                        ticks: {
                            stepSize: 500000,
                            callback: value => '$' + (value / 1000000) + 'M',
                            color: labelColor
                        },
                        grid: { color: gridColor }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            color: labelColor
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    function createOrganizationalGivingChart() {
        const ctx = document.getElementById('organizationalGivingChart');
        if (!ctx) return;

        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDarkMode ? '#d1d5db' : '#4b5563';
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();

        charts.organizationalGivingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'Paid',
                        data: [1250000, 1400000, 1500000],
                        backgroundColor: `hsl(${primaryColor} / 0.7)`,
                        borderRadius: 4
                    },
                    {
                        label: 'Pledge Balance',
                        data: [50000, 25000, 250000],
                        backgroundColor: '#f97316', // orange-500
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                barPercentage: 0.6,
                categoryPercentage: 0.7,
                scales: {
                    x: {
                        stacked: true,
                        ticks: { color: labelColor },
                        grid: { display: false }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 2000000,
                        ticks: {
                            stepSize: 500000,
                            callback: value => '$' + (value / 1000000) + 'M',
                            color: labelColor
                        },
                        grid: { color: gridColor }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            color: labelColor
                        }
                    }
                }
            }
        });
    }
    
    function createVolunteerImpactChart() {
        const ctx = document.getElementById('volunteerImpactChart');
        if (!ctx) return;

        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDarkMode ? '#d1d5db' : '#4b5563';

        charts.volunteerImpactChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [{
                    label: 'Impact',
                    data: [150000, 185000, 182000],
                    backgroundColor: '#f59e0b', // orange-500
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                barPercentage: 0.6,
                categoryPercentage: 0.7,
                scales: {
                    x: {
                        ticks: { color: labelColor },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        max: 200000,
                        ticks: {
                            stepSize: 50000,
                            callback: value => '$' + (value / 1000) + 'k',
                            color: labelColor
                        },
                        grid: { color: gridColor }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    createProgressChart();
    createOrganizationalGivingChart();
    createVolunteerImpactChart();
});