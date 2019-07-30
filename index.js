const axios = require('axios');

// helper function
const start = Date.now();
const log = (v) => console.log(`${v}: ${Date.now() - start}ms elapsed`);


/**
 * EXAMPLE 1
 */

const request1 = async () => {
  return axios.get('https://jsonplaceholder.typicode.com/users/1');
}

const request2 = () => {
  return axios.get('https://jsonplaceholder.typicode.com/users/2');
}


// Blocking Requests. Slower
const make2AjaxBlocking = async () => {
  const a = await request1();
  const b = await request2();
  return [a, b];
};

// Non Blocking Requests. Faster
const make2AjaxNonBlocking = async () => {
  const a = request1();
  const b = request2();
  // return Promise.all([a, b]); 
  // or
  return [await a, await b];
};


const someService = async () => {
  const results = await make2AjaxNonBlocking();
  // const results = await make2AjaxBlocking();
  return [results[0].data, results[1].data];
};


// Execute
( async () => {
  try {
    log(await someService());
  } catch (ex) {
    log(ex);
  }
})();



/**
 *  EXAMPLE 2 
 */

// faster
async function logInOrder(urls) {
  // fetch all the URLs in parallel
  const promises = urls.map(async url => {
    const response = await axios.get(url);
    return response
  });

  // log them in sequence
  for (const promise of promises) {
    log(await promise);
  }
}

// slower 
async function logInOrder2(urls) {
  for(let i = 0; i < urls.length; i++) {
    const response = await axios.get(urls[i]);
    log(response.data);
  }
}

// Execute 
( async () => {
  try {
    await logInOrder(["https://jsonplaceholder.typicode.com/users/1", "https://jsonplaceholder.typicode.com/users/2", "https://jsonplaceholder.typicode.com/users/3", "https://jsonplaceholder.typicode.com/users/4", "https://jsonplaceholder.typicode.com/users/5"]);
  } catch (ex) {
    log(ex);
  }
})();