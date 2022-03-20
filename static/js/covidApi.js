//truyền biến endPoint vào hàm getApiPath để lấy giá trị tổng
const covidApi = {
    getSummary: async () => {
        return await fetchRequest(covidApiEndPoints.summary());
    },
    getworldAllTimeCase: async () => {
        return await fetchRequest(covidApiEndPoints.worldAllTimeCase());
    },
    getcountryAllTimeCase: async (country, status) => {
        return await fetchRequest(covidApiEndPoints.countryAllTimeCase(country, status));
    },
    getworldDaysCase: async () => {
        return await fetchRequest(covidApiEndPoints.worldDaysCase());
    },
    getcountryDaysCase: async (country, status) => {
        return await fetchRequest(covidApiEndPoints.countryDaysCase(country, status));
    }

}
// console.log(getApiPath(covidApiEndPoints.summary()));
//tạo link fetch api
const link_covid_api = 'https://api.covid19api.com/';
// fetch api để lấy tổng số 
const covidApiEndPoints = {
    summary: () => {
        return getApiPath("summary");
    },
    worldAllTimeCase: () => {
        return getApiPath("world");
    },
    countryAllTimeCase: (country, status) => {
        let endPoint = `dayone/country/${country}/status/${status}`;
        return getApiPath(endPoint);
    },
    countryDaysCase: (country, status) => {
        let date = getDaysRange(30);
        let endPoint = `country/${country}/status/${status}?from=${date.start_date}&to=${date.end_date}`;
        return getApiPath(endPoint);
    },
    worldDaysCase: () => {
        let date = getDaysRange(30);
        let endPoint = `world?from=${date.start_date}&to=${date.end_date}`;
        return getApiPath(endPoint);
    }
};
//ley6 ngày cuối cùng
getDaysRange = (days) => {
    let d = new Date();
    let from_d = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000));
    let to_date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    let from_date = `${from_d.getFullYear()}-${from_d.getMonth() + 1}-${from_d.getDate()}`;
    return {
        start_date: from_date,
        end_date: to_date
    }
}

// tạo hàm getApiPath để tạo link fetch api
const getApiPath = (endPoint) => {
    return link_covid_api + endPoint;
}
// console.log(getApiPath("summary"));