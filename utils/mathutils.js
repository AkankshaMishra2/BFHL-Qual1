exports.fibonacciSeries = (n) => {
  const result = [];
  let a = 0, b = 1;

  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  return result;
};

exports.filterPrimes = (arr) => {
  const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  return arr.filter(isPrime);
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

exports.calculateLCM = (arr) =>
  arr.reduce((acc, val) => lcm(acc, val));

exports.calculateHCF = (arr) =>
  arr.reduce((acc, val) => gcd(acc, val));
