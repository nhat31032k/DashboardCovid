const fetchRequest = async (url) => {
    const response = await fetch(url);
    return response.json();
}
// console.log(fetchRequest('https://api.covid19api.com/summary'));