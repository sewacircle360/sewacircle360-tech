const nav = require('next/navigation');
console.log('next/navigation exports:', Object.keys(nav));

try {
  const red = require('next/dist/client/components/redirect');
  console.log('redirect exports:', Object.keys(red));
} catch (e) {
  console.log('Could not load next/dist/client/components/redirect:', e.message);
}
