'use strict';


document.addEventListener('DOMContentLoaded', () => {

    const WEATHERAPI = 'https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=bba62d55e0c797e63522a66e45c40900';
    const result = document.querySelectorAll('span');
    const btnSend = document.querySelector('.btn');
    const input = document.querySelector('.input');
    const city = document.querySelector('.city');
    const storageTime = new Date(localStorage.getItem('TimeStamp'));

    const createInfo = (elem, result) => {
        elem.innerText = result;
    };
    const init = () => {
        result[0].innerText = 'Kyiv';
        result[1].innerText = `Weather now:\n${localStorage.getItem('StatusNow')}`;
        result[2].innerText = `Temperature now:\n${localStorage.getItem('TempNow')+'\u2103'}`;
        result[3].innerText = `Weather per day:\n${localStorage.getItem('StatusPerDay')}`;
        result[4].innerText = `Min temperature:\n${localStorage.getItem('MinTemp')}\u2103`;
        result[5].innerText = `Max temperature:\n${localStorage.getItem('MaxTemp')}\u2103`;
        result[6].innerText = `Wind speed:\n${localStorage.getItem('WindSpeed')} m/s`;
        result[7].innerText = `Request was made in ${storageTime.getDate()}.${storageTime.getMonth()+1}.${storageTime.getFullYear()}\n${(storageTime.getHours()<10?'0':'') + storageTime.getHours()}:${(storageTime.getMinutes()<10?'0':'') + storageTime.getMinutes()}:${(storageTime.getSeconds()<10?'0':'') + storageTime.getSeconds()}`;
    }
    const getInput = () => {
        if (input.value) {
            city.innerText = input.value;
            console.log('have an input' + input.value)
            return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=bba62d55e0c797e63522a66e45c40900`);
        } else {
            console.log('have an else option')
            return fetch(WEATHERAPI);
        }
    }
    const sendRequest = () => {
        const timer = 1;
        const requestTimeStamp = new Date();
        if (localStorage.getItem('TimeStamp') && ((new Date() - Date.parse(localStorage.getItem('TimeStamp'))) / 3600) <= timer) {
            alert(`You're trying to send request too fast! Wait ${(timer - (new Date() - Date.parse(localStorage.getItem('TimeStamp'))) / 3600).toFixed(2)} seconds more!`)
            return
        } else {
            getInput()
                .then(response => response.json())
                .then(localStorage.setItem('TimeStamp', requestTimeStamp))
                .then(data => {
                    console.log(requestTimeStamp)
                    createInfo(result[1], (`Weather now:\n${data.weather[0].description}`));
                    localStorage.setItem('StatusNow', data.weather[0].description);
                    createInfo(result[2], ('Temperature now:\n' + (data.main.temp - 273.15).toFixed(1) + '\u2103'));
                    localStorage.setItem('TempNow', (data.main.temp - 273.15).toFixed(1));
                    createInfo(result[3], ('Weather per day:\n' + data.weather[0].main));
                    localStorage.setItem('StatusPerDay', data.weather[0].main);
                    createInfo(result[4], ('Min temperature:\n' + (data.main.temp_min - 273.15).toFixed(1) + '\u2103'));
                    localStorage.setItem('MinTemp', (data.main.temp_min - 273.15).toFixed(2));
                    createInfo(result[5], ('Max temperature:\n' + (data.main.temp_max - 273.15).toFixed(1) + '\u2103'));
                    localStorage.setItem('MaxTemp', (data.main.temp_max - 273.15).toFixed(1));
                    createInfo(result[6], (`Wind speed:\n${(data.wind.speed*3600/1000).toFixed(1)} km/h or ${data.wind.speed} m/s`));
                    localStorage.setItem('WindSpeed', data.wind.speed)
                    createInfo(result[7], (`Request was made in ${requestTimeStamp.getDate()}.${requestTimeStamp.getMonth()+1}.${requestTimeStamp.getFullYear()}\n${(requestTimeStamp.getHours()<10?'0':'') + requestTimeStamp.getHours()}:${(requestTimeStamp.getMinutes()<10?'0':'') + requestTimeStamp.getMinutes()}:${(requestTimeStamp.getSeconds()<10?'0':'') + requestTimeStamp.getSeconds()}`))
                    result[7].innerText = `Request was made in ${requestTimeStamp.getDate()}.${requestTimeStamp.getMonth()+1}.${requestTimeStamp.getFullYear()}\n${(requestTimeStamp.getHours()<10?'0':'') + requestTimeStamp.getHours()}:${(requestTimeStamp.getMinutes()<10?'0':'') + requestTimeStamp.getMinutes()}:${(requestTimeStamp.getSeconds()<10?'0':'') + requestTimeStamp.getSeconds()}`;
                })
                .catch(error => alert('Something went wrong...\n' + error));
        }
    };

    init();
    btnSend.addEventListener('click', sendRequest);
});