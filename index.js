const http = require('http');
const readline = require('node:readline');
const { stdin: input, output } = require("node:process");
const { apiKey } = require('./config');
console.log(apiKey);
const rl = readline.createInterface({ input, output });

const printGreetingMessage = () => {
  console.log('Enter a city to check the weather');
};
const printErrorMessage = () => {
  console.log('Problem getting data. Try another city.')
}

const getUrl = (city) => `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;


const printWeather = ({ location, current }) => {
  console.log(`In ${location.name} current temperature ${current.temperature}`)
};

const makeRequest = (url) => {
  http.get(url, (res) => {
    const { statusCode } = res

    if (statusCode !== 200){
      printErrorMessage();
      makeRequest();
    }

    res.setEncoding('utf8');
    let chunks = '';

    res.on('data', (chunk) => {
      chunks += chunk;
    })

    res.on('end', () => {
      const data = JSON.parse(chunks);
      if (data?.success === false) {
        console.log('Problem getting data. Try another city.')
        getWeather();
      } else {
        printWeather(data);
        rl.close();
      }
    })
  })
}

const getWeather = () => {
  rl.question('', (city) => {
    const url = getUrl(city);
    makeRequest(url);
  })
}

printGreetingMessage();
getWeather();
