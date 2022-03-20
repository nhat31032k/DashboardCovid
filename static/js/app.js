// tạo biến màu 
const COLORS = {
    confirmed: '#FF0000',
    recovered: '#008000',
    deaths: '#373c43',
}

const CASE_STATUS = {
    confirmed: 'confirmed',
    recovered: 'recovered',
    deaths: 'deaths',
}

let body = document.querySelector('body');
let contries_list
let all_time_chart, days_chart, recover_rate_chart
//load data tổng số
window.onload = async () => {
    console.log('ready.....');
    initTheme();
    await initAllTimeChart();
    await initDaysChart();
    await initRecoveryChart();
    await loadData('Global');
    await loadCountrySelectList();
    document.querySelector('#country-select-toggle').onclick = () => {
        document.querySelector('#country-select-list').classList.toggle('active')
    }
}
loadData = async (country) => {
    startLoading();
    await loadSummary(country);
    await loadAllTimeChart(country);
    await loadDaysChart(country);
    // await loadRecoveryRate();
    endLoading();
}
//hiển thị loading 
startLoading = () => {
    body.classList.add('loading');
}
endLoading = () => {
    body.classList.remove('loading');
}
///
isGlobal = (country) => {
    return country === 'Global';
}
loadSummary = async (country) => {
    //trường hợp country bằng slug
    let summaryData = await covidApi.getSummary();
    let summary = summaryData.Global;
    //nếu country khác Global thì lấy summary của country
    if (!isGlobal(country)) {
        summary = summaryData.Countries.filter(e => e.slug === country)[0];
    }
    console.log(summary);
    showConfirmedTotal(summary.TotalConfirmed);
    showRecoveredTotal(summary.TotalRecovered);
    showDeathTotal(summary.TotalDeaths);
    //load recorey rate
    await loadRecoveryRate(Math.floor(summary.TotalRecovered / summary.TotalConfirmed * 100));
    //hiển thị dánh sách bảng
    let caseByCountries = summaryData.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
    let table_countries_body = document.querySelector('#table-countries tbody');
    // table_countries_body.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        let row = `
            <tr>
                <td> ${caseByCountries[i].Country} </td> 
                <td> ${numberWithCommas(caseByCountries[i].TotalConfirmed)} </td> 
                <td> ${numberWithCommas(caseByCountries[i].TotalRecovered)} </td> 
                <td> ${numberWithCommas(caseByCountries[i].TotalDeaths)}</td> 
            </tr>
        `;
        table_countries_body.insertAdjacentHTML('beforeend', row);
    }
}

//timechart
initAllTimeChart = async () => {
    let options = {
        chart: {
            type: 'bar',
        },
        // chart.type: 'bar',
        colors: [COLORS.confirmed, COLORS.recovered, COLORS.deaths],
        series: [],
        xaxis: {
            categories: [],
            labels: {
                show: false
            }
        },
        grid: {
            show: false
        },
        stroke: {
            curve: 'smooth'
        }
    }
    all_time_chart = new ApexCharts(document.querySelector('#all-time-chart'), options);
    all_time_chart.render();
}
// render du liệu ra 
renderData = (country_data) => {
    let res = [];
    country_data.forEach(e => {
        res.push(e.case);
    });
    return res;
}
renderWorldData = (world_data, status) => {
    let res = [];
    world_data.forEach(e => {
        switch (status) {
            //ley61 dữ liệu ra của từng trang thái
            case CASE_STATUS.confirmed:
                res.push(e.TotalConfirmed);
                break;
            case CASE_STATUS.recovered:
                res.push(e.TotalRecovered);
                break;
            case CASE_STATUS.deaths:
                res.push(e.TotalDeaths);
                break;
        }
    });
    return res;
}
loadAllTimeChart = async (country) => {
    let labels = [];
    let confirm_data, recovered_data, deadth_data;
    if (isGlobal(country)) {
        let world_data = await covidApi.getworldAllTimeCase();
        world_data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        world_data.forEach(e => {
            let d = new Date(e.Date);
            labels.push(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);

        });
        confirm_data = renderWorldData(world_data, CASE_STATUS.confirmed);
        recovered_data = renderWorldData(world_data, CASE_STATUS.recovered);
        deadth_data = renderWorldData(world_data, CASE_STATUS.deaths);
    } else {
        let confirmed = await covidApi.getCountryAllTimeCase(country, CASE_STATUS.confirmed);
        let recovered = await covidApi.getCountryAllTimeCase(country, CASE_STATUS.recovered);
        let deadth = await covidApi.getCountryAllTimeCase(country, CASE_STATUS.deaths);
        confirm_data = renderData(confirmed);
        recovered_data = renderData(recovered);
        deadth_data = renderData(deadth);

        confirmed.forEach(e => {
            let d = new Date(e.Date);
            labels.push(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);

        });
    }
    let series = [{

            name: 'Confirmed',
            data: confirm_data
        },
        {
            name: 'Recovered',
            data: recovered_data
        },
        {
            name: 'Deaths',
            data: deadth_data
        }
    ]
    //update trang thái 
    all_time_chart.updateOptions({
        series: series,
        xaxis: {
            categories: labels
        }
    });
}
initDaysChart = async () => {
    let options = {
        chart: {
            type: 'line',
        },
        // chart.type: 'bar',
        colors: [COLORS.confirmed, COLORS.recovered, COLORS.deaths],
        series: [],
        xaxis: {
            categories: [],
            labels: {
                show: false
            }
        },
        grid: {
            show: false
        },
        stroke: {
            curve: 'smooth'
        }
    }
    days_chart = new ApexCharts(document.querySelector('#days-chart'), options);
    days_chart.render();
};
loadDaysChart = async (country) => {
    let labels = [];
    let confirm_data, recovered_data, deadth_data;
    if (isGlobal(country)) {
        let world_data = await covidApi.getworldDaysCase();
        world_data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        world_data.forEach(e => {
            let d = new Date(e.Date);
            labels.push(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);

        });
        confirm_data = renderWorldData(world_data, CASE_STATUS.confirmed);
        recovered_data = renderWorldData(world_data, CASE_STATUS.recovered);
        deadth_data = renderWorldData(world_data, CASE_STATUS.deaths);
    } else {
        let confirmed = await covidApi.getcountryDaysCase(country, CASE_STATUS.confirmed);
        let recovered = await covidApi.getcountryDaysCase(country, CASE_STATUS.recovered);
        let deadth = await covidApi.getcountryDaysCase(country, CASE_STATUS.deaths);
        confirm_data = renderData(confirmed);
        recovered_data = renderData(recovered);
        deadth_data = renderData(deadth);

        confirmed.forEach(e => {
            let d = new Date(e.Date);
            labels.push(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);

        });
    }
    let series = [{

            name: 'Confirmed',
            data: confirm_data
        },
        {
            name: 'Recovered',
            data: recovered_data
        },
        {
            name: 'Deaths',
            data: deadth_data
        }
    ]
    //update trang thái 
    days_chart.updateOptions({
        series: series,
        xaxis: {
            categories: labels
        }
    });
}
initRecoveryChart = async () => {
    let options = {
        chart: {
            type: 'radialBar',
            height: 350
        },
        // chart.type: 'bar',
        colors: [COLORS.recovered],
        labels: ['Recovery rate'],
        series: [],
    }
    recover_rate_chart = new ApexCharts(document.querySelector('#recovered-rate-chart'), options);
    recover_rate_chart.render();
}
loadRecoveryRate = async (rate) => {
    recover_rate_chart.updateOptions([rate]);
}
//
//dùng regex để chuyển đổi số thành chuỗi có các dấu phẩy
numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//hiện data tổng số
showConfirmedTotal = (total) => {
    document.querySelector('#confirmed-total').innerText = numberWithCommas(total);
}
showRecoveredTotal = (total) => {
    document.querySelector('#recovered-total').innerText = numberWithCommas(total);
}
showDeathTotal = (total) => {
    document.querySelector('#death-total').innerText = numberWithCommas(total);
}
//dark mode
// initTheme = () => {
//     let dark_mode_switch = document.querySelector(".toggle");
//     dark_mode_switch.addEventListener('click', async function (e) {
//         console.log(e.target);
//         // e.target.classList.toggle('dark');
//         // body.classList.toggle('dark');
//     });
// }
initTheme = () => {
    let dark_mode_switch = document.querySelector('#darkmode_switch')

    dark_mode_switch.onclick = () => {
        dark_mode_switch.classList.toggle('dark')
        body.classList.toggle('dark')

        setDarkChart(body.classList.contains('dark'))
    }
}
setDarkChart = (dark) => {
    let theme = {
        theme: {
            mode: dark ? 'dark' : 'light'
        }
    }
    all_time_chart.updateOptions(theme)
    days_chart.updateOptions(theme)
    recover_rate_chart.updateOptions(theme)
}
// country select
renderCountrySelectList = (list) => {
    let country_select_list = document.querySelector('#country-select-list')
    country_select_list.querySelectorAll('div').forEach(e => e.remove())
    list.forEach(e => {
        let item = document.createElement('div')
        item.classList.add('country-item')
        item.textContent = e.Country

        item.onclick = async () => {
            document.querySelector('#country-select span').textContent = e.Country
            country_select_list.classList.toggle('active')
            await loadData(e.Slug)
        }

        country_select_list.appendChild(item)
    })
}

loadCountrySelectList = async () => {
    let summaryData = await covidApi.getSummary()

    countries_list = summaryData.Countries

    let country_select_list = document.querySelector('#country-select-list')

    let item = document.createElement('div')
    item.classList.add('country-item')
    item.textContent = 'Global'
    item.onclick = async () => {
        document.querySelector('#country-select span').textContent = 'Global'
        country_select_list.classList.toggle('active')
        await loadData('Global')
    }
    country_select_list.appendChild(item)

    renderCountrySelectList(countries_list)
}

// country filter
initContryFilter = () => {
    let input = document.querySelector('#country-select-list input')
    input.onkeyup = () => {
        let filtered = countries_list.filter(e => e.Country.toLowerCase().includes(input.value))
        renderCountrySelectList(filtered)
    }
}